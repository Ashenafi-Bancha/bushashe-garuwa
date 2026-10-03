/**
 * Real photographs of Bushaashe Garuwa — the only images used on the site.
 *
 * HOW TO ADD A PHOTO
 * 1. Put the original in the matching section folder:  photos-originals/<section>/
 * 2. Run:  pnpm photos   → creates the web versions (full size and a lighter one for phones) in  src/assets/photos/<section>/
 * 3. Import it below and add a key to `photos`
 * 4. Add its description (alt text) under `photos.<key>` in src/i18n/dictionaries/en.ts and am.ts
 * 5. Use it on a page:  <Photo src={photos.<key>} alt={t.photos.<key>} />
 *    or, for a plain <img>:  <img {...picture(photos.<key>)} alt={t.photos.<key>} />
 */

// grounds — landscape, gardens, buildings
import gateImg from './photos/grounds/main-gate.webp';
import meeshshoImg from './photos/cultural-houses/meeshshuwa/meeshsho-keettaa.webp';
import overviewImg from './photos/grounds/overview.webp';
import houseImg from './photos/grounds/traditional-house.webp';
import pavilionsImg from './photos/grounds/thatched-pavilions.webp';
import gardensImg from './photos/grounds/gardens.webp';
import lawnImg from './photos/grounds/lawn-and-great-tree.webp';

// trees & plants
import ensetImg from './photos/trees-plants/enset-false-banana.webp';
import zigbaImg from './photos/trees-plants/zigba-tree.webp';

// food
import foodImg from './photos/food/cultural-food.webp';

// events — Gifaataa celebration
import gifaataa1Img from './photos/events/gifaataa/gifaataa-01.webp';
import gifaataa2Img from './photos/events/gifaataa/gifaataa-02.webp';
import gifaataa3Img from './photos/events/gifaataa/gifaataa-03.webp';

export const photos = {
  /** The main gate: carved tree-trunk pillars, the welcome sign and the bamboo doors (landscape) */
  gate: gateImg,
  /** Meeshsho Keettaa: the thatched cultural house with its carved door, among the enset (landscape) */
  meeshsho: meeshshoImg,
  /** Wide view: thatched house, fountain, flags and gardens (landscape) */
  home: overviewImg,
  /** Traditional thatched house, flags and Ge'ez signage (landscape) */
  house: houseImg,
  /** Thatched pavilions among trees and gardens (landscape) */
  pavilions: pavilionsImg,
  /** Gardens, hedges and play area (landscape) */
  gardens: gardensImg,
  /** Open lawn with the great tree and heritage house (portrait) */
  lawn: lawnImg,
  /** Enset (false banana) garden — the staple plant of Wolaita (landscape) */
  enset: ensetImg,
  /** Row of zigba trees planted by the forefathers (landscape) */
  zigba: zigbaImg,
  /** Traditional Wolaita dishes served in baskets inside a cultural house (landscape) */
  food: foodImg,
  /** Gifaataa — guests in traditional dress walking through the heritage gate (landscape) */
  gifaataa1: gifaataa1Img,
  /** Gifaataa — women in traditional Wolaita dress on the lawn (landscape) */
  gifaataa2: gifaataa2Img,
  /** Gifaataa — guests in traditional attire lined up on the grounds (landscape) */
  gifaataa3: gifaataa3Img,
} as const;

export type PhotoKey = keyof typeof photos;

/* The lighter copies of each photograph (name-small.webp, name-phone.webp), found by its address */
const files = import.meta.glob<string>('./photos/**/*.webp', { eager: true, import: 'default' });
const lighter = new Map<string, string>();
for (const [path, url] of Object.entries(files)) {
  if (/-(small|phone)\.webp$/.test(path)) continue;
  const phone = files[path.replace(/\.webp$/, '-phone.webp')];
  const small = files[path.replace(/\.webp$/, '-small.webp')];
  const set = [phone && `${phone} 800w`, small && `${small} 1200w`, `${url} 1920w`].filter(Boolean);
  if (set.length > 1) lighter.set(url, set.join(', '));
}

/**
 * What an <img> needs to show a photograph at the right weight: each screen is
 * handed the lightest copy that is still sharp on it. A photograph without
 * lighter copies (one added by staff, for example) is shown as it is.
 *
 *   <img {...picture(photos.gate)} alt="…" />
 */
export function picture(src: string, sizes = '100vw'): { src: string; srcSet?: string; sizes?: string } {
  const srcSet = lighter.get(src);
  return srcSet ? { src, srcSet, sizes } : { src };
}
