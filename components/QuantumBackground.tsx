import React, { useEffect, useRef } from 'react';

interface QuantumBackgroundProps {
  theme: 'uv' | 'ir';
}

const QuantumBackground: React.FC<QuantumBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });
  const ripplesRef = useRef<Array<{ x: number; y: number; r: number; maxR: number; speed: number; opacity: number }>>([]);
  const lastClickTime = useRef<number>(0);
  const scrollRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic rotation angles for laboratory scientific dials
    let rotAngle = 0;
    let fineMeasureAngle = 0;

    // Handle initial resize and clean window binding
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track cursor movement on screen with gentle lerp target
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.tx = -1000;
      mouseRef.current.ty = -1000;
    };

    // Scroll listener for Section transition evolution and Parallax depth tracking
    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Click interactive ripple triggering
    const handleMouseDown = (e: MouseEvent) => {
      const now = performance.now();
      const clickInterval = now - lastClickTime.current;
      lastClickTime.current = now;

      // Click intensity adapts dynamically based on rapid successive clicks (frequency)
      const intensity = Math.min(1.4, Math.max(0.7, 350 / Math.max(180, clickInterval)));

      // Primary shockwave concentric ring
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        maxR: Math.max(width, height) * 0.45 * intensity,
        speed: 5.2 * intensity,
        opacity: 0.75 * intensity,
      });

      // Secondary delayed wave for complex interference patterns
      setTimeout(() => {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          maxR: Math.max(width, height) * 0.36 * intensity,
          speed: 4.2 * intensity,
          opacity: 0.45 * intensity,
        });
      }, 120);

      // Kinetic repulsion flow - push closest nodes outward
      particles.forEach((p) => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 320) {
          const force = (1 - dist / 320) * 15 * intensity;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      });
    };

    // External event listener for global system disturbances (e.g. Navigation, Double Clicks, AI Assistant interaction)
    const handleDisturbance = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail;

      ripplesRef.current.push({
        x,
        y,
        r: 0,
        maxR: Math.max(width, height) * 0.38,
        speed: 5.8,
        opacity: 0.85,
      });

      particles.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 280) {
          const force = (1 - dist / 280) * 16;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.6;
          p.vy += Math.sin(angle) * force * 0.6;
        }
      });
    };

    // Attach listeners with capturing phase for clicks
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('quantum-disturbance', handleDisturbance);

    // Setup multi-layered particle system (Foreground, Midground, Background)
    const particleCount = 65;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;
      size: number;
      alpha: number;
      depthLayer: 1 | 2 | 3; // 1 = foreground (fast), 2 = midground (medium), 3 = background (slow, deep)
      pulseSpeed: number;
      pulsePhase: number;
      type: 'node' | 'dust' | 'spark' | 'fragment';
    }> = [];

    const particleTypes: ('node' | 'dust' | 'spark' | 'fragment')[] = ['node', 'dust', 'spark', 'fragment'];

    for (let i = 0; i < particleCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const layer = (i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3) as 1 | 2 | 3;
      
      particles.push({
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: layer === 1 ? Math.random() * 2.8 + 1.2 : layer === 2 ? Math.random() * 1.8 + 0.8 : Math.random() * 1.0 + 0.4,
        alpha: layer === 1 ? Math.random() * 0.55 + 0.25 : layer === 2 ? Math.random() * 0.45 + 0.15 : Math.random() * 0.25 + 0.08,
        depthLayer: layer,
        pulseSpeed: 0.006 + Math.random() * 0.012,
        pulsePhase: Math.random() * Math.PI * 2,
        type: particleTypes[i % particleTypes.length],
      });
    }

    // Main rendering clock loop
    const render = () => {
      // Dynamic colors based on active theme
      const isUV = theme === 'uv';
      const pColor = isUV ? '168, 85, 247' : '249, 115, 22'; // Purple vs Orange
      const sColor = isUV ? '6, 182, 212' : '251, 146, 60';  // Cyan vs Amber
      const gridOpacity = isUV ? 0.038 : 0.022;

      ctx.clearRect(0, 0, width, height);

      // Increment clock phases
      rotAngle += 0.0008;
      fineMeasureAngle -= 0.0022;

      // Smooth mouse coordinate interpolation (inertia filter)
      const mouse = mouseRef.current;
      if (mouse.tx === -1000) {
        mouse.x += (-1000 - mouse.x) * 0.08;
        mouse.y += (-1000 - mouse.y) * 0.08;
      } else {
        mouse.x += (mouse.tx - mouse.x) * 0.075;
        mouse.y += (mouse.ty - mouse.y) * 0.075;
      }

      // Smooth scroll interpolation (Verlet scroll spring)
      const scroll = scrollRef.current;
      scroll.current += (scroll.target - scroll.current) * 0.065;

      // Section depth evolutionary multiplier: transitions evolve with down-scroll
      const scrollFraction = Math.min(1.0, scroll.current / (document.documentElement.scrollHeight - window.innerHeight || 1));
      const sectionGridMultiplier = 1.0 + scrollFraction * 0.35; // lines widen slightly as user scrolls deeper
      const particleSpeedFactor = 1.0 + scrollFraction * 0.5;   // particles float with increased kinetic energy on deep sections

      // 1. LIGHT MODE RENDERING (LAB EXPERIMENT ATOMOSPHERE)
      if (!isUV) {
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.013)';
        ctx.lineWidth = 0.8;

        // Dial 1 (Top Right Corner Parallax)
        const dial1X = width * 0.88 - (mouse.x !== -1000 ? (mouse.x - width/2) * 0.025 : 0);
        const dial1Y = height * 0.22 - (mouse.y !== -1000 ? (mouse.y - height/2) * 0.025 : 0) + scroll.current * 0.12;
        ctx.beginPath();
        ctx.arc(dial1X, dial1Y, 160, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(dial1X, dial1Y, 150, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.008)';
        ctx.stroke();

        // Direction hashes for Dial 1
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
          const sa = a + rotAngle;
          const sx = dial1X + Math.cos(sa) * 142;
          const sy = dial1Y + Math.sin(sa) * 142;
          const ex = dial1X + Math.cos(sa) * 150;
          const ey = dial1Y + Math.sin(sa) * 150;
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
        }
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.015)';
        ctx.stroke();

        // Rotating Alignment Graph
        ctx.beginPath();
        ctx.arc(dial1X, dial1Y, 45, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.014)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dial1X - 55, dial1Y);
        ctx.lineTo(dial1X + 55, dial1Y);
        ctx.moveTo(dial1X, dial1Y - 55);
        ctx.lineTo(dial1X, dial1Y + 55);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.012)';
        ctx.stroke();

        // Dial 2 (Bottom Left Corner Parallax)
        const dial2X = width * 0.14 - (mouse.x !== -1000 ? (mouse.x - width/2) * 0.015 : 0);
        const dial2Y = height * 0.82 - (mouse.y !== -1000 ? (mouse.y - height/2) * 0.015 : 0) - scroll.current * 0.08;
        ctx.beginPath();
        ctx.arc(dial2X, dial2Y, 240, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.007)';
        ctx.stroke();

        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
          const sa = a + fineMeasureAngle;
          const sx = dial2X + Math.cos(sa) * 228;
          const sy = dial2Y + Math.sin(sa) * 228;
          const ex = dial2X + Math.cos(sa) * 240;
          const ey = dial2Y + Math.sin(sa) * 240;
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 2. DARK MODE SCANLINES & OSCILLOGRAPHS
      if (isUV) {
        // Slow sweeping virtual laser line loader for hardware aesthetic
        const sweepY = (performance.now() * 0.05) % (height + 250) - 120;
        ctx.beginPath();
        ctx.moveTo(0, sweepY);
        ctx.lineTo(width, sweepY);
        ctx.strokeStyle = `rgba(${pColor}, 0.015)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, sweepY + 12);
        ctx.lineTo(width, sweepY + 12);
        ctx.strokeStyle = `rgba(${sColor}, 0.006)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Fourier wave superpositions
        ctx.save();
        ctx.beginPath();
        const waveSegments = 160;
        const waveStep = width / waveSegments;
        const baseWaveY = height * 0.95;
        const timer = performance.now() * 0.0012;

        for (let idx = 0; idx <= waveSegments; idx++) {
          const x = idx * waveStep;
          const yOffset = 
            Math.sin(idx * 0.1 + timer) * 12 + 
            Math.cos(idx * 0.05 - timer * 0.8) * 6 +
            Math.sin(idx * 0.22 + timer * 1.5) * 3;

          if (idx === 0) ctx.moveTo(x, baseWaveY + yOffset);
          else ctx.lineTo(x, baseWaveY + yOffset);
        }
        ctx.strokeStyle = `rgba(${pColor}, 0.05)`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Companion secondary transmission wave
        ctx.beginPath();
        for (let idx = 0; idx <= waveSegments; idx++) {
          const x = idx * waveStep;
          const yOffset = 
            Math.sin(idx * 0.14 - timer * 1.1) * 8 + 
            Math.cos(idx * 0.07 + timer * 0.4) * 4;

          if (idx === 0) ctx.moveTo(x, baseWaveY + yOffset - 15);
          else ctx.lineTo(x, baseWaveY + yOffset - 15);
        }
        ctx.strokeStyle = `rgba(${sColor}, 0.026)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      // 3. PROPAGATE CLICK INTERACTIVE SHOCKWAVES
      ripplesRef.current.forEach((ripple, rIdx) => {
        ripple.r += ripple.speed;
        ripple.opacity *= 0.988; // subtle dampening exponential decay

        if (ripple.opacity < 0.015 || ripple.r > ripple.maxR) {
          ripplesRef.current.splice(rIdx, 1);
          return;
        }

        ctx.save();
        ctx.shadowBlur = isUV ? 16 : 8;
        ctx.shadowColor = `rgba(${pColor}, 0.4)`;

        // Outer coherent shock wavefront
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${pColor}, ${ripple.opacity * 0.45})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Inner constructive interference ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r * 0.84, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${sColor}, ${ripple.opacity * 0.26})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.restore();
      });

      // 4. COORDINATE DISTORTION & ADAPTIVE LENSING GRID
      const gridSpacingX = 75 * sectionGridMultiplier;
      const gridSpacingY = 75 * sectionGridMultiplier;
      const cols = Math.ceil(width / gridSpacingX) + 1;
      const rows = Math.ceil(height / gridSpacingY) + 1;

      const gridPoints: Array<Array<{ x: number; y: number }>> = [];

      for (let r = 0; r < rows; r++) {
        gridPoints[r] = [];
        for (let c = 0; c < cols; c++) {
          const origX = c * gridSpacingX;
          const origY = r * gridSpacingY;

          let ptX = origX;
          let ptY = origY;

          // Parallax depth drift on scroll within the coordinate points
          ptY -= scroll.current * 0.072;

          // Align grid perfectly with the bottom of the visible screen boundaries
          while (ptY < -gridSpacingY) ptY += height + gridSpacingY * 2;
          while (ptY > height + gridSpacingY) ptY -= height + gridSpacingY * 2;

          // 4a. Electromagnetic bending lens around cursor
          if (mouse.x !== -1000) {
            const dx = ptX - mouse.x;
            const dy = ptY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 260;

            if (dist < influenceRadius) {
              const strength = (1 - dist / influenceRadius) * 26;
              const angle = Math.atan2(dy, dx);
              // Gently lens grids outwards representationally
              ptX += Math.cos(angle) * strength;
              ptY += Math.sin(angle) * strength;
            }
          }

          // 4b. Ripple wave warping on passing click waves
          ripplesRef.current.forEach((ripple) => {
            const dx = ptX - ripple.x;
            const dy = ptY - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rippleWidth = Math.abs(dist - ripple.r);

            if (rippleWidth < 120) {
              const strength = Math.sin((rippleWidth / 120) * Math.PI) * ripple.opacity * 16;
              const angle = Math.atan2(dy, dx);
              ptX += Math.cos(angle) * strength;
              ptY += Math.sin(angle) * strength;
            }
          });

          gridPoints[r].push({ x: ptX, y: ptY });
        }
      }

      // Draw horizontal lines
      ctx.lineWidth = 0.75;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = gridPoints[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(${pColor}, ${gridOpacity})`;
        ctx.stroke();
      }

      // Draw vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const pt = gridPoints[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(${pColor}, ${gridOpacity})`;
        ctx.stroke();
      }

      // 5. INTELLECTUAL MULTI-DEPTH PARTICLE SYSTEM
      particles.forEach((p, idx) => {
        // Apply physics damping & perpetual organic noise drift
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Micro kinetic forces
        p.vx += (Math.random() - 0.5) * 0.046 * particleSpeedFactor;
        p.vy += (Math.random() - 0.5) * 0.046 * particleSpeedFactor;

        // Apply 3D layer vertical Parallax based on page scroll
        // Foreground moves fast, Midground medium, Background moves slow/deep
        const layerSpeedFactor = p.depthLayer === 1 ? 0.32 : p.depthLayer === 2 ? 0.16 : 0.04;
        let actualY = p.y - scroll.current * layerSpeedFactor;

        // Seamless wrapping bounds checking
        while (actualY < -50) actualY += height + 100;
        while (actualY > height + 50) actualY -= height + 100;

        const distanceToCursor = mouse.x !== -1000 ? Math.sqrt((p.x - mouse.x) ** 2 + (actualY - mouse.y) ** 2) : 9999;

        // Elastic pull / push relative to cursor proximity
        if (mouse.x !== -1000 && distanceToCursor < 240) {
          const elasticity = (1 - distanceToCursor / 240) * 0.44;
          const steerAngle = Math.atan2(actualY - mouse.y, p.x - mouse.x);
          
          if (idx % 2 === 0) {
            // Entangled attraction towards cursor
            p.vx -= Math.cos(steerAngle) * elasticity * 0.6;
            p.vy -= Math.sin(steerAngle) * elasticity * 0.6;
          } else {
            // Physics-based push away
            p.vx += Math.cos(steerAngle) * elasticity * 0.4;
            p.vy += Math.sin(steerAngle) * elasticity * 0.4;
          }
        }

        // Apply updated coordinates with interpolation
        p.x += p.vx;
        p.y += p.vy;

        // Horizon constraints wrap
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        // Pulse scale & transparency over modular timeline
        p.pulsePhase += p.pulseSpeed;
        const relativePulse = 0.8 + Math.sin(p.pulsePhase) * 0.25;

        // Click waves flare up nearby particles
        let clickGlowMultiplier = 0;
        ripplesRef.current.forEach((ripple) => {
          const distToRipple = Math.sqrt((p.x - ripple.x) ** 2 + (actualY - ripple.y) ** 2);
          const offsetEdge = Math.abs(distToRipple - ripple.r);
          if (offsetEdge < 60) {
            clickGlowMultiplier += (1 - offsetEdge / 60) * ripple.opacity * 1.5;
          }
        });

        // Determine rendering geometry features
        const isFocusNode = distanceToCursor < 185;
        const currentAlpha = Math.min(1.0, (isFocusNode ? p.alpha * 1.8 : p.alpha) + clickGlowMultiplier);
        const finalRenderSize = p.size * relativePulse * (1 + clickGlowMultiplier * 1.2) * (isFocusNode ? 1.3 : 1.0);

        ctx.beginPath();
        if (p.type === 'fragment' && isUV) {
          // Render as a futuristic hollow triangle / scientific segment
          ctx.save();
          ctx.translate(p.x, actualY);
          ctx.rotate(p.pulsePhase * 0.25);
          ctx.moveTo(0, -finalRenderSize * 1.8);
          ctx.lineTo(finalRenderSize * 1.5, finalRenderSize * 1.2);
          ctx.lineTo(-finalRenderSize * 1.5, finalRenderSize * 1.2);
          ctx.closePath();
          ctx.strokeStyle = `rgba(${sColor}, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
          ctx.restore();
        } else if (p.type === 'spark') {
          // Cross hair spark structure
          ctx.strokeStyle = isFocusNode ? `rgba(${sColor}, ${currentAlpha})` : `rgba(${pColor}, ${currentAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x - finalRenderSize * 1.6, actualY);
          ctx.lineTo(p.x + finalRenderSize * 1.6, actualY);
          ctx.moveTo(p.x, actualY - finalRenderSize * 1.6);
          ctx.lineTo(p.x, actualY + finalRenderSize * 1.6);
          ctx.stroke();
        } else {
          // Coherent scientific point node
          ctx.arc(p.x, actualY, finalRenderSize, 0, Math.PI * 2);
          ctx.fillStyle = isFocusNode || clickGlowMultiplier > 0.15
            ? `rgba(${sColor}, ${currentAlpha})`
            : `rgba(${pColor}, ${currentAlpha})`;
          ctx.fill();
        }

        // Concentric halo alignment around high reactive nodes
        if (isFocusNode || clickGlowMultiplier > 0.2) {
          ctx.beginPath();
          ctx.arc(p.x, actualY, finalRenderSize * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pColor}, ${currentAlpha * 0.11})`;
          ctx.fill();
        }

        // Draw connective fiber lines (Neural Network entanglement links)
        // Link boundaries scale dynamically near active areas
        const connectDistance = p.depthLayer === 3 ? 0 : isFocusNode ? 160 : 105;

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p.depthLayer !== p2.depthLayer) continue; // Only link nodes on the same virtual depth plain

          let actualY2 = p2.y - scroll.current * layerSpeedFactor;
          while (actualY2 < -50) actualY2 += height + 100;
          while (actualY2 > height + 50) actualY2 -= height + 100;

          const dxNode = p.x - p2.x;
          const dyNode = actualY - actualY2;
          const dNodes = Math.sqrt(dxNode * dxNode + dyNode * dyNode);

          if (dNodes < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, actualY);
            ctx.lineTo(p2.x, actualY2);

            const baseAlpha = (1 - dNodes / connectDistance);
            const lineAlpha = baseAlpha * (0.09 + clickGlowMultiplier * 0.14) * (isUV ? 1.0 : 0.6);

            ctx.strokeStyle = isFocusNode 
              ? `rgba(${sColor}, ${lineAlpha * 1.4})` 
              : `rgba(${pColor}, ${lineAlpha})`;
            ctx.lineWidth = isFocusNode ? 0.75 + clickGlowMultiplier * 0.3 : 0.48;
            ctx.stroke();

            // Light pulse packets sliding along neural routes
            if (isFocusNode && Math.random() < 0.04) {
              const tracePos = (performance.now() * 0.0016 + p.pulsePhase * 0.1) % 1.0;
              const px = p.x + (p2.x - p.x) * tracePos;
              const py = actualY + (actualY2 - actualY) * tracePos;
              ctx.beginPath();
              ctx.arc(px, py, 1.6, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${sColor}, ${lineAlpha * 1.7})`;
              ctx.fill();
            }
          }
        }
      });

      // 6. AMBIENT SCIENTIFIC LIGHTING GRADIENTS (Blending Overlays)
      if (isUV) {
        // Immersive Cosmic Nebula gradients
        const radialGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.75);
        radialGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
        radialGrad.addColorStop(0.65, 'rgba(3, 7, 18, 0.16)');
        radialGrad.addColorStop(1, 'rgba(1, 3, 10, 0.52)'); // elegant dark vignetted edges
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Atmospheric clean labs gradient shifts
        const labGradLeft = ctx.createRadialGradient(width * 0.15, height * 0.85, 0, width * 0.15, height * 0.85, width * 0.6);
        labGradLeft.addColorStop(0, 'rgba(239, 68, 68, 0.024)');
        labGradLeft.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = labGradLeft;
        ctx.fillRect(0, 0, width, height);

        const labGradRight = ctx.createRadialGradient(width * 0.85, height * 0.15, 0, width * 0.85, height * 0.15, width * 0.5);
        labGradRight.addColorStop(0, 'rgba(249, 115, 22, 0.016)');
        labGradRight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = labGradRight;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown, true);
      window.removeEventListener('quantum-disturbance', handleDisturbance);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: theme === 'uv' ? 'screen' : 'multiply' }}
    />
  );
};

export default QuantumBackground;
