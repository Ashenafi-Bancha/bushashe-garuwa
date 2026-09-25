import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { ContactRepository } from './contact.repository.js';
import type { CreateContactMessage } from './contact.schema.js';

/** What happens with contact messages. (Email notifications to staff would be added here.) */
export function contactService(repo: ContactRepository) {
  return {
    /** Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success. */
    submit({ website, ...input }: CreateContactMessage) {
      if (website) {
        logger.warn('contact: spam submission ignored');
        return null;
      }
      const message = repo.create(input);
      logger.info('contact: new message', { id: message.id, language: message.language });
      return message;
    },

    list: (pagination: Pagination) => repo.list(pagination),

    setStatus(id: number, status: RequestStatus) {
      const updated = repo.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Message not found');
      return updated;
    },
  };
}
export type ContactService = ReturnType<typeof contactService>;
