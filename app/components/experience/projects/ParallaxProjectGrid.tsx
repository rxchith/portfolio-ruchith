'use client';

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "@constants";
import ProjectTile from "./ProjectTile";
import { usePortalStore } from "@stores";

const ParallaxProjectGrid = () => {
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const [targetX, setTargetX] = useState(0);
  const currentXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseX = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!isActive) return;
      setIsDragging(true);
      lastMouseX.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !isActive) return;
      const delta = (e.clientX - lastMouseX.current) * 0.05;
      setTargetX((prev) => prev + delta);
      lastMouseX.current = e.clientX;
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e: WheelEvent) => {
      if (!isActive) return;
      setTargetX((prev) => prev - e.deltaX * 0.02); // Slightly faster scaling for horizontal
    };

    // Touch handlers for mobile swiping
    const handleTouchStart = (e: TouchEvent) => {
      if (!isActive) return;
      setIsDragging(true);
      lastMouseX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !isActive) return;
      const delta = (e.touches[0].clientX - lastMouseX.current) * 0.05;
      setTargetX((prev) => prev + delta);
      lastMouseX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, isDragging]);

  const gridRef = useRef<THREE.Group>(null);
  const spacing = 6; // Reduced spacing to bring titles closer
  const totalWidth = PROJECTS.length * spacing;

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.visible = isActive;
    }
    if (!isActive) return;

    const lerpSpeed = 0.08;
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetX, lerpSpeed);

    if (gridRef.current) {
      gridRef.current.children.forEach((child, i) => {
        // Calculate the base position for each tile
        const baseOffset = i * spacing;
        
        // Infinite Loop Logic:
        // Combine the grid movement with the base offset and wrap it around the total width
        let x = (baseOffset + currentXRef.current) % totalWidth;
        
        // Ensure it wraps correctly even for negative values
        if (x < -totalWidth / 2) x += totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;
        
        child.position.x = x;
        
        // Tilt Effect: Lean based on the calculated wrapped position
        const worldX = x;
        const tiltIntensity = 0.3;
        child.rotation.y = THREE.MathUtils.lerp(
          child.rotation.y,
          -worldX * 0.05 * tiltIntensity,
          0.1
        );
        
        child.rotation.x = Math.PI / 2;
        child.rotation.z = 0;

        // Subtle scale focus based on proximity to center
        const distFromCenter = Math.abs(x);
        const baseScale = 0.7;
        const focusScale = THREE.MathUtils.mapLinear(distFromCenter, 0, spacing, 1, 0.85);
        const finalScale = baseScale * THREE.MathUtils.clamp(focusScale, 0.8, 1);
        child.scale.set(finalScale, finalScale, finalScale);
      });
    }
  });

  return (
    <group ref={gridRef}>
      {PROJECTS.map((project, i) => (
        <ProjectTile
          key={i}
          project={project}
          index={i}
          position={[0, 0, 0]} // Position is now managed by the loop
          rotation={[0, 0, 0]}
          activeId={null}
        />
      ))}
    </group>
  );
};

export default ParallaxProjectGrid;
