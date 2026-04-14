'use client';

import { Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

/**
 * FloatingIcon — A smaller, vibrant element that frames the text.
 */
function FloatingIcon({ mesh, color, position, rotationSpeed = 1 }: { mesh: THREE.Mesh, color: string, position: [number, number, number], rotationSpeed?: number }) {
  const ref = useRef<THREE.Group>(null);
  
  const iconMesh = useMemo(() => {
    const clone = mesh.clone();
    clone.geometry = mesh.geometry.clone();
    clone.geometry.center();
    
    // Normalize geometry to a unit sphere first
    clone.geometry.computeBoundingSphere();
    const radius = clone.geometry.boundingSphere?.radius || 1;
    clone.scale.setScalar(1 / radius);
    
    // Apply a very small final scale (0.25) to prevent "super sizing"
    clone.scale.multiplyScalar(0.25);
    
    clone.material = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.4,
      clearcoat: 1,
      envMapIntensity: 2,
    });
    return clone;
  }, [mesh, color]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y += Math.sin(t + position[0]) * 0.005;
      ref.current.rotation.y += 0.01 * rotationSpeed;
    }
  });

  return (
    <group ref={ref} position={position}>
      <primitive object={iconMesh} />
    </group>
  );
}

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();
  const { scene: glossyScene } = useGLTF('models/glossy_shapes.glb');
  
  const heroMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    glossyScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && meshes.length < 2) {
        meshes.push(child as THREE.Mesh);
      }
    });
    return meshes;
  }, [glossyScene]);

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: 2,
        duration: 3
      });
    }
  }, [progress]);


  return (
    <>
      <Text position={[0, 3.8, -10]} font="/soria-font.ttf" fontSize={0.22} color="#ffffff" letterSpacing={0.5} textAlign="center">NEAT & CONTEMPORARY</Text>
      <Text position={[0, 1.8, -10]} font="/soria-font.ttf" fontSize={3.2} color="#ffffff" letterSpacing={-0.05} ref={titleRef}>Ruchith</Text>
      
      {/* Decorative center shapes to fill the "blank area" */}
      {heroMeshes.length >= 2 && (
        <group position={[0, 2, -10]}>
          <FloatingIcon 
            mesh={heroMeshes[0]} 
            color="#00F2FF" 
            position={[-4.5, 0.5, 0]} 
            rotationSpeed={0.5} 
          />
          <FloatingIcon 
            mesh={heroMeshes[1]} 
            color="#FF7F00" 
            position={[4.5, -0.5, 0]} 
            rotationSpeed={-0.3} 
          />
        </group>
      )}
      
      {/* Hyper-Object Lighting */}
      <pointLight position={[-10, 10, 10]} color="#ffffff" intensity={20} distance={100} />
      <pointLight position={[10, -10, 5]} color="#ffffff" intensity={10} distance={100} />

      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={80} distance={15} color="#fff"/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
