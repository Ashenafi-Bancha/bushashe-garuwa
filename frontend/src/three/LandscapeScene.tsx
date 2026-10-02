import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Tier } from './device';
import { CLEARING, HOME, HOUSES, WALK, clamp, groundHeight, mix, scatterEnset, scatterTrees, seeded, smooth, walkX, type Plant } from './land';
import PlaceholderHouse from './PlaceholderHouse';

/**
 * The drawn landscape behind the home page: green hills, trees, thatched houses
 * among the enset, morning mist and a wide sky. The camera drifts gently, and
 * scrolling walks it down from the rise to the front of the house while the
 * light moves from sunrise to golden hour.
 *
 * Kept light for phones: one terrain, every tree drawn in a single call per
 * kind, no shadows, no textures to download.
 */

type Props = {
  /** The tall section that is scrolled through; its progress drives the walk */
  track: RefObject<HTMLElement | null>;
  tier: Exclude<Tier, 'none'>;
  /** Draw only while the scene is on screen */
  active: boolean;
  /** Give up and show photographs if the device cannot keep up */
  watchSpeed: boolean;
  onReady: () => void;
  onTooSlow: () => void;
};

const QUALITY = {
  high: { ground: 128, trees: 300, enset: 54, mist: 7, clouds: 8, dpr: 1.75 },
  low: { ground: 88, trees: 170, enset: 40, mist: 4, clouds: 5, dpr: 1.5 },
} as const;

/* ── The light at three moments of the day ── */
const at = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();
const MOMENTS = [
  // sunrise: a soft peach horizon, the sun low on the left
  { top: '#7FB2DC', mid: '#DDE1E6', horizon: '#F6D5B6', sun: '#FFD3A6', light: '#FFE6CC', power: 3, fill: 2.2, glow: at(-0.5, 0.11, -0.86), from: at(-0.72, 0.46, 0.5), mist: 1, cloud: '#FFE9DA' },
  // full morning: clear blue
  { top: '#4E9FE4', mid: '#A6D2F0', horizon: '#DCEEF3', sun: '#FFFFFF', light: '#FFFFFF', power: 3.1, fill: 2.3, glow: at(-0.05, 0.92, -0.38), from: at(-0.3, 0.85, 0.45), mist: 0.4, cloud: '#FFFFFF' },
  // golden hour: warm light from the right
  { top: '#5C95D0', mid: '#F0DCC0', horizon: '#FFCD88', sun: '#FFB25C', light: '#FFD9A8', power: 3.4, fill: 2.3, glow: at(0.5, 0.1, -0.86), from: at(0.7, 0.48, 0.52), mist: 0.25, cloud: '#FFDDB4' },
].map((m) => ({ ...m, top: new THREE.Color(m.top), mid: new THREE.Color(m.mid), horizon: new THREE.Color(m.horizon), sun: new THREE.Color(m.sun), light: new THREE.Color(m.light), cloud: new THREE.Color(m.cloud) }));

/* ── A soft white puff, drawn once, used for mist and clouds ── */
function puffTexture(blobs: [number, number, number][], width: number, height: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const pen = canvas.getContext('2d')!;
  for (const [x, y, radius] of blobs) {
    const fade = pen.createRadialGradient(x, y, 0, x, y, radius);
    fade.addColorStop(0, 'rgba(255,255,255,0.9)');
    fade.addColorStop(0.55, 'rgba(255,255,255,0.35)');
    fade.addColorStop(1, 'rgba(255,255,255,0)');
    pen.fillStyle = fade;
    pen.fillRect(0, 0, width, height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ── The ground: rolling hills coloured by height ── */
/* ── Fine speckle for the grass, so the ground is never one flat colour ── */
function grassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const pen = canvas.getContext('2d')!;
  pen.fillStyle = '#F2F2F2';
  pen.fillRect(0, 0, 256, 256);
  const random = seeded(5);
  for (let i = 0; i < 2600; i++) {
    const dark = random() < 0.6;
    pen.fillStyle = dark ? `rgba(40, 90, 30, ${0.04 + random() * 0.07})` : `rgba(255, 255, 215, ${0.06 + random() * 0.1})`;
    const size = 1 + random() * 3.2;
    const squash = 0.5 + random() * 0.5;
    const turn = random() * 3;
    const x = random() * 256;
    const y = random() * 256;
    // drawn again across the edges, so the tile repeats without a seam
    for (const dx of [-256, 0, 256]) {
      for (const dy of [-256, 0, 256]) {
        pen.beginPath();
        pen.ellipse(x + dx, y + dy, size, size * squash, turn, 0, Math.PI * 2);
        pen.fill();
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(72, 67);
  texture.anisotropy = 4;
  return texture;
}

function buildGround(segments: number, trees: Plant[]): THREE.BufferGeometry {
  const geometry = new THREE.PlaneGeometry(430, 400, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, -70);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colours = new Float32Array(position.count * 3);
  const low = new THREE.Color('#6DA643');
  const high = new THREE.Color('#3F7F3D');
  const light = new THREE.Color('#A2C768');
  const lawn = new THREE.Color('#7DB948');
  const far = new THREE.Color('#5E9370');
  const colour = new THREE.Color();
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const height = groundHeight(x, z);
    const fromHome = Math.hypot(x - HOME.x, z - HOME.z);
    position.setY(i, height);
    const patch = Math.sin(x * 0.09 + z * 0.05) * Math.sin(z * 0.07 - x * 0.03);
    colour
      .copy(low)
      .lerp(high, smooth(1, 22, height))
      .lerp(light, smooth(0.15, 0.8, patch) * 0.5)
      .lerp(far, smooth(120, 240, fromHome) * 0.6)
      .lerp(lawn, 1 - smooth(CLEARING - 2, CLEARING + 10, fromHome));
    colours.set([colour.r, colour.g, colour.b], i * 3);
  }
  // the ground is darker where trees stand over it
  const step = 430 / segments;
  const stepZ = 400 / segments;
  for (const tree of trees) {
    const column = Math.round((tree.x + 215) / step);
    const row = Math.round((tree.z + 270) / stepZ);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr;
        const c = column + dc;
        if (r < 0 || c < 0 || r > segments || c > segments) continue;
        const i = r * (segments + 1) + c;
        const away = Math.hypot(position.getX(i) - tree.x, position.getZ(i) - tree.z);
        const shade = 1 - 0.3 * (1 - smooth(0, 5.5 * tree.size, away));
        colours[i * 3] *= shade;
        colours[i * 3 + 1] *= shade;
        colours[i * 3 + 2] *= shade;
      }
    }
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/* ── Leaves and treetops sway a little in the wind ── */
function swaying(material: THREE.Material, time: { value: number }, strength: number): THREE.Material {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader =
      'uniform float uTime;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float swayAt = instanceMatrix[3].x * 0.31 + instanceMatrix[3].z * 0.27;
          transformed.x += sin(uTime * 1.1 + swayAt) * ${strength.toFixed(3)} * position.y;
          transformed.z += cos(uTime * 0.8 + swayAt * 1.3) * ${(strength * 0.6).toFixed(3)} * position.y;
        #endif`,
      );
  };
  return material;
}

/* ── Trees: round-topped and tall pointed ones, each kind drawn in one call ── */
function buildTrees(trees: Plant[], time: { value: number }, shadowMap: THREE.Texture): THREE.Group {
  const pointed = trees.filter((tree) => tree.shade < 0.3);
  const round = trees.filter((tree) => tree.shade >= 0.3);

  const blob = (radius: number, x: number, y: number, z: number) => new THREE.IcosahedronGeometry(radius, 1).translate(x, y, z);
  const roundTop = mergeGeometries([blob(1.75, 0, 3.7, 0), blob(1.25, 1, 3, 0.35), blob(1.3, -0.9, 3.15, -0.45)])!;
  const cone = (radius: number, height: number, y: number) => new THREE.ConeGeometry(radius, height, 7).translate(0, y, 0);
  const pointedTop = mergeGeometries([cone(1.55, 3.4, 3.2), cone(1.15, 2.8, 5), cone(0.75, 2.2, 6.6)])!;
  const trunk = new THREE.CylinderGeometry(0.15, 0.26, 2.6, 6).translate(0, 1.3, 0);

  const leaves = () => swaying(new THREE.MeshLambertMaterial({ flatShading: true }), time, 0.03);
  const group = new THREE.Group();
  const place = new THREE.Object3D();
  const tint = new THREE.Color();

  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, list: typeof trees, colours: [string, string] | null, tall = 1) => {
    const mesh = new THREE.InstancedMesh(geometry, material, list.length);
    const a = new THREE.Color(colours?.[0]);
    const b = new THREE.Color(colours?.[1]);
    list.forEach((tree, i) => {
      place.position.set(tree.x, tree.y - 0.25, tree.z);
      place.rotation.set(0, tree.turn, 0);
      place.scale.set(tree.size, tree.size * tall, tree.size);
      place.updateMatrix();
      mesh.setMatrixAt(i, place.matrix);
      if (colours) mesh.setColorAt(i, tint.copy(a).lerp(b, (tree.shade * 7.3) % 1));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    group.add(mesh);
  };

  add(roundTop, leaves(), round, ['#3C8539', '#77B34A']);
  add(pointedTop, leaves(), pointed, ['#2C6A41', '#44895A'], 1.2);
  add(trunk, new THREE.MeshLambertMaterial({ color: '#6B4E36' }), trees, null);

  // soft round shadows on the grass, where the ground is gentle enough to carry them
  const shaded = trees.filter((tree) => Math.hypot(tree.x - HOME.x, tree.z - HOME.z) < 48 || (tree.z > HOME.z && Math.abs(tree.x - walkX(tree.z)) < 30));
  const shadows = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: shadowMap, color: '#16301C', transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }),
    shaded.length,
  );
  const up = new THREE.Vector3(0, 1, 0);
  const slope = new THREE.Vector3();
  shaded.forEach((tree, i) => {
    slope.set(groundHeight(tree.x - 1, tree.z) - groundHeight(tree.x + 1, tree.z), 2, groundHeight(tree.x, tree.z - 1) - groundHeight(tree.x, tree.z + 1)).normalize();
    place.position.set(tree.x, tree.y, tree.z).addScaledVector(slope, 0.16);
    place.quaternion.setFromUnitVectors(up, slope);
    place.scale.setScalar(6.2 * tree.size);
    place.updateMatrix();
    shadows.setMatrixAt(i, place.matrix);
  });
  shadows.instanceMatrix.needsUpdate = true;
  shadows.frustumCulled = false;
  group.add(shadows);
  return group;
}

/* ── Enset (false banana): broad upright leaves rising from a thick stem ── */
function buildEnset(count: number, time: { value: number }): THREE.InstancedMesh {
  const painted = (geometry: THREE.BufferGeometry, shade: number) => {
    const points = (geometry.attributes.position as THREE.BufferAttribute).count;
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(points * 3).fill(shade), 3));
    return geometry;
  };
  const leaf = (lean: number, around: number, length: number) => {
    const geometry = new THREE.PlaneGeometry(1.25, length, 2, 6);
    geometry.translate(0, length / 2, 0);
    const position = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const up = position.getY(i) / length;
      // a paddle: narrow at the stalk, broad along its length, rounded at the tip
      const broad = smooth(0, 0.22, up) * (1 - 0.88 * smooth(0.72, 1, up)) + 0.1;
      const x = position.getX(i) * broad;
      // folded along the middle and arching outward
      position.setXYZ(i, x, position.getY(i), up * up * 0.95 - Math.abs(x) * 0.38);
    }
    geometry.rotateX(lean);
    geometry.rotateY(around);
    geometry.translate(0, 0.8, 0);
    geometry.computeVertexNormals();
    return painted(geometry, 1);
  };
  const pieces: THREE.BufferGeometry[] = [painted(new THREE.CylinderGeometry(0.1, 0.19, 0.9, 7).translate(0, 0.45, 0), 0.4)];
  for (let i = 0; i < 7; i++) pieces.push(leaf(0.2 + (i % 3) * 0.14, (i / 7) * Math.PI * 2, 3 + (i % 2) * 0.55));
  pieces.push(leaf(0.05, 0.6, 3.7));
  const geometry = mergeGeometries(pieces)!;

  const plants = scatterEnset(count, 23);
  const material = swaying(new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: true }), time, 0.022);
  const mesh = new THREE.InstancedMesh(geometry, material, plants.length);
  const place = new THREE.Object3D();
  const a = new THREE.Color('#4F9E36');
  const b = new THREE.Color('#86C74E');
  const tint = new THREE.Color();
  plants.forEach((plant, i) => {
    place.position.set(plant.x, plant.y, plant.z);
    place.rotation.set(0, plant.turn, 0);
    place.scale.setScalar(plant.size);
    place.updateMatrix();
    mesh.setMatrixAt(i, place.matrix);
    mesh.setColorAt(i, tint.copy(a).lerp(b, plant.shade));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}

/* ── The sky: colour from the horizon up, with the glow of the sun ── */
function buildSky(): THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color() },
      uMid: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSun: { value: new THREE.Color() },
      uSunAt: { value: new THREE.Vector3(0, 1, 0) },
    },
    vertexShader: `
      varying vec3 vDirection;
      void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uTop;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      uniform vec3 uSun;
      uniform vec3 uSunAt;
      varying vec3 vDirection;
      void main() {
        vec3 direction = normalize(vDirection);
        float up = clamp(direction.y, 0.0, 1.0);
        vec3 colour = mix(mix(uHorizon, uMid, smoothstep(0.0, 0.2, up)), uTop, smoothstep(0.1, 0.62, up));
        float toSun = max(dot(direction, uSunAt), 0.0);
        colour += uSun * (pow(toSun, 5.0) * 0.22 + pow(toSun, 60.0) * 0.4 + smoothstep(0.9990, 0.9996, toSun) * 0.9);
        gl_FragColor = vec4(colour, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(700, 32, 16), material);
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  return sky;
}

function World({ track, tier, watchSpeed, onReady, onTooSlow }: Omit<Props, 'active'>) {
  const quality = QUALITY[tier];
  const scene = useThree((state) => state.scene);

  const parts = useMemo(() => {
    const time = { value: 0 };
    const random = seeded(41);
    const mistMap = puffTexture([[64, 64, 64]], 128, 128);
    const cloudMap = puffTexture([[70, 62, 46], [128, 48, 48], [186, 60, 44], [104, 70, 40], [156, 72, 40]], 256, 112);
    const mistMaterial = new THREE.MeshBasicMaterial({ map: mistMap, transparent: true, depthWrite: false, opacity: 0.5 });
    const cloudMaterial = new THREE.MeshBasicMaterial({ map: cloudMap, transparent: true, depthWrite: false, fog: false, opacity: 0.92 });
    const sheet = new THREE.PlaneGeometry(1, 1);

    // mist lying in the low ground behind and beside the houses
    const mist = new THREE.Group();
    for (let i = 0; i < quality.mist; i++) {
      const puff = new THREE.Mesh(sheet, mistMaterial);
      const x = (random() - 0.5) * 230;
      const z = -62 - random() * 95;
      puff.position.set(x, groundHeight(x, z) + 3 + random() * 3, z);
      puff.scale.set(95 + random() * 60, 13 + random() * 9, 1);
      puff.userData.speed = 0.5 + random() * 0.7;
      mist.add(puff);
    }
    // clouds far off, drifting
    const clouds = new THREE.Group();
    for (let i = 0; i < quality.clouds; i++) {
      const cloud = new THREE.Mesh(sheet, cloudMaterial);
      cloud.position.set((random() - 0.5) * 760, 70 + random() * 70, -300 - random() * 160);
      const wide = 110 + random() * 90;
      cloud.scale.set(wide, wide * (0.3 + random() * 0.1), 1);
      cloud.userData.speed = 0.7 + random() * 0.9;
      clouds.add(cloud);
    }

    const trees = scatterTrees(quality.trees, 7);
    const grassMap = grassTexture();
    return {
      time,
      grassMap,
      ground: buildGround(quality.ground, trees),
      trees: buildTrees(trees, time, mistMap),
      enset: buildEnset(quality.enset, time),
      sky: buildSky(),
      mist,
      clouds,
      mistMaterial,
      cloudMaterial,
      disposables: [mistMap, cloudMap, grassMap, mistMaterial, cloudMaterial, sheet],
    };
  }, [quality]);

  // hand everything back when the page is left
  useEffect(
    () => () => {
      parts.ground.dispose();
      parts.sky.geometry.dispose();
      parts.sky.material.dispose();
      parts.enset.geometry.dispose();
      (parts.enset.material as THREE.Material).dispose();
      parts.enset.dispose();
      parts.trees.children.forEach((child) => {
        const mesh = child as THREE.InstancedMesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        mesh.dispose();
      });
      parts.disposables.forEach((item) => item.dispose());
    },
    [parts],
  );

  // the pointer tilts the view a little on computers
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const walk = useRef({ at: 0, lookX: 0, lookY: 0, frames: 0, ready: false, far: false });
  const speed = useRef({ frames: 0, time: 0, warm: 0, done: !watchSpeed, lowered: false });
  const work = useMemo(() => ({ target: new THREE.Vector3(), from: new THREE.Vector3(), glow: new THREE.Vector3(), colour: new THREE.Color(), white: new THREE.Color('#FFFFFF') }), []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const camera = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const journey = walk.current;
    parts.time.value += delta;
    const now = parts.time.value;

    /* how far through the tall section the page has been scrolled */
    const section = track.current;
    let goal = 0;
    if (section) {
      const box = section.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      goal = span > 40 ? clamp(-box.top / span) : 0;
    }
    journey.at += (goal - journey.at) * Math.min(1, delta * 4.5);
    const p = journey.at;
    if (section) {
      section.style.setProperty('--journey', p.toFixed(4));
      const far = p > 0.3;
      if (far !== journey.far) {
        journey.far = far;
        section.toggleAttribute('data-walking', far);
      }
    }

    /* the walk: down from the rise to the front of the house */
    const eased = p * p * (3 - 2 * p);
    // an upright phone sees a narrow slice: it starts nearer and ends square to the door
    const upright = 1 - smooth(0.65, 1.25, width / height);
    const z = mix(mix(WALK.from.z, 36, upright), mix(WALK.to.z, -23.5, upright), eased);
    const x = walkX(z) * (1 - upright * eased);
    journey.lookX += (pointer.current.x - journey.lookX) * Math.min(1, delta * 2);
    journey.lookY += (pointer.current.y - journey.lookY) * Math.min(1, delta * 2);
    const calm = 1 - 0.6 * eased;
    camera.position.set(
      x + Math.sin(now * 0.13) * 0.55 * calm + journey.lookX * 0.9 * calm,
      groundHeight(x, z) + mix(mix(13, 9.5, upright), 1.85, Math.pow(eased, 0.6)) + Math.sin(now * 0.19) * 0.22 * calm - journey.lookY * 0.35 * calm,
      z,
    );
    camera.lookAt(work.target.set(mix(-2, 0, eased), mix(3.2, 2.9, eased) + Math.sin(Math.PI * eased) * mix(2.2, 0.8, upright), mix(-46, HOME.z, eased)));

    // narrow screens see a taller slice, so the houses stay in view
    const fov = clamp(THREE.MathUtils.radToDeg(2 * Math.atan(0.7 / (width / height))), 44, 60);
    if (Math.abs(camera.fov - fov) > 0.01) camera.fov = fov;
    // while the words lie over the lower part, the view is lifted clear of them
    const lift = height * 0.15 * (1 - smooth(0, 0.3, p));
    camera.setViewOffset(width, height, 0, lift, width, height);

    /* the light: sunrise, morning, golden hour */
    const stage = Math.min(p * 2, 1.9999);
    const a = MOMENTS[Math.floor(stage)]!;
    const b = MOMENTS[Math.floor(stage) + 1]!;
    const t = stage % 1;
    const sky = parts.sky.material.uniforms;
    (sky.uTop!.value as THREE.Color).lerpColors(a.top, b.top, t);
    (sky.uMid!.value as THREE.Color).lerpColors(a.mid, b.mid, t);
    (sky.uHorizon!.value as THREE.Color).lerpColors(a.horizon, b.horizon, t);
    (sky.uSun!.value as THREE.Color).lerpColors(a.sun, b.sun, t);
    (sky.uSunAt!.value as THREE.Vector3).copy(work.glow.lerpVectors(a.glow, b.glow, t).normalize());
    parts.sky.position.copy(camera.position);
    if (scene.fog) scene.fog.color.copy(sky.uHorizon!.value as THREE.Color);
    if (sun.current) {
      sun.current.color.lerpColors(a.light, b.light, t);
      sun.current.intensity = mix(a.power, b.power, t);
      sun.current.position.copy(work.from.lerpVectors(a.from, b.from, t).normalize().multiplyScalar(120));
    }
    if (fill.current) {
      fill.current.color.copy(work.colour.copy(sky.uTop!.value as THREE.Color).lerp(work.white, 0.55));
      fill.current.intensity = mix(a.fill, b.fill, t);
    }

    /* mist thins as the day warms; clouds and mist drift */
    parts.mistMaterial.opacity = 0.55 * mix(a.mist, b.mist, t);
    parts.mistMaterial.color.copy(work.colour.copy(sky.uHorizon!.value as THREE.Color).lerp(work.white, 0.5));
    parts.cloudMaterial.color.lerpColors(a.cloud, b.cloud, t);
    for (const puff of parts.mist.children) {
      puff.position.x += delta * (puff.userData.speed as number);
      if (puff.position.x > 150) puff.position.x = -150;
    }
    for (const cloud of parts.clouds.children) {
      cloud.position.x += delta * (cloud.userData.speed as number);
      if (cloud.position.x > 420) cloud.position.x = -420;
    }

    /* the first picture is drawn: the poster can give way */
    if (!journey.ready && ++journey.frames >= 2) {
      journey.ready = true;
      onReady();
    }

    /* too slow here? first draw fewer pixels, then give up and show photographs */
    const check = speed.current;
    if (!check.done && journey.ready) {
      if (rawDelta > 1.5 || document.hidden) {
        // the page was hidden or the scene was off screen: start counting again
        check.frames = 0;
        check.time = 0;
      } else if (check.warm < 0.8) {
        check.warm += rawDelta; // the first moments are busy with setting up
      } else {
        check.frames++;
        check.time += rawDelta;
        if (check.time >= 1.6) {
          const slow = check.frames / check.time < 27;
          if (!slow) check.done = true;
          else if (!check.lowered && state.viewport.dpr > 1) {
            check.lowered = true;
            check.frames = 0;
            check.time = 0;
            check.warm = 0.4;
            state.setDpr(1);
          } else {
            check.done = true;
            onTooSlow();
          }
        }
      }
    }
  });

  return (
    <>
      <fog attach="fog" args={['#F4D6BC', 70, 335]} />
      <hemisphereLight ref={fill} args={['#DCE9F2', '#5C7F45', 2]} />
      <directionalLight ref={sun} />
      <primitive object={parts.sky} />

      <mesh geometry={parts.ground}>
        <meshLambertMaterial vertexColors map={parts.grassMap} />
      </mesh>
      {/* the path to the door */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[HOME.x, 0.05, HOME.z + 9.6]}>
        <planeGeometry args={[1.5, 13]} />
        <meshLambertMaterial color="#D8BF95" emissive="#6B5A3F" emissiveIntensity={0.45} />
      </mesh>

      {HOUSES.map((house) => (
        <PlaceholderHouse key={`${house.x} ${house.z}`} position={[house.x, 0, house.z]} size={house.size} turn={house.turn} />
      ))}
      <primitive object={parts.enset} />
      <primitive object={parts.trees} />
      <primitive object={parts.mist} />
      <primitive object={parts.clouds} />
    </>
  );
}

export default function LandscapeScene({ active, tier, ...rest }: Props) {
  return (
    <Canvas
      flat
      dpr={Math.min(window.devicePixelRatio || 1, QUALITY[tier].dpr)}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: 44, near: 0.5, far: 1500, position: [WALK.from.x, 20, WALK.from.z] }}
      // the words lie over the picture; nothing in it is clicked
      style={{ pointerEvents: 'none' }}
    >
      <World tier={tier} {...rest} />
    </Canvas>
  );
}
