/**
 * The points of the map of the grounds.
 *
 * [MAP LAYOUT NEEDED] The positions below are a stand-in arrangement, NOT the
 * true layout. When a sketch of the grounds is available, set each `at` to its
 * real place: x runs left to right (-12 to 12), z from the back (-8) to the
 * main gate at the front (8).
 *
 * Names and descriptions come from text already on the site (see GroundsMap.tsx).
 */
export type MapPointId =
  | 'gate'
  | 'meeshsho'
  | 'gulanttaa'
  | 'zigba'
  | 'meetingHall'
  | 'zoo'
  | 'pool'
  | 'orchard'
  | 'horses'
  | 'crocodile'
  | 'fish'
  | 'guesthouse'
  | 'restaurant';

export type MapPoint = {
  id: MapPointId;
  at: [x: number, z: number];
  /** The page that tells more */
  to: string;
};

export const MAP_POINTS: MapPoint[] = [
  { id: 'gate', at: [0, 7.6], to: '/visit' },
  { id: 'meeshsho', at: [-2.4, 0.4], to: '/heritage/houses' },
  { id: 'gulanttaa', at: [-6.4, -1.6], to: '/heritage/houses' },
  { id: 'zigba', at: [0, -6.6], to: '/heritage/trees' },
  { id: 'meetingHall', at: [5.6, 3.4], to: '/experiences' },
  { id: 'restaurant', at: [8.8, -0.6], to: '/dine' },
  { id: 'guesthouse', at: [5.2, -3.6], to: '/stay' },
  { id: 'pool', at: [9.6, -5], to: '/stay' },
  { id: 'horses', at: [-5.6, 4.6], to: '/experiences' },
  { id: 'zoo', at: [-9.8, 2], to: '/heritage/animals' },
  { id: 'crocodile', at: [-10, -4.6], to: '/heritage/animals' },
  { id: 'fish', at: [-5.4, -5.6], to: '/heritage/animals' },
  { id: 'orchard', at: [2.4, -3], to: '/heritage/trees' },
];
