'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Environment, Preload, ScrollControls, useProgress, BakeShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { usePortalStore } from "@stores";
import Preloader from "./Preloader";
import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const ref= useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { progress } = useProgress();
  const setUiPortalNode = usePortalStore(state => state.setUiPortalNode);
  
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 1,
    zIndex: 0
  });



  useGSAP(() => {
    // Reveal the behind-canvas background elements
    gsap.to(ref.current, {
      backgroundColor: 'transparent',
      duration: 1,
    });
    gsap.to(canvasRef.current, {
      backgroundColor: 'transparent',
      duration: 1,
    });
  }, []);


  return (
    <div className="relative min-h-[400vh] w-full bg-transparent" ref={ref}>
      <div 
        ref={setUiPortalNode} 
        className="fixed inset-0 pointer-events-none z-[5]"
      />
      <Canvas className="base-canvas"
        shadows
        style={canvasStyle}
        ref={canvasRef}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, alpha: true, toneMapping: 3, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={50} />
          <Environment preset="night" />
          <BakeShadows />

          {/* Pass the portal node to children if they need it */}
          <ScrollControls pages={6} damping={0.2} style={{ zIndex: 10 }}>
            {props.children}
          </ScrollControls>

          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated/>
      </Canvas>

      <ProgressLoader progress={progress} />
      <ScrollHint />
      
      {/* Subtle vignette overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_110%)]"></div>
    </div>
  );
};


export default CanvasLoader;