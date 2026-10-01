import { todayInEthiopia } from '../../db/sql.js';
import { HttpError } from '../../http/http-error.js';
import type { Pagination } from '../../http/pagination.js';
import { logger } from '../../lib/logger.js';
import type { BookingRepository } from './booking.repository.js';
import type { BookingStatus, CreateBooking } from './booking.schema.js';
import type { EventRepository } from './event.repository.js';
import type { EventRecord } from './event.schema.js';
import type { Notifier } from '../notifications/notifier.js';

/** A second request from the same phone within this many hours is the same booking, not a new one */
const REPEAT_WINDOW_HOURS = 24;

/** Rules for reserving a place at an event. */
export function bookingService(bookings: BookingRepository, events: EventRepository, notify?: Notifier) {
  /** Places still free, or null when the event has no limit */
  async function placesLeft(event: EventRecord): Promise<number | null> {
    if (event.capacity === null) return null;
    return Math.max(0, event.capacity - (await bookings.guestsForEvent(event.id)));
  }

  /** The event must exist, be open to the public, still be ahead of us, and take bookings */
  async function bookableEvent(eventId: number): Promise<EventRecord> {
    const event = await events.find(eventId);
    if (!event || !event.published) throw HttpError.notFound('That event was not found');
    if (!event.bookable) throw HttpError.badRequest('This event does not take bookings');
    if (event.date < todayInEthiopia()) throw HttpError.badRequest('That event has already passed');
    return event;
  }

  return {
    /**
     * Reserving places.
     * Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success.
     * Asking again from the same phone within a day returns the booking already made, so a
     * double tap or a re-sent form never books the places twice. The check for room and the
     * saving happen together in the database, so the last places cannot be given out twice.
     */
    async book(eventId: number, { website, ...input }: CreateBooking) {
      const event = await bookableEvent(eventId);

      if (website) {
        logger.warn('bookings: spam submission ignored');
        return null;
      }

      const result = await bookings.reserve(eventId, input, {
        repeatWindowHours: REPEAT_WINDOW_HOURS,
        // an event without a limit that staff marked full takes no new bookings
        closed: event.capacity === null && event.availability === 'full',
      });

      switch (result.kind) {
        case 'gone':
          throw HttpError.notFound('That event was not found');
        case 'repeat':
          logger.info('bookings: repeat request, returning the booking already made', { id: result.booking.id, eventId });
          return result.booking;
        case 'no_room': {
          const left = result.placesLeft;
          if (left === 0) throw new HttpError(409, 'event_full', 'This event is fully booked');
          throw new HttpError(409, 'not_enough_places', `Only ${left} ${left === 1 ? 'place is' : 'places are'} left for this event`, {
            placesLeft: left,
          });
        }
        case 'created': {
          const { booking } = result;
          logger.info('bookings: new booking', { id: booking.id, reference: booking.reference, eventId, guests: booking.guests });
          notify?.bookingReceived(booking, event, await placesLeft(event));
          return booking;
        }
      }
    },

    list: (pagination: Pagination, filter?: { eventId?: number; status?: BookingStatus; search?: string }) =>
      bookings.list(pagination, filter),

    async placesLeftFor(eventId: number) {
      const event = await events.find(eventId);
      return event ? placesLeft(event) : null;
    },

    /**
     * Staff move a booking along. Cancelling gives the places back to the event,
     * so the next guest can take them; the booking itself is kept for the record.
     */
    async setStatus(id: number, status: BookingStatus) {
      const before = await bookings.findById(id);
      const updated = await bookings.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Booking not found');
      logger.info('bookings: status changed', { id, status, reference: updated.reference });

      // the guest hears once, when the booking first becomes confirmed
      if (status === 'confirmed' && before?.status !== 'confirmed') {
        const event = await events.find(updated.eventId);
        if (event) notify?.bookingConfirmed(updated, event);
      }
      return updated;
    },

    findByReference: (reference: string) => bookings.findByReference(reference.trim().toUpperCase()),

    stats: () => bookings.stats(),
  };
}
export type BookingService = ReturnType<typeof bookingService>;
