'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface InternalPearlyProps {
  index: number;
  mesh: THREE.Mesh;
  pastelColor: string;
  speed?: number;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

/**
 * SinglePearlyShape — Renders one specific mesh with a premium Pastel finish.
 */
function SinglePearlyShape({ index, mesh, pastelColor, speed = 1, ...props }: InternalPearlyProps) {
  const groupRef = useRef<THREE.Group>(null);

  const pearlyMesh = useMemo(() => {
    const clone = mesh.clone();
    clone.geometry = mesh.geometry.clone();
    clone.geometry.center(); 
    clone.geometry.computeBoundingSphere();
    const radius = clone.geometry.boundingSphere?.radius || 1;
    clone.scale.setScalar(1 / radius);

    clone.material = new THREE.MeshPhysicalMaterial({
      color: pastelColor,
      metalness: 0,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      iridescence: 1,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [200, 500],
      sheen: 1,
      sheenColor: '#ffffff',
    });
    
    return clone;
  }, [mesh, pastelColor]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y += Math.sin(t * 0.15 + index) * 0.0015;
      groupRef.current.rotation.x -= 0.002 * speed;
      groupRef.current.rotation.z += 0.001 * speed;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={pearlyMesh} />
    </group>
  );
}

/**
 * PearlyShapes — Renders unique glossy shapes with DETERMINISTIC layout.
 */
export function PearlyShapes() {
  const { scene } = useGLTF('models/glossy_shapes.glb');
  
  const uniqueMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && meshes.length < 8) {
        if (!meshes.find(m => m.name.substring(0, 5) === child.name.substring(0, 5))) {
          meshes.push(child as THREE.Mesh);
        }
      }
    });
    return meshes;
  }, [scene]);

  const shapes = useMemo(() => {
    const pastelPalette = [
      '#FFD1DC', '#B2E2F2', '#C1E1C1', '#DCD0FF', '#FFF9B1', '#FFB7B2', '#E2F0CB',
    ];

    const startY = 14; 
    const spacing = 18;

    return uniqueMeshes.map((mesh, i) => {
      const leftRight = [-1, 1, -1, -1, 1, 1, -1, 1];
      const side = leftRight[i % leftRight.length];
      
      const xPos = (24 + (i * 2) % 8) * side; 
      const yPos = startY - (i * spacing); 
      const zPos = -22; 
      
      const sizes = [2.2, 4.2, 1.8, 5.0, 2.8, 3.5, 1.5, 4.0];
      const scale = sizes[i % sizes.length];
      
      return {
        id: mesh.uuid + i,
        mesh,
        pastelColor: pastelPalette[i % pastelPalette.length],
        position: [xPos, yPos, zPos] as [number, number, number],
        scale: scale, 
        speed: 0.3 + (i * 0.05),
        rotation: [(i * 2), (i * 1.2), (i * 3)] as [number, number, number]
      };
    });
  }, [uniqueMeshes]);

  if (uniqueMeshes.length === 0) return null;

  return (
    <group>
      {shapes.map((s) => (
        <SinglePearlyShape 
          key={s.id} 
          index={0} 
          mesh={s.mesh}
          pastelColor={s.pastelColor}
          position={s.position} 
          scale={s.scale} 
          speed={s.speed}
          rotation={s.rotation}
        />
      ))}
    </group>
  );
}

useGLTF.preload('models/glossy_shapes.glb');
