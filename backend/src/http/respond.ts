import type { Response } from 'express';

/**
 * Every successful answer has the same shape: `{ "data": ... }`.
 * Errors are shaped by the error handler as `{ "error": { code, message, details } }`.
 */
export function sendData<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ data });
}
