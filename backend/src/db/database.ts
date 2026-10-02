import type { Env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { migrations } from './migrations.js';

/** Runs SQL: the database itself, or one open transaction */
export interface Queryable {
  /** Runs one statement and returns its rows */
  query<T = Record<string, unknown>>(sql: string, params?: readonly unknown[]): Promise<T[]>;
  /** Runs one statement and returns how many rows it changed */
  execute(sql: string, params?: readonly unknown[]): Promise<number>;
  /** Runs a script of several statements, without parameters (migrations) */
  script(sql: string): Promise<void>;
}

export interface Database extends Queryable {
  /** Everything inside `work` is saved together, or not at all */
  transaction<T>(work: (tx: Queryable) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

/** PostgreSQL's own type number for DATE: kept as the plain 'YYYY-MM-DD' text, never a JS Date */
const DATE_TYPE = 1082;
const dateAsText = (value: string) => value;

/**
 * Opens the PostgreSQL database and brings it up to date.
 *
 * With DATABASE_URL set, this connects to that PostgreSQL server (the hosted
 * database). Without it, outside production, an embedded PostgreSQL keeps its
 * files in DEV_DATABASE_DIR, so there is no database server to install on a
 * developer's computer.
 */
export async function openDatabase(env: Env): Promise<Database> {
  if (env.DATABASE_URL) return ready(await connectPostgres(env));
  if (env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is not set: in production the API needs a PostgreSQL database');
  }
  logger.info(`database: no DATABASE_URL, using the embedded PostgreSQL in ${env.DEV_DATABASE_DIR}`);
  return ready(await openEmbedded(env.DEV_DATABASE_DIR));
}

/** A throwaway PostgreSQL in memory, for tests */
export async function openMemoryDatabase(): Promise<Database> {
  return ready(await openEmbedded());
}

async function ready(db: Database): Promise<Database> {
  await migrate(db);
  return db;
}

/* ── the hosted database: PostgreSQL over the network ── */

async function connectPostgres(env: Env): Promise<Database> {
  const { default: pg } = await import('pg');
  pg.types.setTypeParser(DATE_TYPE, dateAsText);

  logger.info(`database: connecting to PostgreSQL, DATABASE_SSL=${env.DATABASE_SSL}`);
  const pool = new pg.Pool({
    connectionString: withoutSslSettings(env.DATABASE_URL),
    ssl: env.DATABASE_SSL === 'off' ? false : { rejectUnauthorized: env.DATABASE_SSL === 'require' },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  // a dropped idle connection must not take the whole API down
  pool.on('error', (error) => logger.error('database: idle connection error', { error: String(error) }));

  type Runner = { query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[]; rowCount: number | null }> };
  const wrap = (runner: Runner): Queryable => ({
    query: async <T>(sql: string, params: readonly unknown[] = []) => (await runner.query(sql, [...params])).rows as T[],
    execute: async (sql, params = []) => (await runner.query(sql, [...params])).rowCount ?? 0,
    script: async (sql) => void (await runner.query(sql)),
  });

  await pool.query('SELECT 1'); // fail at start-up, with a clear error, if the database cannot be reached

  return {
    ...wrap(pool),
    async transaction(work) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await work(wrap(client));
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

/**
 * Drops sslmode and its relatives from the address: pg lets them override the
 * `ssl` option, and DATABASE_SSL alone decides how the connection is encrypted.
 */
export function withoutSslSettings(databaseUrl: string): string {
  const [address = '', query] = databaseUrl.split('?', 2);
  if (!query) return databaseUrl;
  const kept = query.split('&').filter((setting) => !/^(ssl|sslmode|sslcert|sslkey|sslrootcert|sslnegotiation|uselibpqcompat)=/i.test(setting));
  return kept.length ? `${address}?${kept.join('&')}` : address;
}

/* ── development and tests: PostgreSQL inside this process (PGlite) ── */

async function openEmbedded(dataDir?: string): Promise<Database> {
  const { PGlite } = await import('@electric-sql/pglite');
  const lite = new PGlite({ dataDir, parsers: { [DATE_TYPE]: dateAsText } });
  await lite.waitReady;

  type Runner = {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[]; affectedRows?: number }>;
    exec: (sql: string) => Promise<unknown>;
  };
  const wrap = (runner: Runner): Queryable => ({
    query: async <T>(sql: string, params: readonly unknown[] = []) => (await runner.query(sql, [...params])).rows as T[],
    execute: async (sql, params = []) => (await runner.query(sql, [...params])).affectedRows ?? 0,
    script: async (sql) => void (await runner.exec(sql)),
  });

  return {
    ...wrap(lite),
    transaction: <T>(work: (tx: Queryable) => Promise<T>) => lite.transaction((tx) => work(wrap(tx))) as Promise<T>,
    close: () => lite.close(),
  };
}

/* ── migrations ── */

/** Any fixed number: two API instances starting together take turns instead of colliding */
const MIGRATION_LOCK = 20261001;

async function migrate(db: Database): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.query('SELECT pg_advisory_xact_lock($1)', [MIGRATION_LOCK]);
    await tx.script(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);

    const applied = new Set((await tx.query<{ id: number }>('SELECT id FROM schema_migrations')).map((row) => row.id));

    for (const migration of migrations) {
      if (applied.has(migration.id)) continue;
      await tx.script(migration.sql);
      await tx.execute('INSERT INTO schema_migrations (id, name) VALUES ($1, $2)', [migration.id, migration.name]);
      logger.info(`database: applied migration ${migration.id} (${migration.name})`);
    }
  });
}
