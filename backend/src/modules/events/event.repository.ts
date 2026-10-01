import type { Queryable } from '../../db/database.js';
import { TODAY } from '../../db/sql.js';
import type { EventRecord, SaveEvent } from './event.schema.js';

type Row = {
  id: number;
  /** 'YYYY-MM-DD' */
  event_date: string;
  event_time: string | null;
  category: EventRecord['category'];
  availability: EventRecord['availability'];
  featured: boolean;
  published: boolean;
  photo: string | null;
  partner: string | null;
  bookable: boolean;
  capacity: number | null;
  places_taken?: number;
  translations: EventRecord['translations'];
  created_at: Date;
  updated_at: Date;
};

const toEvent = (row: Row): EventRecord => ({
  id: row.id,
  date: row.event_date,
  time: row.event_time,
  category: row.category,
  availability: row.availability,
  featured: row.featured,
  published: row.published,
  photo: row.photo,
  partner: row.partner,
  bookable: row.bookable,
  capacity: row.capacity,
  placesLeft: row.capacity === null ? null : Math.max(0, row.capacity - (row.places_taken ?? 0)),
  translations: row.translations,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

const values = (input: SaveEvent) => [
  input.date,
  input.time ?? null,
  input.category,
  input.availability,
  input.featured,
  input.published,
  input.photo ?? null,
  input.partner ?? null,
  input.bookable,
  input.capacity,
  JSON.stringify(input.translations),
];

/** Bookings that still hold a place: cancelled ones give their places back */
const PLACES_TAKEN = `(SELECT COALESCE(SUM(b.guests), 0)::int FROM event_bookings b
   WHERE b.event_id = events.id AND b.status != 'cancelled') AS places_taken`;

/** All SQL for events. */
export function eventRepository(db: Queryable) {
  return {
    /** Published and not yet past, soonest first: what the website shows */
    async upcoming(): Promise<EventRecord[]> {
      const rows = await db.query<Row>(
        `SELECT *, ${PLACES_TAKEN} FROM events WHERE published AND event_date >= ${TODAY} ORDER BY event_date ASC, id ASC`,
      );
      return rows.map(toEvent);
    },

    /** Everything, newest date first: what the staff page shows */
    async all(): Promise<EventRecord[]> {
      return (await db.query<Row>(`SELECT *, ${PLACES_TAKEN} FROM events ORDER BY event_date DESC, id DESC`)).map(toEvent);
    },

    async find(id: number): Promise<EventRecord | undefined> {
      const [row] = await db.query<Row>(`SELECT *, ${PLACES_TAKEN} FROM events WHERE id = $1`, [id]);
      return row && toEvent(row);
    },

    async create(input: SaveEvent): Promise<EventRecord> {
      const [row] = await db.query<Row>(
        `INSERT INTO events (event_date, event_time, category, availability, featured, published, photo, partner, bookable, capacity, translations)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::text::jsonb) RETURNING *`,
        values(input),
      );
      return toEvent(row!);
    },

    async update(id: number, input: SaveEvent): Promise<EventRecord | undefined> {
      const [row] = await db.query<Row>(
        `UPDATE events SET event_date = $1, event_time = $2, category = $3, availability = $4, featured = $5,
                           published = $6, photo = $7, partner = $8, bookable = $9, capacity = $10,
                           translations = $11::text::jsonb, updated_at = now()
         WHERE id = $12 RETURNING *`,
        [...values(input), id],
      );
      return row && toEvent(row);
    },

    async remove(id: number): Promise<boolean> {
      return (await db.execute('DELETE FROM events WHERE id = $1', [id])) > 0;
    },

    async stats(): Promise<{ total: number; upcoming: number; drafts: number }> {
      const [row] = await db.query<{ total: number; upcoming: number; drafts: number }>(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE published AND event_date >= ${TODAY})::int AS upcoming,
                COUNT(*) FILTER (WHERE NOT published)::int AS drafts
         FROM events`,
      );
      return row!;
    },
  };
}
export type EventRepository = ReturnType<typeof eventRepository>;
