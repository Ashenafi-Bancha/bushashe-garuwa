import { useFrame } from '@react-three/fiber';
import { useMemo, type RefObject } from 'react';
import * as THREE from 'three';

export type MarkerPlace = {
  /** Where in the scene the marker belongs */
  at: [number, number, number];
  /** Which way that spot faces; the marker hides while it is turned away from the eye */
  facing?: [number, number, number];
};

type Props = {
  places: MarkerPlace[];
  /** The page elements laid over the canvas, in the same order as `places` */
  elements: RefObject<(HTMLElement | null)[]>;
};

/**
 * Goes inside a <Canvas>. Every frame it moves each page element (a button, a
 * label) so it sits over its place in the 3D scene. The elements themselves are
 * ordinary page content in a layer over the canvas, so they are real buttons
 * for keyboards and screen readers.
 */
export function MarkerProjector({ places, elements }: Props) {
  const work = useMemo(() => ({ point: new THREE.Vector3(), normal: new THREE.Vector3(), toEye: new THREE.Vector3() }), []);

  useFrame(({ camera, size }) => {
    places.forEach((place, i) => {
      const el = elements.current[i];
      if (!el) return;
      work.point.set(...place.at);
      let seen = true;
      if (place.facing) {
        work.toEye.copy(camera.position).sub(work.point);
        seen = work.normal.set(...place.facing).dot(work.toEye) > 0;
      }
      work.point.project(camera);
      seen &&= work.point.z < 1;
      const x = (work.point.x * 0.5 + 0.5) * size.width;
      const y = (-work.point.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      el.style.visibility = seen ? 'visible' : 'hidden';
    });
  });

  return null;
}

/**
 * Goes inside a <Canvas>. On screens narrower than the shape the scene was
 * composed for, the view widens so the same width of the scene stays in sight.
 */
export function KeepWidth({ fov, shape, max = 75 }: { fov: number; /** width / height the scene was composed for */ shape: number; max?: number }) {
  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const now = state.size.width / state.size.height;
    const wanted = now >= shape ? fov : Math.min(max, THREE.MathUtils.radToDeg(2 * Math.atan((Math.tan(THREE.MathUtils.degToRad(fov / 2)) * shape) / now)));
    if (Math.abs(camera.fov - wanted) > 0.01) {
      camera.fov = wanted;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** The layer over the canvas that holds the markers; it lets drags through to the scene */
export const MARKER_LAYER = 'absolute inset-0 overflow-hidden pointer-events-none';
/** Each marker in the layer: placed by the projector, hidden until its first frame */
export const MARKER = 'absolute left-0 top-0 pointer-events-auto';
