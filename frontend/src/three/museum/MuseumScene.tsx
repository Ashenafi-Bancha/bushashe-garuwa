import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';
import type { Tier } from '../device';
import { KeepWidth, MARKER, MARKER_LAYER, MarkerProjector } from '../Markers';

/** Distance between two stands along the walk */
const GAP = 7;

export type Exhibit = {
  id: string;
  name: string;
  /** Which stand-in form to show until the scanned object exists */
  form: 0 | 1 | 2 | 3;
};

const dpr = (tier: Exclude<Tier, 'none'>) => Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.5);

/**
 * PLACEHOLDER MODELS. Plain rounded forms in clay, one per stand. They do not
 * picture the real objects; each is to be replaced by a scan (.glb) of the
 * object itself.
 */
function StandIn({ form }: { form: Exhibit['form'] }) {
  const clay = <meshLambertMaterial color={['#C4622D', '#B98A55', '#A9703F', '#D08A4E'][form]} />;
  if (form === 0)
    return (
      <mesh scale={[1, 0.45, 0.75]}>
        <sphereGeometry args={[0.7, 28, 20]} />
        {clay}
      </mesh>
    );
  if (form === 1)
    return (
      <mesh>
        <capsuleGeometry args={[0.28, 0.75, 8, 20]} />
        {clay}
      </mesh>
    );
  if (form === 2)
    return (
      <mesh>
        <cylinderGeometry args={[0.55, 0.42, 0.7, 28]} />
        {clay}
      </mesh>
    );
  return (
    <mesh>
      <torusGeometry args={[0.42, 0.17, 14, 32]} />
      {clay}
    </mesh>
  );
}

/** Turns slowly on its stand */
function Turning({ children, at }: { children: React.ReactNode; at: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += Math.min(delta, 0.1) * 0.35;
  });
  return (
    <group ref={group} position={[at, 2.3, 0]}>
      {children}
    </group>
  );
}

/** Scrolling the tall section walks the camera along the row of stands */
function Walk({ track, count }: { track: RefObject<HTMLElement | null>; count: number }) {
  const at = useRef(0);
  useFrame((state, delta) => {
    const section = track.current;
    let goal = 0;
    if (section) {
      const box = section.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      goal = span > 40 ? Math.min(1, Math.max(0, -box.top / span)) : 0;
    }
    at.current += (goal - at.current) * Math.min(1, Math.min(delta, 0.1) * 5);
    const camera = state.camera as THREE.PerspectiveCamera;
    // the walk lingers at each stand and moves on between them
    const along = at.current * (count - 1);
    const stand = Math.min(Math.floor(along), count - 2);
    const step = Math.min(1, Math.max(0, (along - stand - 0.22) / 0.56));
    const x = (stand + step * step * (3 - 2 * step)) * GAP;
    // narrow screens stand further back, so a whole stand and its neighbours' edges fit
    const back = state.size.width / state.size.height < 1 ? 9.5 : 8;
    camera.position.set(x, 3.1, back);
    camera.lookAt(x, 1.55, 0);
  });
  return null;
}

type RowProps = {
  tier: Exclude<Tier, 'none'>;
  active: boolean;
  track: RefObject<HTMLElement | null>;
  exhibits: Exhibit[];
  closerLabel: string;
  onOpen: (id: string) => void;
};

/** The row of stands, walked past by scrolling */
export default function MuseumScene({ tier, active, track, exhibits, closerLabel, onOpen }: RowProps) {
  const labels = useRef<(HTMLElement | null)[]>([]);
  const places = exhibits.map((_, i) => ({ at: [i * GAP, -0.15, 1.2] as [number, number, number] }));

  return (
    <>
    <Canvas flat dpr={dpr(tier)} frameloop={active ? 'always' : 'never'} camera={{ position: [0, 2.5, 8], fov: 40 }}>
      {/* the floor fades into the colour of the page */}
      <color attach="background" args={['#F4EFE4']} />
      <fog attach="fog" args={['#F4EFE4', 9, 26]} />
      <hemisphereLight args={['#FFFFFF', '#C9D4B4', 2.4]} />
      <directionalLight position={[4, 8, 6]} intensity={2.6} color="#FFF2DC" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[((exhibits.length - 1) * GAP) / 2, 0, 0]}>
        <planeGeometry args={[exhibits.length * GAP + 80, 60]} />
        <meshBasicMaterial color="#E3EBD8" />
      </mesh>
      {exhibits.map((exhibit, i) => (
        <group key={exhibit.id}>
          <mesh position={[i * GAP, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.9, 40]} />
            <meshBasicMaterial color="#C9D6B8" transparent opacity={0.7} />
          </mesh>
          <mesh position={[i * GAP, 0.8, 0]}>
            <cylinderGeometry args={[0.95, 0.95, 1.6, 48]} />
            <meshLambertMaterial color="#EDE4D2" />
          </mesh>
          <mesh position={[i * GAP, 1.63, 0]}>
            <cylinderGeometry args={[1.04, 1.04, 0.07, 48]} />
            <meshLambertMaterial color="#FFFFFF" />
          </mesh>
          <Turning at={i * GAP}>
            <StandIn form={exhibit.form} />
          </Turning>
        </group>
      ))}
      <Walk track={track} count={exhibits.length} />
      <MarkerProjector places={places} elements={labels} />
    </Canvas>

    <div className={MARKER_LAYER}>
      {exhibits.map((exhibit, i) => (
        <div key={exhibit.id} ref={(el) => { labels.current[i] = el; }} style={{ visibility: 'hidden' }} className={`exhibit-label ${MARKER}`}>
          <strong>{exhibit.name}</strong>
          <button type="button" onClick={() => onOpen(exhibit.id)}>
            {closerLabel}
          </button>
        </div>
      ))}
    </div>
    </>
  );
}

/** One object on its own, larger, to turn in any direction */
export function ObjectViewer({ tier, form }: { tier: Exclude<Tier, 'none'>; form: Exhibit['form'] }) {
  return (
    <Canvas flat dpr={dpr(tier)} frameloop="demand" camera={{ position: [0, 0.6, 3.4], fov: 40 }}>
      <hemisphereLight args={['#FFFFFF', '#8FA07C', 2.4]} />
      <directionalLight position={[3, 5, 4]} intensity={2.8} color="#FFF2DC" />
      <group scale={1.5}>
        <StandIn form={form} />
      </group>
      <OrbitControls enablePan={false} enableDamping minDistance={2.2} maxDistance={5} />
      <KeepWidth fov={40} shape={1.3} />
    </Canvas>
  );
}
