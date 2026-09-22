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
];
