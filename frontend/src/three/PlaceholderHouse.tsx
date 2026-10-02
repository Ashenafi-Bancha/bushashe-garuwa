import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * PLACEHOLDER MODEL. A simple stand-in for a traditional thatched house, shaped
 * after the photograph of Meeshsho Keettaa: a round wall and a tall domed thatch
 * roof. It carries no cultural detail of its own and is to be replaced by a
 * scanned model of the real house (.glb) when one is ready.
 */

/** Straw running down the roof */
function thatchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const pen = canvas.getContext('2d')!;
  pen.fillStyle = '#A38E69';
  pen.fillRect(0, 0, 256, 256);
  let n = 11;
  const random = () => ((n = (n * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 900; i++) {
    pen.strokeStyle = ['#B9A680', '#8C7856', '#C6B48D', '#7C6A4C'][i % 4]!;
    pen.globalAlpha = 0.25 + random() * 0.4;
    pen.lineWidth = 1 + random() * 1.5;
    const x = random() * 256;
    const y = random() * 256;
    pen.beginPath();
    pen.moveTo(x, y);
    pen.lineTo(x + (random() - 0.5) * 5, y + 14 + random() * 30);
    pen.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 1.6);
  return texture;
}

/** The wall: rows of bound straw between dark upright posts */
function wallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const pen = canvas.getContext('2d')!;
  pen.fillStyle = '#B79D6C';
  pen.fillRect(0, 0, 512, 64);
  pen.fillStyle = 'rgba(96, 76, 44, 0.55)';
  for (let y = 6; y < 64; y += 8) pen.fillRect(0, y, 512, 2);
  pen.fillStyle = '#2C2620';
  for (let i = 0; i < 14; i++) pen.fillRect(i * (512 / 14) + 6, 0, 4, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/** A soft round shadow on the grass */
function shadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const pen = canvas.getContext('2d')!;
  const fade = pen.createRadialGradient(64, 64, 20, 64, 64, 64);
  fade.addColorStop(0, 'rgba(0,0,0,0.42)');
  fade.addColorStop(1, 'rgba(0,0,0,0)');
  pen.fillStyle = fade;
  pen.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

type Props = {
  position?: [number, number, number];
  /** 1 is the large house: about 7.5 across and 5.5 tall */
  size?: number;
  /** Which way the door faces, in radians (0 = toward the viewer) */
  turn?: number;
};

export default function PlaceholderHouse({ position = [0, 0, 0], size = 1, turn = 0 }: Props) {
  const parts = useMemo(() => {
    // the roof: a tall dome that spreads past the wall
    const outline: THREE.Vector2[] = [new THREE.Vector2(3, 1.5)];
    for (let i = 0; i <= 16; i++) {
      const radius = 3.8 * (1 - i / 16);
      outline.push(new THREE.Vector2(radius, 1.32 + 4.1 * (1 - Math.pow(radius / 3.8, 1.7))));
    }
    const thatch = thatchTexture();
    const wall = wallTexture();
    const shadow = shadowTexture();
    return {
      roof: new THREE.LatheGeometry(outline, 40),
      thatch,
      wall,
      shadow,
    };
  }, []);

  useEffect(
    () => () => {
      parts.roof.dispose();
      parts.thatch.dispose();
      parts.wall.dispose();
      parts.shadow.dispose();
    },
    [parts],
  );

  return (
    <group position={position} rotation={[0, turn, 0]} scale={size}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[5.4, 32]} />
        <meshBasicMaterial map={parts.shadow} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[3, 3, 1.5, 40, 1, true]} />
        <meshLambertMaterial map={parts.wall} />
      </mesh>
      <mesh geometry={parts.roof}>
        <meshLambertMaterial map={parts.thatch} side={THREE.DoubleSide} />
      </mesh>
      {/* the door */}
      <mesh position={[0, 0.68, 3]}>
        <boxGeometry args={[1.05, 1.36, 0.16]} />
        <meshLambertMaterial color="#B5772F" />
      </mesh>
      {/* the tip of the roof */}
      <mesh position={[0, 5.62, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 0.5, 8]} />
        <meshLambertMaterial color="#3A2E25" />
      </mesh>
      <mesh position={[0, 5.9, 0]}>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshLambertMaterial color="#3A2E25" />
      </mesh>
    </group>
  );
}
