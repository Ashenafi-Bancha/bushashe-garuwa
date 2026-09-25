/**
 * Database changes, applied in order and exactly once each.
 * To change the database, add a new entry at the end; never edit one that has already run.
 */
export const migrations: { id: number; name: string; sql: string }[] = [
  {
    id: 1,
    name: 'contact messages and visit requests',
    sql: `
      CREATE TABLE contact_messages (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT    NOT NULL,
        email       TEXT    NOT NULL,
        phone       TEXT,
        message     TEXT    NOT NULL,
        language    TEXT    NOT NULL DEFAULT 'en',
        status      TEXT    NOT NULL DEFAULT 'new',
        created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_contact_messages_created ON contact_messages (created_at DESC);

      CREATE TABLE visit_requests (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        name         TEXT    NOT NULL,
        phone        TEXT    NOT NULL,
        email        TEXT,
        visit_date   TEXT    NOT NULL,
        visitors     TEXT    NOT NULL,
        experiences  TEXT    NOT NULL DEFAULT '[]',
        message      TEXT,
        language     TEXT    NOT NULL DEFAULT 'en',
        status       TEXT    NOT NULL DEFAULT 'new',
        created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_visit_requests_date ON visit_requests (visit_date);
    `,
  },
  {
    id: 2,
    name: 'website content, events and event bookings',
    sql: `
      CREATE TABLE content_entries (
        key         TEXT NOT NULL,
        lang        TEXT NOT NULL,
        value       TEXT NOT NULL,
        updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        PRIMARY KEY (key, lang)
      );

      CREATE TABLE events (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        event_date    TEXT    NOT NULL,
        event_time    TEXT,
        category      TEXT    NOT NULL,
        availability  TEXT    NOT NULL DEFAULT 'open',
        featured      INTEGER NOT NULL DEFAULT 0,
        published     INTEGER NOT NULL DEFAULT 1,
        photo         TEXT,
        partner       TEXT,
        bookable      INTEGER NOT NULL DEFAULT 0,
        translations  TEXT    NOT NULL,
        created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_events_date ON events (event_date);

      CREATE TABLE event_bookings (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id    INTEGER NOT NULL REFERENCES events (id) ON DELETE CASCADE,
        name        TEXT    NOT NULL,
        phone       TEXT    NOT NULL,
        email       TEXT,
        guests      INTEGER NOT NULL DEFAULT 1,
        message     TEXT,
        language    TEXT    NOT NULL DEFAULT 'en',
        status      TEXT    NOT NULL DEFAULT 'new',
        created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_event_bookings_event ON event_bookings (event_id, created_at DESC);
    `,
  },
  {
    id: 3,
    name: 'event capacity, booking references and booking statuses',
    sql: `
      -- how many guests an event can take; NULL means no limit
      ALTER TABLE events ADD COLUMN capacity INTEGER;

      -- a short code the guest can quote, e.g. BG-7K3Q
      ALTER TABLE event_bookings ADD COLUMN reference TEXT;
      CREATE UNIQUE INDEX idx_event_bookings_reference ON event_bookings (reference);

      -- bookings have their own life: pending -> confirmed -> attended, or cancelled
      UPDATE event_bookings SET status = 'pending'   WHERE status IN ('new', 'in_progress');
      UPDATE event_bookings SET status = 'confirmed' WHERE status = 'done';
      UPDATE event_bookings SET status = 'cancelled' WHERE status = 'archived';
    `,
  },
  {
    id: 4,
    name: 'give older bookings a reference',
    sql: `
      UPDATE event_bookings
         SET reference = 'BG-' || substr(hex(randomblob(4)), 1, 4)
       WHERE reference IS NULL;
    `,
  },
];
