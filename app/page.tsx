'use client';

import { usePortalStore } from "@stores";
import { useState, useEffect, useRef, useCallback } from "react";
import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";
import { PearlyShapes } from "./components/models/PearlyShapes";
import { PureGlassShapes } from "./components/models/PureGlassShapes";
import { ScatteredShapes } from "./components/models/Y2KShapes";
import GradientBlinds from "./components/backgrounds/GradientBlinds";
import ForceFieldBackground from "./components/experience/projects/ForceFieldBackground";

import PlasmaBackground from "./components/experience/work/PlasmaBackground";

const Home = () => {
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const isPortalActive = !!activePortalId;
  const isProjectsActive = activePortalId === "projects";
  const isWorkActive = activePortalId === "work";



  return (
    <main className="min-h-screen relative bg-[#0a0a0a]">
      {/* Dynamic WebGL Background — hides when inside a portal */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isPortalActive ? 0 : 1 }}
      >
        <GradientBlinds
          gradientColors={['#0a0a0a', '#0d0d0f', '#121214', '#0a0a0a', '#1a1b1e']}
          angle={-20}
          noise={0.1}
          blindCount={22}
          blindMinWidth={50}
          spotlightRadius={0.8}
          spotlightSoftness={0.9}
          spotlightOpacity={0.5}
          distortAmount={2}
          mouseDampening={0.15}
        />
      </div>

      {/* Force Field Background — shows only when projects portal is active */}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-1000"
        style={{ 
          opacity: isProjectsActive ? 1 : 0, 
          pointerEvents: isProjectsActive ? 'auto' : 'none' 
        }}
      >
        {isProjectsActive && (
          <ForceFieldBackground
            hue={220}
            saturation={5}
            spacing={10}
            forceStrength={15}
            magnifierRadius={200}
            restoreSpeed={0.03}
            density={0.3}
            minStroke={1.5}
            maxStroke={4}
          />
        )}
      </div>

      {/* Plasma Background — shows only when work portal is active */}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-1000"
        style={{
          opacity: isWorkActive ? 1 : 0,
          pointerEvents: isWorkActive ? 'auto' : 'none',
        }}
      >
        {isWorkActive && (
          <PlasmaBackground
            color="#888888"
            speed={0.5}
            direction="forward"
            scale={1.2}
            opacity={0.6}
            mouseInteractive={true}
          />
        )}
      </div>



      {/* Interactive 3D Canvas Context */}
      <CanvasLoader>
        <ScatteredShapes />
        <PearlyShapes />
        <PureGlassShapes />
        
        <ScrollWrapper>
          <Hero/>
          <Experience/>
          <Footer/>
        </ScrollWrapper>
      </CanvasLoader>

      {/* Subtle Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </main>
  );
};

export default Home;
