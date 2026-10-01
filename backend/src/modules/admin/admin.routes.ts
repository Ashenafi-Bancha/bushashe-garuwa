import { Router } from 'express';
import type { Guards } from '../../http/guards.js';
import { bearerToken } from '../../http/require-admin.js';
import { sendData } from '../../http/respond.js';
import { validateBody } from '../../http/validate.js';
import { LoginBody } from '../staff/staff.schema.js';
import type { StaffService } from '../staff/staff.service.js';
import type { ContactRepository } from '../contact/contact.repository.js';
import type { ContentRepository } from '../content/content.repository.js';
import type { BookingRepository } from '../events/booking.repository.js';
import type { EventRepository } from '../events/event.repository.js';
import type { VisitRepository } from '../visits/visit.repository.js';

/**
 * Endpoints behind the staff admin page.
 *
 * POST /admin/login     public: email and password in, a session token out
 * POST /admin/logout    ends the session
 * GET  /admin/session   who is signed in (the staff area checks this when it opens)
 * GET  /admin/summary   the counts shown on the dashboard cards
 */
export function adminRoutes(
  repositories: {
    contact: ContactRepository;
    visits: VisitRepository;
    content: ContentRepository;
    events: EventRepository;
    bookings: BookingRepository;
  },
  staff: StaffService,
  guards: Guards,
) {
  const router = Router();

  router.post('/login', ...guards.signIn, validateBody(LoginBody), async (req, res) => {
    const { email, password } = req.body as LoginBody;
    res.setHeader('Cache-Control', 'no-store');
    sendData(res, await staff.signIn(email, password));
  });

  router.use(...guards.admin);

  router.post('/logout', async (req, res) => {
    await staff.signOut(bearerToken(req.get('authorization')));
    sendData(res, { signedOut: true });
  });

  router.get('/session', (_req, res) => {
    sendData(res, { signedIn: true, user: res.locals.staff });
  });

  router.get('/summary', async (_req, res) => {
    const [contact, visits, events, bookings, edited, lastUpdatedAt] = await Promise.all([
      repositories.contact.stats(),
      repositories.visits.stats(),
      repositories.events.stats(),
      repositories.bookings.stats(),
      repositories.content.count(),
      repositories.content.lastUpdatedAt(),
    ]);
    sendData(res, { contact, visits, events, bookings, content: { edited, lastUpdatedAt }, generatedAt: new Date().toISOString() });
  });

  return router;
}
