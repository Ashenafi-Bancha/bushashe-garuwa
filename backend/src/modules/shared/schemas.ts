import { z } from 'zod';

/** Site languages, matching the website (frontend/src/i18n/config.ts) */
export const Language = z.enum(['en', 'am', 'wal']).default('en');

/** Trimmed text with a length limit; empty strings become undefined when optional */
export const text = (max: number) => z.string().trim().min(1, 'Required').max(max, `At most ${max} characters`);
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `At most ${max} characters`)
    .optional()
    .transform((value) => (value ? value : undefined));

export const Email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address')).pipe(z.string().max(200));

/** Ethiopian and international numbers: digits, spaces, +, -, ( ) */
export const Phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number');

/** Hidden "website" field on the forms: people leave it empty, spam bots fill it in */
export const Honeypot = z.string().max(500).optional();

export const RequestStatus = z.enum(['new', 'in_progress', 'done', 'archived']);
export type RequestStatus = z.infer<typeof RequestStatus>;
