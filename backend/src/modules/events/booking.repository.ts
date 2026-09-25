import { randomInt } from 'node:crypto';
import type { Database } from '../../db/database.js';
import type { Page, Pagination } from '../../http/pagination.js';
import type { Booking, BookingStatus, CreateBooking } from './booking.schema.js';

type Row = {
  id: number;
  event_id: number;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  guests: number;
  message: string | null;
  language: string;
  status: BookingStatus;
  created_at: string;
  event_date?: string;
  translations?: string;
};

const toBooking = (row: Row): Booking => ({
  id: row.id,
  eventId: row.event_id,
  reference: row.reference,
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

/** Same number written differently (0911 22 33 44 / +251911223344) counts as the same guest */
export const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '').replace(/^2510?/, '0');

/** Codes people can read out on the phone: no 0/O or 1/I to confuse */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const makeReference = () => `BG-${Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')}`;

/** All SQL for event bookings. */
export function bookingRepository(db: Database) {
  return {
    create(eventId: number, input: Omit<CreateBooking, 'website'>): Booking {
      // a clash on the short code is rare; try again with a new one
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const row = db
            .prepare(
              `INSERT INTO event_bookings (event_id, reference, name, phone, email, guests, message, language, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending') RETURNING *`,
            )
            .get(
              eventId,
              makeReference(),
              input.name,
              input.phone,
              input.email ?? null,
              input.guests,
              input.message ?? null,
              input.language,
            ) as Row;
          return toBooking(row);
        } catch (error) {
          if (attempt === 4 || !String(error).includes('UNIQUE')) throw error;
        }
      }
      throw new Error('Could not create a booking reference');
    },

    /** The same person asking twice for the same event, within the given hours */
    findRecentByPhone(eventId: number, phone: string, withinHours: number): Booking | undefined {
      const row = db
        .prepare(
          `SELECT * FROM event_bookings
           WHERE event_id = ? AND status != 'cancelled'
             AND replace(replace(replace(replace(phone, ' ', ''), '-', ''), '(', ''), ')', '') LIKE ?
             AND created_at >= datetime('now', ?)
           ORDER BY created_at DESC LIMIT 1`,
        )
        .get(eventId, `%${normalizePhone(phone).slice(-9)}`, `-${withinHours} hours`) as Row | undefined;
      return row && toBooking(row);
    },

    findByReference(reference: string): Booking | undefined {
      const row = db.prepare('SELECT * FROM event_bookings WHERE reference = ?').get(reference) as Row | undefined;
      return row && toBooking(row);
    },

    /** Bookings with their event, newest first; `eventId` narrows it to one event */
    list({ page, pageSize }: Pagination, filter: { eventId?: number; status?: BookingStatus } = {}): Page<Booking> {
      const where: string[] = [];
      const params: (string | number)[] = [];
      if (filter.eventId) {
        where.push('b.event_id = ?');
        params.push(filter.eventId);
      }
      if (filter.status) {
        where.push('b.status = ?');
        params.push(filter.status);
      }
      const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const rows = db
        .prepare(
          `SELECT b.*, e.event_date, e.translations
           FROM event_bookings b JOIN events e ON e.id = b.event_id
           ${clause} ORDER BY b.created_at DESC, b.id DESC LIMIT ? OFFSET ?`,
        )
        .all(...params, pageSize, (page - 1) * pageSize) as Row[];
      const { total } = db
        .prepare(`SELECT COUNT(*) AS total FROM event_bookings b ${clause}`)
        .get(...params) as { total: number };
      return { items: rows.map(toBooking), page, pageSize, total };
    },

    updateStatus(id: number, status: BookingStatus): Booking | undefined {
      const row = db.prepare('UPDATE event_bookings SET status = ? WHERE id = ? RETURNING *').get(status, id) as
        | Row
        | undefined;
      return row && toBooking(row);
    },

    /** Places held for one event (everything except cancelled bookings) */
    guestsForEvent(eventId: number): number {
      const row = db
        .prepare(`SELECT COALESCE(SUM(guests), 0) AS guests FROM event_bookings WHERE event_id = ? AND status != 'cancelled'`)
        .get(eventId) as { guests: number };
      return row.guests;
    },

    stats(): { total: number; pending: number; guestsUpcoming: number } {
      const row = db
        .prepare(
          `SELECT COUNT(*) AS total,
                  SUM(b.status = 'pending') AS pending,
                  COALESCE(SUM(CASE WHEN e.event_date >= date('now') AND b.status != 'cancelled' THEN b.guests END), 0) AS guests
           FROM event_bookings b JOIN events e ON e.id = b.event_id`,
        )
        .get() as { total: number; pending: number | null; guests: number };
      return { total: row.total, pending: row.pending ?? 0, guestsUpcoming: row.guests };
    },
  };
}
export type BookingRepository = ReturnType<typeof bookingRepository>;
