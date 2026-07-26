'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PROJECTS } from '@constants';
import { usePortalStore } from '@stores';
import gsap from 'gsap';

/**
 * Bento-style grid layout tile sizes.
 * Every 4th tile (index 1, 5, 9...) spans 2 columns on desktop for visual variety.
 */
const getSpan = (index: number, isMobileView: boolean): number => {
  if (isMobileView) return index === 0 ? 2 : 1;
  // Pattern: 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1 ...
  const pos = index % 4;
  return pos === 1 ? 2 : 1;
};

const BentoProjectGrid = () => {
  const isActive = usePortalStore((state) => state.activePortalId === 'projects');
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Set mounted for portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Staggered fade-in animation when portal opens
  useEffect(() => {
    if (!isActive || !gridRef.current) return;

    const tiles = gridRef.current.querySelectorAll('.bento-tile');
    gsap.set(tiles, { opacity: 0, y: 40, scale: 0.95 });
    gsap.to(tiles, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      delay: 0.3,
    });

    // Fade in container
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [isActive]);

  if (!mounted || !isActive) return null;

  const columns = isMobileView ? 2 : 4;

  const gridContent = (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        background: 'transparent',
        paddingTop: isMobileView ? '80px' : '100px',
        paddingBottom: isMobileView ? '40px' : '60px',
        paddingLeft: isMobileView ? '12px' : '48px',
        paddingRight: isMobileView ? '12px' : '48px',
      }}
    >
      {/* Section title */}
      <div
        style={{
          fontFamily: 'var(--font-soria), serif',
          fontSize: isMobileView ? '2rem' : '3rem',
          color: '#fff',
          letterSpacing: '-0.03em',
          marginBottom: isMobileView ? '24px' : '40px',
          opacity: 0.9,
        }}
      >
        PROJECTS
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isMobileView ? '10px' : '16px',
          width: '100%',
        }}
      >
        {PROJECTS.map((project, i) => {
          const span = getSpan(i, isMobileView);
          const isWide = span === 2;
          const aspectRatio = isWide
            ? (isMobileView ? '16 / 9' : '21 / 9')
            : '4 / 3';

          return (
            <div
              key={i}
              className="bento-tile"
              onClick={() => {
                if (project.url) window.open(project.url, '_blank');
              }}
              style={{
                gridColumn: `span ${span}`,
                position: 'relative',
                borderRadius: isMobileView ? '12px' : '16px',
                overflow: 'hidden',
                cursor: project.url ? 'pointer' : 'default',
                aspectRatio,
                background: '#111',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1.02)';
                el.style.borderColor = 'rgba(255,255,255,0.15)';
                el.style.zIndex = '2';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1)';
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.zIndex = '1';
              }}
            >
              {/* Project Image */}
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                />
              )}

              {/* Gradient overlay with info — always visible on mobile, hover on desktop */}
              <div
                className="tile-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: isMobileView ? '12px' : '20px',
                  opacity: 1,
                  transition: 'opacity 0.35s ease',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-soria), serif',
                    fontSize: isMobileView
                      ? (isWide ? '1rem' : '0.85rem')
                      : (isWide ? '1.3rem' : '1rem'),
                    color: '#fff',
                    lineHeight: 1.2,
                    marginBottom: '4px',
                  }}
                >
                  {project.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontSize: isMobileView ? '0.65rem' : '0.75rem',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {project.date} · {project.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return createPortal(gridContent, document.body);
};

export default BentoProjectGrid;
