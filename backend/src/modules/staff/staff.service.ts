import { createHash, randomBytes } from 'node:crypto';
import type { Env } from '../../config/env.js';
import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import { DUMMY_HASH, hashPassword, verifyPassword } from './password.js';
import type { StaffRepository } from './staff.repository.js';
import type { StaffSession, StaffUser } from './staff.schema.js';

/** How long a sign-in lasts */
const SESSION_HOURS = 12;

/** Only a hash of the session token is stored, so a copy of the database cannot be used to sign in */
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/** Staff sign-in: email and password in, a session token out. */
export function staffService(repo: StaffRepository) {
  return {
    async signIn(email: string, password: string): Promise<StaffSession> {
      const account = await repo.findByEmail(email);
      // an unknown email is checked against a dummy hash, so it cannot be told apart by timing
      const ok = await verifyPassword(password, account?.passwordHash ?? DUMMY_HASH);
      if (!account || !ok) {
        logger.warn('staff: failed sign-in', { email });
        throw HttpError.unauthorized('That email or password is not correct');
      }

      const token = randomBytes(32).toString('base64url');
      const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
      await repo.createSession(account.id, hashToken(token), expiresAt);
      await repo.deleteExpiredSessions();
      logger.info('staff: signed in', { email: account.email });
      return { token, expiresAt: expiresAt.toISOString(), user: { id: account.id, email: account.email } };
    },

    /** Who a session token belongs to, or undefined when it is unknown or has run out */
    userFor: (token: string): Promise<StaffUser | undefined> => repo.findSessionUser(hashToken(token)),

    signOut: (token: string): Promise<void> => repo.deleteSession(hashToken(token)),

    /**
     * Makes sure the account named in ADMIN_EMAIL / ADMIN_PASSWORD exists with
     * that password. Run once at start-up: it creates the first account, and
     * changing the password setting later changes the password (and signs that
     * account out everywhere).
     */
    async ensureAccount(env: Pick<Env, 'ADMIN_EMAIL' | 'ADMIN_PASSWORD'>): Promise<void> {
      if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
        const existing = await repo.findByEmail(env.ADMIN_EMAIL);
        if (!existing) {
          await repo.saveAccount(env.ADMIN_EMAIL, await hashPassword(env.ADMIN_PASSWORD));
          logger.info('staff: account created', { email: env.ADMIN_EMAIL });
        } else if (!(await verifyPassword(env.ADMIN_PASSWORD, existing.passwordHash))) {
          await repo.saveAccount(env.ADMIN_EMAIL, await hashPassword(env.ADMIN_PASSWORD));
          await repo.deleteSessionsOf(existing.id);
          logger.info('staff: password updated from the settings', { email: env.ADMIN_EMAIL });
        }
      }
      if ((await repo.count()) === 0) {
        logger.warn('staff: no account yet, so nobody can sign in. Set ADMIN_EMAIL and ADMIN_PASSWORD.');
      }
    },
  };
}
export type StaffService = ReturnType<typeof staffService>;
