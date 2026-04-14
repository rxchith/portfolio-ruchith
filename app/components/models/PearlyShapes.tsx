'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface InternalPearlyProps {
  index: number;
  mesh: THREE.Mesh;
  color: string;
  speed?: number;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

/**
 * SingleVibrantPearlyShape — Renders shapes with the high-intensity clay/plastic look.
 */
function SingleVibrantPearlyShape({ index, mesh, color, speed = 1, ...props }: InternalPearlyProps) {
  const groupRef = useRef<THREE.Group>(null);

  const vibrantMesh = useMemo(() => {
    const clone = mesh.clone();
    clone.geometry = mesh.geometry.clone();
    clone.geometry.center(); 
    clone.geometry.computeBoundingSphere();
    const radius = clone.geometry.boundingSphere?.radius || 1;
    clone.scale.setScalar(1 / radius);

    clone.material = new THREE.MeshPhysicalMaterial({
      color: color, 
      metalness: 0,
      roughness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      sheen: 1.0,
      sheenRoughness: 0.5,
      sheenColor: '#ffffff',
      envMapIntensity: 2.5,
    });
    
    return clone;
  }, [mesh, color]);

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
      <primitive object={vibrantMesh} />
    </group>
  );
}

/**
 * PearlyShapes — Vibrant High-Intensity shapes with STRICT scale control.
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
    const vibrantPalette = ['#FF1DCE', '#00F5FF', '#76FF03', '#FFD600', '#6200EA', '#FF3D00', '#1DE9B6'];
    const startY = 14; 
    const spacing = 35; // increased to spread them out more

    return uniqueMeshes.map((mesh, i) => {
      const sides = [-1, 1, -1, 1, -1, 1, -1, 1];
      const side = sides[i % sides.length];
      
      // Fixed: Pushing further to the sides (min 30 units)
      const xPos = (30 + (i * 2) % 10) * side; 
      // Explicitly set first 3 positions to be visible in the Hero section (Y between 2 and -2)
      const yPos = i < 3 ? (2 - i * 2) : startY - (i * spacing); 
      // Shift first 3 shapes closer to the camera for the hero section
      const zPos = i < 3 ? -8 : -22; 
      
      // Even larger scales (min 1.5 instead of 0.8)
      // Boost scale for the first 3 hero shapes
      const sizes = [2.0, 2.8, 1.8, 3.2, 1.5, 2.5, 1.8, 3.0];
      let scale = sizes[i % sizes.length];
      if (i < 3) scale *= 1.5;
      
      return {
        id: mesh.uuid + i,
        mesh,
        color: vibrantPalette[i % vibrantPalette.length],
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
        <SingleVibrantPearlyShape 
          key={s.id} 
          index={0} 
          mesh={s.mesh}
          color={s.color}
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
