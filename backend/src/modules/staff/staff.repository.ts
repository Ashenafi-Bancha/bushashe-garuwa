import type { Queryable } from '../../db/database.js';
import type { StaffMember, StaffRole, StaffUser } from './staff.schema.js';

type Row = {
  id: number;
  email: string;
  name: string;
  role: StaffRole;
  active: boolean;
  must_change_password: boolean;
  password_hash: string;
  seed_hash: string | null;
  created_at: Date | string;
  last_login_at: Date | string | null;
};

/** An account as the server knows it, password hashes included */
export type StaffAccount = StaffMember & { passwordHash: string; seedHash: string | null };

const FIELDS = ['id', 'email', 'name', 'role', 'active', 'must_change_password', 'password_hash', 'seed_hash', 'created_at', 'last_login_at'];
const COLUMNS = FIELDS.join(', ');
const iso = (value: Date | string | null) => (value === null ? null : new Date(value).toISOString());

const toAccount = (row: Row): StaffAccount => ({
  id: row.id,
  email: row.email,
  name: row.name,
  role: row.role,
  active: row.active,
  mustChangePassword: row.must_change_password,
  passwordHash: row.password_hash,
  seedHash: row.seed_hash,
  createdAt: iso(row.created_at)!,
  lastLoginAt: iso(row.last_login_at),
});

/** What the staff area may see of an account: never the password hashes */
export const toMember = (account: StaffAccount): StaffMember => {
  const { passwordHash: _password, seedHash: _seed, ...member } = account;
  return member;
};
export const toUser = ({ id, email, name, role, mustChangePassword }: StaffMember): StaffUser => ({ id, email, name, role, mustChangePassword });

/** All SQL for staff accounts and their sign-in sessions. */
export function staffRepository(db: Queryable) {
  return {
    async findByEmail(email: string): Promise<StaffAccount | undefined> {
      const [row] = await db.query<Row>(`SELECT ${COLUMNS} FROM staff_users WHERE email = $1`, [email]);
      return row && toAccount(row);
    },

    async findById(id: number): Promise<StaffAccount | undefined> {
      const [row] = await db.query<Row>(`SELECT ${COLUMNS} FROM staff_users WHERE id = $1`, [id]);
      return row && toAccount(row);
    },

    /** Everyone: owners first, then by name */
    async list(): Promise<StaffAccount[]> {
      const rows = await db.query<Row>(`SELECT ${COLUMNS} FROM staff_users ORDER BY role = 'owner' DESC, lower(name), email`);
      return rows.map(toAccount);
    },

    async create(input: {
      email: string;
      name: string;
      role: StaffRole;
      passwordHash: string;
      mustChangePassword: boolean;
      seedHash?: string;
    }): Promise<StaffAccount> {
      const [row] = await db.query<Row>(
        `INSERT INTO staff_users (email, name, role, password_hash, must_change_password, seed_hash)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${COLUMNS}`,
        [input.email, input.name, input.role, input.passwordHash, input.mustChangePassword, input.seedHash ?? null],
      );
      return toAccount(row!);
    },

    async update(id: number, values: { name: string; role: StaffRole; active: boolean }): Promise<StaffAccount | undefined> {
      const [row] = await db.query<Row>(`UPDATE staff_users SET name = $2, role = $3, active = $4 WHERE id = $1 RETURNING ${COLUMNS}`, [
        id,
        values.name,
        values.role,
        values.active,
      ]);
      return row && toAccount(row);
    },

    async rename(id: number, name: string): Promise<void> {
      await db.execute('UPDATE staff_users SET name = $2 WHERE id = $1', [id, name]);
    },

    async setPassword(id: number, passwordHash: string, mustChangePassword: boolean): Promise<void> {
      await db.execute('UPDATE staff_users SET password_hash = $2, must_change_password = $3 WHERE id = $1', [id, passwordHash, mustChangePassword]);
    },

    /** The ADMIN_PASSWORD setting was applied to this account: it is an owner and switched on */
    async setSeed(id: number, seedHash: string): Promise<void> {
      await db.execute(`UPDATE staff_users SET seed_hash = $2, role = 'owner', active = true WHERE id = $1`, [id, seedHash]);
    },

    async remove(id: number): Promise<boolean> {
      return (await db.execute('DELETE FROM staff_users WHERE id = $1', [id])) > 0;
    },

    async countActiveOwners(): Promise<number> {
      const [row] = await db.query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM staff_users WHERE role = 'owner' AND active`);
      return row!.total;
    },

    async count(): Promise<number> {
      const [row] = await db.query<{ total: number }>('SELECT COUNT(*)::int AS total FROM staff_users');
      return row!.total;
    },

    async createSession(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
      await db.execute('INSERT INTO staff_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)', [
        tokenHash,
        userId,
        expiresAt.toISOString(),
      ]);
      await db.execute('UPDATE staff_users SET last_login_at = now() WHERE id = $1', [userId]);
    },

    /** The member of staff a session belongs to, unless it has run out or the account is switched off */
    async findSessionUser(tokenHash: string): Promise<StaffUser | undefined> {
      const [row] = await db.query<Row>(
        `SELECT ${FIELDS.map((f) => `u.${f}`).join(', ')} FROM staff_sessions s JOIN staff_users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > now() AND u.active`,
        [tokenHash],
      );
      return row && toUser(toMember(toAccount(row)));
    },

    async deleteSession(tokenHash: string): Promise<void> {
      await db.execute('DELETE FROM staff_sessions WHERE token_hash = $1', [tokenHash]);
    },

    /** Signs the account out everywhere, or everywhere except one session (after a password change) */
    async deleteSessionsOf(userId: number, keepTokenHash?: string): Promise<void> {
      if (keepTokenHash) await db.execute('DELETE FROM staff_sessions WHERE user_id = $1 AND token_hash <> $2', [userId, keepTokenHash]);
      else await db.execute('DELETE FROM staff_sessions WHERE user_id = $1', [userId]);
    },

    async deleteExpiredSessions(): Promise<void> {
      await db.execute('DELETE FROM staff_sessions WHERE expires_at <= now()');
    },
  };
}
export type StaffRepository = ReturnType<typeof staffRepository>;
