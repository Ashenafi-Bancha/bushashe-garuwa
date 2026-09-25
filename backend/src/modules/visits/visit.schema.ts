import { z } from 'zod';
import { Email, Honeypot, Language, Phone, RequestStatus, optionalText, text } from '../shared/schemas.js';

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

/** YYYY-MM-DD, today or later (one day of slack for time zones) */
const VisitDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a real date')
  .refine((value) => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return value >= yesterday;
  }, 'The visit date cannot be in the past');

/** Body of POST /api/v1/visits (the form on the Plan Your Visit page) */
export const CreateVisitRequest = z.object({
  name: text(120),
  phone: Phone,
  email: z.union([Email, z.literal('')]).optional().transform((value) => value || undefined),
  date: VisitDate,
  visitors: GroupSize,
  experiences: z.array(ExperienceType).max(8).default([]).transform((list) => [...new Set(list)]),
  message: optionalText(3000),
  language: Language,
  website: Honeypot,
});
export type CreateVisitRequest = z.infer<typeof CreateVisitRequest>;

export const UpdateVisitStatus = z.object({ status: RequestStatus });

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
