import type { Env } from './config/env.js';
import type { Database } from './db/database.js';
import type { Guards } from './http/guards.js';
import { rateLimit } from './http/rate-limit.js';
import { requireAdmin } from './http/require-admin.js';
import { contactRepository } from './modules/contact/contact.repository.js';
import { contactService } from './modules/contact/contact.service.js';
import { contentRepository } from './modules/content/content.repository.js';
import { contentService } from './modules/content/content.service.js';
import { bookingRepository } from './modules/events/booking.repository.js';
import { bookingService } from './modules/events/booking.service.js';
import { eventRepository } from './modules/events/event.repository.js';
import { eventService } from './modules/events/event.service.js';
import { mediaRepository } from './modules/media/media.repository.js';
import { mediaService } from './modules/media/media.service.js';
import { visitRepository } from './modules/visits/visit.repository.js';
import { visitService } from './modules/visits/visit.service.js';
import { staffRepository } from './modules/staff/staff.repository.js';
import { staffService } from './modules/staff/staff.service.js';
import { mailerFor, type Mailer } from './modules/notifications/mailer.js';
import { notifier } from './modules/notifications/notifier.js';

const MINUTE = 60 * 1000;

/**
 * Composition root: the one place where the parts are built and joined.
 * Repositories talk to the database, services hold the rules, guards protect
 * the routes. `app.ts` only mounts routers onto what this returns.
 */
export function createContainer(env: Env, db: Database, options: { mailer?: Mailer } = {}) {
  const notify = notifier(options.mailer ?? mailerFor(env), env);

  const repositories = {
    contact: contactRepository(db),
    visits: visitRepository(db),
    content: contentRepository(db),
    events: eventRepository(db),
    bookings: bookingRepository(db),
    media: mediaRepository(db),
    staff: staffRepository(db),
  };

  const services = {
    contact: contactService(repositories.contact, notify),
    visits: visitService(repositories.visits, notify),
    content: contentService(repositories.content),
    events: eventService(repositories.events),
    bookings: bookingService(repositories.bookings, repositories.events, notify),
    media: mediaService(repositories.media),
    staff: staffService(repositories.staff),
  };

  const guards: Guards = {
    form: [rateLimit({ max: env.FORM_RATE_LIMIT, windowMs: 15 * MINUTE })],
    admin: [rateLimit({ max: 240, windowMs: 5 * MINUTE }), requireAdmin(services.staff)],
    signIn: [rateLimit({ max: env.NODE_ENV === 'test' ? 1000 : 10, windowMs: 15 * MINUTE })],
  };

  return { db, env, repositories, services, guards };
}

export type Container = ReturnType<typeof createContainer>;
