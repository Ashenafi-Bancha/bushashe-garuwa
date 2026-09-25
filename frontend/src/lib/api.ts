/**
 * Talks to the Bushaashe Garuwa API (backend/).
 *
 * The API address comes from VITE_API_URL (see frontend/.env.example), for example
 * "/api" while developing with `pnpm dev:all`, or "https://api.bushaashegaruwa.com/api"
 * in production. When it is not set, the forms keep working as before: they show
 * the thank-you message without sending anything.
 */
import type { Lang } from '../i18n/config';

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export const apiEnabled = API_BASE !== '';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: { field: string; message: string }[] = [],
  ) {
    super(message);
  }
}

async function post<T>(path: string, body: unknown): Promise<T | null> {
  if (!apiEnabled) return null;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'network_error', 'Could not reach the server');
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const error = json?.error ?? {};
    throw new ApiError(res.status, error.code ?? 'unknown', error.message ?? res.statusText, error.details ?? []);
  }
  return json?.data ?? null;
}

type Received = { id: number | null; received: true };

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  language: Lang;
  /** hidden anti-spam field, always empty for people */
  website?: string;
};

export type VisitRequestInput = {
  name: string;
  phone: string;
  email?: string;
  date: string;
  visitors: string;
  experiences: string[];
  message?: string;
  language: Lang;
  website?: string;
};

export const sendContactMessage = (input: ContactMessageInput) => post<Received>('/v1/contact', input);
export const sendVisitRequest = (input: VisitRequestInput) => post<Received>('/v1/visits', input);
