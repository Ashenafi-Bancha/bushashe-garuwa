import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import type { Env } from './config/env.js';
import { createContainer } from './container.js';
import type { Database } from './db/database.js';
import { errorHandler, notFound } from './http/error-handler.js';
import { adminRoutes } from './modules/admin/admin.routes.js';
import { contactRoutes } from './modules/contact/contact.routes.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { visitRoutes } from './modules/visits/visit.routes.js';

/**
 * Builds the API. Everything it needs is passed in, so tests can use an
 * in-memory database and their own settings.
 *
 *   /api/health          status check
 *   /api/v1/contact      Contact page form, and the staff list of messages
 *   /api/v1/visits       Plan Your Visit form, and the staff list of requests
 *   /api/v1/admin        staff dashboard: session check and counts
 */
export function createApp(env: Env, db: Database) {
  const { services, repositories, guards } = createContainer(env, db);
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // real visitor address behind the hosting proxy (used by the rate limit)
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, methods: ['GET', 'POST', 'PATCH'] }));
  app.use(express.json({ limit: '32kb' }));

  const v1 = express.Router();
  v1.use('/contact', contactRoutes(services.contact, guards));
  v1.use('/visits', visitRoutes(services.visits, guards));
  v1.use('/admin', adminRoutes(repositories, guards));

  app.use('/api/health', healthRoutes(db));
  app.use('/api/v1', v1);
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
