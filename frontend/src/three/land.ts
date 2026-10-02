/**
 * The shape of the drawn landscape: where the ground rises, where the houses
 * stand, the way in, and where trees and enset grow. Plain numbers only (no
 * drawing library), so the same land is made every time.
 *
 * It is a drawing of rolling green country, not a survey of the real grounds.
 */

/** Where the houses stand: a flat clearing */
export const HOME = { x: 0, z: -40 };
export const CLEARING = 15;

/** The walk in: from the rise where the journey starts to the front of the house */
export const WALK = { from: { x: 10, z: 62 }, to: { x: 1.5, z: -21 } };

export const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/** How far left or right the walk is at this depth */
export function walkX(z: number): number {
  const t = clamp((z - WALK.to.z) / (WALK.from.z - WALK.to.z));
  return mix(WALK.to.x, WALK.from.x, t);
}

/** Height of the ground at a point */
export function groundHeight(x: number, z: number): number {
  const fromHome = Math.hypot(x - HOME.x, z - HOME.z);
  const rolling =
    7 * Math.sin(x * 0.024 + 1.3) * Math.cos(z * 0.019 - 0.4) +
    4 * Math.sin(x * 0.047 - 2.1 + z * 0.013) * Math.sin(z * 0.041 + 0.7) +
    1.2 * Math.sin(x * 0.13 + 0.5) * Math.sin(z * 0.11 - 1.1);
  // the houses stand on level ground
  const clearing = smooth(CLEARING, 42, fromHome);
  // the walk in stays gentle, so the view of the houses is open; the hills frame it
  const onWalk = z > HOME.z ? 0.3 + 0.7 * smooth(14, 55, Math.abs(x - walkX(z))) : 1;
  // far away the country climbs into hills
  const far = smooth(75, 235, fromHome) * (26 + 14 * Math.sin(x * 0.014 + 0.8) * Math.cos(z * 0.011 + 2));
  return rolling * clearing * onWalk + far;
}

/** The houses: the large one in the middle, a smaller one beside it. Doors face the walk in. */
export const HOUSES = [
  { x: HOME.x, z: HOME.z, size: 1, turn: 0 },
  { x: HOME.x - 11.2, z: HOME.z - 5.6, size: 0.7, turn: 0.55 },
] as const;

/** The same "random" numbers every time, so the land never changes between visits */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Plant = { x: number; y: number; z: number; size: number; turn: number; shade: number };

const nearAHouse = (x: number, z: number, margin: number) =>
  HOUSES.some((house) => Math.hypot(x - house.x, z - house.z) < 3.9 * house.size + margin);

/** Trees: thick around the clearing, in groves over the hills, none on the walk in */
export function scatterTrees(count: number, seed: number): Plant[] {
  const random = seeded(seed);
  const trees: Plant[] = [];
  for (let tries = 0; trees.length < count && tries < count * 60; tries++) {
    const near = random() < 0.4;
    const angle = random() * Math.PI * 2;
    const distance = near ? CLEARING + 1 + random() * 30 : 44 + Math.pow(random(), 0.8) * 170;
    const x = HOME.x + Math.cos(angle) * distance;
    const z = HOME.z + Math.sin(angle) * distance * 0.92;
    if (z > 78 || z < -235 || Math.abs(x) > 195) continue;
    // the walk in stays open, and wide where the journey starts so nothing stands before the eye
    if (z > HOME.z + 2 && Math.abs(x - walkX(z)) < 7 + smooth(20, 62, z) * 17) continue;
    if (Math.hypot(x - WALK.from.x, z - WALK.from.z) < 36) continue;
    // groves, with open grass between them
    const grove = Math.sin(x * 0.07 + 1.7) * Math.sin(z * 0.06 - 0.6) + 0.5 * Math.sin(x * 0.021 + z * 0.017);
    if (!near && grove < -0.1 && random() < 0.85) continue;
    trees.push({ x, y: groundHeight(x, z), z, size: 0.75 + random() * 0.95, turn: random() * Math.PI * 2, shade: random() });
  }
  return trees;
}

/** Enset (false banana): close around the houses, as in the photographs, but not before the doors */
export function scatterEnset(count: number, seed: number): Plant[] {
  const random = seeded(seed);
  const plants: Plant[] = [];
  for (let tries = 0; plants.length < count && tries < count * 60; tries++) {
    const house = HOUSES[random() < 0.68 ? 0 : 1]!;
    const angle = random() * Math.PI * 2;
    const distance = 3.9 * house.size + 1.3 + random() * 6.5;
    const x = house.x + Math.cos(angle) * distance;
    const z = house.z + Math.sin(angle) * distance;
    if (Math.hypot(x - HOME.x, z - HOME.z) > CLEARING + 3) continue;
    if (nearAHouse(x, z, 1.1)) continue;
    // the front of each house and the path stay clear
    if (z > house.z + 0.5 && Math.abs(x - house.x - (z - house.z) * Math.sin(house.turn)) < 4.2) continue;
    if (z > HOME.z && Math.abs(x - walkX(z)) < 3.6) continue;
    plants.push({ x, y: 0, z, size: 0.75 + random() * 0.6, turn: random() * Math.PI * 2, shade: random() });
  }
  return plants;
}
