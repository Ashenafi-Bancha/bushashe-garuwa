import { createHash, randomBytes, randomInt } from 'node:crypto';
import type { Env } from '../../config/env.js';
import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import { DUMMY_HASH, hashPassword, verifyPassword } from './password.js';
import { toMember, toUser, type StaffRepository } from './staff.repository.js';
import type { CreateStaffBody, StaffMember, StaffSession, StaffUser, UpdateStaffBody } from './staff.schema.js';

/** How long a sign-in lasts */
const SESSION_HOURS = 12;

/** Only a hash of the session token is stored, so a copy of the database cannot be used to sign in */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/**
 * A temporary password an owner passes on by phone or WhatsApp: easy to read
 * aloud (no 0/O, 1/l), three groups of four, e.g. "k7mp-4xqa-9twe".
 */
function temporaryPassword(): string {
  const letters = 'abcdefghjkmnpqrstuvwxyz23456789';
  const group = () => Array.from({ length: 4 }, () => letters[randomInt(letters.length)]).join('');
  return `${group()}-${group()}-${group()}`;
}

/** Staff sign-in, their own password, and the owners' management of accounts. */
export function staffService(repo: StaffRepository) {
  /** Refuses a change that would leave no owner able to manage the accounts */
  const keepAnOwner = async (account: { role: string; active: boolean }, next: { role: string; active: boolean } | null) => {
    const wasOwner = account.role === 'owner' && account.active;
    const staysOwner = next !== null && next.role === 'owner' && next.active;
    if (wasOwner && !staysOwner && (await repo.countActiveOwners()) <= 1) {
      throw HttpError.badRequest('There must always be at least one owner');
    }
  };

  const found = async (id: number) => {
    const account = await repo.findById(id);
    if (!account) throw HttpError.notFound('No such member of staff');
    return account;
  };

  return {
    async signIn(email: string, password: string): Promise<StaffSession> {
      const account = await repo.findByEmail(email);
      // an unknown email is checked against a dummy hash, so it cannot be told apart by timing
      const ok = await verifyPassword(password, account?.passwordHash ?? DUMMY_HASH);
      if (!account || !ok || !account.active) {
        logger.warn('staff: failed sign-in', { email });
        throw HttpError.unauthorized('That email or password is not correct');
      }

      const token = randomBytes(32).toString('base64url');
      const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
      await repo.createSession(account.id, hashToken(token), expiresAt);
      await repo.deleteExpiredSessions();
      logger.info('staff: signed in', { email: account.email });
      return { token, expiresAt: expiresAt.toISOString(), user: toUser(toMember(account)) };
    },

    /** Who a session token belongs to, or undefined when it is unknown, has run out or the account is off */
    userFor: (token: string): Promise<StaffUser | undefined> => repo.findSessionUser(hashToken(token)),

    signOut: (token: string): Promise<void> => repo.deleteSession(hashToken(token)),

    // ── one's own account ──

    async rename(user: StaffUser, name: string): Promise<StaffUser> {
      await repo.rename(user.id, name);
      return { ...user, name };
    },

    /** Changes one's own password and signs out every other device */
    async changePassword(user: StaffUser, current: string, next: string, sessionToken: string): Promise<StaffUser> {
      const account = await found(user.id);
      if (!(await verifyPassword(current, account.passwordHash))) throw HttpError.badRequest('Your current password is not correct');
      if (next === current) throw HttpError.badRequest('Choose a password different from the one you have now');
      if (next.toLowerCase() === account.email) throw HttpError.badRequest('Your password cannot be your email address');
      await repo.setPassword(account.id, await hashPassword(next), false);
      await repo.deleteSessionsOf(account.id, hashToken(sessionToken));
      logger.info('staff: password changed', { email: account.email });
      return { ...user, mustChangePassword: false };
    },

    // ── owners: the staff accounts ──

    list: async (): Promise<StaffMember[]> => (await repo.list()).map(toMember),

    /** A new account with a temporary password, shown to the owner once */
    async create(input: CreateStaffBody): Promise<{ member: StaffMember; temporaryPassword: string }> {
      if (await repo.findByEmail(input.email)) throw HttpError.conflict('There is already an account with that email');
      const password = temporaryPassword();
      const account = await repo.create({ ...input, passwordHash: await hashPassword(password), mustChangePassword: true });
      logger.info('staff: account added', { email: account.email, role: account.role });
      return { member: toMember(account), temporaryPassword: password };
    },

    async update(by: StaffUser, id: number, input: UpdateStaffBody): Promise<StaffMember> {
      const account = await found(id);
      if (id === by.id && (input.role !== account.role || !input.active)) {
        throw HttpError.badRequest('You cannot change your own role or switch off your own account');
      }
      await keepAnOwner(account, input);
      const updated = (await repo.update(id, input))!;
      if (!input.active) await repo.deleteSessionsOf(id);
      return toMember(updated);
    },

    /** A new temporary password; the person is signed out everywhere */
    async resetPassword(by: StaffUser, id: number): Promise<{ temporaryPassword: string }> {
      if (id === by.id) throw HttpError.badRequest('Change your own password under My account');
      const account = await found(id);
      const password = temporaryPassword();
      await repo.setPassword(account.id, await hashPassword(password), true);
      await repo.deleteSessionsOf(account.id);
      logger.info('staff: password reset by an owner', { email: account.email, by: by.email });
      return { temporaryPassword: password };
    },

    async remove(by: StaffUser, id: number): Promise<void> {
      if (id === by.id) throw HttpError.badRequest('You cannot remove your own account');
      const account = await found(id);
      await keepAnOwner(account, null);
      await repo.remove(id);
      logger.info('staff: account removed', { email: account.email, by: by.email });
    },

    /**
     * The account named in ADMIN_EMAIL / ADMIN_PASSWORD, run once at start-up.
     * It creates the first owner. After that the setting only matters when it
     * is changed: then it becomes that account's password again (and signs it
     * out everywhere), which is the way back in if the password is forgotten.
     * A password changed in the staff area is otherwise kept.
     */
    async ensureAccount(env: Pick<Env, 'ADMIN_EMAIL' | 'ADMIN_PASSWORD'>): Promise<void> {
      if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
        const existing = await repo.findByEmail(env.ADMIN_EMAIL);
        if (!existing) {
          await repo.create({
            email: env.ADMIN_EMAIL,
            name: '',
            role: 'owner',
            passwordHash: await hashPassword(env.ADMIN_PASSWORD),
            mustChangePassword: false,
            seedHash: await hashPassword(env.ADMIN_PASSWORD),
          });
          logger.info('staff: owner account created from the settings', { email: env.ADMIN_EMAIL });
        } else if (existing.seedHash === null) {
          // the first start since the setting is remembered: it is taken as already applied
          if (!(await verifyPassword(env.ADMIN_PASSWORD, existing.passwordHash))) {
            await repo.setPassword(existing.id, await hashPassword(env.ADMIN_PASSWORD), false);
            await repo.deleteSessionsOf(existing.id);
          }
          await repo.setSeed(existing.id, await hashPassword(env.ADMIN_PASSWORD));
        } else if (!(await verifyPassword(env.ADMIN_PASSWORD, existing.seedHash))) {
          await repo.setPassword(existing.id, await hashPassword(env.ADMIN_PASSWORD), false);
          await repo.setSeed(existing.id, await hashPassword(env.ADMIN_PASSWORD));
          await repo.deleteSessionsOf(existing.id);
          logger.info('staff: password set again from the settings', { email: env.ADMIN_EMAIL });
        }
      }
      if ((await repo.count()) === 0) {
        logger.warn('staff: no account yet, so nobody can sign in. Set ADMIN_EMAIL and ADMIN_PASSWORD.');
      }
    },
  };
}
export type StaffService = ReturnType<typeof staffService>;
