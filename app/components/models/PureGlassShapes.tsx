'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface InternalGlassProps {
  index: number;
  mesh: THREE.Mesh;
  color: string;
  speed?: number;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

/**
 * SingleVibrantShape — Renders shapes with the high-intensity clay/plastic look.
 */
function SingleVibrantShape({ index, mesh, color, speed = 1, ...props }: InternalGlassProps) {
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
      groupRef.current.position.y += Math.sin(t * 0.1 + index) * 0.001;
      groupRef.current.rotation.x += 0.002 * speed;
      groupRef.current.rotation.z -= 0.001 * speed;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={vibrantMesh} />
    </group>
  );
}

/**
 * PureGlassShapes — Vibrant Clay/Plastic Shapes with STRICT scaling and spacing.
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
    const vibrantPalette = ['#00F2FF', '#FF7F00', '#32FF00', '#FF00FF', '#FFD700', '#007FFF'];
    const startY = 8; 
    const spacing = 35; // increased to spread them out more

    return uniqueMeshes.map((mesh, i) => {
      const sides = [1, -1, 1, -1, 1, -1, 1, -1];
      const side = sides[i % sides.length];
      
      // Fixed: Pushing further to the sides (min 35 units) and removing massive scales
      // Reduced minimum offset to 30 to fill more space
      const xPos = (30 + (i * 3) % 15) * side; 
      // Explicitly set first 3 positions to be visible in the Hero section
      const yPos = i < 3 ? (4 - i * 3) : startY - (i * spacing); 
      // Shift first 3 shapes closer to the camera for the hero section
      const zPos = i < 3 ? -12 : -28; 
      
      // Massive scales (min 2.0, max 3.5) for a full hero section
      // Boost the first 3 for even more presence
      const sizes = [2.5, 3.5, 2.2, 3.2, 2.0, 3.0, 2.4, 3.5];
      let scale = sizes[i % sizes.length];
      if (i < 3) scale *= 1.3;

      return {
        id: mesh.uuid + i,
        mesh,
        color: vibrantPalette[i % vibrantPalette.length],
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
        <SingleVibrantShape 
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

useGLTF.preload('models/envato_shapes.glb');
useGLTF.preload('models/glass_shapes.glb');
