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
    <CanvasLoader>
      {/* Chrome Y2K Shapes */}
      <ScatteredShapes />
      
      {/* Iridescent Pearly Shapes */}
      <PearlyShapes />

      {/* Pure Refractive Glass Shapes */}
      <PureGlassShapes />
      
      <ScrollWrapper>
        <Hero/>
        <Experience/>
        <Footer/>
      </ScrollWrapper>
    </CanvasLoader>
  );
};
export default Home;
