import { useEffect, useState } from 'react';
import type { Lang } from '../i18n/config';
import { API_BASE, apiEnabled } from './api';

/**
 * What guests have said about Bushaashe Garuwa.
 *
 * Staff add them in the staff area (Guest reviews), with the guest's
 * permission, and the published ones come from the API. While there are none
 * the section is not shown at all. TESTIMONIALS below is only a fallback for a
 * site built without the API; only real words from real guests belong in it.
 */
export type Testimonial = {
  name: string;
  from?: string;
  /** 1 to 5 stars, when the guest gave some */
  rating?: number | null;
  words: Partial<Record<Lang, string>> & { en: string };
};

export const TESTIMONIALS: Testimonial[] = [];

type ApiReview = { id: number; name: string; origin: string | null; rating: number | null; words: Testimonial['words'] };

const CACHE_KEY = 'bg-reviews';
let current: Testimonial[] = (() => {
  try {
    return JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') ?? TESTIMONIALS;
  } catch {
    return TESTIMONIALS;
  }
})();
let request: Promise<Testimonial[]> | null = null;

/** One request for the whole visit; slow or offline keeps what was seen last */
function loadReviews(): Promise<Testimonial[]> {
  if (!apiEnabled) return Promise.resolve(TESTIMONIALS);
  request ??= fetch(`${API_BASE}/v1/reviews`, { signal: AbortSignal.timeout(4000) })
    .then(async (res) => {
      if (!res.ok) return current;
      const items = ((await res.json())?.data?.items ?? []) as ApiReview[];
      current = items.map((r) => ({ name: r.name, from: r.origin ?? undefined, rating: r.rating, words: r.words }));
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(current));
      } catch {
        /* private browsing: skip the cache */
      }
      return current;
    })
    .catch(() => current);
  return request;
}

/** The guests' reviews to show, published by staff */
export function useTestimonials(): Testimonial[] {
  const [reviews, setReviews] = useState(current);
  useEffect(() => {
    let live = true;
    void loadReviews().then((list) => live && setReviews(list));
    return () => {
      live = false;
    };
  }, []);
  return reviews;
}
