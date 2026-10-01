import { loadEnv } from '../../src/config/env.js';
import { openDatabase, openMemoryDatabase, type Database } from '../../src/db/database.js';

/**
 * The database a test file runs against.
 *
 * Normally an in-memory PostgreSQL, so `pnpm test` needs nothing installed.
 * Set TEST_DATABASE_URL to a PostgreSQL server (an account allowed to create
 * databases) and each test file gets its own fresh database there instead,
 * which is removed again afterwards:
 *
 *   TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres pnpm test
 */
export async function openTestDatabase(): Promise<Database> {
  const server = process.env.TEST_DATABASE_URL;
  if (!server) return openMemoryDatabase();

  const { default: pg } = await import('pg');
  const name = `bushaashe_test_${process.pid}_${Date.now()}`;
  const asAdmin = async (sql: string) => {
    const client = new pg.Client({ connectionString: server });
    await client.connect();
    try {
      await client.query(sql);
    } finally {
      await client.end();
    }
  };

  await asAdmin(`CREATE DATABASE ${name}`);
  const url = new URL(server);
  url.pathname = `/${name}`;
  const db = await openDatabase(loadEnv({ NODE_ENV: 'test', DATABASE_URL: url.toString() }));

  return {
    ...db,
    async close() {
      await db.close();
      await asAdmin(`DROP DATABASE IF EXISTS ${name}`);
    },
  };
}
