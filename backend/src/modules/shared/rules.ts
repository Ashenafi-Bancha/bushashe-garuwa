/**
 * What may be typed into the forms: the same rules on the website and on the API.
 *
 * This file is the original. backend/src/modules/shared/rules.ts is an exact copy
 * (the API is built on its own and cannot reach into the website), and an API
 * test fails when the two differ: change this one, then copy it over.
 *
 * Each check returns null when the value is fine, or a Problem: a short code the
 * website turns into words in the visitor's language, and the API into English
 * (`englishProblem`). Nothing here depends on the browser or on Node.
 */

/** Longest value of each kind, in characters */
export const LIMITS = {
  name: 120,
  staffName: 80,
  reviewName: 80,
  origin: 80,
  email: 254,
  phone: 25,
  contactMessage: 5000,
  visitMessage: 3000,
  bookingMessage: 2000,
  eventName: 160,
  eventDesc: 2000,
  eventTime: 40,
  partner: 120,
  reviewWords: 1200,
  photoTitle: 120,
  photoDesc: 600,
  passwordMin: 10,
  passwordMax: 200,
  /** a line of website text staff edit (a heading, an address) */
  contentLine: 300,
  /** a paragraph of website text staff edit */
  contentText: 8000,
} as const;

/** Guests in one booking, and places at one event */
export const GUESTS_MAX = 200;
export const CAPACITY_MAX = 5000;
/** How far ahead a visit can be asked for */
export const VISIT_DAYS_AHEAD = 730;

export type Problem =
  | 'required'
  | 'tooLong'
  | 'name'
  | 'email'
  | 'phone'
  | 'date'
  | 'pastDate'
  | 'farDate'
  | 'time'
  | 'wholeNumber'
  | 'tooFew'
  | 'tooMany'
  | 'passwordShort'
  | 'passwordSame'
  | 'passwordEmail'
  | 'passwordsDiffer'
  | 'oneLine';

/* ── Text ─────────────────────────────────────────────────────────────── */

/** Invisible control characters (keeping line breaks and tabs), which no one types on purpose */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩﻿]/g;

/** The value as it is kept: control characters removed, spaces trimmed at both ends */
export function clean(value: string): string {
  return value.replace(CONTROL, '').trim();
}

/** Text with a length limit; empty is a problem only when the field is required */
export function checkText(value: string, max: number, required = true): Problem | null {
  const text = clean(value);
  if (text === '') return required ? 'required' : null;
  if ([...text].length > max) return 'tooLong';
  return null;
}

/** One line only: a heading, an address line */
export function checkLine(value: string, max: number, required = true): Problem | null {
  if (/[\r\n]/.test(clean(value))) return 'oneLine';
  return checkText(value, max, required);
}

/* ── Names ────────────────────────────────────────────────────────────── */

/** Signs that do not belong in a person's name (and that spam uses): <> {} [] \ | ^ ~ ` = @ # $ % * _ + and links */
const NOT_IN_A_NAME = /[<>{}[\]\\|^~`=@#$%*_+]|:\/\/|www\./i;

/**
 * A person's name, in any script (Ge'ez, Latin...): at least two letters.
 * Allowed beside letters: spaces, digits, and . , ' ’ - / ( ) &  (for example
 * "W/ro Almaz", "O'Neil", "Abebe & family").
 */
export function checkName(value: string, max: number = LIMITS.name): Problem | null {
  const text = clean(value);
  if (text === '') return 'required';
  if ([...text].length > max) return 'tooLong';
  if (/[\r\n]/.test(text) || NOT_IN_A_NAME.test(text)) return 'name';
  if ((text.match(/\p{L}/gu) ?? []).length < 2) return 'name';
  return null;
}

/* ── Email ────────────────────────────────────────────────────────────── */

/** The same pattern the API's zod `z.email()` uses */
const EMAIL = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export function checkEmail(value: string, required = true): Problem | null {
  const text = clean(value);
  if (text === '') return required ? 'required' : null;
  if (text.length > LIMITS.email) return 'tooLong';
  const [local = ''] = text.split('@');
  if (local.length > 64 || !EMAIL.test(text)) return 'email';
  return null;
}

/* ── Phone numbers ────────────────────────────────────────────────────── */

/**
 * Ethiopian numbers follow the national plan: 9 digits after the country code
 * 251, or 10 digits starting with 0 inside the country. The first of the 9 is
 * 1 to 5 for a fixed line (11 Addis Ababa, 46 Wolaita Sodo...), 7 for Safaricom
 * and 9 for Ethio telecom mobiles. Numbers from other countries are written
 * with + (or 00) and the country code: 8 to 15 digits in all (ITU E.164).
 *
 * Accepted forms: 0912 345 678, 912345678, +251 912 345 678, 251912345678,
 * 00251912345678, +44 20 7946 0958. Spaces, dashes, dots and brackets may be
 * used to group the digits.
 *
 * Returns the number in one form (+251912345678), or null when it is not one.
 */
export function phoneNumber(value: string): string | null {
  const text = clean(value);
  if (text.length > LIMITS.phone || !/^\+?[0-9 ().-]+$/.test(text)) return null;
  const digits = text.replace(/\D/g, '');
  const ethiopian = (nsn: string) => (/^[1-579]\d{8}$/.test(nsn) ? `+251${nsn}` : null);

  const international = text.startsWith('+') ? digits : digits.startsWith('00') ? digits.slice(2) : null;
  if (international !== null) {
    if (international.startsWith('251')) return ethiopian(international.slice(3));
    return /^[1-9]\d{7,14}$/.test(international) ? `+${international}` : null;
  }
  if (/^0\d{9}$/.test(digits)) return ethiopian(digits.slice(1));
  if (/^251\d{9}$/.test(digits)) return ethiopian(digits.slice(3));
  if (/^\d{9}$/.test(digits)) return ethiopian(digits);
  return null;
}

export function checkPhone(value: string, required = true): Problem | null {
  if (clean(value) === '') return required ? 'required' : null;
  return phoneNumber(value) ? null : 'phone';
}

/* ── Dates and times ──────────────────────────────────────────────────── */

/** A real day written YYYY-MM-DD (not 2026-02-30) */
export function isRealDate(value: string): boolean {
  const found = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!found) return false;
  const [year, month, day] = [Number(found[1]), Number(found[2]), Number(found[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return year >= 2000 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** Today on the grounds, in Ethiopia (East Africa Time, UTC+3, no summer time), as YYYY-MM-DD */
export function todayInEthiopia(now: number = Date.now()): string {
  return new Date(now + 3 * 3_600_000).toISOString().slice(0, 10);
}

/** The day `days` after a YYYY-MM-DD day */
export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

/**
 * The day a visitor asks to come: a real day, not before today and not more than
 * two years ahead. "Today" is Ethiopia's, with one day of grace for visitors
 * writing from countries where it is still yesterday.
 */
export function checkVisitDate(value: string, now: number = Date.now()): Problem | null {
  if (value.trim() === '') return 'required';
  if (!isRealDate(value)) return 'date';
  const today = todayInEthiopia(now);
  if (value < addDays(today, -1)) return 'pastDate';
  if (value > addDays(today, VISIT_DAYS_AHEAD)) return 'farDate';
  return null;
}

/** An event's day: real; a new event also not in the past */
export function checkEventDate(value: string, isNew: boolean, now: number = Date.now()): Problem | null {
  if (value.trim() === '') return 'required';
  if (!isRealDate(value)) return 'date';
  if (isNew && value < todayInEthiopia(now)) return 'pastDate';
  return null;
}

type Clock = { hours: number; minutes: number };

/** One time of day: "18:30", "8:00 AM", "8 PM", "8:00am" */
function clock(text: string): Clock | null {
  const twelve = /^(1[0-2]|0?[1-9])(?:[:.]([0-5]\d))?\s*([AaPp])\.?\s*[Mm]\.?$/.exec(text);
  if (twelve) {
    let hours = Number(twelve[1]) % 12;
    if (twelve[3]!.toLowerCase() === 'p') hours += 12;
    return { hours, minutes: Number(twelve[2] ?? 0) };
  }
  const day = /^([01]?\d|2[0-3])[:.]([0-5]\d)$/.exec(text);
  if (day) return { hours: Number(day[1]), minutes: Number(day[2]) };
  return null;
}

/**
 * An event's time as staff write it: a start, and maybe an end after a dash or
 * "to": "17:00", "17:00 – 21:00", "8:00 AM - 2:00 PM", "6 PM to 10 PM".
 * Returns null when it cannot be read.
 */
export function eventTimes(value: string): { start: Clock; end: Clock | null } | null {
  const parts = clean(value).split(/\s*(?:[-–—]|\bto\b)\s*/i);
  if (parts.length > 2) return null;
  const start = clock(parts[0] ?? '');
  const end = parts.length === 2 ? clock(parts[1] ?? '') : null;
  if (!start || (parts.length === 2 && !end)) return null;
  return { start, end };
}

/** The event's time is optional; when written, it must be readable (the countdown starts from it) */
export function checkEventTime(value: string): Problem | null {
  const text = clean(value);
  if (text === '') return null;
  if (text.length > LIMITS.eventTime) return 'tooLong';
  return eventTimes(text) ? null : 'time';
}

/* ── Numbers ──────────────────────────────────────────────────────────── */

/** A whole number from `min` to `max` (a number of guests, of places) */
export function checkWholeNumber(value: string | number, min: number, max: number, required = true): Problem | null {
  const text = String(value).trim();
  if (text === '') return required ? 'required' : null;
  if (!/^\d+$/.test(text)) return 'wholeNumber';
  const n = Number(text);
  if (n < min) return 'tooFew';
  if (n > max) return 'tooMany';
  return null;
}

/* ── Passwords ────────────────────────────────────────────────────────── */

/** A new password for the staff area: 10 to 200 characters, not the current one, not the email address */
export function checkNewPassword(next: string, current = '', email = ''): Problem | null {
  if (next === '') return 'required';
  if (next.length < LIMITS.passwordMin) return 'passwordShort';
  if (next.length > LIMITS.passwordMax) return 'tooLong';
  if (current !== '' && next === current) return 'passwordSame';
  if (email !== '' && next.trim().toLowerCase() === email.trim().toLowerCase()) return 'passwordEmail';
  return null;
}

/* ── In English (the API, and the staff area) ─────────────────────────── */

/** The problem in plain English; `max`, `min` fill in the limits */
export function englishProblem(problem: Problem, limits: { max?: number; min?: number } = {}): string {
  switch (problem) {
    case 'required':
      return 'Please fill this in';
    case 'tooLong':
      return limits.max ? `Please keep it to ${limits.max} characters or fewer` : 'This is too long';
    case 'name':
      return 'Please write a name with letters (no links or signs like @ or #)';
    case 'email':
      return 'Please write a full email address, like name@example.com';
    case 'phone':
      return 'Please write a phone number, like 0912 345 678 or +251 912 345 678 (with the country code if it is not Ethiopian)';
    case 'date':
      return 'Please choose a real date';
    case 'pastDate':
      return 'This date has already passed';
    case 'farDate':
      return 'Please choose a date within the next two years';
    case 'time':
      return 'Please write the time like 17:00, 17:00 – 21:00 or 8:00 AM - 2:00 PM';
    case 'wholeNumber':
      return 'Please write a whole number';
    case 'tooFew':
      return `Please write at least ${limits.min ?? 1}`;
    case 'tooMany':
      return `Please write ${limits.max ?? ''} or fewer`.replace('  ', ' ');
    case 'passwordShort':
      return `Please choose a password of at least ${LIMITS.passwordMin} characters`;
    case 'passwordSame':
      return 'Please choose a password different from the one you have now';
    case 'passwordEmail':
      return 'Your password cannot be your email address';
    case 'passwordsDiffer':
      return 'The two new passwords are not the same';
    case 'oneLine':
      return 'Please keep this on one line';
  }
}
