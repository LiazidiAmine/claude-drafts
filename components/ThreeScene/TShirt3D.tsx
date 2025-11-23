'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, DoubleSide } from 'three';
import { TShirtColor } from '@/types';
import { TSHIRT_COLORS } from '@/lib/constants';

interface TShirt3DProps {
  color: TShirtColor;
  showFront?: boolean;
}

export function TShirt3D({ color, showFront = true }: TShirt3DProps) {
  const meshRef = useRef<Mesh>(null);

  // Get color hex value
  const colorHex = TSHIRT_COLORS.find((c) => c.value === color)?.hex || '#FFFFFF';

  // Auto-rotate slightly for better view
  useFrame(() => {
    if (meshRef.current) {
      // Rotate to show front or back
      meshRef.current.rotation.y = showFront ? 0 : Math.PI;
    }
  });

  return (
    <group ref={meshRef}>
      {/* T-shirt body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial color={colorHex} side={DoubleSide} />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-1.2, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color={colorHex} side={DoubleSide} />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[1.2, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color={colorHex} side={DoubleSide} />
      </mesh>

      {/* Neck opening */}
      <mesh position={[0, 1.3, 0]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#333333" side={DoubleSide} />
      </mesh>
    </group>
  );
}
