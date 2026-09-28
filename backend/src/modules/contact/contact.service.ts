import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { ContactRepository } from './contact.repository.js';
import type { CreateContactMessage } from './contact.schema.js';
import type { Notifier } from '../notifications/notifier.js';

/** What happens with contact messages: saved, then the sender and the staff are told by email. */
export function contactService(repo: ContactRepository, notify?: Notifier) {
  return {
    /** Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success. */
    submit({ website, ...input }: CreateContactMessage) {
      if (website) {
        logger.warn('contact: spam submission ignored');
        return null;
      }
      const message = repo.create(input);
      logger.info('contact: new message', { id: message.id, language: message.language });
      notify?.messageReceived(message);
      return message;
    },

    list: (pagination: Pagination, filter?: { search?: string }) => repo.list(pagination, filter),

    setStatus(id: number, status: RequestStatus) {
      const updated = repo.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Message not found');
      return updated;
    },
  };
}
export type ContactService = ReturnType<typeof contactService>;
