"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import type { Mesh } from "three";

const EARTH_TEXTURE = "/images/earth-photo.png";

function RotatingEarth() {
  const earthRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, EARTH_TEXTURE);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.075;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.05, 96, 96]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.025}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function EarthSphere() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[-3, 2, 5]} intensity={2.1} />
        <Suspense fallback={null}>
          <RotatingEarth />
        </Suspense>
      </Canvas>
    </div>
  );
}
