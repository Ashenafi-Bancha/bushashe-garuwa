import { HttpError } from '../../lib/http-error.js';
import { logger } from '../../lib/logger.js';
import type { Pagination } from '../../lib/pagination.js';
import type { RequestStatus } from '../shared.js';
import type { VisitRepository } from './visit.repository.js';
import type { CreateVisitRequest } from './visit.schema.js';

/** What happens with visit requests. (Confirmation messages to guests would be added here.) */
export function visitService(repo: VisitRepository) {
  return {
    /** Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success. */
    submit({ website, ...input }: CreateVisitRequest) {
      if (website) {
        logger.warn('visits: spam submission ignored');
        return null;
      }
      const visit = repo.create(input);
      logger.info('visits: new request', { id: visit.id, date: visit.date, visitors: visit.visitors });
      return visit;
    },

    list: (pagination: Pagination, options?: { upcoming?: boolean }) => repo.list(pagination, options),

    setStatus(id: number, status: RequestStatus) {
      const updated = repo.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Visit request not found');
      return updated;
    },
  };
}
export type VisitService = ReturnType<typeof visitService>;
