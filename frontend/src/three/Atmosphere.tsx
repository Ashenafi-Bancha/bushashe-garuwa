import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, type RefObject } from 'react';
import * as THREE from 'three';
import { HOUSES, seeded, smooth } from './land';

/**
 * Small living things for the landscape: birds crossing the sky, leaves
 * drifting down along the walk, and fireflies around the houses as the light
 * turns gold. Each is drawn in a single call and costs almost nothing.
 */

/** How far along the walk (0 to 1), kept by the scene */
type Journey = RefObject<{ at: number }>;

/* ── Birds: a loose flock, far off, wings beating ── */
export function Birds({ count }: { count: number }) {
  const flock = useMemo(() => {
    const random = seeded(77);
    const birds = Array.from({ length: count }, () => ({
      x: (random() - 0.5) * 60,
      y: 34 + random() * 14,
      z: -70 - random() * 60,
      beat: random() * 6,
      size: 0.9 + random() * 0.6,
    }));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 18), 3));
    return { birds, geometry, material: new THREE.MeshBasicMaterial({ color: '#33443B', side: THREE.DoubleSide }) };
  }, [count]);

  useEffect(
    () => () => {
      flock.geometry.dispose();
      flock.material.dispose();
    },
    [flock],
  );

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const position = flock.geometry.attributes.position as THREE.BufferAttribute;
    // the flock crosses from left to right and comes round again
    const drift = ((now * 3.2) % 260) - 130;
    flock.birds.forEach((bird, i) => {
      const x = bird.x + drift;
      const y = bird.y + Math.sin(now * 0.5 + bird.beat) * 0.8;
      const lift = Math.sin(now * 7 + bird.beat) * 0.55 * bird.size;
      const span = 1.5 * bird.size;
      const thick = 0.28 * bird.size;
      // two thin wings meeting at the body, rising and falling together
      [-1, 1].forEach((side, wing) => {
        position.setXYZ(i * 6 + wing * 3, x, y, bird.z);
        position.setXYZ(i * 6 + wing * 3 + 1, x + side * span, y + lift, bird.z);
        position.setXYZ(i * 6 + wing * 3 + 2, x + side * span * 0.45, y + lift * 0.35 - thick, bird.z);
      });
    });
    position.needsUpdate = true;
  });

  return <mesh geometry={flock.geometry} material={flock.material} frustumCulled={false} />;
}

/** A soft round dot, used for leaves and fireflies */
function dotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const pen = canvas.getContext('2d')!;
  const fade = pen.createRadialGradient(32, 32, 0, 32, 32, 32);
  fade.addColorStop(0, 'rgba(255,255,255,1)');
  fade.addColorStop(0.45, 'rgba(255,255,255,0.75)');
  fade.addColorStop(1, 'rgba(255,255,255,0)');
  pen.fillStyle = fade;
  pen.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

/* ── Leaves: a few drift down around the walker once among the trees ── */
export function Leaves({ count, journey }: { count: number; journey: Journey }) {
  const leaves = useMemo(() => {
    const random = seeded(101);
    const seeds = Array.from({ length: count }, () => ({ x: random() * 34, y: random() * 13, z: random() * 34, sway: random() * 6, fall: 0.5 + random() * 0.6 }));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const colours = new Float32Array(count * 3);
    const tint = new THREE.Color();
    seeds.forEach((_, i) => {
      tint.set(['#8FBF4E', '#C9B84A', '#6FA544', '#D9A441'][i % 4]!);
      colours.set([tint.r, tint.g, tint.b], i * 3);
    });
    geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
    const map = dotTexture();
    const material = new THREE.PointsMaterial({ map, size: 0.3, vertexColors: true, transparent: true, depthWrite: false, opacity: 0 });
    return { seeds, geometry, material, map };
  }, [count]);

  useEffect(
    () => () => {
      leaves.geometry.dispose();
      leaves.material.dispose();
      leaves.map.dispose();
    },
    [leaves],
  );

  useFrame(({ clock, camera }) => {
    const now = clock.elapsedTime;
    const p = journey.current.at;
    // none over the open hill; they appear among the trees and thin out at the house
    leaves.material.opacity = 0.9 * smooth(0.18, 0.4, p) * (1 - 0.5 * smooth(0.85, 1, p));
    const position = leaves.geometry.attributes.position as THREE.BufferAttribute;
    const wrap = (value: number, size: number) => ((value % size) + size) % size;
    leaves.seeds.forEach((leaf, i) => {
      // each leaf keeps its place in a box that travels with the walker, so there are always some near
      const x = wrap(leaf.x - camera.position.x + Math.sin(now * 0.6 + leaf.sway) * 1.2, 34) - 17;
      const y = wrap(leaf.y - now * leaf.fall, 13) - 2.5;
      // always a few steps ahead, never right before the eye
      const z = -5 - wrap(leaf.z - camera.position.z, 26);
      position.setXYZ(i, camera.position.x + x, Math.max(0.1, camera.position.y + y), camera.position.z + z);
    });
    position.needsUpdate = true;
  });

  return <points geometry={leaves.geometry} material={leaves.material} frustumCulled={false} />;
}

/* ── Fireflies: small warm lights around the houses as evening comes ── */
export function Fireflies({ count, journey }: { count: number; journey: Journey }) {
  const flies = useMemo(() => {
    const random = seeded(55);
    const homes = Array.from({ length: count }, () => {
      const house = HOUSES[random() < 0.7 ? 0 : 1]!;
      const angle = random() * Math.PI * 2;
      const away = 4.5 + random() * 8;
      return { x: house.x + Math.cos(angle) * away, y: 0.5 + random() * 2.6, z: house.z + Math.sin(angle) * away, beat: random() * 6 };
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute('beat', new THREE.BufferAttribute(new Float32Array(homes.map((home) => home.beat)), 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uGlow: { value: 0 }, uSize: { value: 1 } },
      vertexShader: `
        attribute float beat;
        uniform float uTime;
        uniform float uSize;
        varying float vLit;
        void main() {
          vLit = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 1.7 + beat * 3.0), 3.0);
          vec4 seen = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * seen;
          gl_PointSize = uSize * (0.6 + vLit) * 90.0 / -seen.z;
        }`,
      fragmentShader: `
        uniform float uGlow;
        varying float vLit;
        void main() {
          float away = length(gl_PointCoord - 0.5);
          float light = smoothstep(0.5, 0.0, away);
          gl_FragColor = vec4(vec3(1.0, 0.86, 0.42) * light * vLit * uGlow, light * uGlow);
          #include <colorspace_fragment>
        }`,
    });
    return { homes, geometry, material };
  }, [count]);

  useEffect(
    () => () => {
      flies.geometry.dispose();
      flies.material.dispose();
    },
    [flies],
  );

  useFrame(({ clock, viewport }) => {
    const now = clock.elapsedTime;
    const uniforms = flies.material.uniforms;
    uniforms.uTime!.value = now;
    // they come out as the light turns gold, near the end of the walk
    uniforms.uGlow!.value = smooth(0.7, 0.96, journey.current.at);
    uniforms.uSize!.value = viewport.dpr;
    const position = flies.geometry.attributes.position as THREE.BufferAttribute;
    flies.homes.forEach((home, i) => {
      position.setXYZ(
        i,
        home.x + Math.sin(now * 0.4 + home.beat) * 0.9,
        home.y + Math.sin(now * 0.6 + home.beat * 2) * 0.45,
        home.z + Math.cos(now * 0.33 + home.beat) * 0.9,
      );
    });
    position.needsUpdate = true;
  });

  return <points geometry={flies.geometry} material={flies.material} frustumCulled={false} />;
}
