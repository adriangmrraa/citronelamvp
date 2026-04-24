'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ================================================================
   MOUSE TRACKER — Shared mouse position for interactive elements
   ================================================================ */
function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 });
  return mouse;
}

function MouseTracker({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const { viewport } = useThree();
  useFrame(({ pointer }) => {
    mouseRef.current.x = (pointer.x * viewport.width) / 2;
    mouseRef.current.y = (pointer.y * viewport.height) / 2;
  });
  return null;
}

/* ================================================================
   CANNABIS BUD — Large realistic organic shape
   ================================================================ */
function CannabisBud({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  mouseRef,
  mouseInfluence = 0.3,
}: {
  position?: [number, number, number];
  scale?: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  mouseInfluence?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Base rotation + mouse influence
    groupRef.current.rotation.y = t * 0.08 + mouseRef.current.x * mouseInfluence * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.12 + mouseRef.current.y * mouseInfluence * 0.08;
    // Gentle drift toward mouse
    groupRef.current.position.x = position[0] + mouseRef.current.x * mouseInfluence * 0.15;
    groupRef.current.position.y = position[1] + mouseRef.current.y * mouseInfluence * 0.1;
  });

  const calyxPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < 14; i++) {
      const phi = Math.acos(-1 + (2 * i) / 14);
      const theta = Math.sqrt(14 * Math.PI) * phi;
      pos.push([
        Math.cos(theta) * Math.sin(phi) * 0.55,
        Math.sin(theta) * Math.sin(phi) * 0.55,
        Math.cos(phi) * 0.45,
      ]);
    }
    return pos;
  }, []);

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial color="#2d5a1e" emissive="#1a3a0a" emissiveIntensity={0.35} roughness={0.65} metalness={0.1} distort={0.35} speed={1.5} />
        </mesh>
        {calyxPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.15 + Math.random() * 0.1, 12, 12]} />
            <MeshDistortMaterial
              color={['#4a7c2a', '#3d6b1f', '#558b2f', '#4c8030'][i % 4]}
              emissive="#2e5a16" emissiveIntensity={0.25} roughness={0.55} metalness={0.15} distort={0.2} speed={1.8 + i * 0.05}
            />
          </mesh>
        ))}
        {/* Pistils */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={`p-${i}`} position={[Math.cos(a) * 0.5, 0.35 + Math.sin(a * 2) * 0.2, Math.sin(a) * 0.5]} rotation={[Math.random(), a, Math.random() * 0.5]}>
              <cylinderGeometry args={[0.006, 0.012, 0.2, 4]} />
              <meshStandardMaterial color="#c2592a" emissive="#a0461e" emissiveIntensity={0.6} roughness={0.3} />
            </mesh>
          );
        })}
        {/* Trichome shimmer */}
        <mesh scale={1.1}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.04} roughness={0} metalness={1} />
        </mesh>
      </group>
    </Float>
  );
}

/* ================================================================
   CANNABIS LEAF 3D
   ================================================================ */
function CannabisLeaf({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  mouseRef,
  mouseInfluence = 0.2,
}: {
  position?: [number, number, number];
  scale?: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  mouseInfluence?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.bezierCurveTo(0.15, 0.5, 0.12, 1.2, 0, 1.8);
    shape.bezierCurveTo(-0.12, 1.2, -0.15, 0.5, 0, -0.2);
    return shape;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.1 + mouseRef.current.x * mouseInfluence * 0.12;
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.1;
    groupRef.current.position.x = position[0] + mouseRef.current.x * mouseInfluence * 0.1;
    groupRef.current.position.y = position[1] + mouseRef.current.y * mouseInfluence * 0.08;
  });

  const blades = [-0.7, -0.35, 0, 0.35, 0.7];
  const scales = [0.5, 0.75, 1, 0.75, 0.5];

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        {blades.map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]} scale={[scales[i], scales[i], 1]} position={[Math.sin(angle) * 0.3, Math.cos(angle) * 0.15, 0]}>
            <extrudeGeometry args={[leafShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.02, bevelSegments: 3 }]} />
            <MeshDistortMaterial color="#65a30d" emissive="#365314" emissiveIntensity={0.4} roughness={0.4} metalness={0.2} distort={0.15} speed={2} />
          </mesh>
        ))}
        <mesh position={[0, -0.6, 0.02]}>
          <cylinderGeometry args={[0.03, 0.04, 1, 8]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

/* ================================================================
   TRICHOME PARTICLES
   ================================================================ */
function TrichomeParticles({ count = 80, mouseRef }: { count?: number; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10] as [number, number, number],
        speed: 0.12 + Math.random() * 0.35,
        offset: Math.random() * Math.PI * 2,
        scale: 0.012 + Math.random() * 0.035,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const mx = mouseRef.current.x * 0.05;
    const my = mouseRef.current.y * 0.05;

    particles.forEach((p, i) => {
      const t = state.clock.elapsedTime * p.speed + p.offset;
      dummy.position.set(
        p.position[0] + Math.sin(t) * 0.5 + mx,
        p.position[1] + Math.cos(t * 0.7) * 0.6 + my,
        p.position[2] + Math.sin(t * 0.5) * 0.3
      );
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 3) * 0.4));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#d4e88e" emissive="#a3e635" emissiveIntensity={1.2} transparent opacity={0.65} roughness={0} metalness={0.9} />
    </instancedMesh>
  );
}

/* ================================================================
   GLOW ORB
   ================================================================ */
function GlowOrb({ position, color, size = 0.8 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(size + Math.sin(state.clock.elapsedTime * 0.6) * 0.2);
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.08} />
    </mesh>
  );
}

/* ================================================================
   SCENE: Hero — large objects, depth, mouse interaction
   ================================================================ */
export function HeroScene({ className = '' }: { className?: string }) {
  const mouseRef = useMousePosition();

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <MouseTracker mouseRef={mouseRef} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#a3e635" />
        <pointLight position={[-5, 3, 4]} intensity={0.4} color="#22c55e" />
        <pointLight position={[4, -3, 3]} intensity={0.25} color="#facc15" />
        <spotLight position={[0, 6, 6]} angle={0.35} penumbra={1} intensity={0.4} color="#a3e635" />

        {/* LARGE bud — partially visible, top-right */}
        <CannabisBud position={[4.5, 3, -6]} scale={3} mouseRef={mouseRef} mouseInfluence={0.15} />

        {/* Medium leaf — left side */}
        <CannabisLeaf position={[-3.5, -0.5, -2]} scale={1.6} mouseRef={mouseRef} mouseInfluence={0.3} />

        {/* Small bud — bottom left */}
        <CannabisBud position={[-2, -3, -1]} scale={0.7} mouseRef={mouseRef} mouseInfluence={0.5} />

        <TrichomeParticles count={40} mouseRef={mouseRef} />

        <GlowOrb position={[-4, 3, -5]} color="#a3e635" size={2} />
        <GlowOrb position={[5, -2, -6]} color="#22c55e" size={1.8} />
        <GlowOrb position={[0, -4, -3]} color="#facc15" size={1} />
      </Canvas>
    </div>
  );
}

/* ================================================================
   SCENE: Showcase — background depth for horizontal section
   ================================================================ */
export function ShowcaseScene({ className = '' }: { className?: string }) {
  const mouseRef = useMousePosition();

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 10], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <MouseTracker mouseRef={mouseRef} />

        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 4, 5]} intensity={0.5} color="#22c55e" />
        <pointLight position={[-6, 0, 3]} intensity={0.3} color="#a3e635" />

        {/* HUGE bud — top-left, mostly off-screen */}
        <CannabisBud position={[-6, 4, -8]} scale={5} mouseRef={mouseRef} mouseInfluence={0.08} />

        {/* Large leaf — bottom-right, partially visible */}
        <CannabisLeaf position={[5, -4, -5]} scale={3} mouseRef={mouseRef} mouseInfluence={0.1} />

        {/* Medium bud — center-right */}
        <CannabisBud position={[4, 1, -4]} scale={1.2} mouseRef={mouseRef} mouseInfluence={0.2} />

        {/* Small leaf floating */}
        <CannabisLeaf position={[-2, -1, -2]} scale={0.9} mouseRef={mouseRef} mouseInfluence={0.35} />

        <TrichomeParticles count={50} mouseRef={mouseRef} />

        <GlowOrb position={[-5, 0, -7]} color="#22c55e" size={2.5} />
        <GlowOrb position={[5, 2, -6]} color="#a3e635" size={2} />
      </Canvas>
    </div>
  );
}

export default HeroScene;
