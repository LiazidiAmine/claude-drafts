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

  // Fabric material properties for realistic cloth rendering
  const fabricMaterial = {
    color: colorHex,
    roughness: 0.95, // High roughness for cotton/fabric texture
    metalness: 0, // No metallic properties for fabric
    sheen: 0.5, // Fabric sheen effect
    sheenRoughness: 0.8,
    sheenColor: '#ffffff',
    clearcoat: 0, // No glossy coating for fabric
  };

  return (
    <group ref={groupRef}>
      {/* Main body - torso with subtle curve */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.8, 0.4]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Front chest curve for 3D depth */}
      <mesh position={[0, 0.3, 0.25]} castShadow>
        <sphereGeometry args={[1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Back panel slight curve */}
      <mesh position={[0, 0.3, -0.25]} rotation={[0, Math.PI, 0]} castShadow>
        <sphereGeometry args={[1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Left shoulder/sleeve connection */}
      <mesh position={[-1.2, 0.8, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 16, 32]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Right shoulder/sleeve connection */}
      <mesh position={[1.2, 0.8, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 16, 32]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-1.5, 0.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.9, 24]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.9, 24]} />
        <meshPhysicalMaterial {...fabricMaterial} />
      </mesh>

      {/* Collar - crew neck style */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <torusGeometry args={[0.35, 0.1, 16, 32, Math.PI * 1.8]} />
        <meshPhysicalMaterial
          {...fabricMaterial}
          roughness={0.98} // Slightly rougher for collar ribbing
        />
      </mesh>

      {/* Neck opening shadow */}
      <mesh position={[0, 1.35, 0.05]} rotation={[Math.PI / 12, 0, 0]}>
        <circleGeometry args={[0.32, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Bottom hem with slight wave */}
      <mesh position={[0, -1.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.1, 0.06, 12, 32]} />
        <meshPhysicalMaterial
          {...fabricMaterial}
          roughness={0.98}
        />
      </mesh>

      {/* Side seams for detail */}
      <mesh position={[-1.1, 0, 0.01]}>
        <boxGeometry args={[0.02, 2.6, 0.38]} />
        <meshBasicMaterial color="#00000015" transparent />
      </mesh>
      <mesh position={[1.1, 0, 0.01]}>
        <boxGeometry args={[0.02, 2.6, 0.38]} />
        <meshBasicMaterial color="#00000015" transparent />
      </mesh>

      {/* Shoulder seams */}
      <mesh position={[-0.6, 1.3, 0.01]}>
        <boxGeometry args={[1.2, 0.02, 0.38]} />
        <meshBasicMaterial color="#00000015" transparent />
      </mesh>
      <mesh position={[0.6, 1.3, 0.01]}>
        <boxGeometry args={[1.2, 0.02, 0.38]} />
        <meshBasicMaterial color="#00000015" transparent />
      </mesh>
    </group>
  );
}
