import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface ConsultancyPageProps {
  lang: Language;
  content: any;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const ConsultancyPage: React.FC<ConsultancyPageProps> = ({ lang, content, onBack, onNavigate }) => {
  const [activeCase, setActiveCase] = useState(content.useCases[0].id);
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

    let angle1 = 0;
    let angle2 = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isUV = document.documentElement.classList.contains('theme-uv');
      const tint = isUV ? 'rgba(168, 85, 247, 0.018)' : 'rgba(239, 68, 68, 0.009)';
      const lines = isUV ? 'rgba(168, 85, 247, 0.012)' : 'rgba(239, 68, 68, 0.006)';

      angle1 += 0.001;
      angle2 -= 0.0015;

      // Draw two persistent background target dials representing scientific measurement grids
      const drawsDial = (cx: number, cy: number, radius: number, angle: number) => {
        ctx.save();
        ctx.strokeStyle = tint;
        ctx.lineWidth = 1;

        // Concentric rings
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        // Aligned hash ticks rotating
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
          const sa = a + angle;
          const sx = cx + Math.cos(sa) * (radius - 12);
          const sy = cy + Math.sin(sa) * (radius - 12);
          const ex = cx + Math.cos(sa) * radius;
          const ey = cy + Math.sin(sa) * radius;
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
        }
        ctx.strokeStyle = lines;
        ctx.stroke();
        ctx.restore();
      };

      // Top Right Target
      drawsDial(width * 0.85, height * 0.25, 180, angle1);

      // Bottom Left Target
      drawsDial(width * 0.15, height * 0.75, 280, angle2);

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
      {/* Target aligned Dial consultancy backdrop */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
        style={{ zIndex: -1 }}
      />
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-content-dim hover:text-quantum-500 mb-8 transition-colors interactive"
        >
          <iconify-icon icon="solar:arrow-left-linear"></iconify-icon>
          {lang === Language.EN ? 'Back to Core' : 'Zurück zum Kern'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-quantum-500/20 bg-quantum-500/5 backdrop-blur-md mb-8">
               <span className="text-[9px] font-mono font-bold text-quantum-500 uppercase tracking-widest">Quantum Decoded</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display text-content-main mb-8 leading-[0.9] tracking-tighter">
              {content.hero.title.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 1 ? 'text-content-sub' : ''}>{word} </span>
              ))}
            </h1>
            <p className="text-xl text-content-dim font-light leading-relaxed mb-10 max-w-lg">
              {content.hero.desc}
            </p>
            <div className="flex flex-wrap gap-4">
               <button onClick={() => onNavigate('contact')} className="px-8 py-4 bg-content-main text-surface-base font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-quantum-500 hover:shadow-lg hover:shadow-quantum-500/40 hover:scale-105 transition-all duration-300 interactive">
                 {content.hero.cta}
               </button>
               <button onClick={() => document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 border-2 border-content-main/20 text-content-main font-black text-xs uppercase tracking-[0.2em] rounded-full hover:border-quantum-500 hover:text-quantum-500 hover:bg-quantum-500/10 hover:scale-105 transition-all duration-300 interactive">
                 {lang === Language.EN ? 'View Use Cases' : 'Anwendungsfälle'}
               </button>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
             <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-quantum-500/20 to-transparent border border-surface-border p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
                <div className="relative z-10">
                   <h3 className="text-3xl font-display font-black uppercase text-content-main mb-2">Quantum Compliance</h3>
                   <div className="h-1 w-20 bg-quantum-500 mb-6"></div>
                   <p className="text-sm font-mono text-content-dim mb-8">
                     // COMPLIANCE: EAL4+<br/>
                     // STANDARD: ISO/IEC 27001<br/>
                     // ORIGIN: JENA, DE
                   </p>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full border border-surface-border flex items-center justify-center text-content-main"><iconify-icon icon="solar:shield-check-linear" width="24"></iconify-icon></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-content-sub">German Security Standard</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Use Case Navigator */}
        <section id="use-cases" className="mb-32 scroll-mt-32">
          <h2 className="text-3xl font-display font-black uppercase mb-12 text-center">Business Scenarios</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1 space-y-2">
                {content.useCases.map((uc: any) => (
                  <button
                    key={uc.id}
                    onClick={() => setActiveCase(uc.id)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 interactive group ${activeCase === uc.id ? 'bg-quantum-500 text-white border-quantum-500 shadow-lg shadow-quantum-500/30 scale-105 relative z-10' : 'bg-surface-panel border-surface-border hover:border-quantum-500/50 hover:bg-surface-panel/80 hover:scale-[1.02]'}`}
                  >
                     <div className="flex justify-between items-center">
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${activeCase === uc.id ? 'text-white' : 'text-content-sub group-hover:text-content-main'}`}>{uc.title}</span>
                        {activeCase === uc.id && <iconify-icon icon="solar:arrow-right-linear" width="16" class="text-white"></iconify-icon>}
                     </div>
                  </button>
                ))}
             </div>
             
             <div className="lg:col-span-2">
               <AnimatePresence mode="wait">
                 {content.useCases.map((uc: any) => uc.id === activeCase && (
                   <motion.div 
                     key={uc.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="bg-surface-panel border border-surface-border rounded-[2.5rem] p-12 h-full flex flex-col justify-center"
                   >
                       <span className="text-quantum-500 font-black text-[9px] uppercase tracking-[0.3em] mb-4 block">Recommended Solution</span>
                      <h3 className="text-4xl font-display font-black text-content-main mb-6">{uc.solution}</h3>
                      <p className="text-content-dim text-lg font-light leading-relaxed mb-8 border-l-2 border-quantum-500 pl-6">
                        {uc.outcome}
                      </p>
                      <div className="mt-auto pt-8 border-t border-surface-border flex gap-8">
                         <div className="flex flex-col">
                            <span className="text-[9px] text-content-sub font-bold uppercase tracking-widest mb-1">Deployment</span>
                            <span className="text-content-main font-mono text-xs">3-6 Months</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] text-content-sub font-bold uppercase tracking-widest mb-1">Tech Stack</span>
                            <span className="text-content-main font-mono text-xs">BBM92 / E91</span>
                         </div>
                      </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          </div>
        </section>

        {/* Protocols Grid */}
        <section className="mb-32">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.protocols.map((p: any, i: number) => (
                <div key={i} className="glass-panel p-8 rounded-2xl border border-surface-border hover:border-quantum-500/50 hover:shadow-lg hover:shadow-quantum-500/20 hover:-translate-y-1 transition-all duration-300 group">
                   <div className="w-12 h-12 rounded-full bg-quantum-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-quantum-500/20">
                     <iconify-icon icon="solar:shield-keyhole-linear" width="24" class="text-quantum-500"></iconify-icon>
                   </div>
                   <h3 className="text-lg font-black uppercase text-content-main mb-3 group-hover:text-quantum-500 transition-colors">{p.name}</h3>
                   <p className="text-content-dim text-sm font-light leading-relaxed">{p.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Engagement Models */}
         <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {content.engagement.map((model: any, i: number) => (
               <div key={i} className="bg-surface-panel border border-surface-border p-8 rounded-[2rem] flex flex-col hover:border-quantum-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-quantum-500/20 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-quantum-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <span className="text-content-sub text-[9px] font-black uppercase tracking-[0.2em] mb-4 group-hover:text-quantum-500 transition-colors relative z-10">{model.price}</span>
                  <h3 className="text-2xl font-display font-black text-content-main mb-8 relative z-10">{model.title}</h3>
                  <ul className="space-y-4 mb-12 flex-grow relative z-10">
                     {model.items.map((item: string, idx: number) => (
                       <li key={idx} className="flex items-start gap-3 text-xs text-content-dim font-bold uppercase tracking-wide group-hover:text-content-main transition-colors">
                          <iconify-icon icon="solar:check-circle-linear" class="text-quantum-500 shrink-0"></iconify-icon>
                          {item}
                       </li>
                     ))}
                  </ul>
                  <button onClick={() => onNavigate('contact')} className="w-full py-4 bg-transparent border-2 border-surface-border group-hover:border-quantum-500 group-hover:bg-quantum-500 group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 interactive cursor-pointer relative z-10">
                    Request Info
                  </button>
               </div>
             ))}
          </div>
        </section>

        <div className="mt-24 text-center">
           <p className="text-content-sub font-mono text-[10px] uppercase tracking-widest mb-4">Ready to secure your future?</p>
           <button onClick={() => onNavigate('contact')} className="text-3xl md:text-5xl font-display font-black text-content-main hover:text-quantum-500 transition-colors uppercase interactive cursor-pointer tracking-tighter">
             Start Feasibility Assessment <iconify-icon icon="solar:arrow-right-linear" class="align-middle ml-4"></iconify-icon>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyPage;