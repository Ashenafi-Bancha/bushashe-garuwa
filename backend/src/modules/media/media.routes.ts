import express, { Router } from 'express';
import type { z } from 'zod';
import type { Guards } from '../../http/guards.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import { UpdateMedia, UploadQuery } from './media.schema.js';
import type { MediaService } from './media.service.js';

/** The website shrinks a photo before sending it, so this is generous */
const MAX_PHOTO = '6mb';

/**
 * GET    /media                 public: the photos staff added (gallery, and the pages' opening photos)
 * GET    /media/:id/image       public: the photograph itself
 * GET    /media/admin           staff: every photo, hidden ones too
 * POST   /media/admin/images    staff: add a photo; the body is the file (?kind, ?slot, ?category)
 * PUT    /media/admin/:id       staff: its heading, description, category, and whether it shows
 * DELETE /media/admin/:id       staff: remove a photo
 */
export function mediaRoutes(service: MediaService, guards: Guards) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendData(res, await service.published());
  });

  router.get('/admin', ...guards.admin, async (_req, res) => {
    sendData(res, { items: await service.all() });
  });

  router.post(
    '/admin/images',
    ...guards.admin,
    express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: MAX_PHOTO }),
    validateQuery(UploadQuery),
    async (req, res) => {
      sendData(res, await service.upload(res.locals.query as z.infer<typeof UploadQuery>, req.body), 201);
    },
  );

  router.put('/admin/:id', ...guards.admin, validateBody(UpdateMedia), async (req, res) => {
    sendData(res, await service.update(parseId(req.params.id), req.body));
  });

  router.delete('/admin/:id', ...guards.admin, async (req, res) => {
    await service.remove(parseId(req.params.id));
    sendData(res, { removed: true });
  });

  router.get('/:id/image', async (req, res) => {
    const file = await service.file(parseId(req.params.id));
    // a photo never changes once stored: a new one gets a new id
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.type(file.mime).send(file.bytes);
  });

  return router;
}
