import { useScroll } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect } from "react";
import { usePortalStore } from "@stores";

const Projects = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const data = useScroll();

  useEffect(() => {
    // Hide scrollbar when active.
    data.el.style.overflow = isActive ? 'hidden' : 'auto';
    if (isActive) {
      gsap.to(camera.position, { z: 18, y: -41.5, x: 0, duration: 1.2, ease: "power2.inOut" });
      // Reset rotation
      gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 1 });
    }
  }, [isActive]);

  return (
    <group>
      {/* BentoProjectGrid is rendered at page level to avoid R3F reconciler issues */}
    </group>
  );
};

export default Projects;
