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
  JSON.stringify(input.translations),
];

/** All SQL for events. */
export function eventRepository(db: Database) {
  return {
    /** Published and not yet past, soonest first: what the website shows */
    upcoming(): EventRecord[] {
      const rows = db
        .prepare(`SELECT * FROM events WHERE published = 1 AND event_date >= date('now') ORDER BY event_date ASC, id ASC`)
        .all() as Row[];
      return rows.map(toEvent);
    },

    /** Everything, newest date first: what the staff page shows */
    all(): EventRecord[] {
      return (db.prepare('SELECT * FROM events ORDER BY event_date DESC, id DESC').all() as Row[]).map(toEvent);
    },

    find(id: number): EventRecord | undefined {
      const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as Row | undefined;
      return row && toEvent(row);
    },

    create(input: SaveEvent): EventRecord {
      const row = db
        .prepare(
          `INSERT INTO events (event_date, event_time, category, availability, featured, published, photo, partner, bookable, translations)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        )
        .get(...values(input)) as Row;
      return toEvent(row);
    },

    update(id: number, input: SaveEvent): EventRecord | undefined {
      const row = db
        .prepare(
          `UPDATE events SET event_date = ?, event_time = ?, category = ?, availability = ?, featured = ?,
                             published = ?, photo = ?, partner = ?, bookable = ?, translations = ?,
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
