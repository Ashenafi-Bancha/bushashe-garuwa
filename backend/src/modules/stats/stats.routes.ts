import { Router } from 'express';
import { todayInEthiopia } from '../../db/sql.js';
import type { Guards } from '../../http/guards.js';
import { rateLimit, visitorAddress } from '../../http/rate-limit.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { logger } from '../../lib/logger.js';
import type { StatsRepository } from './stats.repository.js';
import { PageView, StatsQuery } from './stats.schema.js';
import { deviceOf, isRobot, sourceOf, visitorCode } from './stats.service.js';

/**
 * Visitor statistics, kept by the website itself: no cookies, no outside service.
 *
 * POST /stats/view    the website: a page was opened (answers 204, even for robots)
 * GET  /stats/admin   staff: visitors per day, pages, where they came from, languages, devices
 */
export function statsRoutes(repo: StatsRepository, guards: Guards) {
  const router = Router();
  let prunedOn = '';

  router.post('/view', rateLimit({ max: 300, windowMs: 15 * 60 * 1000 }), validateBody(PageView), async (req, res) => {
    const view = req.body as PageView;
    const userAgent = req.get('user-agent') ?? '';
    // robots, and the staff area and the pages under review, are not counted
    if (isRobot(userAgent) || /^\/(admin|preview)(\/|$)/.test(view.path)) {
      res.status(204).end();
      return;
    }
    const day = todayInEthiopia();
    try {
      await repo.add({
        day,
        path: view.path.length > 1 ? view.path.replace(/\/+$/, '') : '/',
        lang: view.lang,
        source: sourceOf(view.ref, view.src, req.hostname),
        device: deviceOf(userAgent),
        visitor: visitorCode(day, visitorAddress(req), userAgent),
      });
      // once a day, forget views older than about a year
      if (prunedOn !== day) {
        prunedOn = day;
        await repo.prune(day);
      }
    } catch (error) {
      // a count that fails must never trouble the visitor
      logger.warn('stats: a page view was not saved', { error: String(error) });
    }
    res.status(204).end();
  });

  router.get('/admin', ...guards.admin, validateQuery(StatsQuery), async (_req, res) => {
    const { days } = res.locals.query as { days: number };
    sendData(res, await repo.summary(todayInEthiopia(), days));
  });

  return router;
}
