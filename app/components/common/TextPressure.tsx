'use client';

import React, { useEffect, useRef } from 'react';

interface TextPressureProps {
  text: string;
  className?: string;
  maxDistance?: number;
  minWeight?: number;
  maxWeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minItal?: number;
  maxItal?: number;
}

export const TextPressure: React.FC<TextPressureProps> = ({
  text,
  className = '',
  maxDistance = 300,
  minWeight = 200,
  maxWeight = 900,
  minWidth = 75,
  maxWidth = 125,
  minItal = 0,
  maxItal = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId: number;

    const update = () => {
      if (containerRef.current) {
        charsRef.current.forEach((char) => {
          if (!char) return;

          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;

          const distance = Math.sqrt(
            Math.pow(mouseRef.current.x - charX, 2) + Math.pow(mouseRef.current.y - charY, 2)
          );

          const proximity = Math.max(0, 1 - distance / maxDistance);

          // Proximity scaling (kept for character interaction)
          char.style.transform = `scale(${1 + proximity * 0.15})`;
        });
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [maxDistance, minWeight, maxWeight, minWidth, maxWidth, minItal, maxItal]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-nowrap justify-center items-center ${className}`}
      style={{
        fontFamily: "var(--font-soria), serif",
      }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charsRef.current[i] = el;
          }}
          className="inline-block transition-transform duration-75 whitespace-pre"
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default TextPressure;
