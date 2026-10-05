import type { Queryable } from '../../db/database.js';
import { TODAY, dayOf } from '../../db/sql.js';
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
  created_at: Date;
};

const toMessage = (row: Row): ContactMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  message: row.message,
  language: row.language,
  status: row.status,
  createdAt: row.created_at.toISOString(),
});

/** All SQL for contact messages lives here. */
export function contactRepository(db: Queryable) {
  return {
    async create(input: Omit<CreateContactMessage, 'website'>): Promise<ContactMessage> {
      const [row] = await db.query<Row>(
        `INSERT INTO contact_messages (name, email, phone, message, language)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [input.name, input.email, input.phone ?? null, input.message, input.language],
      );
      return toMessage(row!);
    },

    /** `search` looks through the name, the email, the phone and the message itself */
    async list({ page, pageSize }: Pagination, { search }: { search?: string } = {}): Promise<Page<ContactMessage>> {
      const where = search ? 'WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR message ILIKE $1' : '';
      const params = search ? [`%${search}%`] : [];
      const rows = await db.query<Row>(
        `SELECT * FROM contact_messages ${where}
         ORDER BY created_at DESC, id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, pageSize, (page - 1) * pageSize],
      );
      const [count] = await db.query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM contact_messages ${where}`, params);
      return { items: rows.map(toMessage), page, pageSize, total: count!.total };
    },

    /** Counts for the admin dashboard */
    async stats(): Promise<{ total: number; new: number; last7Days: number; handledToday: number }> {
      const [row] = await db.query<{ total: number; unread: number; recent: number; handled: number }>(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'new')::int AS unread,
                COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS recent,
                COUNT(*) FILTER (WHERE ${dayOf('handled_at')} = ${TODAY})::int AS handled
         FROM contact_messages`,
      );
      return { total: row!.total, new: row!.unread, last7Days: row!.recent, handledToday: row!.handled };
    },

    async updateStatus(id: number, status: RequestStatus): Promise<ContactMessage | undefined> {
      // handling means moving it off 'new'; going back to 'new' clears the mark
      const [row] = await db.query<Row>(
        `UPDATE contact_messages
            SET status = $1, handled_at = CASE WHEN $1 = 'new' THEN NULL ELSE now() END
          WHERE id = $2 RETURNING *`,
        [status, id],
      );
      return row && toMessage(row);
    },

    async remove(id: number): Promise<boolean> {
      return (await db.execute('DELETE FROM contact_messages WHERE id = $1', [id])) > 0;
    },
  };
}
export type ContactRepository = ReturnType<typeof contactRepository>;
