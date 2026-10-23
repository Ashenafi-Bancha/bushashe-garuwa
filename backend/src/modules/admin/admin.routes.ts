import { Router } from 'express';
import type { Guards } from '../../http/guards.js';
import { bearerToken, requireOwner } from '../../http/require-admin.js';
import { sendData } from '../../http/respond.js';
import { validateBody } from '../../http/validate.js';
import { parseId } from '../shared/params.js';
import {
  ChangePasswordBody,
  CreateStaffBody,
  LoginBody,
  UpdateProfileBody,
  UpdateStaffBody,
  type StaffUser,
} from '../staff/staff.schema.js';
import type { StaffService } from '../staff/staff.service.js';
import type { ContactRepository } from '../contact/contact.repository.js';
import type { ContentRepository } from '../content/content.repository.js';
import type { BookingRepository } from '../events/booking.repository.js';
import type { EventRepository } from '../events/event.repository.js';
import type { MediaRepository } from '../media/media.repository.js';
import type { VisitRepository } from '../visits/visit.repository.js';

/**
 * Endpoints behind the staff admin page.
 *
 * POST /admin/login     public: email and password in, a session token out
 * POST /admin/logout    ends the session
 * GET  /admin/session   who is signed in (the staff area checks this when it opens)
 * GET  /admin/summary   the counts shown on the dashboard cards
 *
 * PUT  /admin/me                         one's own name
 * PUT  /admin/me/password                one's own password (signs out the other devices)
 * GET  /admin/staff                      owners: everyone with an account
 * POST /admin/staff                      owners: a new account, with a temporary password shown once
 * PUT  /admin/staff/:id                  owners: name, role, switched on or off
 * POST /admin/staff/:id/reset-password   owners: a new temporary password
 * DELETE /admin/staff/:id                owners: remove an account
 */
export function adminRoutes(
  repositories: {
    contact: ContactRepository;
    visits: VisitRepository;
    content: ContentRepository;
    events: EventRepository;
    bookings: BookingRepository;
    media: MediaRepository;
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
    const [contact, visits, events, bookings, media, edited, lastUpdatedAt] = await Promise.all([
      repositories.contact.stats(),
      repositories.visits.stats(),
      repositories.events.stats(),
      repositories.bookings.stats(),
      repositories.media.stats(),
      repositories.content.count(),
      repositories.content.lastUpdatedAt(),
    ]);
    sendData(res, { contact, visits, events, bookings, media, content: { edited, lastUpdatedAt }, generatedAt: new Date().toISOString() });
  });

  // ── one's own account ──

  router.put('/me', validateBody(UpdateProfileBody), async (req, res) => {
    sendData(res, await staff.rename(res.locals.staff as StaffUser, req.body.name));
  });

  router.put('/me/password', validateBody(ChangePasswordBody), async (req, res) => {
    const { current, next } = req.body as ChangePasswordBody;
    sendData(res, await staff.changePassword(res.locals.staff as StaffUser, current, next, bearerToken(req.get('authorization'))));
  });

  // ── owners: the staff accounts ──

  router.get('/staff', requireOwner, async (_req, res) => {
    sendData(res, { items: await staff.list() });
  });

  router.post('/staff', requireOwner, validateBody(CreateStaffBody), async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    sendData(res, await staff.create(req.body as CreateStaffBody), 201);
  });

  router.put('/staff/:id', requireOwner, validateBody(UpdateStaffBody), async (req, res) => {
    sendData(res, await staff.update(res.locals.staff as StaffUser, parseId(req.params.id), req.body as UpdateStaffBody));
  });

  router.post('/staff/:id/reset-password', requireOwner, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    sendData(res, await staff.resetPassword(res.locals.staff as StaffUser, parseId(req.params.id)));
  });

  router.delete('/staff/:id', requireOwner, async (req, res) => {
    await staff.remove(res.locals.staff as StaffUser, parseId(req.params.id));
    sendData(res, { removed: true });
  });

  return router;
}
