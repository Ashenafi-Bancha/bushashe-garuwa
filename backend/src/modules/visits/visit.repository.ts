import type { Queryable } from '../../db/database.js';
import { TODAY, dayOf } from '../../db/sql.js';
import type { Page, Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { CreateVisitRequest, VisitRequest } from './visit.schema.js';

type Row = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  /** 'YYYY-MM-DD' */
  visit_date: string;
  visitors: string;
  experiences: VisitRequest['experiences'];
  message: string | null;
  language: string;
  status: RequestStatus;
  created_at: Date;
};

const toVisit = (row: Row): VisitRequest => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  email: row.email,
  date: row.visit_date,
  visitors: row.visitors,
  experiences: row.experiences,
  message: row.message,
  language: row.language,
  status: row.status,
  createdAt: row.created_at.toISOString(),
});

/** All SQL for visit requests lives here. */
export function visitRepository(db: Queryable) {
  return {
    async create(input: Omit<CreateVisitRequest, 'website'>): Promise<VisitRequest> {
      const [row] = await db.query<Row>(
        `INSERT INTO visit_requests (name, phone, email, visit_date, visitors, experiences, message, language)
         VALUES ($1, $2, $3, $4, $5, $6::text::jsonb, $7, $8) RETURNING *`,
        [
          input.name,
          input.phone,
          input.email ?? null,
          input.date,
          input.visitors,
          JSON.stringify(input.experiences),
          input.message ?? null,
          input.language,
        ],
      );
      return toVisit(row!);
    },

    /** Upcoming visits first when `upcoming` is set, otherwise newest requests first */
    async list(
      { page, pageSize }: Pagination,
      { upcoming = false, search }: { upcoming?: boolean; search?: string } = {},
    ): Promise<Page<VisitRequest>> {
      const clauses: string[] = [];
      if (upcoming) clauses.push(`visit_date >= ${TODAY} AND status != 'archived'`);
      if (search) clauses.push('(name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 OR message ILIKE $1)');
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const params = search ? [`%${search}%`] : [];
      const order = upcoming ? 'visit_date ASC, id ASC' : 'created_at DESC, id DESC';
      const rows = await db.query<Row>(
        `SELECT * FROM visit_requests ${where} ORDER BY ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, pageSize, (page - 1) * pageSize],
      );
      const [count] = await db.query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM visit_requests ${where}`, params);
      return { items: rows.map(toVisit), page, pageSize, total: count!.total };
    },

    /** Counts for the admin dashboard */
    async stats(): Promise<{ total: number; new: number; upcoming: number; handledToday: number }> {
      const [row] = await db.query<{ total: number; fresh: number; upcoming: number; handled: number }>(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'new')::int AS fresh,
                COUNT(*) FILTER (WHERE visit_date >= ${TODAY} AND status != 'archived')::int AS upcoming,
                COUNT(*) FILTER (WHERE ${dayOf('handled_at')} = ${TODAY})::int AS handled
         FROM visit_requests`,
      );
      return { total: row!.total, new: row!.fresh, upcoming: row!.upcoming, handledToday: row!.handled };
    },

    async updateStatus(id: number, status: RequestStatus): Promise<VisitRequest | undefined> {
      const [row] = await db.query<Row>(
        `UPDATE visit_requests
            SET status = $1, handled_at = CASE WHEN $1 = 'new' THEN NULL ELSE now() END
          WHERE id = $2 RETURNING *`,
        [status, id],
      );
      return row && toVisit(row);
    },
  };
}
export type VisitRepository = ReturnType<typeof visitRepository>;
