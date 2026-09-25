import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { HttpError } from './http-error.js';

/** Staff-only endpoints: expects `Authorization: Bearer <ADMIN_API_KEY>`. */
export function requireAdmin(adminKey: string): RequestHandler {
  const expected = Buffer.from(adminKey);

  return (req, _res, next) => {
    if (!adminKey) return next(HttpError.unavailable('Staff endpoints are turned off (ADMIN_API_KEY is not set)'));

    const header = req.get('authorization') ?? '';
    const given = Buffer.from(header.startsWith('Bearer ') ? header.slice(7) : '');
    const ok = given.length === expected.length && timingSafeEqual(given, expected);
    next(ok ? undefined : HttpError.unauthorized());
  };
}
