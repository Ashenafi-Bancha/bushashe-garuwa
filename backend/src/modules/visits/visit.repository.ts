import type { Database } from '../../db/database.js';
import type { Page, Pagination } from '../../lib/pagination.js';
import type { RequestStatus } from '../shared.js';
import type { CreateVisitRequest, VisitRequest } from './visit.schema.js';

type Row = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  visit_date: string;
  visitors: string;
  experiences: string;
  message: string | null;
  language: string;
  status: RequestStatus;
  created_at: string;
};

const toVisit = (row: Row): VisitRequest => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  email: row.email,
  date: row.visit_date,
  visitors: row.visitors,
  experiences: JSON.parse(row.experiences),
  message: row.message,
  language: row.language,
  status: row.status,
  createdAt: row.created_at,
});

/** All SQL for visit requests lives here. */
export function visitRepository(db: Database) {
  return {
    create(input: Omit<CreateVisitRequest, 'website'>): VisitRequest {
      const row = db
        .prepare(
          `INSERT INTO visit_requests (name, phone, email, visit_date, visitors, experiences, message, language)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        )
        .get(
          input.name,
          input.phone,
          input.email ?? null,
          input.date,
          input.visitors,
          JSON.stringify(input.experiences),
          input.message ?? null,
          input.language,
        ) as Row;
      return toVisit(row);
    },

    /** Upcoming visits first when `upcoming` is set, otherwise newest requests first */
    list({ page, pageSize }: Pagination, { upcoming = false } = {}): Page<VisitRequest> {
      const where = upcoming ? `WHERE visit_date >= date('now') AND status != 'archived'` : '';
      const order = upcoming ? 'visit_date ASC, id ASC' : 'created_at DESC, id DESC';
      const rows = db
        .prepare(`SELECT * FROM visit_requests ${where} ORDER BY ${order} LIMIT ? OFFSET ?`)
        .all(pageSize, (page - 1) * pageSize) as Row[];
      const { total } = db.prepare(`SELECT COUNT(*) AS total FROM visit_requests ${where}`).get() as { total: number };
      return { items: rows.map(toVisit), page, pageSize, total };
    },

    updateStatus(id: number, status: RequestStatus): VisitRequest | undefined {
      const row = db.prepare('UPDATE visit_requests SET status = ? WHERE id = ? RETURNING *').get(status, id) as
        | Row
        | undefined;
      return row && toVisit(row);
    },
  };
}
export type VisitRepository = ReturnType<typeof visitRepository>;
