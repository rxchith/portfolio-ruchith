import { useScroll } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { usePortalStore } from "@stores";
import ParallaxProjectGrid from "./ParallaxProjectGrid";
import { TouchPanControls } from "./TouchPanControls";

const Projects = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const data = useScroll();

  useEffect(() => {
    // Hide scrollbar when active.
    data.el.style.overflow = isActive ? 'hidden' : 'auto';
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 20, y: -41.5, x: 0, duration: 1.2, ease: "power2.inOut" });
      } else {
        gsap.to(camera.position, { z: 18, y: -41.5, x: 0, duration: 1.2, ease: "power2.inOut" });
      }
      // Reset rotation
      gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 1 });
    }
  }, [isActive]);

  return (
    <group>
      <ParallaxProjectGrid />
      { isActive && isMobile && <TouchPanControls /> }
    </group>
  );
};

export default Projects;
