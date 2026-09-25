import { HttpError } from '../../http/http-error.js';
import type { Pagination } from '../../http/pagination.js';
import { logger } from '../../lib/logger.js';
import type { BookingRepository } from './booking.repository.js';
import type { BookingStatus, CreateBooking } from './booking.schema.js';
import type { EventRepository } from './event.repository.js';
import type { EventRecord } from './event.schema.js';

/** A second request from the same phone within this many hours is the same booking, not a new one */
const REPEAT_WINDOW_HOURS = 24;

/** Rules for reserving a place at an event. */
export function bookingService(bookings: BookingRepository, events: EventRepository) {
  /** Places still free, or null when the event has no limit */
  function placesLeft(event: EventRecord): number | null {
    if (event.capacity === null) return null;
    return Math.max(0, event.capacity - bookings.guestsForEvent(event.id));
  }

  /** The event must exist, be open to the public, still be ahead of us, and take bookings */
  function bookableEvent(eventId: number): EventRecord {
    const event = events.find(eventId);
    if (!event || !event.published) throw HttpError.notFound('That event was not found');
    if (!event.bookable) throw HttpError.badRequest('This event does not take bookings');
    if (event.date < new Date().toISOString().slice(0, 10)) throw HttpError.badRequest('That event has already passed');
    return event;
  }

  return {
    /**
     * Reserving places.
     * Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success.
     * Asking again from the same phone within a day returns the booking already made, so a
     * double tap or a re-sent form never books the places twice.
     */
    book(eventId: number, { website, ...input }: CreateBooking) {
      const event = bookableEvent(eventId);

      if (website) {
        logger.warn('bookings: spam submission ignored');
        return null;
      }

      const existing = bookings.findRecentByPhone(eventId, input.phone, REPEAT_WINDOW_HOURS);
      if (existing) {
        logger.info('bookings: repeat request, returning the booking already made', { id: existing.id, eventId });
        return existing;
      }

      const left = placesLeft(event);
      if (left !== null) {
        if (left === 0) throw new HttpError(409, 'event_full', 'This event is fully booked');
        if (input.guests > left) {
          throw new HttpError(409, 'not_enough_places', `Only ${left} ${left === 1 ? 'place is' : 'places are'} left for this event`, {
            placesLeft: left,
          });
        }
      } else if (event.availability === 'full') {
        throw new HttpError(409, 'event_full', 'This event is fully booked');
      }

      const booking = bookings.create(eventId, input);
      logger.info('bookings: new booking', { id: booking.id, reference: booking.reference, eventId, guests: booking.guests });
      return booking;
    },

    list: (pagination: Pagination, filter?: { eventId?: number; status?: BookingStatus }) =>
      bookings.list(pagination, filter),

    placesLeftFor: (eventId: number) => {
      const event = events.find(eventId);
      return event ? placesLeft(event) : null;
    },

    /**
     * Staff move a booking along. Cancelling gives the places back to the event,
     * so the next guest can take them; the booking itself is kept for the record.
     */
    setStatus(id: number, status: BookingStatus) {
      const updated = bookings.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Booking not found');
      logger.info('bookings: status changed', { id, status, reference: updated.reference });
      return updated;
    },

    findByReference: (reference: string) => bookings.findByReference(reference.trim().toUpperCase()),

    stats: () => bookings.stats(),
  };
}
export type BookingService = ReturnType<typeof bookingService>;
