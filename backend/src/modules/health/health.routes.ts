import { Router } from 'express';
import type { Database } from '../../db/database.js';

/** GET /health: for uptime checks and the hosting platform */
export function healthRoutes(db: Database) {
  const router = Router();
  router.get('/', (_req, res) => {
    let database = 'ok';
    try {
      db.prepare('SELECT 1').get();
    } catch {
      database = 'error';
    }
    res.status(database === 'ok' ? 200 : 503).json({ status: database === 'ok' ? 'ok' : 'degraded', database, uptime: Math.round(process.uptime()) });
  });
  return router;
}
