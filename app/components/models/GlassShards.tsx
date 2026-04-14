'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * GlassShards — Premium floating geometric glass fragments
 * Replaces CloudContainer for the "Fractal Glass" aesthetic.
 * Each shard is a thin, translucent geometry with subtle edge wireframes
 * that slowly drifts, rotates, and reacts to scroll position.
 */

interface ShardConfig {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  phase: number;
  depth: number;
  opacity: number;
  emissive: number;
}

const SHARD_DATA: Omit<ShardConfig, 'speed' | 'phase' | 'depth' | 'opacity' | 'emissive'>[] = [
  // Large background shards
  { width: 6,  height: 1.8, position: [-5,  3,  -12], rotation: [0.3,  0.8,  0.1]  },
  { width: 7,  height: 2.2, position: [ 4, -2,  -15], rotation: [-0.2, -0.7, 0.15] },
  { width: 5,  height: 1.5, position: [ 0,  0.5,-10], rotation: [0.4,  0.5,  -0.1] },
  // Medium mid-ground shards
  { width: 4,  height: 1.1, position: [-3,  2.5, -6], rotation: [-0.35, 0.6, 0.2]  },
  { width: 3.5,height: 1.0, position: [ 3.5,-1, -5],  rotation: [0.5, -0.45, 0.1]  },
  { width: 4.5,height: 1.2, position: [-1.5,-3, -8],  rotation: [0.2,  0.35,-0.15] },
  // Small foreground accents
  { width: 2.5,height: 0.7, position: [ 2.5, 2, -3],  rotation: [-0.4, 0.5, 0.3]   },
  { width: 2,  height: 0.6, position: [-3.5,-0.5,-2],  rotation: [0.6, -0.3, -0.2]  },
  { width: 1.8,height: 0.5, position: [ 1.5,-2.5,-1.5],rotation: [-0.5, 0.65,0.25]  },
  // Extra accent shards
  { width: 3,  height: 0.9, position: [-1,  1.5, -4],  rotation: [0.3, -0.5, 0.1]   },
  { width: 2.8,height: 0.8, position: [ 2,  3,   -5],  rotation: [-0.25,0.4,-0.1]   },
  { width: 2.2,height: 0.6, position: [-2.5,-2,  -3],  rotation: [0.45, 0.35,0.2]   },
];

const GlassShard = ({ config }: { config: ShardConfig }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle floating + rotation
    meshRef.current.rotation.x += 0.0004 * config.speed;
    meshRef.current.rotation.y += 0.0006 * config.speed;
    meshRef.current.position.y =
      config.position[1] + Math.sin(t * 0.3 * config.speed + config.phase) * 0.15;
  });

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      rotation={config.rotation}
    >
      <boxGeometry args={[config.width, config.height, 0.02]} />
      <meshPhysicalMaterial
        color="#ff3b30"
        metalness={0.6}
        roughness={0.05}
        transparent
        opacity={config.opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        emissive="#ff1111"
        emissiveIntensity={config.emissive}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={2}
        ior={2.33}
        transmission={0.2}
        thickness={0.5}
      />
      {/* Red wireframe edge for that crisp glass shard look */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(config.width, config.height, 0.02)]}
        />
        <lineBasicMaterial color="#ff3b30" transparent opacity={0.25} />
      </lineSegments>
    </mesh>
  );
};

const GlassShards = () => {
  const groupRef = useRef<THREE.Group>(null);

  const shards = useMemo<ShardConfig[]>(() => {
    return SHARD_DATA.map((data) => ({
      ...data,
      speed: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      depth: Math.abs(data.position[2]) / 15,
      opacity: 0.04 + Math.random() * 0.1,
      emissive: 0.02 + Math.random() * 0.05,
    }));
  }, []);

  return (
    <group ref={groupRef} position={[0, -5, 0]}>
      {shards.map((shard, i) => (
        <GlassShard key={i} config={shard} />
      ))}
    </group>
  );
};

export default GlassShards;
