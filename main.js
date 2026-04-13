/* ══════════════════════════════════════════════════════
   RUCHITH PORTFOLIO — PREMIUM ENGINE
   ──────────────────────────────────────────────────────
   Libraries integrated:
   1. Lenis        → Buttery smooth scroll
   2. GSAP         → ScrollTrigger animations & tweens
   3. Three.js     → WebGL 3D fractal glass scene
   4. Anime.js     → Hero text character reveal
   5. Barba.js     → Page load curtain transition
   6. Spline       → 3D accent viewer (hero)
   ══════════════════════════════════════════════════════ */

import * as THREE from 'three';
import Lenis from 'lenis';

// ─── GLOBALS ───
const { gsap, ScrollTrigger, anime, barba } = window;
gsap.registerPlugin(ScrollTrigger);

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let gx = mx, gy = my;
const isDesktop = window.innerWidth > 768;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
}, { passive: true });


/* ═══════════════════════════════════════
   1. LENIS — SMOOTH SCROLL
   ═══════════════════════════════════════ */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});

// Connect Lenis → GSAP ScrollTrigger (single unified loop)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Smooth anchor scroll via Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});


/* ═══════════════════════════════════════
   2. THREE.JS — 3D FRACTAL GLASS SCENE
   ═══════════════════════════════════════ */
const canvas = document.getElementById('threeCanvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.025);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.set(0, 0, 28);

// ─── LIGHTS ───
scene.add(new THREE.AmbientLight(0x111111, 0.8));

const redLight1 = new THREE.PointLight(0xff3b30, 60, 90);
redLight1.position.set(-14, 10, 12);
scene.add(redLight1);

const redLight2 = new THREE.PointLight(0xff2d55, 35, 70);
redLight2.position.set(12, -6, 8);
scene.add(redLight2);

const dimLight = new THREE.PointLight(0x330808, 20, 60);
dimLight.position.set(0, -10, 20);
scene.add(dimLight);

// ─── GLASS SHARDS ───
const shardsGroup = new THREE.Group();
scene.add(shardsGroup);

const glassMat = new THREE.MeshStandardMaterial({
    color: 0xff3b30,
    metalness: 0.5,
    roughness: 0.1,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
    emissive: 0xff1111,
    emissiveIntensity: 0.04,
});

const edgeMat = new THREE.LineBasicMaterial({
    color: 0xff3b30,
    transparent: true,
    opacity: 0.18,
});

// Shard configs: [width, height, x, y, z, rotX, rotY, rotZ]
const shardData = [
    // Large background
    [14, 3.5, -9,  7,  -18, 0.3,  0.8,  0.1 ],
    [16, 4.5,  6, -4,  -22, -0.2, -0.7, 0.15],
    [12, 3,    0,  1,  -14, 0.4,  0.5,  -0.1],
    // Medium mid-ground
    [9,  2.2, -6,  5,  -9,  -0.35, 0.6,  0.2 ],
    [8,  2,    7, -2,  -7,  0.5,  -0.45, 0.1 ],
    [10, 2.5, -3, -6,  -11, 0.2,  0.35, -0.15],
    // Small foreground
    [6,  1.5,  5,  4,  -4,  -0.4, 0.5,  0.3 ],
    [5,  1.2, -7, -1,  -3,  0.6,  -0.3, -0.2],
    [4,  1,    3, -5,  -2,  -0.5, 0.65, 0.25],
    // Accent
    [7, 1.8,  -2,  3,  -6,  0.3, -0.5, 0.1 ],
    [6, 1.5,   4,  6,  -8,  -0.25, 0.4, -0.1],
    [5, 1.3,  -5, -4,  -5,  0.45, 0.35, 0.2 ],
];

const shards = [];
shardData.forEach((d) => {
    const geo = new THREE.BoxGeometry(d[0], d[1], 0.04);
    const mat = glassMat.clone();
    mat.opacity = 0.05 + Math.random() * 0.12;
    mat.emissiveIntensity = 0.02 + Math.random() * 0.06;

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d[2], d[3], d[4]);
    mesh.rotation.set(d[5], d[6], d[7]);

    // Red edge wireframe for crisp glass look
    const edgeGeo = new THREE.EdgesGeometry(geo);
    const wire = new THREE.LineSegments(edgeGeo, edgeMat.clone());
    mesh.add(wire);

    shardsGroup.add(mesh);
    shards.push({
        mesh,
        baseY: d[3],
        speed: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        depth: Math.abs(d[4]) / 22, // normalized for parallax
    });
});

// ─── THREE RENDER ───
function renderScene(time) {
    // Gentle shard floating
    for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        s.mesh.rotation.x += 0.00015 * s.speed;
        s.mesh.rotation.y += 0.00025 * s.speed;
        s.mesh.position.y = s.baseY + Math.sin(time * 0.4 * s.speed + s.phase) * 0.3;
    }

    // Camera mouse follow (subtle 3D parallax)
    if (isDesktop) {
        const tx = (mx / window.innerWidth - 0.5) * 4;
        const ty = -(my / window.innerHeight - 0.5) * 3;
        camera.position.x += (tx - camera.position.x) * 0.02;
        camera.position.y += (ty - camera.position.y) * 0.02;
    }

    // Scroll parallax — move shard group up as user scrolls
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollProgress = lenis.scroll / maxScroll;
    shardsGroup.position.y = scrollProgress * 10;

    // Subtle light drift
    redLight1.position.x = -14 + Math.sin(time * 0.2) * 2;
    redLight2.position.y = -6 + Math.cos(time * 0.15) * 1.5;

    camera.lookAt(0, scrollProgress * 3, 0);
    renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, { passive: true });


/* ═══════════════════════════════════════
   3. ANIME.JS — TEXT SPLITTING & REVEAL
   ═══════════════════════════════════════ */
function splitChars(element) {
    const nodes = Array.from(element.childNodes);
    element.innerHTML = '';

    nodes.forEach(node => {
        if (node.nodeType === 3) {
            // Text node → split into char spans
            node.textContent.split('').forEach(c => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = c === ' ' ? '\u00A0' : c;
                element.appendChild(span);
            });
        } else if (node.nodeType === 1) {
            // Element node (e.g. <span class="accent-text">)
            if (node.tagName === 'BR') {
                element.appendChild(node);
                return;
            }
            splitChars(node);
            element.appendChild(node);
        }
    });
}

// Split all title lines
document.querySelectorAll('.title-line').forEach(splitChars);


/* ═══════════════════════════════════════
   4. BARBA.JS — PAGE LOAD TRANSITION
   ═══════════════════════════════════════ */
function animateHero() {
    // Anime.js: character-by-character reveal
    anime({
        targets: '#heroTitle .char',
        translateY: [80, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1400,
        delay: anime.stagger(20, { start: 100 }),
    });

    // GSAP: remaining hero elements
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .to('.hero-scroll-hint', { opacity: 1, duration: 1 }, '-=0.3');

    // Anime.js: scroll line pulsing loop
    anime({
        targets: '.scroll-line',
        scaleY: [0, 1],
        opacity: [0.4, 1],
        easing: 'easeInOutSine',
        duration: 1500,
        direction: 'alternate',
        loop: true,
        delay: 2000,
    });

    // Anime.js: badge dot pulsing
    anime({
        targets: '.badge-dot',
        scale: [1, 0.8, 1],
        opacity: [1, 0.5, 1],
        easing: 'easeInOutSine',
        duration: 2000,
        loop: true,
    });
}

// Set initial positions for GSAP hero tweens
gsap.set('.hero-badge', { y: 20 });
gsap.set('.hero-sub', { y: 30 });
gsap.set('.hero-cta-row', { y: 30 });

// Barba.js initialization
barba.init({
    prevent: ({ el }) => {
        const href = el.getAttribute && el.getAttribute('href');
        return !href || href.startsWith('#') || href.startsWith('mailto:');
    },
    transitions: [{
        name: 'page-intro',
        once() {
            // Curtain slides up to reveal content
            return gsap.to('.page-transition', {
                yPercent: -100,
                duration: 1.2,
                ease: 'power4.inOut',
                delay: 0.4,
            });
        }
    }]
});

// After the curtain reveals, trigger hero animation
barba.hooks.afterOnce(() => {
    animateHero();
    initScrollAnimations();
});


/* ═══════════════════════════════════════
   5. GSAP — SCROLL TRIGGERED ANIMATIONS
   ═══════════════════════════════════════ */
function initScrollAnimations() {
    // ─── ABOUT SECTION ───
    gsap.from('#about .section-label', {
        scrollTrigger: { trigger: '#about', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('#about .section-header h2', {
        scrollTrigger: { trigger: '#about', start: 'top 78%' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1
    });
    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out'
    });

    // Stat cards stagger
    gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.about-stats', start: 'top 82%' },
        y: 50, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out'
    });

    // Stat counter animation
    gsap.utils.toArray('.stat-number').forEach(el => {
        const raw = el.textContent.trim();
        const num = parseInt(raw);
        const suffix = raw.replace(/[0-9]/g, '');
        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(obj, {
                    val: num,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = Math.round(obj.val) + suffix;
                    }
                });
            }
        });
    });

    // Skill pills stagger
    gsap.from('.skill-pill', {
        scrollTrigger: { trigger: '.skills-row', start: 'top 85%' },
        y: 20, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out'
    });

    // ─── PROJECTS SECTION ───
    gsap.from('#projects .section-label', {
        scrollTrigger: { trigger: '#projects', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('#projects .section-header h2', {
        scrollTrigger: { trigger: '#projects', start: 'top 78%' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1
    });
    gsap.from('.project-card', {
        scrollTrigger: { trigger: '.projects-grid', start: 'top 75%' },
        y: 80, opacity: 0, stagger: 0.2, duration: 1.1, ease: 'power3.out'
    });

    // ─── EXPERIENCE SECTION ───
    gsap.from('#experience .section-label', {
        scrollTrigger: { trigger: '#experience', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('#experience .section-header h2', {
        scrollTrigger: { trigger: '#experience', start: 'top 78%' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1
    });
    gsap.from('.testimonial-card', {
        scrollTrigger: { trigger: '.testimonials-track', start: 'top 78%' },
        y: 60, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out'
    });

    // ─── CONTACT SECTION ───
    gsap.from('.contact-inner', {
        scrollTrigger: { trigger: '#contact', start: 'top 75%' },
        y: 50, opacity: 0, scale: 0.97, duration: 1.2, ease: 'power3.out'
    });
}


/* ═══════════════════════════════════════
   6. INTERACTIONS — Cursor, Card Tilt, Hover
   ═══════════════════════════════════════ */
const cursorGlow = document.getElementById('cursorGlow');
const nav = document.getElementById('mainNav');
let wasScrolled = false;

// ─── Project card tilt (GSAP-driven) ───
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
            rotateX: -y * 8,
            rotateY: x * 8,
            y: -8,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 800,
            overwrite: 'auto',
        });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0, rotateY: 0, y: 0,
            duration: 0.6, ease: 'power2.out',
            overwrite: 'auto',
        });
    });
});

// ─── Testimonial hover glow ───
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        card.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,59,48,0.06), rgba(255,255,255,0.03))`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
        card.style.background = 'rgba(255,255,255,0.03)';
    });
});


/* ═══════════════════════════════════════
   7. UNIFIED TICK — GSAP Ticker drives everything
   ═══════════════════════════════════════ */
gsap.ticker.add((time) => {
    // Three.js render
    renderScene(time);

    // Cursor glow follow (lerp)
    gx += (mx - gx) * 0.1;
    gy += (my - gy) * 0.1;
    cursorGlow.style.transform = `translate3d(${gx - 175}px, ${gy - 175}px, 0)`;

    // Nav scroll state (toggle only on change)
    const isScrolled = lenis.scroll > 50;
    if (isScrolled !== wasScrolled) {
        wasScrolled = isScrolled;
        nav.classList.toggle('scrolled', isScrolled);
    }
});
