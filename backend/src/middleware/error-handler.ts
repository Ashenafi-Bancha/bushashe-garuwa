import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../lib/http-error.js';
import { logger } from '../lib/logger.js';

/** Unknown routes under /api */
export const notFound: RequestHandler = (req, _res, next) => {
  next(HttpError.notFound(`No endpoint at ${req.method} ${req.originalUrl}`));
};

/** Turns every error into the same JSON shape: { error: { code, message, details? } } */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Body that is not valid JSON, or too large
  if (err?.type === 'entity.parse.failed') err = HttpError.badRequest('The request body is not valid JSON');
  if (err?.type === 'entity.too.large') err = new HttpError(413, 'payload_too_large', 'The request body is too large');

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
    return;
  }

  logger.error('unhandled error', { method: req.method, path: req.originalUrl, error: String(err?.stack ?? err) });
  res.status(500).json({ error: { code: 'internal_error', message: 'Something went wrong on our side' } });
};
