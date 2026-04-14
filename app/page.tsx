'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";
import { PearlyShapes } from "./components/models/PearlyShapes";
import { PureGlassShapes } from "./components/models/PureGlassShapes";
import { ScatteredShapes } from "./components/models/Y2KShapes";

const Home = () => {
  return (
    <main className="min-h-screen relative">
      {/* Interactive 3D Canvas Context */}
      <CanvasLoader>
        {/* Chrome Y2K Shapes */}
        <ScatteredShapes />
        
        {/* Vibrant Clay/Pearly Shapes */}
        <PearlyShapes />

        {/* Vibrant Clay/Plastic Shapes */}
        <PureGlassShapes />
        
        <ScrollWrapper>
          <Hero/>
          <Experience/>
          <Footer/>
        </ScrollWrapper>
      </CanvasLoader>
    </main>
  );
};
export default Home;
