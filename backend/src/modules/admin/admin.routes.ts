import { Router } from 'express';
import type { Guards } from '../../http/guards.js';
import { sendData } from '../../http/respond.js';
import type { ContactRepository } from '../contact/contact.repository.js';
import type { ContentRepository } from '../content/content.repository.js';
import type { BookingRepository } from '../events/booking.repository.js';
import type { EventRepository } from '../events/event.repository.js';
import type { VisitRepository } from '../visits/visit.repository.js';

/**
 * Endpoints behind the staff admin page.
 *
 * GET /admin/session   confirms the staff key is valid (used by the sign-in box)
 * GET /admin/summary   the counts shown on the dashboard cards
 */
export function adminRoutes(
  repositories: {
    contact: ContactRepository;
    visits: VisitRepository;
    content: ContentRepository;
    events: EventRepository;
    bookings: BookingRepository;
  },
  guards: Guards,
) {
  const router = Router();
  router.use(...guards.admin);

  router.get('/session', (_req, res) => {
    sendData(res, { signedIn: true });
  });

  router.get('/summary', (_req, res) => {
    sendData(res, {
      contact: repositories.contact.stats(),
      visits: repositories.visits.stats(),
      events: repositories.events.stats(),
      bookings: repositories.bookings.stats(),
      content: { edited: repositories.content.count(), lastUpdatedAt: repositories.content.lastUpdatedAt() },
      generatedAt: new Date().toISOString(),
    });
  });

  return router;
}
