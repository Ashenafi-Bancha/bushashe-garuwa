import { z } from 'zod';
import {
  LIMITS,
  checkEmail,
  checkLine,
  checkName,
  checkPhone,
  checkText,
  clean,
  englishProblem,
  phoneNumber,
  type Problem,
} from './rules.js';

/*
 * The fields of the forms, checked with the same rules the website uses
 * (./rules.ts, a copy of frontend/src/lib/rules.ts). Every text is cleaned
 * first: invisible control characters removed, spaces trimmed.
 */

/** Site languages, matching the website (frontend/src/i18n/config.ts) */
export const Language = z.enum(['en', 'am', 'wol']).default('en');

/** A string checked by one of the rules; the message is the rule's own, in English */
function ruled(check: (value: string) => Problem | null, limits: { max?: number; min?: number } = {}) {
  return z
    .string({ error: 'Please fill this in' })
    .transform(clean)
    .superRefine((value, ctx) => {
      const problem = check(value);
      if (problem) ctx.addIssue({ code: 'custom', message: englishProblem(problem, limits) });
    });
}

/** Optional: missing, null or empty (after cleaning) becomes undefined */
function optional<T extends z.ZodType<string, string>>(schema: T) {
  return z
    .union([z.null(), z.string()], { error: 'Please write text here' })
    .optional()
    .transform((value, ctx): z.output<T> | undefined => {
      const text = value == null ? '' : clean(value);
      if (text === '') return undefined;
      // when it is written, the field's own rule applies, with its own message (not a vague "Invalid input")
      const checked = schema.safeParse(text);
      if (checked.success) return checked.data;
      for (const issue of checked.error.issues) ctx.addIssue({ code: 'custom', message: issue.message });
      return z.NEVER;
    });
}

/** Required text with a length limit */
export const text = (max: number) => ruled((value) => checkText(value, max), { max });
/** Optional text with a length limit; empty becomes undefined */
export const optionalText = (max: number) => optional(ruled((value) => checkText(value, max, false), { max }));
/** Optional text on one line (a place, a partner's name) */
export const optionalLine = (max: number) => optional(ruled((value) => checkLine(value, max, false), { max }));

/** A person's name: at least two letters, in any script, no links or signs like @ # */
export const PersonName = (max: number = LIMITS.name) => ruled((value) => checkName(value, max), { max });

/** An email address, kept in lower case */
export const Email = ruled((value) => checkEmail(value), { max: LIMITS.email }).transform((value) => value.toLowerCase());
export const OptionalEmail = optional(Email);

/** A phone number (Ethiopian, or international with its country code), kept in one form: +251912345678 */
export const Phone = ruled((value) => checkPhone(value)).transform((value) => phoneNumber(value) ?? value);
export const OptionalPhone = optional(Phone);

/** Hidden "website" field on the forms: people leave it empty, spam bots fill it in */
export const Honeypot = z.string().max(500).optional();

export const RequestStatus = z.enum(['new', 'in_progress', 'done', 'archived']);
export type RequestStatus = z.infer<typeof RequestStatus>;
