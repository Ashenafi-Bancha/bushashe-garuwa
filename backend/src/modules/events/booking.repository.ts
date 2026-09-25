import type { Database } from '../../db/database.js';
import type { Page, Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { Booking, CreateBooking } from './booking.schema.js';

type Row = {
  id: number;
  event_id: number;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  message: string | null;
  language: string;
  status: RequestStatus;
  created_at: string;
  event_date?: string;
  translations?: string;
};

const toBooking = (row: Row): Booking => ({
  id: row.id,
  eventId: row.event_id,
  eventDate: row.event_date,
  eventName: row.translations ? JSON.parse(row.translations).en?.name : undefined,
  name: row.name,
  phone: row.phone,
  email: row.email,
  guests: row.guests,
  message: row.message,
  language: row.language,
  status: row.status,
  createdAt: row.created_at,
});

/** All SQL for event bookings. */
export function bookingRepository(db: Database) {
  return {
    create(eventId: number, input: Omit<CreateBooking, 'website'>): Booking {
      const row = db
        .prepare(
          `INSERT INTO event_bookings (event_id, name, phone, email, guests, message, language)
           VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        )
        .get(
          eventId,
          input.name,
          input.phone,
          input.email ?? null,
          input.guests,
          input.message ?? null,
          input.language,
        ) as Row;
      return toBooking(row);
    },

    /** Bookings with their event, newest first; `eventId` narrows it to one event */
    list({ page, pageSize }: Pagination, filter: { eventId?: number } = {}): Page<Booking> {
      const where = filter.eventId ? 'WHERE b.event_id = ?' : '';
      const params = filter.eventId ? [filter.eventId] : [];
      const rows = db
        .prepare(
          `SELECT b.*, e.event_date, e.translations
           FROM event_bookings b JOIN events e ON e.id = b.event_id
           ${where} ORDER BY b.created_at DESC, b.id DESC LIMIT ? OFFSET ?`,
        )
        .all(...params, pageSize, (page - 1) * pageSize) as Row[];
      const { total } = db
        .prepare(`SELECT COUNT(*) AS total FROM event_bookings b ${where.replace('b.event_id', 'b.event_id')}`)
        .get(...params) as { total: number };
      return { items: rows.map(toBooking), page, pageSize, total };
    },

    updateStatus(id: number, status: RequestStatus): Booking | undefined {
      const row = db.prepare('UPDATE event_bookings SET status = ? WHERE id = ? RETURNING *').get(status, id) as
        | Row
        | undefined;
      return row && toBooking(row);
    },

    /** Places already reserved for one event, so staff can see how full it is */
    guestsForEvent(eventId: number): number {
      const row = db
        .prepare(`SELECT COALESCE(SUM(guests), 0) AS guests FROM event_bookings WHERE event_id = ? AND status != 'archived'`)
        .get(eventId) as { guests: number };
      return row.guests;
    },

    stats(): { total: number; new: number; guestsUpcoming: number } {
      const row = db
        .prepare(
          `SELECT COUNT(*) AS total,
                  SUM(b.status = 'new') AS fresh,
                  COALESCE(SUM(CASE WHEN e.event_date >= date('now') AND b.status != 'archived' THEN b.guests END), 0) AS guests
           FROM event_bookings b JOIN events e ON e.id = b.event_id`,
        )
        .get() as { total: number; fresh: number | null; guests: number };
      return { total: row.total, new: row.fresh ?? 0, guestsUpcoming: row.guests };
    },
  };
}
export type BookingRepository = ReturnType<typeof bookingRepository>;
