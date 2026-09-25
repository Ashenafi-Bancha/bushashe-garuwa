import { Router } from 'express';
import { z } from 'zod';
import type { Guards } from '../../http/guards.js';
import { PaginationQuery } from '../../http/pagination.js';
import { sendData } from '../../http/respond.js';
import { validateBody, validateQuery } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import { CreateBooking, UpdateBookingStatus } from './booking.schema.js';
import type { BookingService } from './booking.service.js';
import { SaveEvent } from './event.schema.js';
import type { EventService } from './event.service.js';

/**
 * GET    /events          public: published events that are still to come
 * GET    /events/admin    staff: every event, including drafts and past ones
 * POST   /events/admin    staff: add an event
 * PUT    /events/admin/:id    staff: change an event
 * DELETE /events/admin/:id    staff: remove an event
 *
 * POST   /events/:id/bookings         public: reserve places at an event
 * GET    /events/admin/bookings       staff: every booking (?eventId, ?page)
 * PATCH  /events/admin/bookings/:id/status   staff: change a booking's status
 */
const BookingListQuery = PaginationQuery.extend({
  eventId: z.coerce.number().int().min(1).optional(),
});

export function eventRoutes(service: EventService, bookings: BookingService, guards: Guards) {
  const router = Router();

  // bookings are listed before /admin/:id so "bookings" is not read as an id
  router.get('/admin/bookings', ...guards.admin, validateQuery(BookingListQuery), (_req, res) => {
    const { eventId, ...pagination } = res.locals.query as z.infer<typeof BookingListQuery>;
    sendData(res, bookings.list(pagination, { eventId }));
  });

  router.patch('/admin/bookings/:id/status', ...guards.admin, validateBody(UpdateBookingStatus), (req, res) => {
    sendData(res, bookings.setStatus(parseId(req.params.id), req.body.status));
  });

  router.post('/:id/bookings', ...guards.form, validateBody(CreateBooking), (req, res) => {
    const booking = bookings.book(parseId(req.params.id), req.body);
    sendData(res, { id: booking?.id ?? null, received: true }, 201);
  });

  router.get('/', (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=60');
    sendData(res, { items: service.published() });
  });

  router.get('/admin', ...guards.admin, (_req, res) => {
    sendData(res, { items: service.all() });
  });

  router.post('/admin', ...guards.admin, validateBody(SaveEvent), (req, res) => {
    sendData(res, service.create(req.body), 201);
  });

  router.put('/admin/:id', ...guards.admin, validateBody(SaveEvent), (req, res) => {
    sendData(res, service.update(parseId(req.params.id), req.body));
  });

  router.delete('/admin/:id', ...guards.admin, (req, res) => {
    service.remove(parseId(req.params.id));
    sendData(res, { removed: true });
  });

  return router;
}
