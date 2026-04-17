import { useState, useEffect, useCallback, useRef } from "react";
import Timeline from "./Timeline";
import { usePortalStore } from "@stores";

const Work = () => {
  const isActive = usePortalStore((state) => state.activePortalId === "work");
  const [progress, setProgress] = useState(0);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  // Reset progress when portal opens
  useEffect(() => {
    if (isActive) {
      setProgress(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e: WheelEvent) => {
      setProgress((prev) => Math.max(0, Math.min(1, prev + e.deltaY * 0.0005)));
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      lastY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const delta = (lastY.current - e.touches[0].clientY) * 0.002;
      setProgress((prev) => Math.max(0, Math.min(1, prev + delta)));
      lastY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isActive]);

  return (
    <group>
      {/* Shadow catcher */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      
      {/* 3D Timeline */}
      <Timeline progress={progress} />
    </group>
  );
};

export default Work;