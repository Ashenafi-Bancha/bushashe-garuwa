import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { openDatabase } from './db/database.js';
import { logger } from './lib/logger.js';

const env = loadEnv();
const db = openDatabase(env.DATABASE_PATH);
const app = createApp(env, db);

const server = app.listen(env.PORT, () => {
  logger.info(`Bushaashe Garuwa API listening on http://localhost:${env.PORT}`, { env: env.NODE_ENV });
  if (!env.ADMIN_API_KEY) logger.warn('ADMIN_API_KEY is not set: the staff endpoints are turned off');
});

/** Finish open requests and close the database cleanly when the host stops the server */
function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
