import type { RequestHandler } from 'express';

/**
 * A guard is the chain of middleware that runs before a route's handler.
 * Routers spread them: `router.post('/', ...guards.form, handler)`.
 */
export type Guard = RequestHandler[];

export type Guards = {
  /** Public form endpoints: limits how often one visitor may post */
  form: Guard;
  /** Staff endpoints: slows down key guessing, then checks the staff key */
  admin: Guard;
};
