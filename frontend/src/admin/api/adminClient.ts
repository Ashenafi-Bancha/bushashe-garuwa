import { API_BASE, ApiError } from '../../lib/api';
import type { AdminEvent, Booking, ContactMessage, ContentEntry, Page, RequestStatus, SaveEventInput, Summary, VisitRequest } from './types';

/**
 * Calls the staff endpoints of the API. Every call carries the staff key
 * as `Authorization: Bearer <key>`; the key never leaves the staff member's browser.
 */
async function request<T>(key: string, path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new ApiError(0, 'not_configured', 'The API address (VITE_API_URL) is not set');

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    throw new ApiError(0, 'network_error', 'Could not reach the API. Is the backend running?');
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
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
  /** Used by the sign-in box to check the key before storing it */
  checkKey: (key: string) => request<{ signedIn: true }>(key, '/v1/admin/session'),

  summary: (key: string) => request<Summary>(key, '/v1/admin/summary'),

  messages: (key: string, page: number, pageSize = 20) =>
    request<Page<ContactMessage>>(key, `/v1/contact${list({ page, pageSize })}`),

  visits: (key: string, page: number, options: { upcoming?: boolean; pageSize?: number } = {}) =>
    request<Page<VisitRequest>>(
      key,
      `/v1/visits${list({ page, pageSize: options.pageSize ?? 20, upcoming: options.upcoming || undefined })}`,
    ),

  setMessageStatus: (key: string, id: number, status: RequestStatus) =>
    request<ContactMessage>(key, `/v1/contact/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  setVisitStatus: (key: string, id: number, status: RequestStatus) =>
    request<VisitRequest>(key, `/v1/visits/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ── Events ──
  events: (key: string) => request<{ items: AdminEvent[] }>(key, '/v1/events/admin'),

  createEvent: (key: string, input: SaveEventInput) =>
    request<AdminEvent>(key, '/v1/events/admin', { method: 'POST', body: JSON.stringify(input) }),

  updateEvent: (key: string, id: number, input: SaveEventInput) =>
    request<AdminEvent>(key, `/v1/events/admin/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  deleteEvent: (key: string, id: number) =>
    request<{ removed: true }>(key, `/v1/events/admin/${id}`, { method: 'DELETE' }),

  // ── Bookings ──
  bookings: (key: string, page: number, eventId?: number) =>
    request<Page<Booking>>(key, `/v1/events/admin/bookings${list({ page, pageSize: 20, eventId })}`),

  setBookingStatus: (key: string, id: number, status: RequestStatus) =>
    request<Booking>(key, `/v1/events/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ── Website text ──
  content: (key: string) => request<{ items: ContentEntry[] }>(key, '/v1/content/admin'),

  saveContent: (key: string, entries: { key: string; lang: string; value: string }[]) =>
    request<{ saved: ContentEntry[] }>(key, '/v1/content/admin', { method: 'PUT', body: JSON.stringify({ entries }) }),
};
