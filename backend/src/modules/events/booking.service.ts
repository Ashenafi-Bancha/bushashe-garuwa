import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { BookingRepository } from './booking.repository.js';
import type { CreateBooking } from './booking.schema.js';
import type { EventRepository } from './event.repository.js';

/** Rules for reserving a place at an event. */
export function bookingService(bookings: BookingRepository, events: EventRepository) {
  return {
    /** Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success. */
    book(eventId: number, { website, ...input }: CreateBooking) {
      const event = events.find(eventId);
      if (!event || !event.published) throw HttpError.notFound('That event was not found');
      if (!event.bookable) throw HttpError.badRequest('This event does not take bookings');
      if (event.date < new Date().toISOString().slice(0, 10)) throw HttpError.badRequest('That event has already passed');
      if (event.availability === 'full') throw HttpError.badRequest('This event is fully booked');

      if (website) {
        logger.warn('bookings: spam submission ignored');
        return null;
      }

      const booking = bookings.create(eventId, input);
      logger.info('bookings: new booking', { id: booking.id, eventId, guests: booking.guests });
      return booking;
    },

    list: (pagination: Pagination, filter?: { eventId?: number }) => bookings.list(pagination, filter),

    guestsForEvent: (eventId: number) => bookings.guestsForEvent(eventId),

    setStatus(id: number, status: RequestStatus) {
      const updated = bookings.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Booking not found');
      return updated;
    },

    stats: () => bookings.stats(),
  };
}
export type BookingService = ReturnType<typeof bookingService>;
