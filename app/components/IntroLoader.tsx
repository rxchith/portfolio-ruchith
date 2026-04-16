'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { getPath } from '../utils/getPath';

interface BlobTrail {
  x: number;
  y: number;
  size: number;
  opacity: number;
  birth: number;
}

const HOLD_DURATION = 3000; // 3 seconds to reveal

const IntroLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouseRef = useRef({ x: -9999, y: -9999 });
  const trailsRef = useRef<BlobTrail[]>([]);
  const rafRef = useRef<number>(0);
  const holdStartRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number>(0);
  const isHoldingRef = useRef(false);
  const progressRef = useRef(0);
  const wavePhaseRef = useRef(0);
  const prevTimeRef = useRef<number>(0);

  const [dismissed, setDismissed] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Load images
  useEffect(() => {
    let loaded = 0;
    const checkDone = () => {
      loaded++;
      if (loaded >= 2) setImagesLoaded(true);
    };

    const img1 = new Image();
    img1.crossOrigin = 'anonymous';
    img1.src = getPath('/images/image1.webp');
    img1.onload = checkDone;
    img1.onerror = checkDone;
    baseImgRef.current = img1;

    const img2 = new Image();
    img2.crossOrigin = 'anonymous';
    img2.src = getPath('/images/image2.webp');
    img2.onload = checkDone;
    img2.onerror = checkDone;
    revealImgRef.current = img2;
  }, []);

  // Dismiss animation
  const dismiss = useCallback(() => {
    if (dismissed) return;
    setDismissed(true);

    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 1.4,
        ease: 'power4.inOut',
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [dismissed]);

  // Hold interaction handlers
  const startHold = useCallback(
    (x: number, y: number) => {
      if (dismissed) return;
      holdStartRef.current = performance.now();
      isHoldingRef.current = true;
      mouseRef.current = { x, y };
      if (smoothMouseRef.current.x < -5000) {
        smoothMouseRef.current = { x, y };
      }
    },
    [dismissed]
  );

  const endHold = useCallback(() => {
    isHoldingRef.current = false;
  }, []);


  const updateMouse = useCallback((x: number, y: number) => {
    mouseRef.current = { x, y };
    if (smoothMouseRef.current.x < -5000) {
      smoothMouseRef.current = { x, y };
    }
  }, []);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse
    const onMouseDown = (e: MouseEvent) => startHold(e.clientX, e.clientY);
    const onMouseUp = () => endHold();
    const onMouseMove = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY);
      if (!isHoldingRef.current) {
        // For hover reveal on desktop
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startHold(t.clientX, t.clientY);
    };
    const onTouchEnd = () => endHold();
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      updateMouse(t.clientX, t.clientY);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [startHold, endHold, updateMouse]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      offCanvas.width = window.innerWidth;
      offCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawImageCover = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      w: number,
      h: number
    ) => {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let sx = 0,
        sy = 0,
        sw = img.naturalWidth,
        sh = img.naturalHeight;

      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    };

    // Organic blob shape generator
    const drawBlob = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      time: number,
      seed: number
    ) => {
      ctx.beginPath();
      const points = 8;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise =
          Math.sin(angle * 3 + time * 2 + seed) * 0.15 +
          Math.sin(angle * 5 + time * 3 + seed * 2) * 0.1;
        const r = radius * (1 + noise);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Smooth curve through points
          const prevAngle = ((i - 1) / points) * Math.PI * 2;
          const prevNoise =
            Math.sin(prevAngle * 3 + time * 2 + seed) * 0.15 +
            Math.sin(prevAngle * 5 + time * 3 + seed * 2) * 0.1;
          const prevR = radius * (1 + prevNoise);
          const prevX = cx + Math.cos(prevAngle) * prevR;
          const prevY = cy + Math.sin(prevAngle) * prevR;

          const cpx = (prevX + x) / 2 + Math.sin(angle * 2 + time) * radius * 0.1;
          const cpy = (prevY + y) / 2 + Math.cos(angle * 2 + time) * radius * 0.1;
          ctx.quadraticCurveTo(cpx, cpy, x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    };

    // Draw wave lines in background
    const drawWaves = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      time: number,
      mx: number,
      my: number
    ) => {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;

      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const baseY = h * 0.3 + i * (h * 0.06);
        for (let x = 0; x < w; x += 4) {
          const mouseInfluence =
            Math.exp(-Math.pow((x - mx) / (w * 0.3), 2)) *
            Math.exp(-Math.pow((baseY - my) / (h * 0.3), 2)) *
            20;
          const y =
            baseY +
            Math.sin(x * 0.005 + time * 0.5 + i * 0.5) * 15 +
            Math.sin(x * 0.012 + time * 0.3) * 8 +
            mouseInfluence * Math.sin(time * 2 + i);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const loopTime = performance.now();
      const time = loopTime * 0.001;
      const dt = prevTimeRef.current ? loopTime - prevTimeRef.current : 16;
      prevTimeRef.current = loopTime;
      
      wavePhaseRef.current = time;

      // Smooth mouse following
      const smx = smoothMouseRef.current;
      smx.x += (mouseRef.current.x - smx.x) * 0.08;
      smx.y += (mouseRef.current.y - smx.y) * 0.08;

      // Update hold progress
      if (isHoldingRef.current) {
        progressRef.current = Math.min(1, progressRef.current + dt / HOLD_DURATION);
      } else {
        progressRef.current = Math.max(0, progressRef.current - dt / 1500); // 1.5 seconds to fade back
      }
      setHoldProgress(progressRef.current);

      if (progressRef.current >= 1) {
        dismiss();
        cancelAnimationFrame(rafRef.current);
        return;
      }

      // Add trail blobs while holding or having some progress
      if (
        isHoldingRef.current &&
        trailsRef.current.length < 15 &&
        Math.random() > 0.6
      ) {
        trailsRef.current.push({
          x: smx.x + (Math.random() - 0.5) * 30,
          y: smx.y + (Math.random() - 0.5) * 30,
          size: 30 + Math.random() * 40,
          opacity: 0.6,
          birth: time,
        });
      }

      // Fade out trails
      trailsRef.current = trailsRef.current
        .map((t) => ({ ...t, opacity: t.opacity * 0.96 }))
        .filter((t) => t.opacity > 0.01);

      // 1. Draw base image (headshot)
      ctx.clearRect(0, 0, w, h);
      if (baseImgRef.current && baseImgRef.current.complete) {
        drawImageCover(ctx, baseImgRef.current, w, h);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle parallax shift on base image
      const parallaxX = ((smx.x - w / 2) / w) * -8;
      const parallaxY = ((smx.y - h / 2) / h) * -8;

      // 2. Draw wave lines
      drawWaves(ctx, w, h, time, smx.x, smx.y);

      // 3. Reveal second image through blob mask
      if (
        revealImgRef.current &&
        revealImgRef.current.complete &&
        smx.x > -5000 &&
        offCtx
      ) {
        offCtx.clearRect(0, 0, w, h);
        
        // 1. Draw all blob shapes as solid black (these form the mask)
        offCtx.globalCompositeOperation = 'source-over';
        offCtx.filter = 'blur(20px)';
        offCtx.fillStyle = '#000';

        // Create main blob that expands exponentially
        const maxRadius = Math.max(w, h) * 1.5;
        const blobRadius =
          120 + Math.pow(progressRef.current, 3) * maxRadius + Math.sin(time * 2) * 15;

        drawBlob(offCtx, smx.x, smx.y, blobRadius, time, 0);

        // Draw trail blobs
        trailsRef.current.forEach((trail) => {
          const trailRadius = trail.size * trail.opacity + Math.pow(progressRef.current, 3) * maxRadius * 0.5;
          drawBlob(offCtx, trail.x, trail.y, trailRadius, time, trail.birth);
        });

        // 2. Draw the reveal image only INSIDE the shapes we just drew
        offCtx.globalCompositeOperation = 'source-in';
        offCtx.filter = 'none';
        drawImageCover(offCtx, revealImgRef.current, w, h);

        // Reset state for next frame
        offCtx.globalCompositeOperation = 'source-over';

        // 3. Draw offscreen composite back to main canvas
        ctx.drawImage(offCanvas, 0, 0);
      }

      // 4. Draw hold progress ring
      if (isHoldingRef.current && progressRef.current > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(
          smx.x,
          smx.y,
          80 + progressRef.current * 30,
          -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * progressRef.current
        );
        ctx.stroke();

        // Glow effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();
      }

      // Subtle vignette
      const vignette = ctx.createRadialGradient(
        w / 2,
        h / 2,
        w * 0.2,
        w / 2,
        h / 2,
        w * 0.8
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [imagesLoaded, dismiss]);

  if (dismissed) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] bg-black"
      style={{ touchAction: 'none' }}
    >
      {/* Full-screen interactive canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: 'none' }}
      />

      {/* Vignette gradients for text legibility */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 to-transparent z-[5] pointer-events-none" />

      {/* Name — top left */}
      <div
        className="absolute top-8 left-8 z-10 pointer-events-none"
        style={{
          fontFamily: 'var(--font-soria), serif',
          opacity: 0.9,
        }}
      >
        <div className="text-white leading-[0.9]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          RUCHITH
        </div>
        <div
          className="text-white leading-[0.9]"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', opacity: 0.5 }}
        >
          RAMESH
        </div>
      </div>

      {/* Role — top right */}
      <div
        className="absolute top-8 right-8 z-10 pointer-events-none text-right"
        style={{
          fontFamily: 'var(--font-soria), serif',
          opacity: 0.9,
        }}
      >
        <div className="text-white leading-[0.9]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          PRODUCT
        </div>
        <div
          className="text-white leading-[0.9]"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', opacity: 0.5 }}
        >
          DESIGNER
        </div>
      </div>

      {/* Instruction hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <p
          className="text-white/50 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          {holdProgress > 0.01
            ? `${Math.round(holdProgress * 100)}%`
            : 'TAP & HOLD TO ENTER'}
        </p>

        {/* Progress bar */}
        <div className="mt-3 w-40 h-[2px] bg-white/10 mx-auto rounded-full overflow-hidden">
          <div
            className="h-full bg-white/70 rounded-full transition-all duration-100"
            style={{ width: `${holdProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
