import type { RequestHandler } from 'express';
import { HttpError } from './http-error.js';

/**
 * Limits how many requests one address can make in a time window (kept in memory,
 * which is enough for a single server). Protects the forms from spam floods.
 */
export function rateLimit({ max, windowMs }: { max: number; windowMs: number }): RequestHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    // forget old addresses now and then so the map does not grow forever
    if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return next(HttpError.tooManyRequests());
    }
    next();
  };
}
