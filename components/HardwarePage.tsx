import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Language, Product } from '../types';
import { generateProductPDF } from '../services/pdfGenerator';
import { WorkflowParticleTrails } from './WorkflowParticleTrails';
import { D3PhotonVisualizer } from './D3PhotonVisualizer';
import { gsap } from 'gsap';

interface HardwarePageProps {
  lang: Language;
  content: any;
  protocols: any;
  products: Product[];
  onBack: () => void;
  onProductSelect: (p: Product) => void;
  theme?: 'uv' | 'ir';
}

const RippleButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ onClick, children, className, title }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      onClick();
    }, 150);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      onClick={createRipple}
      className={`relative overflow-hidden ${className}`}
      title={title}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => removeRipple(ripple.id)}
          className="absolute rounded-full bg-content-main/30 pointer-events-none"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </motion.button>
  );
};

const HardwareSkeletonGrid: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-32">
    {Array.from({ length: 4 }).map((_, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-surface-panel/5 p-8 rounded-[2rem] flex flex-col h-full border border-surface-border/50 relative overflow-hidden"
      >
        {/* Shimmer overlay block */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        {/* Category Badge skeleton */}
        <div className="h-3.5 w-24 bg-quantum-500/20 rounded-full mb-5 animate-pulse"></div>

        {/* Name/Title skeleton */}
        <div className="h-7 w-2/3 bg-content-main/15 rounded-lg mb-5 animate-pulse"></div>

        {/* Description lines skeleton */}
        <div className="space-y-2 mb-8">
          <div className="h-3.5 w-full bg-content-dim/10 rounded-md animate-pulse"></div>
          <div className="h-3.5 w-5/6 bg-content-dim/10 rounded-md animate-pulse"></div>
        </div>

        {/* Tags list skeleton */}
        <div className="flex flex-wrap gap-2 mb-10">
          <div className="h-5 w-16 bg-quantum-500/10 rounded-full animate-pulse border border-quantum-500/10"></div>
          <div className="h-5 w-24 bg-quantum-500/10 rounded-full animate-pulse border border-quantum-500/10"></div>
          <div className="h-5 w-14 bg-quantum-500/10 rounded-full animate-pulse border border-quantum-500/10"></div>
        </div>

        {/* Bottom buttons placeholders */}
        <div className="mt-auto flex gap-3 animate-pulse">
          <div className="flex-1 h-12 bg-content-main/10 rounded-full"></div>
          <div className="w-12 h-12 bg-quantum-500/15 rounded-full border border-quantum-500/20"></div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ProductCard: React.FC<{
  prod: Product;
  i: number;
  onProductSelect: (p: Product) => void;
  lang: Language;
}> = ({ prod, i, onProductSelect, lang }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out coordinate changes with low spring tension/damping to feel clean and organic
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6.5, -6.5]), { stiffness: 140, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6.5, 6.5]), { stiffness: 140, damping: 22 });

  // Translation on depth elements
  const depthX = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 140, damping: 22 });
  const depthY = useSpring(useTransform(y, [-0.5, 0.5], [-4, 4]), { stiffness: 140, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative range -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
    
    // Spotlight variables inside card elements
    el.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="bg-surface-panel/10 p-8 rounded-[2rem] flex flex-col h-full border border-surface-border group hover:border-quantum-500/40 hover:bg-surface-panel/20 transition-all relative overflow-hidden spotlight-card cursor-pointer"
    >
       {/* Animated Ambient Spotlight Shimmer moving along with user cursor precisely */}
       <div 
         className="absolute inset-0 bg-[radial-gradient(circle_at_var(--spotlight-x,50%)_var(--spotlight-y,50%),rgba(168,85,247,0.06)_0%,transparent_60%)] pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
       />

       {/* Category Label (Shifted in virtual 3D space) */}
       <motion.span 
         style={{ translateZ: 10, translateX: depthX, translateY: depthY }}
         className="text-quantum-500 text-[10px] font-black uppercase tracking-widest mb-4 inline-block"
       >
         {prod.category}
       </motion.span>

       {/* Title */}
       <motion.h3 
         style={{ translateZ: 15, translateX: depthX, translateY: depthY }}
         className="text-2xl font-black font-display text-content-main mb-4 leading-tight group-hover:text-quantum-500 transition-colors"
       >
         {prod.name}
       </motion.h3>

       {/* Description */}
       <motion.p 
         style={{ translateZ: 5 }}
         className="text-content-dim font-light text-sm mb-8 leading-relaxed h-12 overflow-hidden text-ellipsis line-clamp-2"
       >
         {prod.description}
       </motion.p>
       
       {/* Tags */}
       <motion.div 
         style={{ translateZ: 8 }}
         className="flex flex-wrap gap-2 mb-10"
       >
         {prod.features.map(tag => (
           <span key={tag} className="px-3 py-1 bg-quantum-500/10 text-quantum-500 rounded-full text-[9px] font-bold uppercase tracking-wider border border-quantum-500/20">
             {tag}
           </span>
         ))}
       </motion.div>
       
       {/* Action Buttons */}
       <motion.div 
         style={{ translateZ: 12 }}
         className="mt-auto flex gap-3 relative z-20"
       >
         <RippleButton 
           onClick={() => onProductSelect(prod)} 
           className="flex-1 py-4 bg-content-main hover:bg-content-main/80 text-surface-base rounded-full text-xs font-black uppercase tracking-[0.2em] transition-colors interactive cursor-pointer"
         >
           {lang === Language.EN ? 'Details' : 'Details'}
         </RippleButton>
         <RippleButton 
           onClick={() => generateProductPDF(prod, lang)} 
           className="px-5 py-4 bg-transparent border-2 border-content-main text-content-main hover:bg-content-main hover:text-surface-base rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 interactive cursor-pointer group"
           title={lang === Language.EN ? "Download Specs PDF" : "Spezifikationen PDF herunterladen"}
         >
           <iconify-icon icon="solar:download-square-linear" width="24" className="group-hover:scale-110 transition-transform"></iconify-icon>
         </RippleButton>
       </motion.div>
    </motion.div>
  );
};

const HardwarePage: React.FC<HardwarePageProps> = ({ lang, content, protocols, products, onBack, onProductSelect, theme }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quantum physical calibration loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Subtle GSAP staggered entrance animation for the glass-panels inside workflow section when scrolled into view
    const target = document.getElementById('workflow');
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo("#workflow .glass-panel", 
            { opacity: 0, y: 40, scale: 0.96 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 1.1, 
              stagger: 0.18, 
              ease: "power2.out" 
            }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, []);

  const featureContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4
      }
    }
  };

  const featureItemVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-surface-base relative z-20">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-content-dim hover:text-quantum-500 mb-8 transition-colors interactive"
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
           <button onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-quantum-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-content-main hover:shadow-xl transition-all duration-300 interactive shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105">
             {content.hero.cta}
           </button>
        </div>
      </div>

      {/* Workflow & Entangled Sources Visual Representation */}
      <section id="workflow" className="py-24 bg-surface-panel/5 border-t border-surface-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black font-display tracking-tighter mb-4">{content.workflow.title}</h2>
               <p className="text-content-dim font-light">{content.workflow.desc}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-24">
               {/* Source A Visual (UV to Red) */}
               <div className="glass-panel opacity-0 p-8 rounded-[3rem] relative overflow-hidden group flex flex-col justify-between h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-quantum-500/10 blur-3xl"></div>
                  <div>
                     <h4 className="text-[10px] font-black text-quantum-500 uppercase tracking-[0.4em] mb-4">Module A-405</h4>
                     <h3 className="text-3xl font-black font-display mb-6 text-content-main">405 nm (UV) → 810 nm (RED)</h3>
                     <div className="h-1 flex-grow bg-gradient-to-r from-quantum-600 to-red-500 rounded-full mb-6"></div>
                     <p className="text-content-dim text-sm font-light leading-relaxed mb-6">High-fidelity ultraviolet source optimized for VIS spectrum analysis and standard silicon-based detector integration.</p>
                  </div>
                  <D3PhotonVisualizer sourceType="A" />
               </div>
               {/* Source B Visual (Red to IR) */}
               <div className="glass-panel opacity-0 p-8 rounded-[3rem] relative overflow-hidden group flex flex-col justify-between h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl"></div>
                  <div>
                     <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Module B-775</h4>
                     <h3 className="text-3xl font-black font-display mb-6 text-content-main">775 nm (RED) → 1550 nm (IR)</h3>
                     <div className="h-1 flex-grow bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-6"></div>
                     <p className="text-content-dim text-sm font-light leading-relaxed mb-6">Telecommunication band source engineered for long-distance fiber deployment and minimal attenuation nodes.</p>
                  </div>
                  <D3PhotonVisualizer sourceType="B" />
               </div>
            </div>

            {/* Pipeline Step Representation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-12 glass-panel rounded-[3rem] border-dashed border-2 border-surface-border relative overflow-hidden opacity-0">
               {/* Ambient dynamic Three.js trails that connect Source module to Measurement node */}
               <WorkflowParticleTrails theme={theme} />

               <div id="workflow-step-01" className="text-center group relative z-10 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-full bg-quantum-500/5 flex items-center justify-center text-quantum-500 mb-4 mx-auto group-hover:scale-110 transition-transform">
                     <iconify-icon icon="solar:atom-linear" width="32"></iconify-icon>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-2 text-quantum-500">Step 01</span>
                  <div className="text-lg font-bold uppercase">{content.workflow.steps[0].title}</div>
               </div>
               <iconify-icon icon="solar:arrow-right-linear" className="hidden md:block text-content-sub relative z-10" width="32"></iconify-icon>
               <div id="workflow-step-02" className="text-center group relative z-10 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-full bg-quantum-500/5 flex items-center justify-center text-quantum-500 mb-4 mx-auto group-hover:scale-110 transition-transform">
                     <iconify-icon icon="solar:graph-linear" width="32"></iconify-icon>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-2 text-quantum-500">Step 02</span>
                  <div className="text-lg font-bold uppercase">{content.workflow.steps[1].title}</div>
               </div>
               <iconify-icon icon="solar:arrow-right-linear" className="hidden md:block text-content-sub relative z-10" width="32"></iconify-icon>
               <div id="workflow-step-03" className="text-center group relative z-10 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-full bg-quantum-500/5 flex items-center justify-center text-quantum-500 mb-4 mx-auto group-hover:scale-110 transition-transform">
                     <iconify-icon icon="solar:settings-linear" width="32"></iconify-icon>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-2 text-quantum-500">Step 03</span>
                  <div className="text-lg font-bold uppercase">{content.workflow.steps[2].title}</div>
               </div>
            </div>
          </div>
      </section>

      {/* Protocol Section */}
      <section className="py-24 bg-surface-base border-t border-surface-border">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black font-display uppercase tracking-tighter mb-4">Our Products</h2>
            <p className="text-content-dim font-light mb-16">High-performance quantum modules engineered for real-world deployment.</p>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 flex items-center gap-3 font-mono text-[10px] text-quantum-500 tracking-wider">
                    <iconify-icon icon="solar:transmission-linear" className="animate-spin text-sm"></iconify-icon>
                    <span>{lang === Language.EN ? 'ESTABLISHING SECURE OPTICAL LINK... CALIBRATING LAB SENSORS...' : 'SICHERE OPTISCHE VERBINDUNG WIRD HERGESTELLT... KALIBRIERUNG...'}</span>
                  </div>
                  <HardwareSkeletonGrid lang={lang} />
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-32"
                >
                  {products.map((prod, i) => (
                    <ProductCard 
                      key={prod.id}
                      prod={prod}
                      i={i}
                      onProductSelect={onProductSelect}
                      lang={lang}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className="text-4xl font-black font-display uppercase tracking-tighter mb-16">{lang === Language.EN ? 'Communication Protocols' : 'Kommunikations-Protokolle'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {protocols.map((proto: any, i: number) => (
                 <motion.div 
                   key={proto.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                   className="glass-panel p-6 rounded-2xl border border-surface-border group hover:border-quantum-500/40 transition-all"
                 >
                    <div className="text-lg font-black text-quantum-500 mb-2">{proto.name}</div>
                    <p className="text-xs text-content-dim leading-relaxed font-light">{proto.desc}</p>
                 </motion.div>
               ))}
            </div>
          </div>
      </section>
    </div>
  );
};

export default HardwarePage;