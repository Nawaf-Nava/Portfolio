"use client";

import { Component, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  SRGBColorSpace,
  Vector3,
  CatmullRomCurve3,
  TubeGeometry,
  type Mesh,
  type Group,
} from "three";


const RADIUS = 1.82;

// Build the map locally so the globe never depends on a third-party image host.
function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const ocean = ctx.createLinearGradient(0, 0, 0, 1024);
  ocean.addColorStop(0, "#123d70");
  ocean.addColorStop(0.5, "#071d3d");
  ocean.addColorStop(1, "#10345d");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 2048, 1024);

  // Fine ocean contours and latitude/longitude guides.
  ctx.strokeStyle = "rgba(72, 178, 255, 0.13)";
  ctx.lineWidth = 2;
  for (let y = 64; y < 1024; y += 128) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke();
  }
  for (let x = 64; x < 2048; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
  }

  const continents: number[][][] = [
    [[0.035,0.18],[0.075,0.10],[0.13,0.08],[0.17,0.13],[0.19,0.20],[0.16,0.27],[0.14,0.34],[0.12,0.43],[0.10,0.48],[0.075,0.40],[0.06,0.31]],
    [[0.16,0.48],[0.20,0.50],[0.22,0.57],[0.21,0.66],[0.19,0.76],[0.17,0.86],[0.145,0.78],[0.14,0.66],[0.15,0.56]],
    [[0.36,0.16],[0.40,0.12],[0.44,0.14],[0.47,0.19],[0.46,0.25],[0.43,0.29],[0.40,0.27],[0.38,0.22]],
    [[0.40,0.30],[0.46,0.29],[0.49,0.35],[0.50,0.44],[0.48,0.54],[0.46,0.66],[0.43,0.78],[0.40,0.70],[0.39,0.57],[0.37,0.45]],
    [[0.49,0.19],[0.55,0.13],[0.64,0.12],[0.72,0.16],[0.79,0.18],[0.86,0.24],[0.91,0.30],[0.88,0.37],[0.82,0.38],[0.77,0.34],[0.72,0.39],[0.68,0.35],[0.64,0.42],[0.59,0.38],[0.55,0.31],[0.51,0.29]],
    [[0.58,0.42],[0.64,0.41],[0.68,0.47],[0.67,0.58],[0.64,0.68],[0.61,0.76],[0.58,0.68],[0.56,0.56]],
    [[0.78,0.56],[0.84,0.52],[0.90,0.55],[0.93,0.62],[0.90,0.69],[0.85,0.68],[0.81,0.63]],
    [[0.94,0.78],[0.98,0.76],[1.00,0.82],[0.98,0.89],[0.95,0.87]]
  ];

  const land = ctx.createLinearGradient(0, 120, 0, 900);
  land.addColorStop(0, "#78b77a");
  land.addColorStop(0.45, "#438b68");
  land.addColorStop(1, "#b1a16b");
  ctx.fillStyle = land;
  ctx.strokeStyle = "rgba(150, 222, 184, 0.75)";
  ctx.lineWidth = 5;
  continents.forEach((points) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      const px = x * 2048, py = y * 1024;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Polar ice caps.
  ctx.fillStyle = "rgba(205, 235, 245, 0.88)";
  ctx.fillRect(0, 0, 2048, 35);
  ctx.fillRect(0, 989, 2048, 35);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

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
  const texture = useMemo(() => createEarthTexture(), []);
  const globeRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.045;
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
