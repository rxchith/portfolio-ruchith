'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { isMobile } from 'react-device-detect';

export interface ForceFieldBackgroundProps {
  hue?: number;
  saturation?: number;
  spacing?: number;
  density?: number;
  minStroke?: number;
  maxStroke?: number;
  forceStrength?: number;
  magnifierRadius?: number;
  friction?: number;
  restoreSpeed?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  brightness: number;
}

/**
 * ForceFieldBackground — Pure Canvas2D implementation.
 * No p5.js dependency. Works reliably with Next.js SSR.
 */
export function ForceFieldBackground({
  hue = 210,
  saturation = 100,
  spacing = 10,
  density = 0.5,
  minStroke = 2,
  maxStroke = 5,
  forceStrength = 10,
  magnifierRadius = 150,
  friction = 0.9,
  restoreSpeed = 0.05,
  className = "",
}: ForceFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const propsRef = useRef({ hue, saturation, spacing, density, minStroke, maxStroke, forceStrength, magnifierRadius, friction, restoreSpeed });

  // Update props ref
  useEffect(() => {
    propsRef.current = { hue, saturation, spacing, density, minStroke, maxStroke, forceStrength, magnifierRadius, friction, restoreSpeed };
  }, [hue, saturation, spacing, density, minStroke, maxStroke, forceStrength, magnifierRadius, friction, restoreSpeed]);

  // Generate palette of HSL colors
  const generatePalette = useCallback((h: number, s: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < 12; i++) {
      const lightness = 95 - (i / 11) * 90; // 95 down to 5
      colors.push(`hsl(${h}, ${s}%, ${lightness}%)`);
    }
    return colors;
  }, []);

  // Generate particles grid
  const generateParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const safeSpacing = Math.max(4, propsRef.current.spacing);

    for (let y = 0; y < h; y += safeSpacing) {
      for (let x = 0; x < w; x += safeSpacing) {
        if (Math.random() > propsRef.current.density) continue;

        // Add slight randomness to position
        const jitterX = (Math.random() - 0.5) * safeSpacing * 0.3;
        const jitterY = (Math.random() - 0.5) * safeSpacing * 0.3;
        const px = x + jitterX;
        const py = y + jitterY;

        particles.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          vx: 0,
          vy: 0,
          brightness: Math.random() * 200 + 55, // 55-255
        });
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      particlesRef.current = generateParticles(rect.width, rect.height);
    };
    resize();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('resize', resize);

    // Mobile: random animated virtual cursor offsets
    const mobileOffsetX = Math.random() * 1000;
    const mobileOffsetY = Math.random() * 1000;

    let palette = generatePalette(propsRef.current.hue, propsRef.current.saturation);
    let lastHue = propsRef.current.hue;
    let lastSaturation = propsRef.current.saturation;

    // Animation loop
    const animate = () => {
      const props = propsRef.current;
      const particles = particlesRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (w === 0 || h === 0) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Regenerate palette if colors changed
      if (props.hue !== lastHue || props.saturation !== lastSaturation) {
        palette = generatePalette(props.hue, props.saturation);
        lastHue = props.hue;
        lastSaturation = props.saturation;
      }

      // Smooth mouse (or animated virtual cursor on mobile)
      const smx = smoothMouseRef.current;
      if (isMobile) {
        const time = performance.now() * 0.0005;
        mouseRef.current.x = w * 0.5 + Math.sin(time * 0.7 + mobileOffsetX) * w * 0.35 + Math.sin(time * 1.3 + mobileOffsetY) * w * 0.1;
        mouseRef.current.y = h * 0.5 + Math.cos(time * 0.5 + mobileOffsetY) * h * 0.35 + Math.cos(time * 1.1 + mobileOffsetX) * h * 0.1;
      }
      smx.x += (mouseRef.current.x - smx.x) * 0.1;
      smx.y += (mouseRef.current.y - smx.y) * 0.1;

      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        // Force field repulsion
        const dx = pt.x - smx.x;
        const dy = pt.y - smx.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < props.magnifierRadius && dist > 0) {
          const force = props.forceStrength / dist;
          pt.vx += (dx / dist) * force;
          pt.vy += (dy / dist) * force;
        }

        // Friction
        pt.vx *= props.friction;
        pt.vy *= props.friction;

        // Restore to origin
        pt.vx += (pt.ox - pt.x) * props.restoreSpeed;
        pt.vy += (pt.oy - pt.y) * props.restoreSpeed;

        // Update position
        pt.x += pt.vx;
        pt.y += pt.vy;

        // Draw
        const b = pt.brightness;
        const shadeIndex = Math.min(11, Math.max(0, Math.floor((b / 255) * 11)));
        let strokeSize = props.minStroke + ((b / 255) * (props.maxStroke - props.minStroke));

        // Magnify near cursor
        if (dist < props.magnifierRadius) {
          const factor = 1 + (1 - dist / props.magnifierRadius);
          strokeSize *= factor;
        }

        ctx.fillStyle = palette[shadeIndex];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, strokeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', resize);
    };
  }, [generateParticles, generatePalette]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export default ForceFieldBackground;
