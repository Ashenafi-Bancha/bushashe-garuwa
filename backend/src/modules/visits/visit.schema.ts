import { z } from 'zod';
import { LIMITS, checkVisitDate, englishProblem, isRealDate } from '../shared/rules.js';
import { Honeypot, Language, OptionalEmail, Phone, PersonName, RequestStatus, optionalText } from '../shared/schemas.js';

/** The options on the Plan Your Visit page (frontend t.visit.types) */
export const ExperienceType = z.enum([
  'heritage',
  'cultural',
  'food',
  'restaurant',
  'guesthouse',
  'group',
  'education',
  'meeting',
]);

/** The group sizes offered in the form's select */
export const GroupSize = z.enum(['1', '2', '3–5', '6–10', '11–20', '21–50', '50+']);

/** YYYY-MM-DD: a real day, from today (in Ethiopia, one day of grace) to two years ahead */
const VisitDate = z.string().superRefine((value, ctx) => {
  const problem = checkVisitDate(value);
  if (problem) ctx.addIssue({ code: 'custom', message: englishProblem(problem) });
});

/** YYYY-MM-DD: any real day (staff may correct an old request) */
const AnyDate = z.string().refine(isRealDate, englishProblem('date'));

/** Body of POST /api/v1/visits (the form on the Plan Your Visit page) */
export const CreateVisitRequest = z.object({
  name: PersonName(LIMITS.name),
  phone: Phone,
  email: OptionalEmail,
  date: VisitDate,
  visitors: GroupSize,
  experiences: z.array(ExperienceType).max(8).default([]).transform((list) => [...new Set(list)]),
  message: optionalText(LIMITS.visitMessage),
  language: Language,
  website: Honeypot,
});
export type CreateVisitRequest = z.infer<typeof CreateVisitRequest>;

export const UpdateVisitStatus = z.object({ status: RequestStatus });

/**
 * Body of PUT /api/v1/visits/:id: staff correcting a request after a phone call
 * (a new date, a different number of guests, a note). The date may be in the
 * past, so an old request can still be put right.
 */
export const UpdateVisitRequest = z.object({
  name: PersonName(LIMITS.name),
  phone: Phone,
  email: OptionalEmail,
  date: AnyDate,
  visitors: GroupSize,
  message: optionalText(LIMITS.visitMessage),
});
export type UpdateVisitRequest = z.infer<typeof UpdateVisitRequest>;

export type VisitRequest = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  visitors: string;
  experiences: z.infer<typeof ExperienceType>[];
  message: string | null;
  language: string;
  status: z.infer<typeof RequestStatus>;
  createdAt: string;
};
