import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Tier } from '../device';
import { KeepWidth, MARKER, MARKER_LAYER, MarkerProjector, type MarkerPlace } from '../Markers';
import PlaceholderHouse from '../PlaceholderHouse';

export type Spot = MarkerPlace & { id: string; label: string };

type Props = {
  tier: Exclude<Tier, 'none'>;
  active: boolean;
  spots: Spot[];
  chosen: string | null;
  onChoose: (id: string) => void;
};

/** The house stands a little below the middle of the picture */
const DROP = -2.5;

/** Up-and-down swipes still scroll the page; only sideways drags turn the house */
function KeepPageScroll() {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    canvas.style.touchAction = 'pan-y';
  });
  return null;
}

/** The house on a round lawn. Drag sideways to walk around it; markers open the notes. */
export default function HouseScene({ tier, active, spots, chosen, onChoose }: Props) {
  const [touched, setTouched] = useState(false);
  const buttons = useRef<(HTMLElement | null)[]>([]);
  const places = spots.map((spot) => ({ ...spot, at: [spot.at[0], spot.at[1] + DROP, spot.at[2]] as [number, number, number] }));

  return (
    <>
      <Canvas
        flat
        dpr={Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.5)}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [8.6, 2.6, 10.6], fov: 36 }}
      >
        <hemisphereLight args={['#F4F7EC', '#6E8F4E', 2.3]} />
        <directionalLight position={[6, 9, 6]} intensity={3} color="#FFF1D8" />

        <group position={[0, DROP, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[7.4, 56]} />
            <meshLambertMaterial color="#8CBF55" />
          </mesh>
          <PlaceholderHouse />
        </group>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          minPolarAngle={1.3}
          maxPolarAngle={1.3}
          autoRotate={!touched}
          autoRotateSpeed={0.7}
          onStart={() => setTouched(true)}
        />
        <KeepPageScroll />
        <KeepWidth fov={36} shape={1.5} />
        <MarkerProjector places={places} elements={buttons} />
      </Canvas>

      <div className={MARKER_LAYER}>
        {spots.map((spot, i) => (
          <button
            key={spot.id}
            ref={(el) => { buttons.current[i] = el; }}
            type="button"
            onClick={() => onChoose(spot.id)}
            aria-label={spot.label}
            aria-pressed={chosen === spot.id}
            style={{ visibility: 'hidden' }}
            className={`hotspot hit-slim ${MARKER}`}
          />
        ))}
      </div>
    </>
  );
}
