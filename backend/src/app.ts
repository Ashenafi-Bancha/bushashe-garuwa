import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import type { Env } from './config/env.js';
import type { Database } from './db/database.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { rateLimit } from './middleware/rate-limit.js';
import { requireAdmin } from './middleware/require-admin.js';
import { contactRepository } from './modules/contact/contact.repository.js';
import { contactRoutes } from './modules/contact/contact.routes.js';
import { contactService } from './modules/contact/contact.service.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { visitRepository } from './modules/visits/visit.repository.js';
import { visitRoutes } from './modules/visits/visit.routes.js';
import { visitService } from './modules/visits/visit.service.js';

/**
 * Builds the API. Everything it needs is passed in, so tests can use an
 * in-memory database and their own settings.
 *
 *   /api/health          status check
 *   /api/v1/contact      Contact page form
 *   /api/v1/visits       Plan Your Visit form
 */
export function createApp(env: Env, db: Database) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // real visitor address behind the hosting proxy (used by the rate limit)
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, methods: ['GET', 'POST', 'PATCH'] }));
  app.use(express.json({ limit: '32kb' }));

  const guards = {
    form: rateLimit({ max: env.FORM_RATE_LIMIT, windowMs: 15 * 60 * 1000 }),
    admin: requireAdmin(env.ADMIN_API_KEY),
  };

  const v1 = express.Router();
  v1.use('/contact', contactRoutes(contactService(contactRepository(db)), guards));
  v1.use('/visits', visitRoutes(visitService(visitRepository(db)), guards));

  app.use('/api/health', healthRoutes(db));
  app.use('/api/v1', v1);
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
