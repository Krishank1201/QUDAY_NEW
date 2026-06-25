import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface SoftwarePageProps {
  lang: Language;
  content: any;
  onBack: () => void;
  onLaunchDashboard: () => void;
}

const SoftwarePage: React.FC<SoftwarePageProps> = ({ lang, content, onBack, onLaunchDashboard }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      pulseAngle: number;
    }> = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      pulseAngle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isUV = document.documentElement.classList.contains('theme-uv');
      const pointColor = isUV ? 'rgba(168, 85, 247, 0.45)' : 'rgba(239, 68, 68, 0.22)';
      const connectionColor = isUV ? 'rgba(6, 182, 212, 0.08)' : 'rgba(249, 115, 22, 0.04)';

      // 1. Particle movement & rendering
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseAngle += 0.02;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const sizeOffset = Math.sin(p.pulseAngle) * 0.6;
        const currentSize = Math.max(0.5, p.size + sizeOffset);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = pointColor;
        ctx.fill();

        // 2. Connect near elements
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = (1 - dist / 140) * 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-surface-base relative z-20 overflow-hidden w-full">
      {/* Dynamic software cybernetic canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
        style={{ zIndex: -1 }}
      />
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-content-dim hover:text-content-main mb-8 transition-colors interactive"
        >
          <iconify-icon icon="solar:arrow-left-linear"></iconify-icon>
          {lang === Language.EN ? 'Back to Core' : 'Zurück zum Kern'}
        </button>

        <div className="text-center mb-16 max-w-4xl mx-auto">
           <h1 className="text-5xl md:text-7xl font-black font-display text-content-main mb-6 tracking-tighter">
             {content.hero.title}
           </h1>
           <p className="text-xl text-content-dim font-light leading-relaxed mb-10">
             {content.hero.desc}
           </p>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col items-center"
           >
             <button 
               onClick={onLaunchDashboard}
               className="group relative px-12 py-5 bg-[#FF3333] hover:bg-[#FF4444] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,51,51,0.3)] hover:shadow-[0_0_60px_rgba(255,51,51,0.5)] active:scale-95 flex items-center gap-3"
             >
               Launch QKD Dashboard Suite
               <iconify-icon icon="solar:round-alt-arrow-right-bold" class="text-lg"></iconify-icon>
               <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </button>
           </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-32">
         <h2 className="text-3xl font-display font-black uppercase mb-16 text-center text-content-main">Software Capabilities</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {content.capabilities.map((cap: any, i: number) => (
               <div key={i} className="group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-1 bg-quantum-500 mb-6 group-hover:w-24 transition-all duration-300"></div>
                  <h3 className="text-2xl font-black text-content-main mb-4 group-hover:text-quantum-500 transition-colors duration-300">{cap.title}</h3>
                  <p className="text-content-dim text-lg font-light leading-relaxed">{cap.desc}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="bg-surface-panel border-t border-surface-border py-24">
         <div className="max-w-7xl mx-auto px-6 text-center">
             <h2 className="text-3xl font-display font-black uppercase mb-8 text-content-main">Beyond the Dashboard</h2>
             <div className="max-w-2xl mx-auto glass-panel p-10 rounded-3xl border border-dashed border-surface-border">
                <p className="text-content-dim font-light mb-8">
                   Do you have specific security compliance needs? We build custom protocols and specialized UI layers for RI-QKD implementations.
                </p>
                <div className="flex justify-center gap-4">
                   <span className="px-3 py-1 bg-surface-base/10 rounded text-[10px] font-mono text-content-sub">PYTHON API</span>
                   <span className="px-3 py-1 bg-surface-base/10 rounded text-[10px] font-mono text-content-sub">C++ DRIVERS</span>
                   <span className="px-3 py-1 bg-surface-base/10 rounded text-[10px] font-mono text-content-sub">LABVIEW</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default SoftwarePage;