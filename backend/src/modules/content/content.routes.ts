import { Router } from 'express';
import { z } from 'zod';
import type { Guards } from '../../http/guards.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { ContentLang, ContentQuery, SaveContentBatch } from './content.schema.js';
import type { ContentService } from './content.service.js';

const PublicQuery = z.object({ lang: z.enum(['en', 'am', 'wal']).default('en') });

/**
 * GET    /content?lang=en          public: the staff edits for one language
 * GET    /content/admin            staff: every edited entry (?lang, ?prefix)
 * PUT    /content/admin            staff: save a batch of edits (empty value undoes one)
 * DELETE /content/admin/:key       staff: put the built-in text back (?lang)
 */
export function contentRoutes(service: ContentService, guards: Guards) {
  const router = Router();

  router.get('/', validateQuery(PublicQuery), async (_req, res) => {
    const { lang } = res.locals.query as z.infer<typeof PublicQuery>;
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendData(res, await service.published(lang));
  });

  router.get('/admin', ...guards.admin, validateQuery(ContentQuery), async (_req, res) => {
    sendData(res, { items: await service.list(res.locals.query as z.infer<typeof ContentQuery>) });
  });

  router.put('/admin', ...guards.admin, validateBody(SaveContentBatch), async (req, res) => {
    sendData(res, { saved: await service.save(req.body.entries) });
  });

  router.delete('/admin/:key', ...guards.admin, validateQuery(z.object({ lang: ContentLang })), async (req, res) => {
    const { lang } = res.locals.query as { lang: z.infer<typeof ContentLang> };
    await service.reset(req.params.key as string, lang);
    sendData(res, { reset: true });
  });

  return router;
}
