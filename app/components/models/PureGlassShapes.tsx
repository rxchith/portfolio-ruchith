'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface InternalGlassProps {
  index: number;
  mesh: THREE.Mesh;
  speed?: number;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

/**
 * SingleGlassShape — Renders one specific mesh with a high-end Glass finish.
 */
function SingleGlassShape({ index, mesh, speed = 1, ...props }: InternalGlassProps) {
  const groupRef = useRef<THREE.Group>(null);

  const glassMesh = useMemo(() => {
    const clone = mesh.clone();
    clone.geometry = mesh.geometry.clone();
    clone.geometry.center(); 
    clone.geometry.computeBoundingSphere();
    const radius = clone.geometry.boundingSphere?.radius || 1;
    clone.scale.setScalar(1 / radius);

    clone.material = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.1,
      transmission: 1, 
      thickness: 1.5,
      ior: 1.5,
      clearcoat: 1,
      envMapIntensity: 1.5,
      transparent: true,
    });
    
    return clone;
  }, [mesh]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y += Math.sin(t * 0.1 + index) * 0.001;
      groupRef.current.rotation.x += 0.002 * speed;
      groupRef.current.rotation.z -= 0.001 * speed;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={glassMesh} />
    </group>
  );
}

/**
 * PureGlassShapes — Renders unique shapes from two files with NO DUPLICATES and wide spacing.
 */
export function PureGlassShapes() {
  const envato = useGLTF('models/envato_shapes.glb');
  const glass = useGLTF('models/glass_shapes.glb');
  
  const uniqueMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    
    const extract = (scene: THREE.Group) => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && meshes.length < 12) {
          if (!meshes.find(m => m.name.substring(0, 5) === child.name.substring(0, 5))) {
            meshes.push(child as THREE.Mesh);
          }
        }
      });
    };

    extract(envato.scene);
    extract(glass.scene);
    return meshes;
  }, [envato, glass]);

  const shapes = useMemo(() => {
    const startY = 8; 
    const spacing = 18;

    return uniqueMeshes.map((mesh, i) => {
      const leftRight = [1, -1, 1, 1, -1, -1, 1, -1];
      const side = leftRight[i % leftRight.length];
      
      const xPos = (36 + (i * 2) % 12) * side; 
      const yPos = startY - (i * spacing); 
      const zPos = -28; 
      
      const sizes = [1.8, 3.5, 6.0, 2.5, 4.5, 2.0, 5.0, 3.0];
      const scale = sizes[i % sizes.length];

      return {
        id: mesh.uuid + i,
        mesh,
        position: [xPos, yPos, zPos] as [number, number, number],
        scale: scale, 
        speed: 0.2 + (i * 0.05),
        rotation: [(i * 0.5), (i * 0.9), (i * 1.5)] as [number, number, number]
      };
    });
  }, [uniqueMeshes]);

  if (uniqueMeshes.length === 0) return null;

  return (
    <group>
      {shapes.map((s) => (
        <SingleGlassShape 
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

useGLTF.preload('models/envato_shapes.glb');
useGLTF.preload('models/glass_shapes.glb');
