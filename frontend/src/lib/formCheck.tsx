import { useRef, useState } from 'react';
import { fmt, useI18n } from '../i18n/I18nProvider';
import { ApiError } from './api';
import { englishProblem, type Problem } from './rules';

/**
 * Checking a form's fields in the browser with the same rules as the API
 * (src/lib/rules.ts), and showing what is wrong under each field.
 *
 *   const check = useFormCheck('contact', {
 *     name: () => checkName(form.name),
 *     email: () => checkEmail(form.email),
 *   });
 *   <input {...check.field('name')} ... />  <FieldError check={check} name="name" />
 *   on submit: if (!check.all()) return;   on an API error: check.fromServer(err)
 *
 * A field is checked when it is left (a missing value is only pointed out once
 * the form is sent), again while it is being corrected, and all at once on
 * sending; the first wrong field then gets the focus. The API's answer is the
 * last word: a field it refuses is marked too.
 */

/** A problem, with the limit it refers to */
export type Found = Problem | { problem: Problem; max?: number; min?: number } | null;
type Say = (problem: Problem, limits: { max?: number; min?: number }) => string;

function useChecks<F extends string>(id: string, checks: Record<F, () => Found>, say: Say) {
  const [errors, setErrors] = useState<Partial<Record<F, string>>>({});
  // the checks of the latest render, so a check after a change reads the new value
  const latest = useRef(checks);
  latest.current = checks;
  const message = (found: Found) => {
    if (!found) return undefined;
    return typeof found === 'string' ? say(found, {}) : say(found.problem, found);
  };
  const problemOf = (found: Found) => (found === null ? null : typeof found === 'string' ? found : found.problem);

  const set = (field: F, text: string | undefined) => setErrors((current) => (current[field] === text ? current : { ...current, [field]: text }));

  /** Check one field; `leaving` keeps quiet about an empty field that has not been marked yet */
  const run = (field: F, leaving = false) => {
    const found = latest.current[field]();
    if (leaving && problemOf(found) === 'required' && !errors[field]) return true;
    set(field, message(found));
    return !found;
  };

  /** Check every field; false (and the focus on the first wrong one) when something needs fixing */
  const all = () => {
    const next: Partial<Record<F, string>> = {};
    let first: F | undefined;
    for (const field of Object.keys(latest.current) as F[]) {
      const text = message(latest.current[field]());
      if (text) {
        next[field] = text;
        first ??= field;
      }
    }
    setErrors(next);
    if (first) document.getElementById(`${id}-${first}`)?.focus();
    return first === undefined;
  };

  /** Mark the fields the API refused; true when it named any of this form's fields */
  const fromServer = (err: unknown) => {
    if (!(err instanceof ApiError) || err.fields.length === 0) return false;
    const next: Partial<Record<F, string>> = {};
    let first: F | undefined;
    for (const { field, message: serverText } of err.fields) {
      const name = field.split('.')[0] as F;
      if (!(name in latest.current)) continue;
      // our own words when we see the problem too, the API's otherwise
      next[name] = message(latest.current[name]()) ?? serverText;
      first ??= name;
    }
    if (!first) return false;
    setErrors((current) => ({ ...current, ...next }));
    document.getElementById(`${id}-${first}`)?.focus();
    return true;
  };

  /** What an input needs: its id, the error state for screen readers, the check when it is left */
  const field = (name: F) => ({
    id: `${id}-${name}`,
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    onBlur: () => run(name, true),
  });

  /** After a change: check again only if the field is marked, so the mark goes as soon as it is right */
  const changed = (name: F) => {
    if (errors[name]) setTimeout(() => run(name), 0);
  };

  return { id, errors, run, all, fromServer, field, changed, hasErrors: Object.values(errors).some(Boolean) };
}

/** For the public forms: the messages in the visitor's language */
export function useFormCheck<F extends string>(id: string, checks: Record<F, () => Found>) {
  const { t } = useI18n();
  const words = t.common.problems;
  return useChecks(id, checks, (problem, limits) => fmt(words[problem], { max: limits.max ?? '', min: limits.min ?? 1 }));
}

/** For the staff area, which is in English */
export function useAdminFormCheck<F extends string>(id: string, checks: Record<F, () => Found>) {
  return useChecks(id, checks, (problem, limits) => `${englishProblem(problem, limits)}.`);
}

export type FormCheck = ReturnType<typeof useChecks<string>>;

/** The message under a field, read out by screen readers when it appears */
export function FieldError({ check, name, className = '' }: { check: { id: string; errors: Partial<Record<string, string>> }; name: string; className?: string }) {
  const text = check.errors[name];
  if (!text) return null;
  return (
    <p id={`${check.id}-${name}-error`} role="alert" className={`field-error ${className}`}>
      {text}
    </p>
  );
}
