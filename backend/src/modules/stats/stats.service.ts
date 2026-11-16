import { createHash, randomBytes } from 'node:crypto';
import type { Device } from './stats.schema.js';

/**
 * Counting visitors without following them.
 *
 * No cookie is set and no address is kept. To tell one visitor from another
 * within a day, the address and the browser's name are mixed with a secret
 * that is made fresh every day and never stored, then cut short. The next day
 * the same person gets a different code, so no one can be followed from day
 * to day, or traced back from the code.
 */

const salts = new Map<string, Buffer>();

/** A short code for this visitor today */
export function visitorCode(day: string, address: string, userAgent: string): string {
  let salt = salts.get(day);
  if (!salt) {
    salts.clear(); // yesterday's secret is gone for good
    salt = randomBytes(32);
    salts.set(day, salt);
  }
  return createHash('sha256').update(salt).update(address).update('\n').update(userAgent).digest('hex').slice(0, 16);
}

/** Search engines, link previews and monitors: not people */
const ROBOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp\/|telegrambot|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python-requests|node-fetch|axios/i;
export const isRobot = (userAgent: string) => userAgent === '' || ROBOT.test(userAgent);

export function deviceOf(userAgent: string): Device {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android|Windows Phone|Opera Mini/i.test(userAgent)) return 'phone';
  return 'computer';
}

/** The places people come from, by the end of the address they followed */
const KNOWN: [RegExp, string][] = [
  [/(^|\.)google\./, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
  [/(^|\.)yahoo\./, 'yahoo'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/, 'facebook'],
  [/(^|\.)(t\.me|telegram\.org|telegram\.me)$/, 'telegram'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'whatsapp'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'x'],
  [/(^|\.)linkedin\.com$/, 'linkedin'],
  [/(^|\.)tripadvisor\./, 'tripadvisor'],
];

/**
 * Where a visit came from: the campaign mark in the link if there is one
 * (?ref=qr on the posters), else the site that linked here, else "direct".
 * `ownHost` is our own address: moving between our pages is not a source.
 */
export function sourceOf(ref: string | undefined, src: string | undefined, ownHost: string): string {
  if (src) return src.toLowerCase().slice(0, 40);
  if (!ref) return 'direct';
  if (/^android-app:\/\/org\.telegram/i.test(ref)) return 'telegram';
  if (/^android-app:\/\/com\.(facebook|instagram)/i.test(ref)) return ref.toLowerCase().includes('instagram') ? 'instagram' : 'facebook';
  let host: string;
  try {
    host = new URL(ref).hostname.toLowerCase().replace(/^www\.|^m\.|^l\.|^lm\./, '');
  } catch {
    return 'direct';
  }
  if (!host || host === ownHost.replace(/^www\./, '') || host === 'localhost') return 'direct';
  for (const [pattern, name] of KNOWN) if (pattern.test(host)) return name;
  return host.slice(0, 60);
}
