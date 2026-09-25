/**
 * Website text that staff edited in the admin area.
 *
 * The built-in text in `src/i18n/dictionaries` is always what the site starts from.
 * If the API is reachable, its entries are laid over the top, one key at a time
 * (`home.hero.title`, `settings.phone`, …). If the API is missing, slow or offline,
 * the site simply shows its built-in text, so nothing can break the public pages.
 */
import { API_BASE, apiEnabled } from './api';

export type ContentOverrides = Record<string, string>;

const CACHE_KEY = 'bg-content';
const REQUEST_TIMEOUT_MS = 4000;

/** Last answer for this language, so a repeat visit shows edits immediately */
function readCache(lang: string): ContentOverrides {
  try {
    const cached = sessionStorage.getItem(`${CACHE_KEY}:${lang}`);
    return cached ? (JSON.parse(cached) as ContentOverrides) : {};
  } catch {
    return {};
  }
}

function writeCache(lang: string, entries: ContentOverrides) {
  try {
    sessionStorage.setItem(`${CACHE_KEY}:${lang}`, JSON.stringify(entries));
  } catch {
    /* private browsing: skip the cache */
  }
}

export async function fetchContent(lang: string): Promise<ContentOverrides> {
  if (!apiEnabled) return {};
  try {
    const res = await fetch(`${API_BASE}/v1/content?lang=${lang}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok) return readCache(lang);
    const json = await res.json();
    const entries = (json?.data?.entries ?? {}) as ContentOverrides;
    writeCache(lang, entries);
    return entries;
  } catch {
    return readCache(lang); // offline or slow: keep whatever was seen last
  }
}

export const cachedContent = readCache;

/**
 * Returns a copy of the dictionary with the edited values put in their place.
 * Keys that do not exist in the dictionary, or that point at something other
 * than a line of text, are ignored.
 */
export function applyOverrides<T>(dictionary: T, overrides: ContentOverrides): T {
  const keys = Object.keys(overrides);
  if (keys.length === 0) return dictionary;

  const copy = structuredClone(dictionary) as Record<string, unknown>;
  for (const key of keys) {
    const path = key.split('.');
    const last = path.pop();
    if (!last) continue;

    let node: Record<string, unknown> | undefined = copy;
    for (const step of path) {
      const next: unknown = node?.[step];
      node = next && typeof next === 'object' ? (next as Record<string, unknown>) : undefined;
      if (!node) break;
    }
    if (node && typeof node[last] === 'string') node[last] = overrides[key];
  }
  return copy as T;
}
