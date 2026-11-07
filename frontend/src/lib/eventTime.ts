/**
 * When an event begins, and how long until then.
 *
 * Staff write the time in the admin area ("8:00 AM - 2:00 AM", "18:30",
 * "17:00 – 21:00"; both sides check it can be read); the first time is the start. The grounds are in Ethiopia, so
 * the date and time are read in East Africa Time (UTC+3, no summer time).
 */
import { useEffect, useState } from 'react';
import type { SiteEvent } from './events';
import { eventTimes } from './rules';

export function eventStart(event: Pick<SiteEvent, 'date' | 'time'>): Date {
  // the same reading as the forms (src/lib/rules.ts): the first time written; midnight when there is none
  const start = eventTimes(event.time ?? '')?.start ?? { hours: 0, minutes: 0 };
  const pad = (n: number) => String(n).padStart(2, '0');
  return new Date(`${event.date.slice(0, 10)}T${pad(start.hours)}:${pad(start.minutes)}:00+03:00`);
}

export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; started: boolean };

function timeLeft(target: number): TimeLeft {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, started: ms === 0 };
}

/** Days, hours, minutes and seconds until `target`, updated every second */
export function useCountdown(target: Date): TimeLeft {
  const at = target.getTime();
  const [left, setLeft] = useState(() => timeLeft(at));
  useEffect(() => {
    setLeft(timeLeft(at));
    const timer = setInterval(() => setLeft(timeLeft(at)), 1000);
    return () => clearInterval(timer);
  }, [at]);
  return left;
}
