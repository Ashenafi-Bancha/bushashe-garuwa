import { Router } from 'express';
import { z } from 'zod';
import type { Guards } from '../../http/guards.js';
import { PaginationQuery } from '../../http/pagination.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import { CreateVisitRequest, UpdateVisitStatus } from './visit.schema.js';
import type { VisitService } from './visit.service.js';

const ListQuery = PaginationQuery.extend({
  upcoming: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

/**
 * POST  /visits              public: the Plan Your Visit form
 * GET   /visits              staff: list requests (?page, ?pageSize, ?upcoming=true)
 * PATCH /visits/:id/status   staff: mark as in_progress / done / archived
 */
export function visitRoutes(service: VisitService, guards: Guards) {
  const router = Router();

  router.post('/', ...guards.form, validateBody(CreateVisitRequest), (req, res) => {
    const visit = service.submit(req.body);
    sendData(res, { id: visit?.id ?? null, received: true }, 201);
  });

  router.get('/', ...guards.admin, validateQuery(ListQuery), (_req, res) => {
    const { upcoming, ...pagination } = res.locals.query as z.infer<typeof ListQuery>;
    sendData(res, service.list(pagination, { upcoming }));
  });

  router.patch('/:id/status', ...guards.admin, validateBody(UpdateVisitStatus), (req, res) => {
    sendData(res, service.setStatus(parseId(req.params.id), req.body.status));
  });

  return router;
}
