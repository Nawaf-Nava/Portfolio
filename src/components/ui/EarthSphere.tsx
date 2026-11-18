"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector3, CatmullRomCurve3, TubeGeometry, type Mesh } from "three";

const EARTH_TEXTURE =
  "https://upload.wikimedia.org/wikipedia/commons/b/b3/Solarsystemscope_texture_8k_earth_nightmap.jpg";

const RADIUS = 2.05;

function pointOnGlobe(latitude: number, longitude: number, radius = RADIUS * 1.012) {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  return new Vector3(
    -radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  );
}

const NETWORK_LINKS = [
  [[38, -105], [48, -35], [51, 10]],
  [[35, 15], [18, 75], [28, 125]],
  [[-24, 135], [-5, 95], [18, 55]],
  [[5, -75], [22, -35], [38, 10]],
] as const;

function DataArc({
  coordinates,
  color,
  phase,
}: {
  coordinates: readonly (readonly [number, number])[];
  color: string;
  phase: number;
}) {
  const pulseRef = useRef<Mesh>(null);
  const curve = useMemo(
    () => new CatmullRomCurve3(coordinates.map(([lat, lon]) => pointOnGlobe(lat, lon))),
    [coordinates],
  );
  const geometry = useMemo(() => new TubeGeometry(curve, 72, 0.008, 6, false), [curve]);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = (clock.elapsedTime * 0.075 + phase) % 1;
      pulseRef.current.position.copy(curve.getPointAt(t));
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} transparent opacity={0.72} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.027, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {coordinates.map(([lat, lon], index) => (
        <mesh key={index} position={pointOnGlobe(lat, lon)}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RotatingEarth() {
  const earthRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, EARTH_TEXTURE);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.045;
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[RADIUS, 128, 128]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <DataArc coordinates={NETWORK_LINKS[0]} color="#278dff" phase={0} />
      <DataArc coordinates={NETWORK_LINKS[1]} color="#ff3b4f" phase={0.28} />
      <DataArc coordinates={NETWORK_LINKS[2]} color="#278dff" phase={0.56} />
      <DataArc coordinates={NETWORK_LINKS[3]} color="#ff3b4f" phase={0.78} />
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
        <Suspense fallback={null}>
          <RotatingEarth />
        </Suspense>
      </Canvas>
    </div>
  );
}
