# Ruchith Ramesh — Product Designer

Welcome to my digital space. This project is a high-fidelity, interactive 3D portfolio designed to push the boundaries of traditional web experiences. As a **Product Designer**, I view the web not just as a collection of pages, but as a spatial environment where user interaction and visual storytelling intersect.

[Live Portfolio](https://rxchith.github.io/portfolio-ruchith/)

---

## 🎨 Design Philosophy 
The core objective of this portfolio was to create an **Immersive Surface Experience**. By blending traditional typography with dynamic 3D elements, the design seeks to achieve a "zero-gravity" aesthetic that feels both premium and experimental.

- **Spatial hierarchy**: Using Z-depth to categorize information and guide the user’s eye.
- **Micro-interactions**: Every movement of the mouse or scroll triggers a subtle response from the environment, reinforcing a sense of "alive" software.
- **Materiality**: Utilizing high-performance shaders to simulate glass, chrome, and clay textures that react to light in real-time.

---

## 🛠 The Toolkit (Why these tools?)

While I am a designer, I believe in understanding the medium I design for. This project uses a modern stack to ensure that high-quality visuals don't compromise performance.

### Core Architecture
- **Next.js 15**: Chosen for its robust performance optimizations and SEO capabilities. It provides the foundation for a fast, reliable, and accessible site.
- **React**: The structural framework used to build reusable components, allowing for a scalable design system.

### The 3D Layer
- **Three.js (React Three Fiber & Drei)**: This is the heart of the experience. It allows me to bridge the gap between Figma/Blender and the browser. I used R3F to create the interactive "Glossy Shapes" and the complex "Window Model" that responds to user scroll.
- **OGL**: Used specifically for the `GradientBlinds` background to ensure high-performance WebGL rendering for complex light simulations without overtaxing the GPU.

### Animation & Interaction
- **GSAP (GreenSock Animation Platform)**: For cinematic timing. GSAP handles the refined entrance sequences and portal transitions where precise, non-linear easing is required to feel "natural."
- **Zustand**: A lightweight state management library. It is used to coordinate the "Portal" transitions between different sections (Work, Projects, Contact) without the overhead of heavier frameworks.
- **Tailwind CSS**: Used to handle the layout and typography layer, ensuring that the 2D UI elements are as clean and responsive as the 3D background.

---

## 🚀 Key Features

- **Dynamic Depth Cascade**: A hero section that utilizes a staggered 3D layout to create a deep parallax effect.
- **Interactive Force Fields**: A project showcase that reacts to the user's touch/cursor, simulating a physical force field using Canvas2D.
- **Adaptive Mobile Layout**: Custom-tuned 3D coordinates and density filtering for vertical screens, ensuring a premium experience across all devices.
- **The "Portal" System**: A seamless transition mechanic that allows users to "enter" specific case studies while keeping the 3D environment persistent.

---

## 📟 Local Setup

If you'd like to explore the code behind these designs:

1. **Clone the repo**
   ```bash
   git clone https://github.com/rxchith/portfolio-ruchith.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

Designed and Developed by **Ruchith Ramesh**. 
*Pushing the boundaries of the web, one frame at a time.*
