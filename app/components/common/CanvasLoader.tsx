'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Environment, Preload, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import AwwardsBadge from "./AwwardsBadge";
import Preloader from "./Preloader";
import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const ref= useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { progress } = useProgress();
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    overflow: "hidden",
  });

  useEffect(() => {
    if (!isMobile) {
      const borderStyle = {
        inset: '1.5rem',
        width: 'calc(100% - 3rem)',
        height: 'calc(100% - 3rem)',
      };
      setCanvasStyle({ ...canvasStyle, ...borderStyle})
    }
  }, [isMobile]);

  useGSAP(() => {
    if (progress === 100) {
      gsap.to('.base-canvas', { opacity: 1, duration: 2, delay: 0.5 });
    }
  }, [progress]);

  useGSAP(() => {
    // Hyper-Object background: Clean, dark charcoal/black
    gsap.to(ref.current, {
      backgroundColor: '#0a0a0a',
      duration: 1,
    });
    gsap.to(canvasRef.current, {
      backgroundColor: '#0a0a0a',
      duration: 1,
    });
  }, []);

  return (
    <div className="h-[100dvh] wrapper relative overflow-hidden bg-[#0a0a0a]">
       {/* Subtle vignette overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none vignette-overlay"></div>
      
      <div className="h-[100dvh] relative" ref={ref}>
        <Canvas className="base-canvas"
          shadows
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1 }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            
            {/* Environment map for realistic object textures */}
            <Environment preset="city" />

            <ScrollControls pages={4} damping={0.4} maxSpeed={1} distance={1} style={{ zIndex: 1 }}>
              {props.children}
              <Preloader />
            </ScrollControls>

            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated/>
        </Canvas>
        <ProgressLoader progress={progress} />
      </div>
      <AwwardsBadge />
      <ScrollHint />
    </div>
  );
};

export default CanvasLoader;