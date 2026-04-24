'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
   SCENE: Hero — large objects, depth, mouse interaction
   ================================================================ */
export function HeroScene({ className = '' }: { className?: string }) {
  const mouseRef = useMousePosition();

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <MouseTracker mouseRef={mouseRef} />

        <ambientLight intensity={0.3} />
        <pointLight position={[-5, 3, 4]} intensity={0.4} color="#22c55e" />
        <pointLight position={[4, -3, 3]} intensity={0.25} color="#facc15" />

        <TrichomeParticles count={60} mouseRef={mouseRef} />
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

        <ambientLight intensity={0.2} />
        <pointLight position={[-6, 0, 3]} intensity={0.3} color="#a3e635" />

        <TrichomeParticles count={50} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}

export default HeroScene;
