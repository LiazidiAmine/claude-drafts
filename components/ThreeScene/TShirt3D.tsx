'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';
import { TShirtColor } from '@/types';
import { TSHIRT_COLORS } from '@/lib/constants';

interface TShirt3DProps {
  color: TShirtColor;
  showFront?: boolean;
}

export function TShirt3D({ color, showFront = true }: TShirt3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Get color hex value
  const colorHex = TSHIRT_COLORS.find((c) => c.value === color)?.hex || '#FFFFFF';

  // Auto-rotate to show front or back
  useFrame(() => {
    if (groupRef.current) {
      const targetRotation = showFront ? 0 : Math.PI;
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body - using cylinder for more realistic curve */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.3, 2.5, 32]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Front panel overlay for flatness */}
      <mesh position={[0, 0, 1.15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 2.3]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Back panel */}
      <mesh position={[0, 0, -1.15]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 2.3]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Left sleeve */}
      <group position={[-1.3, 0.7, 0]}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
          <meshStandardMaterial
            color={colorHex}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Right sleeve */}
      <group position={[1.3, 0.7, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
          <meshStandardMaterial
            color={colorHex}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Collar/Neck */}
      <mesh position={[0, 1.25, 0]}>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Neck opening */}
      <mesh position={[0, 1.2, 0.05]} rotation={[Math.PI / 12, 0, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#f0f0f0' : '#2a2a2a'}
          roughness={0.9}
        />
      </mesh>

      {/* Bottom hem - slight curve */}
      <mesh position={[0, -1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.05, 8, 32]} />
        <meshStandardMaterial
          color={colorHex}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle seam lines for realism */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(1.2, 1.3, 2.5, 32)]} />
        <lineBasicMaterial color="#00000020" />
      </lineSegments>
    </group>
  );
}
