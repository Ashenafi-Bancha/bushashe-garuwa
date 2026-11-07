import { z } from 'zod';
import { CAPACITY_MAX, LIMITS, checkEventDate, checkEventTime, checkLine, clean, englishProblem } from '../shared/rules.js';
import { optionalLine, optionalText } from '../shared/schemas.js';

/** The event's name: one line */
const EventName = z
  .string({ error: 'Please fill this in' })
  .transform(clean)
  .superRefine((value, ctx) => {
    const problem = checkLine(value, LIMITS.eventName);
    if (problem) ctx.addIssue({ code: 'custom', message: englishProblem(problem, { max: LIMITS.eventName }) });
  });

/** YYYY-MM-DD; a new event may not be in the past (in Ethiopia) */
const EventDate = (isNew: boolean) =>
  z.string().superRefine((value, ctx) => {
    const problem = checkEventDate(value, isNew);
    if (problem) ctx.addIssue({ code: 'custom', message: englishProblem(problem) });
  });

/** Matches the filters on the Events page */
export const EventCategory = z.enum(['food', 'culture', 'education', 'music', 'community']);

/** How many places are left, shown as a small label on the card */
export const EventAvailability = z.enum(['open', 'limited', 'full']);

/** The words for one language. English is required; the others may be left empty and fall back to it. */
const Translation = z.object({
  name: EventName,
  desc: optionalText(LIMITS.eventDesc),
});

const OptionalTranslation = z
  .object({
    name: optionalLine(LIMITS.eventName),
    desc: optionalText(LIMITS.eventDesc),
  })
  .optional()
  // an entry with nothing in it is the same as no entry at all
  .transform((value) => (value && (value.name || value.desc) ? value : undefined));

export const EventTranslations = z.object({
  en: Translation,
  am: OptionalTranslation,
  wol: OptionalTranslation,
});

/** Changing an event: any real day, so an old event can still be put right */
export const SaveEvent = z.object({
  date: EventDate(false),
  /** "17:00", "17:00 – 21:00", "8:00 AM - 2:00 PM": the countdown on the website starts from it */
  time: z
    .union([z.null(), z.string()])
    .optional()
    .transform((value) => clean(value ?? ''))
    .superRefine((value, ctx) => {
      const problem = checkEventTime(value);
      if (problem) ctx.addIssue({ code: 'custom', message: englishProblem(problem, { max: LIMITS.eventTime }) });
    })
    .transform((value) => (value ? value : undefined)),
  category: EventCategory,
  availability: EventAvailability.default('open'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  /** key of a photo in the website's photo registry, for example "food" */
  photo: z
    .union([z.null(), z.string().trim().max(40).regex(/^[A-Za-z0-9]*$/, 'Choose a photo from the list')])
    .optional()
    .transform((value) => (value ? value : undefined)),
  /** Partner hosting the event with us, for example "Lidya Cultural Food" */
  partner: optionalLine(LIMITS.partner),
  /** People may reserve a place for this event */
  bookable: z.boolean().default(false),
  /** How many guests fit; leave empty for no limit */
  capacity: z
    .union([z.null(), z.literal(''), z.coerce.number({ error: 'Please write a whole number' }).int('Please write a whole number').min(1, 'Please write at least 1').max(CAPACITY_MAX, `Please write ${CAPACITY_MAX} or fewer`)])
    .optional()
    .transform((value) => (typeof value === 'number' ? value : null)),
  translations: EventTranslations,
});
export type SaveEvent = z.infer<typeof SaveEvent>;

/** Adding an event: its day must not have passed */
export const CreateEvent = SaveEvent.extend({ date: EventDate(true) });

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
