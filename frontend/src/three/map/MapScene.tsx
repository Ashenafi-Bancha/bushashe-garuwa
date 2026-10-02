import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Tier } from '../device';
import { seeded } from '../land';
import { MARKER, MARKER_LAYER, MarkerProjector } from '../Markers';
import PlaceholderHouse from '../PlaceholderHouse';
import { MAP_POINTS, type MapPointId } from './points';

type Props = {
  tier: Exclude<Tier, 'none'>;
  active: boolean;
  /** The name of each point, read out and shown on its marker */
  names: Record<MapPointId, string>;
  chosen: MapPointId | null;
  onChoose: (id: MapPointId) => void;
};

const at = (id: MapPointId) => MAP_POINTS.find((point) => point.id === id)!.at;

/** The board sits a little below the middle of the picture */
const DROP = -1.4;
const PIN_PLACES = MAP_POINTS.map((point) => ({ at: [point.at[0], 1.7 + DROP, point.at[1]] as [number, number, number] }));

/** Up-and-down swipes still scroll the page; only sideways drags turn the map */
function KeepPageScroll() {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.style.touchAction = 'pan-y';
  });
  return null;
}

/** The whole board stays in view on wide and narrow screens alike */
function FitBoard() {
  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(2 * Math.atan(0.56 / (state.size.width / state.size.height))), 32, 68);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** A plain building: cream walls under a clay roof */
function Building({ x, z, wide = 2.4, deep = 1.6 }: { x: number; z: number; wide?: number; deep?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[wide, 1, deep]} />
        <meshLambertMaterial color="#F3EBDD" />
      </mesh>
      <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} scale={[wide * 0.78, 0.6, deep * 0.78]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshLambertMaterial color="#C4622D" />
      </mesh>
    </group>
  );
}

function Water({ x, z, wide, deep, round = false }: { x: number; z: number; wide: number; deep: number; round?: boolean }) {
  return (
    <mesh position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[wide, deep, 1]}>
      {round ? <circleGeometry args={[0.5, 32]} /> : <planeGeometry args={[1, 1]} />}
      <meshLambertMaterial color="#6FB7D6" />
    </mesh>
  );
}

function Tree({ x, z, pointed = false, size = 1 }: { x: number; z: number; pointed?: boolean; size?: number }) {
  return (
    <group position={[x, 0, z]} scale={size}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.6, 6]} />
        <meshLambertMaterial color="#6B4E36" />
      </mesh>
      <mesh position={[0, pointed ? 1.25 : 0.95, 0]}>
        {pointed ? <coneGeometry args={[0.42, 1.5, 7]} /> : <icosahedronGeometry args={[0.55, 1]} />}
        <meshLambertMaterial color={pointed ? '#2F6F45' : '#4E9A40'} flatShading />
      </mesh>
    </group>
  );
}

/** A small model of the grounds on a board, with a marker for each place */
export default function MapScene({ tier, active, names, chosen, onChoose }: Props) {
  // trees scattered where nothing else stands
  const trees = useMemo(() => {
    const random = seeded(19);
    const list: { x: number; z: number; pointed: boolean; size: number }[] = [];
    for (let tries = 0; list.length < (tier === 'high' ? 46 : 30) && tries < 900; tries++) {
      const x = (random() - 0.5) * 24;
      const z = (random() - 0.5) * 16;
      if (MAP_POINTS.some((point) => Math.hypot(point.at[0] - x, point.at[1] - z) < 2.3)) continue;
      if (Math.abs(x) < 1.2 && z > 0) continue; // the path from the gate
      list.push({ x, z, pointed: random() < 0.3, size: 0.8 + random() * 0.6 });
    }
    return list;
  }, [tier]);

  const gate = at('gate');
  const zigba = at('zigba');
  const pins = useRef<(HTMLElement | null)[]>([]);

  return (
    <>
    <Canvas flat dpr={Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.5)} frameloop={active ? 'always' : 'never'} camera={{ position: [0, 20, 19], fov: 36 }}>
      <hemisphereLight args={['#FFFFFF', '#8FA07C', 2.3]} />
      <directionalLight position={[8, 14, 6]} intensity={2.8} color="#FFF4E0" />

      <group position={[0, DROP, 0]}>
        {/* the board: earth below, lawn on top */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[27, 0.9, 19]} />
          <meshLambertMaterial color="#B08A5B" />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[27, 19]} />
          <meshLambertMaterial color="#8CBF55" />
        </mesh>
        {/* the path in from the gate */}
        <mesh position={[gate[0], 0.02, 4.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 7.4]} />
          <meshLambertMaterial color="#DCC59B" />
        </mesh>
        {/* the gate: two posts and a beam */}
        {[-0.9, 0.9].map((side) => (
          <mesh key={side} position={[gate[0] + side, 0.7, gate[1] + 0.9]}>
            <cylinderGeometry args={[0.16, 0.2, 1.4, 10]} />
            <meshLambertMaterial color="#7A5A3C" />
          </mesh>
        ))}
        <mesh position={[gate[0], 1.45, gate[1] + 0.9]}>
          <boxGeometry args={[2.5, 0.22, 0.3]} />
          <meshLambertMaterial color="#7A5A3C" />
        </mesh>

        <PlaceholderHouse position={[at('meeshsho')[0], 0, at('meeshsho')[1]]} size={0.36} />
        <PlaceholderHouse position={[at('gulanttaa')[0], 0, at('gulanttaa')[1]]} size={0.3} turn={0.5} />
        <Building x={at('meetingHall')[0]} z={at('meetingHall')[1]} wide={3} deep={2} />
        <Building x={at('restaurant')[0]} z={at('restaurant')[1]} />
        <Building x={at('guesthouse')[0]} z={at('guesthouse')[1]} wide={3.2} deep={1.5} />
        <Water x={at('pool')[0]} z={at('pool')[1]} wide={2.6} deep={1.5} />
        <Water x={at('crocodile')[0]} z={at('crocodile')[1]} wide={2.6} deep={2} round />
        <Water x={at('fish')[0]} z={at('fish')[1]} wide={2} deep={1.6} round />
        {/* the zigba trees stand in a line */}
        {[-3, -2, -1, 0, 1, 2, 3].map((step) => (
          <Tree key={step} x={zigba[0] + step * 1.15} z={zigba[1] - 0.9} pointed size={1.25} />
        ))}
        {trees.map((tree, i) => (
          <Tree key={i} {...tree} />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        minPolarAngle={0.82}
        maxPolarAngle={0.82}
        minAzimuthAngle={-0.6}
        maxAzimuthAngle={0.6}
      />
      <KeepPageScroll />
      <FitBoard />
      <MarkerProjector places={PIN_PLACES} elements={pins} />
    </Canvas>

    <div className={MARKER_LAYER}>
      {MAP_POINTS.map((point, i) => (
        <button
          key={point.id}
          ref={(el) => { pins.current[i] = el; }}
          type="button"
          onClick={() => onChoose(point.id)}
          aria-label={names[point.id]}
          aria-pressed={chosen === point.id}
          style={{ visibility: 'hidden' }}
          className={`map-pin hit-slim ${MARKER}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
    </>
  );
}
