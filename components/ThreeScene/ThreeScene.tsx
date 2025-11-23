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
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights - optimized for PBR fabric rendering */}
        <ambientLight intensity={0.4} />

        {/* Main key light - simulates sunlight/studio light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Fill light - softens shadows */}
        <directionalLight
          position={[-3, 3, -5]}
          intensity={0.5}
        />

        {/* Rim light - highlights edges for depth */}
        <directionalLight
          position={[0, -2, -5]}
          intensity={0.3}
          color="#b8d4ff"
        />

        {/* Hemisphere light for realistic ambient */}
        <hemisphereLight
          args={['#ffffff', '#444444', 0.35]}
        />

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
