import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { HttpError } from './http-error.js';

/**
 * Checks the request body against a schema and replaces it with the cleaned value.
 * Invalid input answers 400 with the list of fields to fix.
 */
export function validateBody<S extends z.ZodType>(schema: S): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      const fields = parsed.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
      return next(HttpError.badRequest('Some fields need attention', fields));
    }
    req.body = parsed.data;
    next();
  };
}

/** Parses the query string with a schema; handlers read the result from res.locals.query. */
export function validateQuery<S extends z.ZodType>(schema: S): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return next(HttpError.badRequest('Invalid query parameters'));
    res.locals.query = parsed.data;
    next();
  };
}
