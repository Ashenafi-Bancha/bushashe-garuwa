import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { PaginationQuery } from '../../lib/pagination.js';
import { validateBody, validateQuery } from '../../middleware/validate.js';
import { parseId } from '../params.js';
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
export function visitRoutes(service: VisitService, guards: { form: RequestHandler; admin: RequestHandler }) {
  const router = Router();

  router.post('/', guards.form, validateBody(CreateVisitRequest), (req, res) => {
    const visit = service.submit(req.body);
    res.status(201).json({ data: { id: visit?.id ?? null, received: true } });
  });

  router.get('/', guards.admin, validateQuery(ListQuery), (_req, res) => {
    const { upcoming, ...pagination } = res.locals.query as z.infer<typeof ListQuery>;
    res.json({ data: service.list(pagination, { upcoming }) });
  });

  router.patch('/:id/status', guards.admin, validateBody(UpdateVisitStatus), (req, res) => {
    res.json({ data: service.setStatus(parseId(req.params.id), req.body.status) });
  });

  return router;
}
