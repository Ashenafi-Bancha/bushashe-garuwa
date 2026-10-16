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
import gardenPlantImg from './photos/trees-plants/flower-like.webp';

// animals
import birdImg from './photos/animals/bird-in-bushaashe-garuwa.webp';

// food
import foodImg from './photos/food/cultural-food.webp';

// events — Gifaataa celebration
import gifaataa1Img from './photos/events/gifaataa/gifaataa-01.webp';
import gifaataa2Img from './photos/events/gifaataa/gifaataa-02.webp';
import gifaataa3Img from './photos/events/gifaataa/gifaataa-03.webp';

// events — gatherings and celebrations on the grounds
import eventEldersImg from './photos/events/elders-in-bushaashe-garuwaa.webp';
import eventGatheringImg from './photos/events/discussing-at-bushaashe-garuwa.webp';
import eventCelebrationImg from './photos/events/celebreties-bushaashe-garuwa.webp';
import eventGamesImg from './photos/events/play-in-bushaashe-garuwa.webp';

// meeting hall and guest house
import meetingHallImg from './photos/meeting-hall/meeting-hall.webp';
import vipRoomImg from './photos/vip-rooms/vip-room.webp';
import vipDiningImg from './photos/vip-rooms/vip-dining-room.webp';
import vipKitchenImg from './photos/vip-rooms/kitchen-in-vip-room.webp';
import vipCookingImg from './photos/vip-rooms/cooking-room.webp';
import vipShowerImg from './photos/vip-rooms/bath-room.webp';
import vipBasinImg from './photos/vip-rooms/bath1.webp';
import vipToiletImg from './photos/vip-rooms/toilet-in-rest-room.webp';

// added October 2026: animals, farm, hall and bar, the family, plants
import deerImg from './photos/animals/deer-at-bushaashe-garuwa.webp';
import farmImg from './photos/grounds/4-hectar-farm-land.webp';
import hallAndBarImg from './photos/meeting-hall/bar-and-meeting-hall-area.webp';
import familyImg from './photos/people/bushaashe-about-us-family.webp';
import barImg from './photos/restaurant-bar/bar.webp';
import bananaImg from './photos/trees-plants/banana.webp';
import herbsImg from './photos/trees-plants/herbs-and-ingredients.webp';

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
  /** Red-and-green leaved garden plants along the path beside a thatched house (landscape) */
  gardenPlant: gardenPlantImg,
  /** A pigeon with a white head and a purple sheen on its neck, perched on a roof edge (landscape) */
  bird: birdImg,
  /** Traditional Wolaita dishes served in baskets inside a cultural house (landscape) */
  food: foodImg,
  /** Gifaataa — guests in traditional dress walking through the heritage gate (landscape) */
  gifaataa1: gifaataa1Img,
  /** Gifaataa — women in traditional Wolaita dress on the lawn (landscape) */
  gifaataa2: gifaataa2Img,
  /** Gifaataa — guests in traditional attire lined up on the grounds (landscape) */
  gifaataa3: gifaataa3Img,
  /** Meeting hall: rows of chairs in white covers with Wolaita-pattern bands (landscape) */
  meetingHall: meetingHallImg,
  /** Guest house, VIP room: carved wooden bed with an embroidered cover (landscape) */
  vipRoom: vipRoomImg,
  /** Guest house, VIP room: sitting and dining room with sofas, table, kitchen counter and fireplace (landscape) */
  vipDining: vipDiningImg,
  /** VIP kitchen: carved wooden cupboards over a marble counter with a sink (landscape) */
  vipKitchen: vipKitchenImg,
  /** VIP cooking corner: black double sink with running water and a two-ring electric stove (landscape) */
  vipCooking: vipCookingImg,
  /** VIP rest room: rain shower, round mirror and lamps on marble-patterned tiles (landscape) */
  vipShower: vipShowerImg,
  /** VIP rest room: white washbasin with a chrome tap (landscape) */
  vipBasin: vipBasinImg,
  /** VIP rest room: the toilet, tiled from floor to ceiling (landscape) */
  vipToilet: vipToiletImg,
  /** Elders and women in traditional dress seated under the great tree, before the thatched house and a welcome banner (landscape) */
  eventElders: eventEldersImg,
  /** A speaker with a microphone addresses guests at a long table in Wolaita cloth, under a tree (landscape) */
  eventGathering: eventGatheringImg,
  /** Guests in Wolaita-pattern shirts clap around a cake and a large traditional loaf (landscape) */
  eventCelebration: eventCelebrationImg,
  /** Guests playing with a ball on the lawn, laughing (landscape) */
  eventGames: eventGamesImg,
  /** A young deer with large ears in the grass of the lawn (portrait) */
  deer: deerImg,
  /** The farm building with its green roof among banana, enset and young trees on the four-hectare farm (landscape) */
  farm: farmImg,
  /** The bamboo meeting hall with its green roof beside the round thatched bar, along the stone path (portrait) */
  hallAndBar: hallAndBarImg,
  /** Members of the family in traditional dress on the lawn (landscape) */
  family: familyImg,
  /** The bar: a round thatched house with glass walls and lanterns, on the lawn (portrait) */
  bar: barImg,
  /** Banana plants with a bunch of green fruit in the red earth (portrait) */
  banana: bananaImg,
  /** The herb garden: herbs and flowering plants along the stone path (landscape) */
  herbs: herbsImg,
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
