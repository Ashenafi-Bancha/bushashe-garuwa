import { API_BASE, ApiError } from '../../lib/api';
import type {
  AdminEvent,
  Booking,
  BookingStatus,
  ContactMessage,
  ContentEntry,
  GalleryCategory,
  MediaImage,
  Page,
  RequestStatus,
  SaveEventInput,
  SaveMediaInput,
  Summary,
  VisitRequest,
} from './types';

/** Fired when the API answers that the session is no longer valid, so the staff area returns to the sign-in screen */
export const SESSION_ENDED_EVENT = 'bg-admin-session-ended';

export type SignedIn = { token: string; expiresAt: string; user: { id: number; email: string } };

/**
 * Calls the staff endpoints of the API. Every call carries the session token
 * the API gave this browser at sign-in, as `Authorization: Bearer <token>`.
 * Pass an empty token for the sign-in call itself.
 */
async function request<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new ApiError(0, 'not_configured', 'The API address (VITE_API_URL) is not set');

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    throw new ApiError(0, 'network_error', 'Could not reach the API. Is the backend running?');
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    // a signed-in request that is refused means the session ran out
    if (res.status === 401 && token) window.dispatchEvent(new Event(SESSION_ENDED_EVENT));
    const error = json?.error ?? {};
    throw new ApiError(res.status, error.code ?? 'unknown', error.message ?? res.statusText, error.details ?? []);
  }
  return json?.data as T;
}

const list = (params: Record<string, string | number | boolean | undefined>) => {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) if (value !== undefined && value !== '') query.set(name, String(value));
  return query.toString() ? `?${query}` : '';
};

export const adminApi = {
  /** Email and password in, a session out; throws a 401 ApiError when they are wrong */
  signIn: (email: string, password: string) =>
    request<SignedIn>('', '/v1/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  signOut: (token: string) => request<{ signedOut: true }>(token, '/v1/admin/logout', { method: 'POST' }),

  summary: (token: string) => request<Summary>(token, '/v1/admin/summary'),

  messages: (token: string, page: number, search = '') =>
    request<Page<ContactMessage>>(token, `/v1/contact${list({ page, pageSize: 20, q: search })}`),

  visits: (token: string, page: number, options: { upcoming?: boolean; pageSize?: number; search?: string } = {}) =>
    request<Page<VisitRequest>>(
      token,
      `/v1/visits${list({ page, pageSize: options.pageSize ?? 20, upcoming: options.upcoming || undefined, q: options.search })}`,
    ),

  setMessageStatus: (token: string, id: number, status: RequestStatus) =>
    request<ContactMessage>(token, `/v1/contact/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteMessage: (token: string, id: number) => request<{ removed: true }>(token, `/v1/contact/${id}`, { method: 'DELETE' }),

  updateVisit: (token: string, id: number, input: { name: string; phone: string; email: string; date: string; visitors: string; message: string }) =>
    request<VisitRequest>(token, `/v1/visits/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  deleteVisit: (token: string, id: number) => request<{ removed: true }>(token, `/v1/visits/${id}`, { method: 'DELETE' }),

  setVisitStatus: (token: string, id: number, status: RequestStatus) =>
    request<VisitRequest>(token, `/v1/visits/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ── Events ──
  events: (token: string) => request<{ items: AdminEvent[] }>(token, '/v1/events/admin'),

  createEvent: (token: string, input: SaveEventInput) =>
    request<AdminEvent>(token, '/v1/events/admin', { method: 'POST', body: JSON.stringify(input) }),

  updateEvent: (token: string, id: number, input: SaveEventInput) =>
    request<AdminEvent>(token, `/v1/events/admin/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  deleteEvent: (token: string, id: number) =>
    request<{ removed: true }>(token, `/v1/events/admin/${id}`, { method: 'DELETE' }),

  // ── Bookings ──
  bookings: (token: string, page: number, search = '', eventId?: number) =>
    request<Page<Booking>>(token, `/v1/events/admin/bookings${list({ page, pageSize: 20, eventId, q: search })}`),

  updateBooking: (token: string, id: number, input: { name: string; phone: string; email: string; guests: number; message: string }) =>
    request<Booking>(token, `/v1/events/admin/bookings/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  deleteBooking: (token: string, id: number) => request<{ removed: true }>(token, `/v1/events/admin/bookings/${id}`, { method: 'DELETE' }),

  setBookingStatus: (token: string, id: number, status: BookingStatus) =>
    request<Booking>(token, `/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ── Photos ──
  media: (token: string) => request<{ items: MediaImage[] }>(token, '/v1/media/admin'),

  /** Sends the photograph itself; it stays hidden until `saveMedia` gives it a heading */
  uploadMedia: (
    token: string,
    file: Blob,
    where: { kind: 'gallery' | 'hero'; slot?: string; category?: GalleryCategory; width?: number; height?: number },
  ) => request<MediaImage>(token, `/v1/media/admin/images${list(where)}`, { method: 'POST', headers: { 'Content-Type': file.type }, body: file }),

  saveMedia: (token: string, id: number, input: SaveMediaInput) =>
    request<MediaImage>(token, `/v1/media/admin/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  deleteMedia: (token: string, id: number) => request<{ removed: true }>(token, `/v1/media/admin/${id}`, { method: 'DELETE' }),

  // ── Website text ──
  content: (token: string) => request<{ items: ContentEntry[] }>(token, '/v1/content/admin'),

  saveContent: (token: string, entries: { key: string; lang: string; value: string }[]) =>
    request<{ saved: ContentEntry[] }>(token, '/v1/content/admin', { method: 'PUT', body: JSON.stringify({ entries }) }),
};
