import type { Env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';
import type { ContactMessage } from '../contact/contact.schema.js';
import type { Booking } from '../events/booking.schema.js';
import type { EventRecord } from '../events/event.schema.js';
import type { VisitRequest } from '../visits/visit.schema.js';
import type { Email, Mailer } from './mailer.js';
import {
  type BookingFacts,
  bookingConfirmed,
  bookingReceived,
  contactReceived,
  langOf,
  staffNewBooking,
  staffNewMessage,
  staffNewVisit,
  visitReceived,
} from './templates/messages.js';

/**
 * Decides who is told what, and when. Sending happens in the background: a slow
 * or broken mail server never holds up, or undoes, a booking or a message.
 */
export function notifier(mailer: Mailer, env: Env) {
  function deliver(email: Email) {
    void mailer.send(email).catch((error: unknown) => {
      logger.error('mail: could not send', { kind: email.kind, to: email.to, error: String(error) });
    });
  }

  const toStaff = (email: Omit<Email, 'to'>) => {
    if (env.STAFF_EMAIL) deliver({ ...email, to: env.STAFF_EMAIL });
  };

  const bookingFacts = (booking: Booking, event: EventRecord): BookingFacts => {
    const lang = langOf(booking.language);
    return {
      reference: booking.reference,
      name: booking.name,
      phone: booking.phone,
      guests: booking.guests,
      eventName: event.translations[lang]?.name || event.translations.en.name,
      eventDate: event.date,
      eventTime: event.time,
      partner: event.partner,
      lang,
    };
  };

  return {
    /** A guest reserved places: they get their booking number, staff get the details */
    bookingReceived(booking: Booking, event: EventRecord, placesLeft: number | null) {
      const facts = bookingFacts(booking, event);
      if (booking.email) deliver({ ...bookingReceived(facts, env.SITE_URL), to: booking.email, kind: 'booking-received' });
      toStaff({
        ...staffNewBooking({ ...facts, lang: 'en', eventName: event.translations.en.name, email: booking.email, message: booking.message, placesLeft }, env.SITE_URL),
        kind: 'staff-new-booking',
      });
    },

    /** Staff confirmed a booking: the guest hears it, with directions */
    bookingConfirmed(booking: Booking, event: EventRecord) {
      if (!booking.email) return;
      deliver({ ...bookingConfirmed(bookingFacts(booking, event), env.SITE_URL), to: booking.email, kind: 'booking-confirmed' });
    },

    visitReceived(visit: VisitRequest) {
      const facts = { name: visit.name, date: visit.date, visitors: visit.visitors, experiences: visit.experiences, lang: langOf(visit.language) };
      if (visit.email) deliver({ ...visitReceived(facts, env.SITE_URL), to: visit.email, kind: 'visit-received' });
      toStaff({ ...staffNewVisit({ ...facts, phone: visit.phone, email: visit.email, message: visit.message }, env.SITE_URL), kind: 'staff-new-visit' });
    },

    messageReceived(message: ContactMessage) {
      const facts = { name: message.name, message: message.message, lang: langOf(message.language) };
      deliver({ ...contactReceived(facts, env.SITE_URL), to: message.email, kind: 'message-received' });
      toStaff({ ...staffNewMessage({ ...facts, email: message.email, phone: message.phone }, env.SITE_URL), kind: 'staff-new-message' });
    },
  };
}

export type Notifier = ReturnType<typeof notifier>;
