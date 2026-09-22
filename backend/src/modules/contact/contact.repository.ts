import type { Database } from '../../db/database.js';
import type { Page, Pagination } from '../../lib/pagination.js';
import type { RequestStatus } from '../shared.js';
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

    list({ page, pageSize }: Pagination): Page<ContactMessage> {
      const rows = db
        .prepare('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?')
        .all(pageSize, (page - 1) * pageSize) as Row[];
      const { total } = db.prepare('SELECT COUNT(*) AS total FROM contact_messages').get() as { total: number };
      return { items: rows.map(toMessage), page, pageSize, total };
    },

    updateStatus(id: number, status: RequestStatus): ContactMessage | undefined {
      const row = db.prepare('UPDATE contact_messages SET status = ? WHERE id = ? RETURNING *').get(status, id) as
        | Row
        | undefined;
      return row && toMessage(row);
    },
  };
}
export type ContactRepository = ReturnType<typeof contactRepository>;
