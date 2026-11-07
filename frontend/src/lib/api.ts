/**
 * Talks to the Bushaashe Garuwa API (backend/).
 *
 * The API address comes from VITE_API_URL (see frontend/.env.example), for example
 * "/api" while developing with `pnpm dev:all`, or "https://api.bushaashegaruwa.com/api"
 * in production. When it is not set, the forms keep working as before: they show
 * the thank-you message without sending anything.
 *
 * Built as one app with the API (`pnpm build`, which uses `--mode app`), the
 * website is served by the API itself, so the API is at "/api" on the same address.
 */
import type { Lang } from '../i18n/config';

const SAME_ADDRESS = import.meta.env.MODE === 'app' ? '/api' : '';

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? SAME_ADDRESS;

export const apiEnabled = API_BASE !== '';

export class ApiError extends Error {
  /** the fields the API refused, when it names them */
  readonly fields: { field: string; message: string }[];
  /** anything else the API added, for example { placesLeft: 3 } */
  readonly details: Record<string, unknown>;

  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    details: unknown = [],
  ) {
    super(message);
    this.fields = Array.isArray(details)
      ? details.filter((d): d is { field: string; message: string } => typeof d?.field === 'string' && typeof d?.message === 'string')
      : [];
    this.details = details && typeof details === 'object' && !Array.isArray(details) ? (details as Record<string, unknown>) : {};
    // "Some fields need attention" says too little: name each field and what is wrong with it
    if (this.fields.length > 0) this.message = this.fields.map((f) => `${fieldLabel(f.field)}: ${f.message}`).join(' · ');
  }
}

const FIELD_WORDS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  message: 'Message',
  date: 'Date',
  time: 'Time',
  guests: 'Guests',
  visitors: 'Visitors',
  capacity: 'How many guests fit',
  partner: 'Partner',
  photo: 'Photo',
  desc: 'Description',
  title: 'Heading',
  origin: 'Where they are from',
  words: 'Their words',
  rating: 'Stars',
  value: 'Text',
  current: 'Current password',
  next: 'New password',
  password: 'Password',
  role: 'Role',
};
const LANGUAGES: Record<string, string> = { en: 'English', am: 'Amharic', wol: 'Wolaytta' };

/** "translations.am.name" → "Name (Amharic)" */
function fieldLabel(path: string): string {
  const parts = path.split('.').filter((part) => part !== 'translations' && !/^\d+$/.test(part));
  const language = parts.find((part) => part in LANGUAGES);
  const word = [...parts].reverse().find((part) => !(part in LANGUAGES)) ?? language ?? path;
  const label = FIELD_WORDS[word] ?? word.charAt(0).toUpperCase() + word.slice(1);
  return language && word !== language ? `${label} (${LANGUAGES[language]})` : language ? `${FIELD_WORDS.words} (${LANGUAGES[language]})` : label;
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
