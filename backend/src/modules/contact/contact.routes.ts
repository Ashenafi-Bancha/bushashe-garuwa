import { Router, type RequestHandler } from 'express';
import { PaginationQuery, type Pagination } from '../../lib/pagination.js';
import { validateBody, validateQuery } from '../../middleware/validate.js';
import { parseId } from '../params.js';
import { CreateContactMessage, UpdateContactStatus } from './contact.schema.js';
import type { ContactService } from './contact.service.js';

/**
 * POST  /contact              public: the Contact page form
 * GET   /contact              staff: list messages (?page, ?pageSize)
 * PATCH /contact/:id/status   staff: mark as in_progress / done / archived
 */
export function contactRoutes(service: ContactService, guards: { form: RequestHandler; admin: RequestHandler }) {
  const router = Router();

  router.post('/', guards.form, validateBody(CreateContactMessage), (req, res) => {
    const message = service.submit(req.body);
    res.status(201).json({ data: { id: message?.id ?? null, received: true } });
  });

  router.get('/', guards.admin, validateQuery(PaginationQuery), (_req, res) => {
    res.json({ data: service.list(res.locals.query as Pagination) });
  });

  router.patch('/:id/status', guards.admin, validateBody(UpdateContactStatus), (req, res) => {
    res.json({ data: service.setStatus(parseId(req.params.id), req.body.status) });
  });

  return router;
}
