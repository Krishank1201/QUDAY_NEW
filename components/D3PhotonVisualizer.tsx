import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3PhotonVisualizerProps {
  sourceType: 'A' | 'B';
}

interface Photon {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  age: number;
  maxAge: number;
  color: string;
}

export const D3PhotonVisualizer: React.FC<D3PhotonVisualizerProps> = ({ sourceType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 160 });
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  // Monitor parent dimensions and keep centering perfect
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width: width || 300, height: 160 });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear previous elements
    d3.select(svg).selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const cx = width / 2;
    const cy = height / 2;

    const svgSelect = d3.select(svg)
      .attr('width', width)
      .attr('height', height);

    // Defs for glowing and gradient styles
    const defs = svgSelect.append('defs');

    // Create a radial glow filter for the central non-linear BBO crystal
    const filter = defs.append('filter')
      .attr('id', `glow-${sourceType}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

    // Define colors depending on the selected optical channel spectrum
    const primaryColor = sourceType === 'A' ? '#a855f7' : '#ff5a36'; // Purple (405nm UV) vs Orange (775nm Red)
    const secondaryColor = sourceType === 'A' ? '#3b82f6' : '#ec4899'; // Blue (810nm Red) vs Pink (1550nm IR)

    // Center Quantum Crystal
    const centerGroup = svgSelect.append('g')
      .attr('transform', `translate(${cx}, ${cy})`);

    // Subtle background targeting crosshair matching our aerospace system design
    const bgGroup = svgSelect.append('g').attr('opacity', 0.25);
    
    // Circle rings
    bgGroup.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 50)
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3, 4');

    bgGroup.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 75)
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '1, 5');

    // Target axes
    bgGroup.append('line')
      .attr('x1', cx - 90).attr('y1', cy).attr('x2', cx + 90).attr('y2', cy)
      .attr('stroke', '#334155').attr('stroke-width', 0.5);
    bgGroup.append('line')
      .attr('x1', cx).attr('y1', cy - 70).attr('x2', cx).attr('y2', cy + 70)
      .attr('stroke', '#334155').attr('stroke-width', 0.5);

    // Dynamic crystal scale
    const crystal = centerGroup.append('polygon')
      .attr('points', '-10,0 -5,-9 5,-9 10,0 5,9 -5,9')
      .attr('fill', primaryColor)
      .attr('opacity', 0.8)
      .style('filter', `url(#glow-${sourceType})`)
      .style('cursor', 'pointer');

    const crystalCore = centerGroup.append('circle')
      .attr('r', 4)
      .attr('fill', '#ffffff');

    // Holographic measurement reading overlay
    const overlayText = svgSelect.append('text')
      .attr('x', 15)
      .attr('y', 20)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '8px')
      .attr('fill', '#e2e8f0')
      .attr('opacity', 0.4)
      .text('SYS://QUANTUM_SPONTANEOUS_DOWN_CONVERSION');

    const rateText = svgSelect.append('text')
      .attr('x', 15)
      .attr('y', 32)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '8px')
      .attr('class', 'photon-rate-label')
      .attr('fill', primaryColor)
      .text('CONV_RATE: 1.4 MHz');

    // Track active photons
    let photons: Photon[] = [];
    const maxAge = 80;

    const spawnPhotons = () => {
      const angle = Math.random() * Math.PI * 2;
      const id1 = Math.random().toString();
      const id2 = Math.random().toString();
      const speed = 1.2 + Math.random() * 0.8;

      // Spontaneous Parametric Down-Conversion generates a pair of entangled photons
      photons.push({
        id: id1,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: angle,
        speed: speed,
        age: 0,
        maxAge: maxAge,
        color: primaryColor
      });

      // Epistemically entangled counterpart traveling exactly opposite to conserve momentum
      photons.push({
        id: id2,
        x: cx,
        y: cy,
        vx: -Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        angle: angle + Math.PI,
        speed: speed,
        age: 0,
        maxAge: maxAge,
        color: secondaryColor
      });
    };

    let baseInterval = sourceType === 'A' ? 140 : 180;
    let spawnTimer = 0;

    const particlesGroup = svgSelect.append('g');

    // Main animation loop inside D3
    let animFrame: number;
    const tick = () => {
      // Adjusted emission density on mouse hover
      const generationSpeedMultiplier = isHovered ? 2.5 : 1.0;
      spawnTimer += 1 * generationSpeedMultiplier;
      if (spawnTimer >= baseInterval / 12) {
        spawnPhotons();
        spawnTimer = 0;
      }

      // Update rates label dynamic values
      rateText.text(`CONV_RATE: ${(1.2 * generationSpeedMultiplier + Math.random() * 0.2).toFixed(2)} MHz`);

      // Update positions and handle force interactions
      photons.forEach(p => {
        p.age += 1;
        p.x += p.vx;
        p.y += p.vy;

        // Magnetized hover coordinates pull photon streams slightly towards cursor to display interactivity
        if (isHovered && mouseRef.current) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const pullForce = 0.045 * (1 - dist / 120);
            p.vx += (dx / dist) * pullForce;
            p.vy += (dy / dist) * pullForce;
          }
        }
      });

      // Filter out aged particles
      photons = photons.filter(p => p.age < p.maxAge);

      // Data bind photons inside SVG with unique key preservation
      const selection = particlesGroup.selectAll<SVGCircleElement, Photon>('circle.photon')
        .data(photons, d => d.id);

      // Enter
      selection.enter()
        .append('circle')
        .attr('class', 'photon')
        .attr('r', 2.5)
        .attr('fill', d => d.color)
        .style('filter', `url(#glow-${sourceType})`)
        .merge(selection) // Update
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('opacity', d => {
          const ratio = d.age / d.maxAge;
          return Math.sin(ratio * Math.PI) * 0.95; // Beautiful fade in and fade out envelope
        });

      // Exit
      selection.exit().remove();

      // Pulse crystal core
      const t = Date.now() / 150;
      const crystalScale = 1.0 + Math.sin(t) * 0.12 + (isHovered ? 0.25 : 0);
      crystal.attr('transform', `scale(${crystalScale})`);

      animFrame = requestAnimationFrame(tick);
    };

    tick();

    // Bind event handlers on parent container interface using standard D3 interaction layers
    svgSelect.on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event);
      mouseRef.current = { x: mx, y: my };
    });

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [dimensions, isHovered, sourceType]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-[180px] bg-slate-950 rounded-[2rem] border border-surface-border/50 overflow-hidden group cursor-crosshair mt-4 transition-all hover:bg-slate-900 hover:border-quantum-500/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseRef.current = null;
      }}
    >
      <svg ref={svgRef} className="block overflow-visible"></svg>
      
      {/* Decorative reticle markings in corners */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-surface-border/40 group-hover:border-quantum-500/50 transition-colors"></div>
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-surface-border/40 group-hover:border-quantum-500/50 transition-colors"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-surface-border/40 group-hover:border-quantum-500/50 transition-colors"></div>
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-surface-border/40 group-hover:border-quantum-500/50 transition-colors"></div>

      <div className="absolute bottom-3 right-4 font-mono text-[8px] text-content-dim/30 tracking-wider">
        STATUS // ACTIVE
      </div>
    </div>
  );
};
