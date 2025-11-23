'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TShirt3D } from './TShirt3D';
import { TShirtColor, PrintSide } from '@/types';

interface ThreeSceneProps {
  color: TShirtColor;
  currentSide: PrintSide;
}

export function ThreeScene({ color, currentSide }: ThreeSceneProps) {
  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg">
      <Canvas>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />

        {/* T-Shirt */}
        <TShirt3D color={color} showFront={currentSide === 'front'} />

        {/* Controls for rotation */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
