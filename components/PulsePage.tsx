import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface PulsePageProps {
  lang: Language;
}

const NEWSLETTERS = [
  { 
    id: 1, 
    title: 'Quantum Teleportation Breakthrough', 
    date: 'Oct 2026', 
    about: 'A deep dive into the latest milestones achieved in distant node entanglement.',
    content: 'Our research team in Jena has successfully demonstrated high-fidelity quantum teleportation across a 50km metropolitan fiber network. This milestone paves the way for scalable quantum repeaters, enabling long-distance entanglement without signal degradation. By utilizing our proprietary polarization correction modules, we achieved a fidelity of 96.5%, surpassing previous records for urban environments. The implications for secure, global quantum communication networks are profound, moving us one step closer to the Quantum Internet.'
  },
  { 
    id: 2, 
    title: 'The Next Generation of QKD', 
    date: 'Sep 2026', 
    about: 'Exploring the new enhancements in our QKD dashboard and key rate bounds.',
    content: 'We are thrilled to announce the rollout of our Version 3 QKD Dashboard. Designed with real-time analytics in mind, the new dashboard provides unprecedented visibility into entanglement quality, flux rates, and error correction metrics. Accompanying this software update is our new RAMQ-2 hardware iteration, which pushes secure key rates to 1.5 kbps over 10km. With enhanced Bell verification protocols built-in, organizations can now dynamically monitor network integrity and automatically reroute keys during physical layer disruptions.'
  },
  { 
    id: 3, 
    title: 'European Quantum Ecosystem', 
    date: 'Aug 2026', 
    about: 'QuDay partners with EU institutions to set upcoming communication standards.',
    content: 'QuDay has officially joined the EuroQCI (European Quantum Communication Infrastructure) initiative as a primary hardware provider. This strategic partnership aims to standardize quantum cryptographic protocols across the continent, ensuring interoperability between different national networks. By aligning our BBM92 and RI-QKD implementations with the emerging European standards, we guarantee that our infrastructure will seamlessly integrate into the highly secure, pan-European network currently under development.'
  },
  { 
    id: 4, 
    title: 'Silicon Photonics Update', 
    date: 'Jul 2026', 
    about: 'Our progress in integrating high-fidelity sources into silicon photonics chips.',
    content: 'Miniaturization is key for mass deployment. Our latest whitepaper details the successful integration of our high-fidelity entangled photon sources into silicon photonics chips. Moving away from bulky optical tables, these new chips reduce the form factor by 90% while maintaining a fidelity > 95%. This breakthrough allows for embedding quantum sources directly into standard data center racks and even mobile platforms, drastically lowering the barrier to entry for enterprise quantum security.'
  },
  { 
    id: 5, 
    title: 'Decoherence and You', 
    date: 'Jun 2026', 
    about: 'Understanding the noise parameters in realistic fiber-optic quantum channels.',
    content: 'Decoherence is the enemy of quantum states. In this issue, we break down the environmental factors affecting fiber-optic quantum channels—from temperature fluctuations to mechanical stress. We explore how our active Polarization Correction Modules counteract these effects in real-time. Through an automated feedback loop operating at sub-millisecond speeds, our systems maintain phase stability even when cables are subjected to physical vibrations, ensuring uninterrupted secure key distribution in harsh industrial environments.'
  },
  { 
    id: 6, 
    title: 'New CEO Announcement', 
    date: 'May 2026', 
    about: 'A special letter regarding new strategic direction and product expansions.',
    content: 'We are proud to welcome Uday Chandrashekhara as the new CEO of QuDay. With his extensive background in both theoretical physics and enterprise scaling, Uday brings a bold new vision: bringing quantum cyber-sovereignty to the global market. Under his leadership, QuDay will rapidly expand its production capabilities and launch a new suite of orbital uplink systems designed for satellite integration. Read his full open letter on our commitment to physics-layer security.'
  }
];

import { AnimatePresence } from 'framer-motion';

const PulsePage: React.FC<PulsePageProps> = ({ lang }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [selectedIssue, setSelectedIssue] = React.useState<typeof NEWSLETTERS[0] | null>(null);

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

    // Flow path configuration representing quantum digital channels
    const channels = Array.from({ length: 6 }, (_, i) => ({
      y: height * (0.2 + i * 0.12),
      amplitude: 15 + Math.random() * 25,
      frequency: 0.002 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.015,
      pulses: Array.from({ length: 3 }, () => ({
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        size: 3 + Math.random() * 5,
      })),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Detect current active theme colors dynamically
      const isUV = document.documentElement.classList.contains('theme-uv');
      const pulseColor = isUV ? 'rgba(168, 85, 247, 0.07)' : 'rgba(239, 68, 68, 0.035)';
      const activeSignalColor = isUV ? '168, 85, 247' : '239, 68, 68';

      channels.forEach((channel) => {
        channel.phase += channel.speed;

        // 1. Draw sine fiber-optic channel pathways
        ctx.beginPath();
        for (let x = 0; x <= width; x += 15) {
          const y = channel.y + Math.sin(x * channel.frequency + channel.phase) * channel.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = pulseColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 2. Draw high-speed data packets sliding on the waveguides
        channel.pulses.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress > 1) {
            pulse.progress = 0;
            pulse.speed = 0.002 + Math.random() * 0.004;
          }

          const currentX = pulse.progress * width;
          const currentY = channel.y + Math.sin(currentX * channel.frequency + channel.phase) * channel.amplitude;

          // Compute fade multiplier at boundaries
          const fade = Math.sin(pulse.progress * Math.PI);

          ctx.save();
          // Halo glow
          ctx.beginPath();
          ctx.arc(currentX, currentY, pulse.size * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${activeSignalColor}, ${0.11 * fade})`;
          ctx.fill();

          // Core point
          ctx.beginPath();
          ctx.arc(currentX, currentY, pulse.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${activeSignalColor}, ${0.55 * fade})`;
          ctx.fill();
          ctx.restore();
        });
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
    <div className="relative pt-20 pb-24 min-h-screen z-10 flex flex-col items-center w-full overflow-hidden">
      {/* Embedded in-section Canvas animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
        style={{ zIndex: -1 }}
      />
      <div className="max-w-7xl mx-auto px-6 w-full text-center mb-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          className="inline-block mb-6 px-6 py-2 rounded-full border border-[var(--pulse-color)] bg-[var(--pulse-color)]/10 backdrop-blur-md"
        >
          <span className="text-[var(--pulse-color)] text-xs font-bold uppercase tracking-[0.3em]">
            {lang === Language.EN ? 'Intelligence Hub' : 'Nachrichtenzentrum'}
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl mb-6 font-display font-black tracking-tighter"
          style={{ color: 'var(--pulse-color)' }}
        >
          Quantum Pulse
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-content-dim font-light text-xl max-w-2xl mx-auto"
        >
          {lang === Language.EN 
            ? 'The latest transmissions from the frontier of quantum technology.' 
            : 'Die neuesten Übertragungen von der Grenze der Quantentechnologie.'}
        </motion.p>
      </div>

      <div className="w-full relative px-6 md:px-12 pb-24 flex flex-wrap gap-8 items-stretch justify-center z-20">
        {NEWSLETTERS.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }}
            className="w-full md:w-[calc(50%-1rem)] xl:w-[calc(33.333%-1.5rem)] rounded-[2rem] p-8 bg-surface-panel/30 hover:bg-surface-panel/50 backdrop-blur-xl border border-surface-border hover:border-[var(--pulse-color)]/50 shadow-2xl transition-all duration-500 group overflow-hidden relative flex flex-col interactive cursor-pointer hover:-translate-y-2"
            onClick={() => setSelectedIssue(item)}
          >
            {/* Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--pulse-color)] opacity-10 blur-3xl rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
            
            <div className="mb-6 flex justify-between items-center text-xs font-mono font-bold uppercase tracking-widest text-content-sub border-b border-surface-border/50 pb-4 relative z-10">
              <span className="bg-surface-base px-3 py-1 rounded-full border border-surface-border">Vol. {String(NEWSLETTERS.length - i).padStart(2, '0')}</span>
              <span className="text-[var(--pulse-color)] flex items-center gap-2">
                <iconify-icon icon="solar:calendar-linear"></iconify-icon> {item.date}
              </span>
            </div>
            
            <h3 className="text-2xl font-black font-display text-content-main leading-tight mb-4 group-hover:text-[var(--pulse-color)] transition-colors duration-300 relative z-10">
              {item.title}
            </h3>
            
            <p className="text-content-dim text-sm font-light leading-relaxed mb-8 flex-grow relative z-10">
              {item.about}
            </p>
            
            <div className="mt-auto flex justify-between items-center pt-6 border-t border-surface-border/30 relative z-10">
              <div className="flex gap-1">
                {[1, 2, 3].map(dot => (
                  <div key={dot} className="w-1.5 h-1.5 rounded-full bg-[var(--pulse-color)] opacity-20 group-hover:opacity-100 transition-opacity" style={{ transitionDelay: `${dot * 100}ms` }}></div>
                ))}
              </div>
              <button 
                className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--pulse-color)] group-hover:gap-4 transition-all bg-[var(--pulse-color)]/10 px-4 py-2 rounded-full group-hover:bg-[var(--pulse-color)] group-hover:text-surface-base"
                onClick={(e) => { e.stopPropagation(); setSelectedIssue(item); }}
              >
                {lang === Language.EN ? 'Read Issue' : 'Ausgabe Lesen'} <iconify-icon icon="solar:arrow-right-linear" width="16"></iconify-icon>
              </button>
            </div>
            
            {/* Visual styling representing a folded newspaper / magazine */}
            <div className="absolute -left-2 top-0 bottom-0 w-4 bg-gradient-to-r from-[var(--pulse-color)]/20 to-transparent shadow-[inset_2px_0_5px_rgba(0,0,0,0.2)]"></div>
          </motion.div>
        ))}
      </div>

      {/* Modal for displaying issue content */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-surface-base/80 backdrop-blur-2xl"
            onClick={() => setSelectedIssue(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-surface-panel border border-surface-border shadow-2xl rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-8 md:p-12 border-b border-surface-border relative overflow-hidden bg-surface-panel/50">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--pulse-color)] opacity-10 blur-[100px] rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--pulse-color)] to-transparent opacity-30"></div>
                
                <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-widest text-[var(--pulse-color)] mb-8">
                  <span className="bg-[var(--pulse-color)]/10 px-4 py-1.5 rounded-full border border-[var(--pulse-color)]/30 flex items-center gap-2 shadow-[0_0_15px_rgba(var(--active-signal-color),0.15)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--pulse-color)] animate-pulse"></div>
                    Vol. {String(NEWSLETTERS.length - NEWSLETTERS.findIndex(n => n.id === selectedIssue.id)).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-2 text-content-dim">
                    <iconify-icon icon="solar:calendar-bold"></iconify-icon> {selectedIssue.date}
                  </span>
                  <span className="ml-auto flex items-center gap-2 text-[10px] text-content-sub border border-surface-border px-3 py-1 rounded-full">
                    <iconify-icon icon="solar:shield-check-bold" className="text-quantum-500"></iconify-icon> Verified
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-content-main to-content-sub uppercase leading-[1.1] relative z-10 tracking-tight">
                  {selectedIssue.title}
                </h2>
              </div>
              
              {/* Modal Body */}
              <div className="p-8 md:p-12 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--pulse-color)]/50 scrollbar-track-transparent relative bg-surface-base/30">
                <div className="absolute top-0 bottom-0 left-8 md:left-12 w-[1px] bg-gradient-to-b from-[var(--pulse-color)] via-[var(--pulse-color)]/20 to-transparent opacity-20"></div>
                
                <p className="text-xl md:text-2xl text-content-main font-light leading-relaxed mb-12 italic border-l-4 border-[var(--pulse-color)] pl-6 py-2 shadow-[inset_10px_0_20px_-10px_rgba(var(--active-signal-color),0.1)] bg-gradient-to-r from-[var(--pulse-color)]/5 to-transparent">
                  "{selectedIssue.about}"
                </p>
                
                <div className="pl-6 md:pl-10 relative">
                  <div className="absolute top-2 -left-1 w-2 h-2 rounded-full bg-[var(--pulse-color)] shadow-[0_0_10px_var(--pulse-color)]"></div>
                  <p className="text-content-dim text-lg font-light leading-loose text-justify first-letter:text-6xl first-letter:font-black first-letter:text-[var(--pulse-color)] first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                    {selectedIssue.content}
                  </p>
                </div>
                
                <div className="mt-16 flex justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-content-sub mb-1">Transmission Origin</p>
                    <p className="text-sm font-black uppercase text-[var(--pulse-color)]">QuDay Intelligence Hub, Jena</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-8 bg-surface-base/50 border-t border-surface-border flex justify-between items-center mt-auto">
                <div className="flex gap-4">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-panel border border-surface-border text-content-sub hover:text-[var(--pulse-color)] hover:border-[var(--pulse-color)] transition-colors">
                    <iconify-icon icon="solar:share-linear" width="20"></iconify-icon>
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-panel border border-surface-border text-content-sub hover:text-[var(--pulse-color)] hover:border-[var(--pulse-color)] transition-colors">
                    <iconify-icon icon="solar:bookmark-linear" width="20"></iconify-icon>
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="px-8 py-3 rounded-full bg-[var(--pulse-color)] text-surface-base font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--active-signal-color),0.3)]"
                >
                  {lang === Language.EN ? 'Close Transmission' : 'Übertragung schließen'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PulsePage;
