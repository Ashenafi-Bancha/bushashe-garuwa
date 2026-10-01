import { Router } from 'express';
import type { Database } from '../../db/database.js';

/** GET /health: for uptime checks and the hosting platform */
export function healthRoutes(db: Database) {
  const router = Router();
  router.get('/', async (_req, res) => {
    let database = 'ok';
    try {
      await db.query('SELECT 1');
    } catch {
      database = 'error';
    }
    res.status(database === 'ok' ? 200 : 503).json({ status: database === 'ok' ? 'ok' : 'degraded', database, uptime: Math.round(process.uptime()) });
  });
  return router;
}
