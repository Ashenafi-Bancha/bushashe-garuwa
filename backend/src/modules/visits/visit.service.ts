import { HttpError } from '../../http/http-error.js';
import { logger } from '../../lib/logger.js';
import type { Pagination } from '../../http/pagination.js';
import type { RequestStatus } from '../shared/schemas.js';
import type { VisitRepository } from './visit.repository.js';
import type { CreateVisitRequest, UpdateVisitRequest } from './visit.schema.js';
import type { Notifier } from '../notifications/notifier.js';

/** What happens with visit requests: saved, then the guest and the staff are told by email. */
export function visitService(repo: VisitRepository, notify?: Notifier) {
  return {
    /** Returns null for spam caught by the hidden field: nothing is saved, but the sender sees success. */
    async submit({ website, ...input }: CreateVisitRequest) {
      if (website) {
        logger.warn('visits: spam submission ignored');
        return null;
      }
      const visit = await repo.create(input);
      logger.info('visits: new request', { id: visit.id, date: visit.date, visitors: visit.visitors });
      notify?.visitReceived(visit);
      return visit;
    },

    list: (pagination: Pagination, options?: { upcoming?: boolean; search?: string }) => repo.list(pagination, options),

    async setStatus(id: number, status: RequestStatus) {
      const updated = await repo.updateStatus(id, status);
      if (!updated) throw HttpError.notFound('Visit request not found');
      return updated;
    },

    async update(id: number, input: UpdateVisitRequest) {
      const updated = await repo.update(id, input);
      if (!updated) throw HttpError.notFound('Visit request not found');
      logger.info('visits: request edited by staff', { id });
      return updated;
    },

    async remove(id: number) {
      if (!(await repo.remove(id))) throw HttpError.notFound('Visit request not found');
      logger.info('visits: request deleted by staff', { id });
    },
  };
}
export type VisitService = ReturnType<typeof visitService>;
