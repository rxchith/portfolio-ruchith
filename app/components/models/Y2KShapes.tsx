'use client';

import { getPath } from "../../utils/getPath";
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { isMobile } from "react-device-detect";

interface InternalShapeProps {
  index: number;
  mesh: THREE.Mesh;
  speed?: number;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

/**
 * SingleY2KShape — Renders one specific mesh with premium Chrome styling.
 */
export function SingleY2KShape({ index, mesh, speed = 1, ...props }: InternalShapeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const clonedMesh = useMemo(() => {
    const clone = mesh.clone();
    clone.geometry = mesh.geometry.clone();
    clone.geometry.center(); 
    clone.geometry.computeBoundingSphere();
    const radius = clone.geometry.boundingSphere?.radius || 1;
    clone.scale.setScalar(1 / radius);

    clone.material = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 2.5,
      clearcoat: 1,
    });
    
    return clone;
  }, [mesh]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y += Math.sin(t * 0.2 + index) * 0.001;
      groupRef.current.rotation.x += 0.003 * speed;
      groupRef.current.rotation.y += 0.002 * speed;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={clonedMesh} />
    </group>
  );
}

/**
 * ScatteredShapes — Spreads unique shapes with DETERMINISTIC layout for full control.
 */
export function ScatteredShapes() {
  const { scene } = useGLTF(getPath('models/y2k_shapes.glb'));
  
  const uniqueMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && meshes.length < 10) {
        if (!meshes.find(m => m.name.substring(0, 5) === child.name.substring(0, 5))) {
          meshes.push(child as THREE.Mesh);
        }
      }
    });
    return meshes;
  }, [scene]);

  const shapes = useMemo(() => {
    return uniqueMeshes
      .filter((_, i) => !isMobile || i < 5) // Reduce density on mobile
      .map((mesh, i) => {
        const sides = [1, -1, 1, 1, -1, -1, 1, -1];
        const side = sides[i % sides.length];
        
        // Pushed further out on mobile to clear vertical center
        const xPos = (isMobile ? 12 : 32 + (i * 5)) * side; 
        const yPos = 25 - (i * 12); 
        const zPos = -30 - (i % 2) * 15; 
        
        const sizes = [3.5, 5.0, 3.0, 6.5, 4.0, 5.5, 3.2, 4.5];
        const scale = sizes[i % sizes.length] * (isMobile ? 0.5 : 0.8);

        return {
          id: mesh.uuid + i,
          mesh,
          position: [xPos, yPos, zPos] as [number, number, number],
          scale: scale, 
          speed: 0.4 + (i * 0.1),
          rotation: [(i * 1.5), (i * 2.2), (i * 0.8)] as [number, number, number]
        };
      });
  }, [uniqueMeshes]);



  if (uniqueMeshes.length === 0) return null;

  return (
    <group>
      {shapes.map((s) => (
        <SingleY2KShape 
          key={s.id} 
          index={0}
          mesh={s.mesh}
          position={s.position} 
          scale={s.scale} 
          speed={s.speed}
          rotation={s.rotation}
        />
      ))}
    </group>
  );
}

useGLTF.preload(getPath('models/y2k_shapes.glb'));
