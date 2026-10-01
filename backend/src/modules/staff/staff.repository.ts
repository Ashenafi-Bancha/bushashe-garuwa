import type { Queryable } from '../../db/database.js';
import type { StaffUser } from './staff.schema.js';

type UserRow = { id: number; email: string; password_hash: string };

/** All SQL for staff accounts and their sign-in sessions. */
export function staffRepository(db: Queryable) {
  return {
    async findByEmail(email: string): Promise<(StaffUser & { passwordHash: string }) | undefined> {
      const [row] = await db.query<UserRow>('SELECT id, email, password_hash FROM staff_users WHERE email = $1', [email]);
      return row && { id: row.id, email: row.email, passwordHash: row.password_hash };
    },

    /** Creates the account, or gives an existing one a new password */
    async saveAccount(email: string, passwordHash: string): Promise<StaffUser> {
      const [row] = await db.query<UserRow>(
        `INSERT INTO staff_users (email, password_hash) VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET password_hash = excluded.password_hash
         RETURNING id, email, password_hash`,
        [email, passwordHash],
      );
      return { id: row!.id, email: row!.email };
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

    /** The member of staff a session belongs to, unless it has run out */
    async findSessionUser(tokenHash: string): Promise<StaffUser | undefined> {
      const [row] = await db.query<StaffUser>(
        `SELECT u.id, u.email FROM staff_sessions s JOIN staff_users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > now()`,
        [tokenHash],
      );
      return row;
    },

    async deleteSession(tokenHash: string): Promise<void> {
      await db.execute('DELETE FROM staff_sessions WHERE token_hash = $1', [tokenHash]);
    },

    /** Signs the account out everywhere (after a password change) */
    async deleteSessionsOf(userId: number): Promise<void> {
      await db.execute('DELETE FROM staff_sessions WHERE user_id = $1', [userId]);
    },

    async deleteExpiredSessions(): Promise<void> {
      await db.execute('DELETE FROM staff_sessions WHERE expires_at <= now()');
    },
  };
}
export type StaffRepository = ReturnType<typeof staffRepository>;
