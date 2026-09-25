import type { Database } from '../../db/database.js';
import type { EventRecord, SaveEvent } from './event.schema.js';

type Row = {
  id: number;
  event_date: string;
  event_time: string | null;
  category: EventRecord['category'];
  availability: EventRecord['availability'];
  featured: number;
  published: number;
  photo: string | null;
  partner: string | null;
  bookable: number;
  capacity: number | null;
  places_taken?: number;
  translations: string;
  created_at: string;
  updated_at: string;
};

const toEvent = (row: Row): EventRecord => ({
  id: row.id,
  date: row.event_date,
  time: row.event_time,
  category: row.category,
  availability: row.availability,
  featured: row.featured === 1,
  published: row.published === 1,
  photo: row.photo,
  partner: row.partner,
  bookable: row.bookable === 1,
  capacity: row.capacity,
  placesLeft: row.capacity === null ? null : Math.max(0, row.capacity - (row.places_taken ?? 0)),
  translations: JSON.parse(row.translations),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const values = (input: SaveEvent) => [
  input.date,
  input.time ?? null,
  input.category,
  input.availability,
  input.featured ? 1 : 0,
  input.published ? 1 : 0,
  input.photo ?? null,
  input.partner ?? null,
  input.bookable ? 1 : 0,
  input.capacity,
  JSON.stringify(input.translations),
];


/** Bookings that still hold a place: cancelled ones give their places back */
const PLACES_TAKEN = `(SELECT COALESCE(SUM(b.guests), 0) FROM event_bookings b
   WHERE b.event_id = events.id AND b.status != 'cancelled') AS places_taken`;

/** All SQL for events. */
export function eventRepository(db: Database) {
  return {
    /** Published and not yet past, soonest first: what the website shows */
    upcoming(): EventRecord[] {
      const rows = db
        .prepare(`SELECT *, ${PLACES_TAKEN} FROM events WHERE published = 1 AND event_date >= date('now') ORDER BY event_date ASC, id ASC`)
        .all() as Row[];
      return rows.map(toEvent);
    },

    /** Everything, newest date first: what the staff page shows */
    all(): EventRecord[] {
      return (db.prepare(`SELECT *, ${PLACES_TAKEN} FROM events ORDER BY event_date DESC, id DESC`).all() as Row[]).map(toEvent);
    },

    find(id: number): EventRecord | undefined {
      const row = db.prepare(`SELECT *, ${PLACES_TAKEN} FROM events WHERE id = ?`).get(id) as Row | undefined;
      return row && toEvent(row);
    },

    create(input: SaveEvent): EventRecord {
      const row = db
        .prepare(
          `INSERT INTO events (event_date, event_time, category, availability, featured, published, photo, partner, bookable, capacity, translations)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        )
        .get(...values(input)) as Row;
      return toEvent(row);
    },

    update(id: number, input: SaveEvent): EventRecord | undefined {
      const row = db
        .prepare(
          `UPDATE events SET event_date = ?, event_time = ?, category = ?, availability = ?, featured = ?,
                             published = ?, photo = ?, partner = ?, bookable = ?, capacity = ?, translations = ?,
                             updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
           WHERE id = ? RETURNING *`,
        )
        .get(...values(input), id) as Row | undefined;
      return row && toEvent(row);
    },

    remove(id: number): boolean {
      return db.prepare('DELETE FROM events WHERE id = ?').run(id).changes > 0;
    },

    stats(): { total: number; upcoming: number; drafts: number } {
      const row = db
        .prepare(
          `SELECT COUNT(*) AS total,
                  SUM(published = 1 AND event_date >= date('now')) AS upcoming,
                  SUM(published = 0) AS drafts
           FROM events`,
        )
        .get() as { total: number; upcoming: number | null; drafts: number | null };
      return { total: row.total, upcoming: row.upcoming ?? 0, drafts: row.drafts ?? 0 };
    },
  };
}
export type EventRepository = ReturnType<typeof eventRepository>;
