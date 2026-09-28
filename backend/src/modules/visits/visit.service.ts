import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { VisitRepository } from './visit.repository.js';
import type { CreateVisitRequest } from './visit.schema.js';
import type { Notifier } from '../notifications/notifier.js';

/** What happens with visit requests: saved, then the guest and the staff are told by email. */
export function visitService(repo: VisitRepository, notify?: Notifier) {
  return {
    /** Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success. */
    submit({ website, ...input }: CreateVisitRequest) {
      if (website) {
        logger.warn('visits: spam submission ignored');
        return null;
      }
      const visit = repo.create(input);
      logger.info('visits: new request', { id: visit.id, date: visit.date, visitors: visit.visitors });
      notify?.visitReceived(visit);
      return visit;
    },

    list: (pagination: Pagination, options?: { upcoming?: boolean; search?: string }) => repo.list(pagination, options),

    setStatus(id: number, status: RequestStatus) {
      const updated = repo.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Visit request not found');
      return updated;
    },
  };
}
export type VisitService = ReturnType<typeof visitService>;
