"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  TextureLoader,
  SRGBColorSpace,
  Vector3,
  type Texture,
  CatmullRomCurve3,
  TubeGeometry,
  type Group,
  type Mesh,
} from "three";

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

const RADIUS = 1.82;

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
  const geometry = useMemo(() => new TubeGeometry(curve, 36, 0.007, 4, false), [curve]);

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
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {coordinates.map(([lat, lon], index) => (
        <mesh key={index} position={pointOnGlobe(lat, lon)}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RotatingEarth() {
  const globeRef = useRef<Group>(null);
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    const loadedTexture = loader.load(
      EARTH_TEXTURE,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = SRGBColorSpace;
        setTexture(loaded);
      },
      undefined,
      () => {
        if (!cancelled) setTexture(null);
      },
    );

    return () => {
      cancelled = true;
      loadedTexture.dispose();
    };
  }, []);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += Math.min(delta, 0.05) * 0.035;
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[RADIUS, 72, 72]} />
        <meshBasicMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#0b4c82"} toneMapped={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[RADIUS * 1.006, 24, 16]} />
        <meshBasicMaterial
          color="#45cfff"
          wireframe
          transparent
          opacity={0.065}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[RADIUS * 1.022, 48, 48]} />
        <meshBasicMaterial
          color="#168dff"
          wireframe
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </mesh>

      <DataArc coordinates={NETWORK_LINKS[0]} color="#278dff" phase={0} />
      <DataArc coordinates={NETWORK_LINKS[1]} color="#ff3b4f" phase={0.34} />
      <DataArc coordinates={NETWORK_LINKS[2]} color="#278dff" phase={0.68} />
    </group>
  );
}

class EarthErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Keep a graphics failure isolated from the rest of the portfolio.
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function EarthSphere() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <EarthErrorBoundary>
        <Canvas
          className="!absolute !inset-0 !h-full !w-full"
          camera={{ position: [0, 0, 6.2], fov: 38 }}
          dpr={1}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
            stencil: false,
            depth: true,
          }}
          fallback={null}
        >
          <RotatingEarth />
        </Canvas>
      </EarthErrorBoundary>
    </div>
  );
}
