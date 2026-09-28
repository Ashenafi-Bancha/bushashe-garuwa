import type { Database } from '../../db/database.js';
import type { Page, Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { ContactMessage, CreateContactMessage } from './contact.schema.js';

type Row = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  language: string;
  status: RequestStatus;
  created_at: string;
};

const toMessage = (row: Row): ContactMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  message: row.message,
  language: row.language,
  status: row.status,
  createdAt: row.created_at,
});

/** All SQL for contact messages lives here. */
export function contactRepository(db: Database) {
  return {
    create(input: Omit<CreateContactMessage, 'website'>): ContactMessage {
      const row = db
        .prepare(
          `INSERT INTO contact_messages (name, email, phone, message, language)
           VALUES (?, ?, ?, ?, ?) RETURNING *`,
        )
        .get(input.name, input.email, input.phone ?? null, input.message, input.language) as Row;
      return toMessage(row);
    },

    /** `search` looks through the name, the email, the phone and the message itself */
    list({ page, pageSize }: Pagination, { search }: { search?: string } = {}): Page<ContactMessage> {
      const where = search ? 'WHERE name LIKE ?1 OR email LIKE ?1 OR phone LIKE ?1 OR message LIKE ?1' : '';
      const params = search ? [`%${search}%`] : [];
      const rows = db
        .prepare(`SELECT * FROM contact_messages ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
        .all(...params, pageSize, (page - 1) * pageSize) as Row[];
      const { total } = db.prepare(`SELECT COUNT(*) AS total FROM contact_messages ${where}`).get(...params) as { total: number };
      return { items: rows.map(toMessage), page, pageSize, total };
    },

    /** Counts for the admin dashboard */
    stats(): { total: number; new: number; last7Days: number; handledToday: number } {
      const row = db
        .prepare(
          `SELECT COUNT(*) AS total,
                  SUM(status = 'new') AS unread,
                  SUM(created_at >= datetime('now', '-7 days')) AS recent,
                  SUM(date(handled_at) = date('now')) AS handled
           FROM contact_messages`,
        )
        .get() as { total: number; unread: number | null; recent: number | null; handled: number | null };
      return { total: row.total, new: row.unread ?? 0, last7Days: row.recent ?? 0, handledToday: row.handled ?? 0 };
    },

    updateStatus(id: number, status: RequestStatus): ContactMessage | undefined {
      // handling means moving it off 'new'; going back to 'new' clears the mark
      const row = db
        .prepare(
          `UPDATE contact_messages
              SET status = ?, handled_at = CASE WHEN ? = 'new' THEN NULL ELSE strftime('%Y-%m-%dT%H:%M:%fZ', 'now') END
            WHERE id = ? RETURNING *`,
        )
        .get(status, status, id) as Row | undefined;
      return row && toMessage(row);
    },
  };
}
export type ContactRepository = ReturnType<typeof contactRepository>;
