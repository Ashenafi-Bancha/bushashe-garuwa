/**
 * Photographs staff added in the admin area: gallery photos and the pages'
 * opening photos.
 *
 * The photos built into the website (src/assets/photos.ts) are always what the
 * site starts from. If the API is reachable, the staff photos join the gallery
 * and take the place of a page's opening photo. If the API is missing, slow or
 * offline, the site shows its built-in photos, so nothing can break the pages.
 */
import { useEffect, useState } from 'react';
import { photos } from '../assets/photos';
import type { Lang } from '../i18n/config';
import type { Dictionary } from '../i18n/dictionaries/en';
import { API_BASE, apiEnabled } from './api';
import { HERO_SLOTS, type HeroSlot } from './heroSlots';

export type MediaCaption = { title: string; desc: string };

export type MediaPhoto = {
  id: number;
  kind: 'gallery' | 'hero';
  slot: HeroSlot | null;
  category: 'grounds' | 'culture' | null;
  width: number | null;
  height: number | null;
  translations: { en: MediaCaption; am?: Partial<MediaCaption>; wal?: Partial<MediaCaption> };
};

export type SiteMedia = { gallery: MediaPhoto[]; heroes: Partial<Record<HeroSlot, MediaPhoto[]>> };

const NONE: SiteMedia = { gallery: [], heroes: {} };
const CACHE_KEY = 'bg-media';
const REQUEST_TIMEOUT_MS = 4000;

/** Where a staff photo is served from */
export const mediaUrl = (id: number) => `${API_BASE}/v1/media/${id}/image`;

/** A staff photo's heading and description in the visitor's language; English fills any gap */
export function captionFor(photo: MediaPhoto, lang: Lang): MediaCaption {
  const own = lang === 'en' ? undefined : photo.translations[lang];
  return {
    title: own?.title?.trim() || photo.translations.en.title,
    desc: own?.desc?.trim() || photo.translations.en.desc,
  };
}

/** Last answer, so a repeat visit shows the staff photos immediately */
function readCache(): SiteMedia {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as SiteMedia) : NONE;
  } catch {
    return NONE;
  }
}

let current: SiteMedia = readCache();
let request: Promise<SiteMedia> | null = null;

/** One request for the whole visit, shared by every page */
function loadMedia(): Promise<SiteMedia> {
  if (!apiEnabled) return Promise.resolve(NONE);
  request ??= fetch(`${API_BASE}/v1/media`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    .then(async (res) => {
      if (!res.ok) return current;
      const data = (await res.json())?.data as SiteMedia | undefined;
      current = { gallery: data?.gallery ?? [], heroes: data?.heroes ?? {} };
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(current));
      } catch {
        /* private browsing: skip the cache */
      }
      return current;
    })
    .catch(() => current); // offline or slow: keep whatever was seen last
  return request;
}

export function useSiteMedia(): SiteMedia {
  const [media, setMedia] = useState(current);
  useEffect(() => {
    let mounted = true;
    void loadMedia().then((loaded) => {
      if (mounted) setMedia(loaded);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return media;
}

/** An opening photo ready to draw, whether built in or added by staff */
export type HeroPhoto = { id: string; src: string; alt: string; title: string; pos: string };

/** The photos that open a page: the staff's own if they added any, otherwise the built-in ones */
export function heroPhotos(slot: HeroSlot, media: SiteMedia, t: Dictionary, lang: Lang): HeroPhoto[] {
  const added = media.heroes[slot];
  if (added?.length) {
    return added.map((photo) => {
      const caption = captionFor(photo, lang);
      return { id: `m${photo.id}`, src: mediaUrl(photo.id), alt: caption.desc || caption.title, title: caption.title, pos: 'object-center' };
    });
  }
  return HERO_SLOTS[slot].photos.map(({ key, pos }) => ({
    id: key,
    src: photos[key],
    alt: t.photos[key],
    title: t.photoCaptions[key].title,
    pos,
  }));
}
