/** An error with an HTTP status and a stable code the website can react to. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, 'bad_request', message, details);
  }
  static unauthorized(message = 'A valid staff key is required') {
    return new HttpError(401, 'unauthorized', message);
  }
  static notFound(message = 'Not found') {
    return new HttpError(404, 'not_found', message);
  }
  static tooManyRequests(message = 'Too many requests, please try again later') {
    return new HttpError(429, 'too_many_requests', message);
  }
  static unavailable(message: string) {
    return new HttpError(503, 'unavailable', message);
  }
}
