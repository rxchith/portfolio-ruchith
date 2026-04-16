'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const OldLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.8, // Slightly longer delay to ensure user sees it
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none';
          }
        }
      });
    }
  }, []);

  return (
    <div className="page-transition" id="pageTransition" ref={loaderRef}>
      <div className="pt-logo">
        RUCHITH<span>.</span>
      </div>
    </div>
  );
};

export default OldLoader;
