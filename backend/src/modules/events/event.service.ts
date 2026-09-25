import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { EventRepository } from './event.repository.js';
import type { SaveEvent } from './event.schema.js';

/** Rules for events. */
export function eventService(repo: EventRepository) {
  return {
    /** For the website: published events that have not passed */
    published: () => repo.upcoming(),

    /** For the staff page: everything, including drafts and past events */
    all: () => repo.all(),

    create(input: SaveEvent) {
      const created = repo.create(input);
      logger.info('events: created', { id: created.id, date: created.date });
      return created;
    },

    update(id: number, input: SaveEvent) {
      const updated = repo.update(id, input);
      if (!updated) throw HttpError.notFound('Event not found');
      return updated;
    },

    remove(id: number) {
      if (!repo.remove(id)) throw HttpError.notFound('Event not found');
    },

    stats: () => repo.stats(),
  };
}
export type EventService = ReturnType<typeof eventService>;
