'use client';

import { Text } from "@react-three/drei";

import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: 0,
        duration: 3
      });
    }
  }, [progress]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 1.2,
  };

  return (
    <>
      <Text position={[0, 2, -10]} {...fontProps} ref={titleRef}>Hi, I am Mohit Virli.</Text>
      
      {/* Hyper-Object Lighting: Neutral and focused on the center objects */}
      <pointLight
        position={[-10, 10, 10]}
        color="#ffffff"
        intensity={20}
        distance={100}
      />
      <pointLight
        position={[10, -10, 5]}
        color="#ffffff"
        intensity={10}
        distance={100}
      />

      <group position={[0, -25, 5.69]}>
        {/* Focused light for the main object */}
        <pointLight castShadow position={[1, 1, -2.5]} intensity={80} distance={15} color="#fff"/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
