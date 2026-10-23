import type { Queryable } from '../../db/database.js';
import type { RequestStatus } from '../shared/schemas.js';

/** A visit expected on a day */
export type ScheduledVisit = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  visitors: string;
  experiences: string[];
  message: string | null;
  status: RequestStatus;
};

/** A booking for an event on a day */
export type ScheduledBooking = { id: number; reference: string; name: string; phone: string; guests: number; status: string };

/** An event on a day, with the places booked for it */
export type ScheduledEvent = {
  id: number;
  name: string;
  time: string | null;
  published: boolean;
  capacity: number | null;
  guests: number;
  bookings: ScheduledBooking[];
};

export type ScheduleDay = { date: string; visits: ScheduledVisit[]; events: ScheduledEvent[] };

const ymd = (value: Date | string) => (typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10));
const parse = <T>(value: T | string): T => (typeof value === 'string' ? (JSON.parse(value) as T) : value);

/**
 * Who is coming, day by day: the visit requests for each date (archived ones
 * left out) and the events with their bookings (cancelled ones left out).
 */
export function scheduleRepository(db: Queryable) {
  return {
    async between(from: string, to: string): Promise<ScheduleDay[]> {
      const [visits, events, bookings] = await Promise.all([
        db.query<{ id: number; visit_date: Date | string; name: string; phone: string; email: string | null; visitors: string; experiences: string[] | string; message: string | null; status: RequestStatus }>(
          `SELECT id, visit_date, name, phone, email, visitors, experiences, message, status FROM visit_requests
           WHERE visit_date BETWEEN $1 AND $2 AND status != 'archived' ORDER BY visit_date, created_at`,
          [from, to],
        ),
        db.query<{ id: number; event_date: Date | string; event_time: string | null; published: boolean; capacity: number | null; name: string }>(
          `SELECT id, event_date, event_time, published, capacity, translations -> 'en' ->> 'name' AS name FROM events
           WHERE event_date BETWEEN $1 AND $2 ORDER BY event_date, event_time NULLS LAST, id`,
          [from, to],
        ),
        db.query<{ id: number; event_id: number; reference: string; name: string; phone: string; guests: number; status: string }>(
          `SELECT b.id, b.event_id, b.reference, b.name, b.phone, b.guests, b.status FROM event_bookings b JOIN events e ON e.id = b.event_id
           WHERE e.event_date BETWEEN $1 AND $2 AND b.status != 'cancelled' ORDER BY b.created_at`,
          [from, to],
        ),
      ]);

      const days = new Map<string, ScheduleDay>();
      const day = (date: string) => {
        if (!days.has(date)) days.set(date, { date, visits: [], events: [] });
        return days.get(date)!;
      };
      for (const v of visits) {
        day(ymd(v.visit_date)).visits.push({
          id: v.id,
          name: v.name,
          phone: v.phone,
          email: v.email,
          visitors: v.visitors,
          experiences: parse(v.experiences),
          message: v.message,
          status: v.status,
        });
      }
      for (const e of events) {
        const own = bookings.filter((b) => b.event_id === e.id).map(({ event_id: _event, ...b }) => b);
        day(ymd(e.event_date)).events.push({
          id: e.id,
          name: e.name ?? '',
          time: e.event_time,
          published: e.published,
          capacity: e.capacity,
          guests: own.reduce((sum, b) => sum + b.guests, 0),
          bookings: own,
        });
      }
      return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
    },
  };
}
export type ScheduleRepository = ReturnType<typeof scheduleRepository>;
