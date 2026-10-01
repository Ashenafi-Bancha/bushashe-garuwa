/**
 * Database changes for PostgreSQL, applied in order and exactly once each.
 * To change the database, add a new entry at the end; never edit one that has already run.
 */
export const migrations: { id: number; name: string; sql: string }[] = [
  {
    id: 1,
    name: 'contact messages, visit requests, website content, events and bookings',
    sql: `
      CREATE TABLE contact_messages (
        id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name        TEXT        NOT NULL,
        email       TEXT        NOT NULL,
        phone       TEXT,
        message     TEXT        NOT NULL,
        language    TEXT        NOT NULL DEFAULT 'en',
        status      TEXT        NOT NULL DEFAULT 'new',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        handled_at  TIMESTAMPTZ
      );
      CREATE INDEX idx_contact_messages_created ON contact_messages (created_at DESC);

      CREATE TABLE visit_requests (
        id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name         TEXT        NOT NULL,
        phone        TEXT        NOT NULL,
        email        TEXT,
        visit_date   DATE        NOT NULL,
        visitors     TEXT        NOT NULL,
        experiences  JSONB       NOT NULL DEFAULT '[]',
        message      TEXT,
        language     TEXT        NOT NULL DEFAULT 'en',
        status       TEXT        NOT NULL DEFAULT 'new',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        handled_at   TIMESTAMPTZ
      );
      CREATE INDEX idx_visit_requests_date ON visit_requests (visit_date);

      CREATE TABLE content_entries (
        key         TEXT        NOT NULL,
        lang        TEXT        NOT NULL,
        value       TEXT        NOT NULL,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (key, lang)
      );

      CREATE TABLE events (
        id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        event_date    DATE        NOT NULL,
        event_time    TEXT,
        category      TEXT        NOT NULL,
        availability  TEXT        NOT NULL DEFAULT 'open',
        featured      BOOLEAN     NOT NULL DEFAULT false,
        published     BOOLEAN     NOT NULL DEFAULT true,
        photo         TEXT,
        partner       TEXT,
        bookable      BOOLEAN     NOT NULL DEFAULT false,
        -- how many guests the event can take; NULL means no limit
        capacity      INTEGER,
        translations  JSONB       NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX idx_events_date ON events (event_date);

      -- bookings have their own life: pending -> confirmed -> attended, or cancelled
      CREATE TABLE event_bookings (
        id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        event_id    INTEGER     NOT NULL REFERENCES events (id) ON DELETE CASCADE,
        -- a short code the guest can quote, e.g. BG-7K3Q
        reference   TEXT        NOT NULL UNIQUE,
        name        TEXT        NOT NULL,
        phone       TEXT        NOT NULL,
        email       TEXT,
        guests      INTEGER     NOT NULL DEFAULT 1,
        message     TEXT,
        language    TEXT        NOT NULL DEFAULT 'en',
        status      TEXT        NOT NULL DEFAULT 'pending',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        handled_at  TIMESTAMPTZ
      );
      CREATE INDEX idx_event_bookings_event ON event_bookings (event_id, created_at DESC);
    `,
  },
  {
    id: 2,
    name: 'staff accounts and sign-in sessions',
    sql: `
      CREATE TABLE staff_users (
        id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        -- always stored in lower case
        email          TEXT        NOT NULL UNIQUE,
        -- a salted scrypt hash; the password itself is never stored
        password_hash  TEXT        NOT NULL,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_login_at  TIMESTAMPTZ
      );

      CREATE TABLE staff_sessions (
        -- a hash of the token the browser holds, so this table alone cannot be used to sign in
        token_hash  TEXT        PRIMARY KEY,
        user_id     INTEGER     NOT NULL REFERENCES staff_users (id) ON DELETE CASCADE,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        expires_at  TIMESTAMPTZ NOT NULL
      );
      CREATE INDEX idx_staff_sessions_user ON staff_sessions (user_id);
    `,
  },
];
