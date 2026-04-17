'use client';

import { Text, useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useMemo } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";
import TextPressure from "../common/TextPressure";
import { usePortalStore } from "@stores";
import { getPath } from "../../utils/getPath";

/**
 * FloatingIcon — A smaller, vibrant element that frames the text.
 */
function FloatingIcon({ mesh, color, position, rotationSpeed = 1, index = 0 }: { mesh: THREE.Mesh, color: string, position: [number, number, number], rotationSpeed?: number, index?: number }) {
  const ref = useRef<THREE.Group>(null);
  
  const iconMesh = useMemo(() => {
    const clone = mesh.clone();
    clone.geometry = mesh.geometry.clone();
    clone.geometry.center();
    
    // Normalize geometry to a unit sphere first
    clone.geometry.computeBoundingSphere();
    const radius = clone.geometry.boundingSphere?.radius || 1;
    clone.scale.setScalar(1 / radius);
    
    // Scaled based on index for variety
    const scaleMap = [1.8, 1.4, 2.2, 1.6];
    const baseScale = scaleMap[index % scaleMap.length] || 1.5;
    clone.scale.multiplyScalar(isMobile ? baseScale * 0.6 : baseScale);
    
    clone.material = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.4,
      clearcoat: 1,
      envMapIntensity: 2,
    });
    return clone;
  }, [mesh, color, index]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      // More complex floating: Y-bobbing + slight X-drift
      ref.current.position.y = position[1] + Math.sin(t * 0.5 + index) * 0.2;
      ref.current.position.x = position[0] + Math.cos(t * 0.3 + index) * 0.1;
      ref.current.rotation.y += 0.01 * rotationSpeed;
      ref.current.rotation.z += 0.005 * rotationSpeed;
    }
  });

  return (
    <group ref={ref} position={position}>
      <primitive object={iconMesh} />
    </group>
  );
}

const Hero = () => {
  const titleContainerRef = useRef<THREE.Group>(null);
  const { progress } = useProgress();
  const { scene: glossyScene } = useGLTF(getPath('models/glossy_shapes.glb'));
  const uiPortalNode = usePortalStore(state => state.uiPortalNode);
  
  const heroMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    glossyScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && meshes.length < 4) {
        if (!meshes.find(m => m.name.substring(0, 5) === child.name.substring(0, 5))) {
          meshes.push(child as THREE.Mesh);
        }
      }
    });
    return meshes;
  }, [glossyScene]);

  useEffect(() => {
    if (progress === 100 && titleContainerRef.current) {
      gsap.fromTo(titleContainerRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: 2,
        duration: 3,
        ease: "power3.out"
      });
    }
  }, [progress]);


  return (
    <>
      <group ref={titleContainerRef} position={[0, 2, -10]}>
        {/* Subtitle (Top) */}
        <Text 
          position={[0, isMobile ? 1.8 : 2.2, 0]} 
          font={getPath("soria-font.ttf")} 
          fontSize={isMobile ? 0.5 : 0.45} 
          color="#ffffff" 
          letterSpacing={0.5} 
          textAlign="center"
        >
          HI, I AM
        </Text>

        {/* Main Title (Bottom) */}
        <group position={[0, isMobile ? -0.2 : -0.8, 0]}>
          {uiPortalNode && (
            <Html 
              center 
              transform 
              distanceFactor={isMobile ? 5 : 10} 
              portal={{ current: uiPortalNode as HTMLElement }}
            >
              <TextPressure 
                text="Ruchith" 
                className={`${isMobile ? 'text-[154px]' : 'text-[120px]'} tracking-tighter text-white uppercase italic`}
              />
            </Html>
          )}
        </group>
      </group>
      
      {/* Decorative center shapes with "Dynamic Depth Cascade" layout */}
      <group position={[0, 2, -10]}>
        {heroMeshes.map((mesh, i) => {
          // Optimized for vertical mobile screens
          const positions: [number, number, number][] = [
            [isMobile ? -3 : -15, isMobile ? 7 : 5, -8],    // Top Left
            [isMobile ? 3 : 12, isMobile ? 5 : 4, 2],       // Top Right
            [isMobile ? -3.5 : -11, isMobile ? -6 : -3, -4], // Bottom Left
            [isMobile ? 3.5 : 16, isMobile ? -4 : -2, -6],   // Bottom Right
          ];
          
          const colors = ["#00F2FF", "#FF7F00", "#FF1DCE", "#76FF03"];
          
          if (i >= positions.length) return null;

          return (
            <FloatingIcon 
              key={mesh.uuid}
              index={i}
              mesh={mesh} 
              color={colors[i % colors.length]} 
              position={positions[i]} 
              rotationSpeed={0.5 * (i % 2 === 0 ? 1 : -1)} 
            />
          );
        })}
      </group>
      
      {/* Hyper-Object Lighting */}
      <pointLight position={[-10, 10, 10]} color="#ffffff" intensity={20} distance={100} />
      <pointLight position={[10, -10, 5]} color="#ffffff" intensity={10} distance={100} />

      <group position={[0, -25, 5.69]}>
        <pointLight castShadow shadow-mapSize={[512, 512]} position={[1, 1, -2.5]} intensity={80} distance={15} color="#fff"/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
