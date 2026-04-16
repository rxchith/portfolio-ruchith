
import { Edges, MeshPortalMaterial, Text, TextProps, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { usePortalStore } from '@stores';
import gsap from "gsap";
import { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import * as THREE from 'three';
import { TriangleGeometry } from './Triangle';

interface GridTileProps {
  id: string;
  title: string;
  textAlign: TextProps['textAlign'];
  children: React.ReactNode;
  position: THREE.Vector3;
  thumbnail: string;
}

const GridTile = (props: GridTileProps) => {
  const titleRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const hoverBoxRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const thumbnailRef = useRef<THREE.Mesh>(null);
  const { title, textAlign, children, position, id, thumbnail } = props;
  const { camera } = useThree();
  const setActivePortal = usePortalStore((state) => state.setActivePortal);
  const isActive = usePortalStore((state) => state.activePortalId === id);
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const data = useScroll();
  const texture = useTexture(thumbnail);

  // Store the initial position to avoid snapping on re-renders
  const basePosition = useRef(position.clone());

  useEffect(() => {
    if (isMobile && titleRef.current) {
      const isWork = id === 'work';
      gsap.to(titleRef.current, {
        fontSize: 0.13,
        maxWidth: 4,
        color: isWork ? '#FFF' : '#888',
        letterSpacing: 0.4,
      });
      gsap.to(titleRef.current.position, {
        x: isWork ? 1: -1,
        y: isWork ? -1.7 : 1.5,
        duration: 0.5,
      });
    }
  }, []);

  useFrame(() => {
    const d = data.range(0.95, 0.05);
    if (isMobile && titleRef.current) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (titleRef.current as any).fillOpacity = d;
    }
    
    if (thumbnailRef.current && portalRef.current) {
      const blend = (portalRef.current as any).blend || 0;
      const targetOpacity = isActive ? (1 - blend) : 1;
      (thumbnailRef.current.material as THREE.MeshBasicMaterial).opacity = targetOpacity;
      thumbnailRef.current.visible = targetOpacity > 0.01;
    }
  });

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitPortal(true);
    }
  };

  const portalInto = (e: React.MouseEvent) => {
    if (isActive || activePortalId) return;
    e.stopPropagation();
    setActivePortal(id);
    document.body.style.cursor = 'auto';
    const div = document.createElement('div');

    div.className = 'fixed close';
    div.style.transform = 'rotateX(90deg)';
    div.onclick = () => exitPortal(true);

    if (!document.querySelector('.close')) {
      document.body.appendChild(div);

      gsap.fromTo(div, {
        scale: 0,
        rotate: '-180deg',
      },{
        opacity: 1,
        zIndex: 150,
        transform: 'rotateX(0deg)',
        scale: 1,
        duration: 1,
      })
    }
    document.body.addEventListener('keydown', handleEscape);
    gsap.to(portalRef.current, {
      blend: 1,
      duration: 0.5,
    });
  };

  const exitPortal = (force = false) => {
    if (!force && !activePortalId) return;
    setActivePortal(null)

    gsap.to(camera.position, {
      x: 0,
      duration: 1,
    });

    gsap.to(camera.rotation, {
      x: -Math.PI / 2,
      y: 0,
      duration: 1,
    });

    gsap.to(portalRef.current, {
      blend: 0,
      duration: 1,
    });

    gsap.to(document.querySelector('.close'), {
      scale: 0,
      duration: 0.5,
      onComplete: () => {
        document.querySelectorAll('.close').forEach((el) => {
          el.remove();
        });
      }
    })
    document.body.removeEventListener('keydown', handleEscape);
  }

  const fontProps: Partial<TextProps> = {
    font: "./soria-font.ttf",
    maxWidth: 2,
    anchorX: 'center',
    anchorY: 'bottom',
    fontSize: 0.8,
    color: 'white',
    textAlign: textAlign,
    fillOpacity: 1,
    letterSpacing: -0.05,
  };

  const onPointerOver = () => {
    if (activePortalId || isMobile) return;
    document.body.style.cursor = 'pointer';
    gsap.to(titleRef.current, {
      fillOpacity: 1,
      color: '#fff'
    });
    if (groupRef.current && hoverBoxRef.current) {
      gsap.to(groupRef.current.position, { z: basePosition.current.z + 0.5, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    }
  };

  const onPointerOut = () => {
    if (isMobile) return;
    document.body.style.cursor = 'auto';
    gsap.to(titleRef.current, {
      fillOpacity: 0.8,
      color: '#ccc'
    });
    if (groupRef.current && hoverBoxRef.current) {
      gsap.to(groupRef.current.position, { z: basePosition.current.z, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.4 });
    }
  };

  const getGeometry = () => {
    if (!isMobile) {
      return <planeGeometry args={[4, 4, 1]} />
    }

    const isWork = id === 'work';
    const points = isWork ?
      [[-1, 2, 0], [-1, -2, 0], [3, -2, 0]] :
      [[-3, 2, 0], [1, -2, 0], [1, 2, 0]];

    return <primitive object={TriangleGeometry({ points })} attach="geometry" />
  };

  return (
    <group position={position} ref={groupRef}>
      {/* 1. Base Interactive Mesh (Portal) */}
      <mesh 
        onClick={portalInto}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}>
        { getGeometry() }
        <MeshPortalMaterial ref={portalRef} blend={0} resolution={512} blur={0}>
          <group>
            {children}
          </group>
        </MeshPortalMaterial>
      </mesh>

      {/* 2. Overlays (Thumbnails, Titles, Hover Decorations) */}
      <group pointerEvents="none">
        {/* Thumbnail: slightly in front of portal to prevent Z-fighting */}
        <mesh ref={thumbnailRef} position={[0, 0, 0.05]}>
          { getGeometry() }
          <meshBasicMaterial map={texture} transparent opacity={1} toneMapped={false} depthWrite={false} />
        </mesh>

        {/* Hover Box: behind everything */}
        <mesh position={[0, 0, -0.01]} ref={hoverBoxRef} scale={[0, 0, 0]}>
          <boxGeometry args={[4, 4, 0.5]}/>
          <meshPhysicalMaterial
            color="#222"
            transparent={true}
            opacity={0.3}
            metalness={0.5}
            roughness={0.2}
          />
          <Edges color="#fff" lineWidth={1}/>
        </mesh>
        
        <Text position={[0, -1.8, 0.4]} {...fontProps} ref={titleRef}>
          {title}
        </Text>
      </group>
    </group>
  );
}

export default GridTile;