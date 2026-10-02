import type { Lang } from '../i18n/config';

/**
 * What guests have said about Bushaashe Garuwa.
 *
 * [TESTIMONIALS NEEDED] This list is empty on purpose: only real words from
 * real guests belong here, with their permission. While it is empty the
 * section is not shown at all. To add one:
 *
 *   { name: 'Guest name', from: 'Town or country', words: { en: '…', am: '…' } }
 *
 * A language left out falls back to English.
 */
export type Testimonial = {
  name: string;
  from?: string;
  words: Partial<Record<Lang, string>> & { en: string };
};

export const TESTIMONIALS: Testimonial[] = [];
