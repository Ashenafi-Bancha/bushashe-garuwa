import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import type { Tier } from '../device';

type Props = {
  tier: Exclude<Tier, 'none'>;
  /** The 360° photograph; without one a drawn stand-in is shown */
  image?: string;
  /** Written on the stand-in */
  name: string;
  needed: string;
};

/** A stand-in for a missing 360° photo: sky, ground, compass lines and a clear note */
function standIn(name: string, needed: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const pen = canvas.getContext('2d')!;
  const sky = pen.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, '#5FA4DC');
  sky.addColorStop(1, '#E4F0F2');
  pen.fillStyle = sky;
  pen.fillRect(0, 0, 2048, 512);
  const ground = pen.createLinearGradient(0, 512, 0, 1024);
  ground.addColorStop(0, '#A9CC78');
  ground.addColorStop(1, '#4F8A3A');
  pen.fillStyle = ground;
  pen.fillRect(0, 512, 2048, 512);
  // lines every 45°, so turning is easy to see
  pen.strokeStyle = 'rgba(30, 58, 41, 0.28)';
  pen.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    pen.beginPath();
    pen.moveTo(i * 256, 0);
    pen.lineTo(i * 256, 1024);
    pen.stroke();
  }
  pen.beginPath();
  pen.moveTo(0, 512);
  pen.lineTo(2048, 512);
  pen.stroke();
  pen.textAlign = 'center';
  pen.fillStyle = '#13261A';
  for (let i = 0; i < 4; i++) {
    const x = 256 + i * 512;
    pen.font = '800 30px system-ui, sans-serif';
    pen.fillText(needed, x, 452);
    pen.font = '600 24px system-ui, sans-serif';
    pen.fillText(name, x, 492);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** One 360° picture seen from its middle. Drag to look in any direction. */
export default function PanoramaScene({ tier, image, name, needed }: Props) {
  const [picture, setPicture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let current: THREE.Texture | null = null;
    let gone = false;
    const show = (texture: THREE.Texture) => {
      if (gone) return texture.dispose();
      current = texture;
      setPicture(texture);
    };
    if (image) {
      new THREE.TextureLoader().load(
        image,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          show(texture);
        },
        undefined,
        () => show(standIn(name, needed)),
      );
    } else {
      show(standIn(name, needed));
    }
    return () => {
      gone = true;
      current?.dispose();
    };
  }, [image, name, needed]);

  return (
    <Canvas flat dpr={Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.5)} frameloop="demand" camera={{ position: [0, 0, 0.01], fov: 72 }}>
      {picture && (
        // seen from inside, so the picture is mirrored back the right way round
        <mesh scale={[-1, 1, 1]}>
          <sphereGeometry args={[50, 48, 32]} />
          <meshBasicMaterial key={picture.uuid} map={picture} side={THREE.BackSide} />
        </mesh>
      )}
      <OrbitControls enablePan={false} enableZoom={false} enableDamping rotateSpeed={-0.4} />
    </Canvas>
  );
}
