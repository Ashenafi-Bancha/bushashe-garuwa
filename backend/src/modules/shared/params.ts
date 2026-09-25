import { HttpError } from '../../http/http-error.js';

/** Route ids like /contact/12 */
export function parseId(value: unknown): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw HttpError.badRequest('Invalid id');
  return id;
}
