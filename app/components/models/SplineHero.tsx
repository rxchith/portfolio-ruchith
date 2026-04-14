'use client';

import Script from 'next/script';
import React from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; className?: string }, HTMLElement>;
    }
  }
}

export default function SplineHero() {
  return (
    <>
      {/* Load Spline Viewer from CDN */}
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.0.91/build/spline-viewer.js" 
      />
      
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden transition-opacity duration-1000">
        <div className="w-full h-full transform scale-75 opacity-80">
          <spline-viewer 
             url="https://prod.spline.design/ATu8-Q9pQ9Z8D8S0/scene.splinecode"
             className="w-full h-full"
          />
        </div>
        
        {/* Soft overlay to blend spline with the dark charcoal background and keep it in the background */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0a0a0a/60] to-[#0a0a0a]"></div>
      </div>
    </>
  );
}
