import { Text, TextProps, Image } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { getPath } from "../../../utils/getPath";
import { usePortalStore } from "@stores";
import { Project } from "@types";

interface ProjectTileProps {
  project: Project;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  activeId: number | null;
  onClick?: () => void;
}

const ProjectTile = ({ project, index, position, rotation, activeId, onClick }: ProjectTileProps) => {
  const projectRef = useRef<THREE.Group>(null);
  const hoverAnimRef = useRef<gsap.core.Timeline | null>(null);
  const [hovered, setHovered] = useState(false);
  const isProjectSectionActive = usePortalStore((state) => state.activePortalId === "projects");

  const titleProps = useMemo(() => ({
    font: getPath("soria-font.ttf"),
    color: "white",
    letterSpacing: -0.05,
  }), []);

  const subtitleProps: Partial<TextProps> = useMemo(() => ({
    font: getPath("Vercetti-Regular.woff"),
    color: "rgba(255,255,255,0.7)",
    anchorX: "left",
    anchorY: "top",
  }), []);

  useEffect(() => {
    if (!projectRef.current) return;
    hoverAnimRef.current?.kill();

    const [image, title, , subtext] = projectRef.current.children;

    hoverAnimRef.current = gsap.timeline();
    hoverAnimRef.current
      .to(projectRef.current.position, { z: hovered ? 1 : 0, duration: 0.3 }, 0)
      .to(image.scale, { 
        x: hovered ? 4.6 : 4.2, 
        y: hovered ? 6.2 : 5.8,
        duration: 0.4 
      }, 0)
      .to(title, { fillOpacity: hovered ? 1 : 0.7, duration: 0.3 }, 0)
      .to(subtext, { fillOpacity: hovered ? 1 : 0, duration: 0.3 }, 0);
  }, [hovered]);

  useEffect(() => {
    if (isMobile) {
      setHovered(activeId === index);
    }
  }, [isMobile, activeId]);

  useEffect(() => {
    if (projectRef.current) {
      gsap.to(projectRef.current.position, {
        y: isProjectSectionActive ? 0 : -10,
        duration: 1,
        delay: isProjectSectionActive ? index * 0.1 : 0,
      });
    }
  }, [isProjectSectionActive]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onClick) onClick();
    if (!project.url) return;
    setTimeout(() => window.open(project.url, '_blank'), 50);
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => {
        if (!isMobile && isProjectSectionActive) {
          setHovered(true);
          if (project.url) document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (!isMobile && isProjectSectionActive) {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}>
      <group ref={projectRef}>
        {project.image && (
          /* eslint-disable-next-line jsx-a11y/alt-text */
          <Image
            url={getPath(project.image)}
            scale={[4.2, 5.8] as [number, number]}
            zoom={1}
            transparent
            grayscale={0}
            opacity={1}
          />
        )}

        <Text
          {...titleProps}
          position={[0, -3.3, 0.1]}
          anchorX="center"
          anchorY="top"
          maxWidth={4}
          fontSize={0.4}>
          {project.title}
        </Text>
        <group position={[0, -3.8, 0.1]}>
          <Text
            {...subtitleProps}
            anchorX="center"
            position={[0, 0, 0]}
            fontSize={0.2}>
            {project.date.toUpperCase()}
          </Text>
        </group>
        <Text
          {...subtitleProps}
          maxWidth={3.8}
          anchorX="center"
          position={[0, -4.2, 0.1]}
          fontSize={0.15}>
          {project.subtext}
        </Text>
      </group>
    </group>
  );
};

export default ProjectTile;