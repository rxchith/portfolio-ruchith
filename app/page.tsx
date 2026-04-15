'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";
import { PearlyShapes } from "./components/models/PearlyShapes";
import { PureGlassShapes } from "./components/models/PureGlassShapes";
import { ScatteredShapes } from "./components/models/Y2KShapes";
import GradientBlinds from "./components/backgrounds/GradientBlinds";

const Home = () => {
  return (
    <main className="min-h-screen relative bg-[#0a0a0a]">
      {/* Dynamic WebGL Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
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

