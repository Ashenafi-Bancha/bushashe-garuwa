/**
 * Events staff created in the admin area (the twice-monthly cultural food
 * evening and anything else). When the API is not reachable, the pages fall
 * back to the schedule written in the translations.
 */
import { useEffect, useState } from 'react';
import type { Lang } from '../i18n/config';
import { API_BASE, ApiError, apiEnabled } from './api';

export type EventCategory = 'food' | 'culture' | 'education' | 'music' | 'community';
export type EventAvailability = 'open' | 'limited' | 'full';

export type SiteEvent = {
  id: number;
  date: string;
  time: string | null;
  category: EventCategory;
  availability: EventAvailability;
  featured: boolean;
  published: boolean;
  photo: string | null;
  partner: string | null;
  bookable: boolean;
  translations: Partial<Record<Lang, { name?: string; desc?: string }>>;
};

/** The event's words in the visitor's language, falling back to English */
export function eventText(event: SiteEvent, lang: Lang) {
  const chosen = event.translations[lang];
  const english = event.translations.en;
  return {
    name: chosen?.name?.trim() || english?.name || '',
    desc: chosen?.desc?.trim() || english?.desc || '',
  };
}

export async function fetchEvents(): Promise<SiteEvent[]> {
  if (!apiEnabled) return [];
  try {
    const res = await fetch(`${API_BASE}/v1/events`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data?.items ?? []) as SiteEvent[];
  } catch {
    return [];
  }
}

/** Upcoming events for the public pages; `events.length === 0` means "show the built-in schedule". */
export function useSiteEvents() {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loaded, setLoaded] = useState(!apiEnabled);

  useEffect(() => {
    let current = true;
    void fetchEvents().then((items) => {
      if (!current) return;
      setEvents(items);
      setLoaded(true);
    });
    return () => {
      current = false;
    };
  }, []);

  return { events, loaded };
}

export type BookingInput = {
  name: string;
  phone: string;
  email?: string;
  guests: number;
  message?: string;
  language: Lang;
  website?: string;
};

/** Reserve places at an event */
export async function bookEvent(eventId: number, input: BookingInput) {
  if (!apiEnabled) return null;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/v1/events/${eventId}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
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
