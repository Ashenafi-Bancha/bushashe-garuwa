import { Router } from 'express';
import type { Guards } from '../../http/guards.js';
import { HttpError } from '../../http/http-error.js';
import { sendData } from '../../http/respond.js';
import { validateBody } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import type { ReviewRepository } from './review.repository.js';
import { SaveReview } from './review.schema.js';

/**
 * Guests' reviews, added by staff (with the guest's permission) and shown on the website.
 *
 * GET    /reviews             public: the published reviews, newest first
 * GET    /reviews/admin       staff: every review, hidden ones too
 * POST   /reviews/admin       staff: add a review
 * PUT    /reviews/admin/:id   staff: change it, or hide or show it
 * DELETE /reviews/admin/:id   staff: remove it
 */
export function reviewRoutes(repo: ReviewRepository, guards: Guards) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendData(res, { items: await repo.published() });
  });

  router.get('/admin', ...guards.admin, async (_req, res) => {
    sendData(res, { items: await repo.all() });
  });

  router.post('/admin', ...guards.admin, validateBody(SaveReview), async (req, res) => {
    sendData(res, await repo.create(req.body as SaveReview), 201);
  });

  router.put('/admin/:id', ...guards.admin, validateBody(SaveReview), async (req, res) => {
    const review = await repo.update(parseId(req.params.id), req.body as SaveReview);
    if (!review) throw HttpError.notFound('No such review');
    sendData(res, review);
  });

  router.delete('/admin/:id', ...guards.admin, async (req, res) => {
    if (!(await repo.remove(parseId(req.params.id)))) throw HttpError.notFound('No such review');
    sendData(res, { removed: true });
  });

  return router;
}
