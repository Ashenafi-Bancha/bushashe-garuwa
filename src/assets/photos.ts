/**
 * Real photographs of Bushaashe Garuwa — the only images used on the site.
 * Each photo's description (alt text) lives in the translations under `photos.<key>`.
 * When the client supplies new photos, add them here and pass them to <Photo src={...} />.
 */
import houseImg from './site-image-3.jpg';
import pavilionsImg from './grounds.png';
import gardensImg from './site-image-2.jpg';
import lawnImg from './site-image-4b.jpg';
import homeImg from './bushashe-home.jpg';
import gifaataa1Img from './gifaataa-1.jpg';
import gifaataa2Img from './gifaataa-2.jpg';
import gifaataa3Img from './gifaataa-3.jpg';

export const photos = {
  /** Traditional thatched house, flags and Ge'ez signage (landscape) */
  house: houseImg,
  /** Thatched pavilions among trees and gardens (landscape) */
  pavilions: pavilionsImg,
  /** Gardens, hedges and play area (landscape) */
  gardens: gardensImg,
  /** Open lawn with the great tree and heritage house (portrait) */
  lawn: lawnImg,
  /** Wide view: thatched house, fountain, flags and gardens (landscape) */
  home: homeImg,
  /** Gifaataa — guests in traditional dress walking through the heritage gate (landscape) */
  gifaataa1: gifaataa1Img,
  /** Gifaataa — women in traditional Wolaita dress on the lawn (landscape) */
  gifaataa2: gifaataa2Img,
  /** Gifaataa — guests in traditional attire lined up on the grounds (landscape) */
  gifaataa3: gifaataa3Img,
} as const;

export type PhotoKey = keyof typeof photos;
