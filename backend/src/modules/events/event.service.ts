import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { BookingRepository } from './booking.repository.js';
import type { EventRepository } from './event.repository.js';
import type { SaveEvent } from './event.schema.js';

/** Rules for events. */
export function eventService(repo: EventRepository, bookings?: Pick<BookingRepository, 'guestsForEvent'>) {
  return {
    /** For the website: published events that have not passed */
    published: () => repo.upcoming(),

    /** For the staff page: everything, including drafts and past events */
    all: () => repo.all(),

    async create(input: SaveEvent) {
      const created = await repo.create(input);
      logger.info('events: created', { id: created.id, date: created.date });
      return created;
    },

    async update(id: number, input: SaveEvent) {
      // the number of places cannot go below the guests already booked
      if (input.capacity !== null && bookings) {
        const booked = await bookings.guestsForEvent(id);
        if (input.capacity < booked) {
          throw new HttpError(409, 'capacity_below_bookings', `${booked} ${booked === 1 ? 'guest has' : 'guests have'} already booked: the event needs at least ${booked} places`, [
            { field: 'capacity', message: `At least ${booked}, the guests already booked` },
          ]);
        }
      }
      const updated = await repo.update(id, input);
      if (!updated) throw HttpError.notFound('Event not found');
      return updated;
    },

    async remove(id: number) {
      if (!(await repo.remove(id))) throw HttpError.notFound('Event not found');
    },

    stats: () => repo.stats(),
  };
}
export type EventService = ReturnType<typeof eventService>;
