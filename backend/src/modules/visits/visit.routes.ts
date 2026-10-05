import { Router } from 'express';
import { z } from 'zod';
import type { Guards } from '../../http/guards.js';
import { PaginationQuery, SearchQuery } from '../../http/pagination.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import { CreateVisitRequest, UpdateVisitRequest, UpdateVisitStatus } from './visit.schema.js';
import type { VisitService } from './visit.service.js';

const ListQuery = PaginationQuery.extend({
  q: SearchQuery,
  upcoming: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

/**
 * POST  /visits              public: the Plan Your Visit form
 * GET   /visits              staff: list requests (?page, ?pageSize, ?upcoming=true)
 * PATCH /visits/:id/status   staff: mark as in_progress / done / archived
 * PUT   /visits/:id          staff: correct the details
 * DELETE /visits/:id         staff: delete the request for good
 */
export function visitRoutes(service: VisitService, guards: Guards) {
  const router = Router();

  router.post('/', ...guards.form, validateBody(CreateVisitRequest), async (req, res) => {
    const visit = await service.submit(req.body);
    sendData(res, { id: visit?.id ?? null, received: true }, 201);
  });

  router.get('/', ...guards.admin, validateQuery(ListQuery), async (_req, res) => {
    const { upcoming, q, ...pagination } = res.locals.query as z.infer<typeof ListQuery>;
    sendData(res, await service.list(pagination, { upcoming, search: q }));
  });

  router.patch('/:id/status', ...guards.admin, validateBody(UpdateVisitStatus), async (req, res) => {
    sendData(res, await service.setStatus(parseId(req.params.id), req.body.status));
  });

  router.put('/:id', ...guards.admin, validateBody(UpdateVisitRequest), async (req, res) => {
    sendData(res, await service.update(parseId(req.params.id), req.body));
  });

  router.delete('/:id', ...guards.admin, async (req, res) => {
    await service.remove(parseId(req.params.id));
    sendData(res, { removed: true });
  });

  return router;
}
