/**
 * When an event begins, and how long until then.
 *
 * Staff write the time freely in the admin area ("8:00 AM - 2:00 AM", "18:30",
 * "2 PM"); the first time in it is the start. The grounds are in Ethiopia, so
 * the date and time are read in East Africa Time (UTC+3, no summer time).
 */
import { useEffect, useState } from 'react';
import type { SiteEvent } from './events';

export function eventStart(event: Pick<SiteEvent, 'date' | 'time'>): Date {
  let hours = 0;
  let minutes = 0;
  const found = event.time?.match(/(\d{1,2})(?:[:.](\d{2}))?\s*([AaPp])?\.?\s*[Mm]?/);
  if (found) {
    hours = Number(found[1]);
    minutes = Number(found[2] ?? 0);
    const half = found[3]?.toLowerCase();
    if (half === 'p' && hours < 12) hours += 12;
    if (half === 'a' && hours === 12) hours = 0;
    if (hours > 23 || minutes > 59) hours = minutes = 0;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return new Date(`${event.date.slice(0, 10)}T${pad(hours)}:${pad(minutes)}:00+03:00`);
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
