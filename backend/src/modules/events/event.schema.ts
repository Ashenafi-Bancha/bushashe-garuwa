import { z } from 'zod';
import { optionalText, text } from '../shared/schemas.js';

/** Matches the filters on the Events page */
export const EventCategory = z.enum(['food', 'culture', 'education', 'music', 'community']);

/** How many places are left, shown as a small label on the card */
export const EventAvailability = z.enum(['open', 'limited', 'full']);

/** The words for one language. English is required; the others may be left empty and fall back to it. */
const Translation = z.object({
  name: text(160),
  desc: optionalText(2000),
});

const OptionalTranslation = z
  .object({
    name: optionalText(160),
    desc: optionalText(2000),
  })
  .optional()
  // an entry with nothing in it is the same as no entry at all
  .transform((value) => (value && (value.name || value.desc) ? value : undefined));

export const EventTranslations = z.object({
  en: Translation,
  am: OptionalTranslation,
  wal: OptionalTranslation,
});

export const SaveEvent = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD'),
  time: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value ? value : undefined)),
  category: EventCategory,
  availability: EventAvailability.default('open'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  photo: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value ? value : undefined)),
  /** Partner hosting the event with us, for example "Lidya Cultural Food" */
  partner: optionalText(120),
  /** People may reserve a place for this event */
  bookable: z.boolean().default(false),
  /** How many guests fit; leave empty for no limit */
  capacity: z.coerce.number().int().min(1).max(5000).nullish().transform((value) => value ?? null),
  translations: EventTranslations,
});
export type SaveEvent = z.infer<typeof SaveEvent>;

export const EventQuery = z.object({
  /** staff only: also show events that are not published, and past ones */
  all: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

export type EventRecord = {
  id: number;
  date: string;
  time: string | null;
  category: z.infer<typeof EventCategory>;
  availability: z.infer<typeof EventAvailability>;
  featured: boolean;
  published: boolean;
  /** key of a photo in the website's photo registry */
  photo: string | null;
  partner: string | null;
  bookable: boolean;
  capacity: number | null;
  /** worked out from the bookings; null when there is no limit */
  placesLeft?: number | null;
  translations: z.infer<typeof EventTranslations>;
  createdAt: string;
  updatedAt: string;
};
