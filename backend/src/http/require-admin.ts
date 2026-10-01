import type { RequestHandler } from 'express';
import type { StaffService } from '../modules/staff/staff.service.js';
import { HttpError } from './http-error.js';

/** The session token from `Authorization: Bearer <token>`, or '' */
export const bearerToken = (header: string | undefined) => (header?.startsWith('Bearer ') ? header.slice(7).trim() : '');

/**
 * Staff-only endpoints: expects the session token a member of staff was given
 * when they signed in. The signed-in person is left in `res.locals.staff`.
 */
export function requireAdmin(staff: StaffService): RequestHandler {
  return async (req, res, next) => {
    const token = bearerToken(req.get('authorization'));
    const user = token ? await staff.userFor(token) : undefined;
    if (!user) return next(HttpError.unauthorized());
    res.locals.staff = user;
    next();
  };
}
