import { Router } from 'express';
import type { Guards } from '../../http/guards.js';
import { PaginationQuery, type Pagination } from '../../http/pagination.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import { CreateContactMessage, UpdateContactStatus } from './contact.schema.js';
import type { ContactService } from './contact.service.js';

/**
 * POST  /contact              public: the Contact page form
 * GET   /contact              staff: list messages (?page, ?pageSize)
 * PATCH /contact/:id/status   staff: mark as in_progress / done / archived
 */
export function contactRoutes(service: ContactService, guards: Guards) {
  const router = Router();

  router.post('/', ...guards.form, validateBody(CreateContactMessage), (req, res) => {
    const message = service.submit(req.body);
    sendData(res, { id: message?.id ?? null, received: true }, 201);
  });

  router.get('/', ...guards.admin, validateQuery(PaginationQuery), (_req, res) => {
    sendData(res, service.list(res.locals.query as Pagination));
  });

  router.patch('/:id/status', ...guards.admin, validateBody(UpdateContactStatus), (req, res) => {
    sendData(res, service.setStatus(parseId(req.params.id), req.body.status));
  });

  return router;
}
