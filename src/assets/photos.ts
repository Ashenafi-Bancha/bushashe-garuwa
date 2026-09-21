/**
 * Real photographs of Bushaashe Garuwa — the only images used on the site.
 *
 * HOW TO ADD A PHOTO
 * 1. Put the original in the matching section folder:  photos-originals/<section>/
 * 2. Run:  pnpm photos   → creates the web version in  src/assets/photos/<section>/
 * 3. Import it below and add a key to `photos`
 * 4. Add its description (alt text) under `photos.<key>` in src/i18n/dictionaries/en.ts and am.ts
 * 5. Use it on a page:  <Photo src={photos.<key>} alt={t.photos.<key>} />
 */

// grounds — landscape, gardens, buildings
import overviewImg from './photos/grounds/overview.jpg';
import houseImg from './photos/grounds/traditional-house.jpg';
import pavilionsImg from './photos/grounds/thatched-pavilions.jpg';
import gardensImg from './photos/grounds/gardens.jpg';
import lawnImg from './photos/grounds/lawn-and-great-tree.jpg';

// trees & plants
import ensetImg from './photos/trees-plants/enset-false-banana.jpg';
import zigbaImg from './photos/trees-plants/zigba-tree.jpg';

// food
import foodImg from './photos/food/cultural-food.jpg';

// events — Gifaataa celebration
import gifaataa1Img from './photos/events/gifaataa/gifaataa-01.jpg';
import gifaataa2Img from './photos/events/gifaataa/gifaataa-02.jpg';
import gifaataa3Img from './photos/events/gifaataa/gifaataa-03.jpg';

export const photos = {
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
