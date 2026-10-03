/**
 * The opening photograph of each page.
 *
 * Every page has a "slot". The photo built into the website is listed here;
 * when staff add their own from the admin area (Page photos), that one is
 * shown instead. The home page turns through several photos as slides.
 *
 * The slot names match the API (backend/src/modules/media/media.schema.ts).
 */
import type { PhotoKey } from '../assets/photos';

export type HeroSlot =
  | 'home'
  | 'discover'
  | 'heritage'
  | 'heritageTrees'
  | 'experiences'
  | 'events'
  | 'stay'
  | 'dine'
  | 'gallery'
  | 'visit'
  | 'contact'
  | 'about';

/** A built-in photo and the part of it to keep in view (an object-position class) */
export type BuiltInHero = { key: PhotoKey; pos: string };

export const HERO_SLOTS: Record<HeroSlot, { label: string; path: string; photos: BuiltInHero[] }> = {
  home: {
    label: 'Home',
    path: '/',
    photos: [
      { key: 'gate', pos: 'object-[center_35%]' },
      { key: 'meeshsho', pos: 'object-[center_22%]' },
      { key: 'home', pos: 'object-center' },
      { key: 'gifaataa1', pos: 'object-[center_40%]' },
      { key: 'house', pos: 'object-center' },
      { key: 'zigba', pos: 'object-[center_40%]' },
      { key: 'gifaataa2', pos: 'object-[center_45%]' },
    ],
  },
  discover: { label: 'Discover', path: '/discover', photos: [{ key: 'home', pos: 'object-center' }] },
  heritage: { label: 'Heritage', path: '/heritage', photos: [{ key: 'meeshsho', pos: 'object-[center_22%]' }] },
  heritageTrees: { label: 'Heritage: trees and plants', path: '/heritage/trees', photos: [{ key: 'zigba', pos: 'object-[center_45%]' }] },
  experiences: { label: 'Experiences', path: '/experiences', photos: [{ key: 'gifaataa1', pos: 'object-[center_35%]' }] },
  events: { label: 'Events', path: '/events', photos: [{ key: 'gifaataa3', pos: 'object-center' }] },
  stay: { label: 'Stay', path: '/stay', photos: [{ key: 'pavilions', pos: 'object-center' }] },
  dine: { label: 'Dine', path: '/dine', photos: [{ key: 'food', pos: 'object-center' }] },
  gallery: { label: 'Gallery', path: '/gallery', photos: [{ key: 'home', pos: 'object-center' }] },
  visit: { label: 'Visit', path: '/visit', photos: [{ key: 'gate', pos: 'object-[center_30%]' }] },
  contact: { label: 'Contact', path: '/contact', photos: [{ key: 'gardens', pos: 'object-center' }] },
  about: { label: 'About', path: '/about', photos: [{ key: 'gifaataa2', pos: 'object-[center_38%]' }] },
};

/** Slots that show every photo, one after another */
export const SLIDE_SLOTS: readonly HeroSlot[] = ['home'];
