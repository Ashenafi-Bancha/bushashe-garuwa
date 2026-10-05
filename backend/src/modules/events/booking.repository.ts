import { randomInt } from 'node:crypto';
import type { Database, Queryable } from '../../db/database.js';
import { TODAY, dayOf, isUniqueViolation } from '../../db/sql.js';
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
  created_at: Date;
  /** 'YYYY-MM-DD' */
  event_date?: string;
  translations?: { en?: { name?: string } };
};

const toBooking = (row: Row): Booking => ({
  id: row.id,
  eventId: row.event_id,
  reference: row.reference,
  eventDate: row.event_date,
  eventName: row.translations?.en?.name,
  name: row.name,
  phone: row.phone,
  email: row.email,
  guests: row.guests,
  message: row.message,
  language: row.language,
  status: row.status,
  createdAt: row.created_at.toISOString(),
});

/** Same number written differently (0911 22 33 44 / +251911223344) counts as the same guest */
export const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '').replace(/^2510?/, '0');

/** Codes people can read out on the phone: no 0/O or 1/I to confuse */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const makeReference = () => `BG-${Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')}`;

/** What asking for places can end in */
export type Reservation =
  | { kind: 'created'; booking: Booking }
  /** the same phone asked again: the booking already made */
  | { kind: 'repeat'; booking: Booking }
  /** not enough places; `placesLeft` is 0 when the event is full */
  | { kind: 'no_room'; placesLeft: number }
  /** the event was removed while the guest was filling in the form */
  | { kind: 'gone' };

/** The same person asking twice for the same event, within the given hours */
async function recentByPhone(db: Queryable, eventId: number, phone: string, withinHours: number): Promise<Booking | undefined> {
  const [row] = await db.query<Row>(
    `SELECT * FROM event_bookings
     WHERE event_id = $1 AND status != 'cancelled'
       AND regexp_replace(phone, '[^0-9]', '', 'g') LIKE $2
       AND created_at >= now() - make_interval(hours => $3::int)
     ORDER BY created_at DESC LIMIT 1`,
    [eventId, `%${normalizePhone(phone).slice(-9)}`, withinHours],
  );
  return row && toBooking(row);
}

/** Places held for one event (everything except cancelled bookings) */
async function guestsHeld(db: Queryable, eventId: number): Promise<number> {
  const [row] = await db.query<{ guests: number }>(
    `SELECT COALESCE(SUM(guests), 0)::int AS guests FROM event_bookings WHERE event_id = $1 AND status != 'cancelled'`,
    [eventId],
  );
  return row!.guests;
}

/** All SQL for event bookings. */
export function bookingRepository(db: Database) {
  return {
    /**
     * Takes places at an event, if there is room.
     *
     * The event's row is locked for the length of the check and the insert, so
     * two guests booking the last places at the same moment are served one
     * after the other and the event can never be overbooked. `closed` refuses
     * new bookings outright (an event without a limit that staff marked full).
     */
    async reserve(
      eventId: number,
      input: Omit<CreateBooking, 'website'>,
      options: { repeatWindowHours: number; closed?: boolean },
    ): Promise<Reservation> {
      // a clash on the short code is rare; try again with a new one
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          return await db.transaction(async (tx): Promise<Reservation> => {
            const [event] = await tx.query<{ capacity: number | null }>('SELECT capacity FROM events WHERE id = $1 FOR UPDATE', [eventId]);
            if (!event) return { kind: 'gone' };

            const existing = await recentByPhone(tx, eventId, input.phone, options.repeatWindowHours);
            if (existing) return { kind: 'repeat', booking: existing };

            if (options.closed) return { kind: 'no_room', placesLeft: 0 };
            if (event.capacity !== null) {
              const left = Math.max(0, event.capacity - (await guestsHeld(tx, eventId)));
              if (input.guests > left) return { kind: 'no_room', placesLeft: left };
            }

            const [row] = await tx.query<Row>(
              `INSERT INTO event_bookings (event_id, reference, name, phone, email, guests, message, language, status)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING *`,
              [eventId, makeReference(), input.name, input.phone, input.email ?? null, input.guests, input.message ?? null, input.language],
            );
            return { kind: 'created', booking: toBooking(row!) };
          });
        } catch (error) {
          if (attempt === 4 || !isUniqueViolation(error)) throw error;
        }
      }
      throw new Error('Could not create a booking reference');
    },

    async findById(id: number): Promise<Booking | undefined> {
      const [row] = await db.query<Row>('SELECT * FROM event_bookings WHERE id = $1', [id]);
      return row && toBooking(row);
    },

    async findByReference(reference: string): Promise<Booking | undefined> {
      const [row] = await db.query<Row>('SELECT * FROM event_bookings WHERE reference = $1', [reference]);
      return row && toBooking(row);
    },

    /** Bookings with their event, newest first; `eventId` narrows it to one event */
    async list(
      { page, pageSize }: Pagination,
      filter: { eventId?: number; status?: BookingStatus; search?: string } = {},
    ): Promise<Page<Booking>> {
      const where: string[] = [];
      const params: (string | number)[] = [];
      const param = (value: string | number) => `$${params.push(value)}`;
      if (filter.eventId) where.push(`b.event_id = ${param(filter.eventId)}`);
      if (filter.status) where.push(`b.status = ${param(filter.status)}`);
      if (filter.search) {
        // the name, the phone, the email, the note, or the booking's short code
        const like = param(`%${filter.search}%`);
        where.push(`(b.name ILIKE ${like} OR b.phone ILIKE ${like} OR b.email ILIKE ${like} OR b.message ILIKE ${like} OR b.reference ILIKE ${like})`);
      }
      const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const [count] = await db.query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM event_bookings b ${clause}`, params);
      const rows = await db.query<Row>(
        `SELECT b.*, e.event_date, e.translations
         FROM event_bookings b JOIN events e ON e.id = b.event_id
         ${clause} ORDER BY b.created_at DESC, b.id DESC LIMIT ${param(pageSize)} OFFSET ${param((page - 1) * pageSize)}`,
        params,
      );
      return { items: rows.map(toBooking), page, pageSize, total: count!.total };
    },

    async updateStatus(id: number, status: BookingStatus): Promise<Booking | undefined> {
      // handled means moved off 'pending'; back to pending clears the mark
      const [row] = await db.query<Row>(
        `UPDATE event_bookings
            SET status = $1, handled_at = CASE WHEN $1 = 'pending' THEN NULL ELSE now() END
          WHERE id = $2 RETURNING *`,
        [status, id],
      );
      return row && toBooking(row);
    },

    /**
     * Staff corrections to a booking. More guests are only taken while the
     * event has room for them; the check and the change happen together, with
     * the event's row locked, exactly as when a place is first reserved.
     */
    async update(
      id: number,
      input: { name: string; phone: string; email?: string; guests: number; message?: string },
    ): Promise<{ kind: 'gone' } | { kind: 'no_room'; placesLeft: number } | { kind: 'updated'; booking: Booking }> {
      return db.transaction(async (tx) => {
        const [current] = await tx.query<Row>('SELECT * FROM event_bookings WHERE id = $1', [id]);
        if (!current) return { kind: 'gone' as const };
        const [event] = await tx.query<{ capacity: number | null }>('SELECT capacity FROM events WHERE id = $1 FOR UPDATE', [current.event_id]);
        // a cancelled booking holds no places, so its number can be anything
        if (event && event.capacity !== null && current.status !== 'cancelled' && input.guests > current.guests) {
          const others = (await guestsHeld(tx, current.event_id)) - current.guests;
          const left = Math.max(0, event.capacity - others);
          if (input.guests > left) return { kind: 'no_room' as const, placesLeft: left };
        }
        const [row] = await tx.query<Row>(
          `UPDATE event_bookings SET name = $1, phone = $2, email = $3, guests = $4, message = $5 WHERE id = $6 RETURNING *`,
          [input.name, input.phone, input.email ?? null, input.guests, input.message ?? null, id],
        );
        return { kind: 'updated' as const, booking: toBooking(row!) };
      });
    },

    /** Deleting a booking for good; its places go back to the event */
    async remove(id: number): Promise<boolean> {
      return (await db.execute('DELETE FROM event_bookings WHERE id = $1', [id])) > 0;
    },

    guestsForEvent: (eventId: number) => guestsHeld(db, eventId),

    async stats(): Promise<{ total: number; pending: number; guestsUpcoming: number; handledToday: number }> {
      const [row] = await db.query<{ total: number; pending: number; handled: number; guests: number }>(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE b.status = 'pending')::int AS pending,
                COUNT(*) FILTER (WHERE ${dayOf('b.handled_at')} = ${TODAY})::int AS handled,
                COALESCE(SUM(b.guests) FILTER (WHERE e.event_date >= ${TODAY} AND b.status != 'cancelled'), 0)::int AS guests
         FROM event_bookings b JOIN events e ON e.id = b.event_id`,
      );
      return { total: row!.total, pending: row!.pending, guestsUpcoming: row!.guests, handledToday: row!.handled };
    },
  };
}
export type BookingRepository = ReturnType<typeof bookingRepository>;
