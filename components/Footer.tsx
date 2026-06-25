import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_SVG } from '../constants';
import { Language } from '../types';
import QuDayLogo from './QuDayLogo';

interface FooterProps {
  lang: Language;
  content: any;
  theme: 'uv' | 'ir';
}

const Footer: React.FC<FooterProps> = ({ lang, content, theme }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const footerCanvasRef = useRef<HTMLCanvasElement>(null);

  const validateEmail = (val: string) => {
    if (!val) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.includes('@')) return lang === Language.EN ? 'Missing "@" symbol.' : 'Fehlendes "@".';
    if (!emailRegex.test(val)) return lang === Language.EN ? 'Invalid transmission endpoint.' : 'Ungültiger Endpunkt.';
    return '';
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError || !email) {
      setError(validationError || (lang === Language.EN ? 'Identity required.' : 'Identität erforderlich.'));
      return;
    }
    setError('');
    setSubscribed(true);
  };

  useEffect(() => {
    if (subscribed) {
      const timer = setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscribed]);

  // Immersive Glowing Node & Laser waveform animation loop
  useEffect(() => {
    const canvas = footerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Track cursor vectors directly inside the footer
    let mouseX = -1000;
    let mouseY = -1000;

    const handleParentMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleParentMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.parentElement?.addEventListener('mousemove', handleParentMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleParentMouseLeave);

    // High fidelity nodes constellation
    const numParticles = 32;
    const particles: Array<{
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -0.05 - Math.random() * 0.08, // float up slowly
        vx: (Math.random() - 0.5) * 0.06,
        size: Math.random() * 2.2 + 1,
        alpha: 0.16 + Math.random() * 0.22,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Realtime class state detection for seamless theme sync
      const isUV = document.documentElement.classList.contains('theme-uv') || !document.documentElement.classList.contains('theme-ir');
      const colorStr = isUV ? '168, 85, 247' : '239, 68, 68'; // Purple vs Red
      const secondaryColorStr = isUV ? '6, 182, 212' : '249, 115, 22'; // Cyan vs Orange

      // 1. Draw a majestic coherent laser waveform at the top of the footer
      ctx.save();
      ctx.beginPath();
      const waveY = height * 0.12;
      const waveSegments = 80;
      const waveStep = width / waveSegments;
      const timeFactor = performance.now() * 0.0015;

      for (let s = 0; s <= waveSegments; s++) {
        const x = s * waveStep;
        // Superimposes two sine waves for organic optical motion
        const yOffset = 
          Math.sin(s * 0.12 + timeFactor) * 8 + 
          Math.cos(s * 0.06 - timeFactor * 0.6) * 4;
        
        if (s === 0) ctx.moveTo(x, waveY + yOffset);
        else ctx.lineTo(x, waveY + yOffset);
      }
      ctx.strokeStyle = `rgba(${colorStr}, 0.082)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Parallel secondary feedback fiber
      ctx.beginPath();
      for (let s = 0; s <= waveSegments; s++) {
        const x = s * waveStep;
        const yOffset = 
          Math.sin(s * 0.16 - timeFactor * 1.1) * 6 + 
          Math.cos(s * 0.09 + timeFactor * 0.4) * 3;
        
        if (s === 0) ctx.moveTo(x, waveY + yOffset + 12);
        else ctx.lineTo(x, waveY + yOffset + 12);
      }
      ctx.strokeStyle = `rgba(${secondaryColorStr}, 0.045)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      // 2. Constellation particles
      particles.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx;

        // Loop boundaries wrap
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) p.vx *= -1;

        // Flare calculations on cursor proximity
        const distToMouse = mouseX !== -1000 ? Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2) : 9999;
        const isNearCursor = distToMouse < 140;

        ctx.beginPath();
        const renderSize = p.size * (isNearCursor ? 1.9 : 1.0);
        ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2);
        
        const finalAlpha = isNearCursor ? 0.9 : p.alpha;
        ctx.fillStyle = isNearCursor
          ? `rgba(${secondaryColorStr}, ${finalAlpha})`
          : `rgba(${colorStr}, ${finalAlpha})`;
        ctx.fill();

        // Node halo glows for flares
        if (isNearCursor) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderSize * 3.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorStr}, 0.14)`;
          ctx.fill();
        }

        // 3. Connect entanglement lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          
          // Entanglement range maps up to 140px
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Fades lines out as they near boundaries of the footer card
            const screenBoundaryFade = (p.y / height) * (1 - p.y / height) * 4;
            const lineAlpha = (1 - dist / 140) * 0.052 * screenBoundaryFade * (isNearCursor ? 1.5 : 1.0);
            
            ctx.strokeStyle = isNearCursor ? `rgba(${secondaryColorStr}, ${lineAlpha * 1.5})` : `rgba(${colorStr}, ${lineAlpha})`;
            ctx.lineWidth = isNearCursor ? 0.75 : 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleParentMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleParentMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  const socials = [
    { icon: 'pajamas:twitter', label: 'X', url: '#' },
    { icon: 'hugeicons:linkedin-02', label: 'LinkedIn', url: '#' },
    { icon: 'simple-icons:medium', label: 'Medium', url: '#' },
  ];

  const getBorderColor = () => {
    if (!email) return 'border-surface-border';
    const err = validateEmail(email);
    if (err) return 'border-rose-500/50';
    return 'border-quantum-500/50';
  };

  return (
    <footer className="relative bg-surface-base pt-48 pb-12 border-t border-surface-border transition-all overflow-hidden">
      {/* Absolute Ambient Canvas Background inside footer */}
      <canvas
        ref={footerCanvasRef}
        className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
      />

      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-surface-base to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row justify-between gap-24 mb-32">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-12 group interactive select-none">
              <QuDayLogo 
                size="md" 
                isDark={theme === 'uv'} 
                animated={true}
              />
              <span className="font-black tracking-tight text-4xl text-content-main transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>QuDay</span>
            </div>
            <p className="text-content-dim text-xl mb-12 leading-relaxed font-light">
              Deep-tech engineering company based in Jena. Pioneering physical-layer security through quantum entanglement distribution.
            </p>
            
            <div className="relative max-w-md">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-quantum-500 mb-6">{content.newsletter}</h4>
              
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-quantum-500/10 border border-quantum-500/30 rounded-full px-8 py-5"
                  >
                    <div className="flex items-center gap-3">
                      <iconify-icon icon="solar:check-circle-bold" class="text-quantum-400 text-xl"></iconify-icon>
                      <span className="text-[10px] text-quantum-400 font-black uppercase tracking-[0.2em]">{content.success}</span>
                    </div>
                    <button onClick={() => setSubscribed(false)} className="text-quantum-400 hover:text-white transition-colors">
                      <iconify-icon icon="solar:close-circle-linear" width="18"></iconify-icon>
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="relative">
                    <div className="flex items-center gap-3">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="name@agency.gov" 
                        className={`flex-1 bg-surface-panel border ${getBorderColor()} rounded-full px-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-quantum-500/20 focus:border-quantum-500 transition-all text-content-main interactive`} 
                      />
                      <button type="submit" className="w-14 h-14 rounded-full bg-quantum-500 text-surface-base flex items-center justify-center hover:scale-110 transition-transform interactive shadow-[0_0_20px_var(--cursor-glow)]">
                        <iconify-icon icon="solar:arrow-right-linear" width="24"></iconify-icon>
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute mt-2 left-4 text-[9px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <iconify-icon icon="solar:danger-linear"></iconify-icon>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-24">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-content-main mb-10">Ecosystem</h4>
              <ul className="space-y-6 text-xs text-content-dim font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-quantum-400 transition-colors interactive">Infrastructure</a></li>
                <li><a href="#" className="hover:text-quantum-400 transition-colors interactive">R&D Lab</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-content-main mb-10">Connect</h4>
              <ul className="space-y-6 text-xs text-content-dim font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-quantum-400 transition-colors interactive">About Us</a></li>
                <li><a href="#" className="hover:text-quantum-400 transition-colors interactive">News & Media</a></li>
                <li><a href="#" className="hover:text-quantum-400 transition-colors interactive">Careers</a></li>
                <li><a href="#" className="hover:text-quantum-400 transition-colors interactive">Projects</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-content-main mb-10">Channels</h4>
              <div className="flex gap-6">
                {socials.map(s => (
                  <a key={s.label} href={s.url} className="w-12 h-12 flex-shrink-0 rounded-2xl bg-surface-panel border border-surface-border flex items-center justify-center text-content-dim hover:text-quantum-400 hover:border-quantum-500/50 hover:bg-quantum-500/5 transition-all interactive" title={s.label}>
                    <iconify-icon icon={s.icon} width="22"></iconify-icon>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-content-sub font-mono tracking-[0.5em] uppercase font-bold">
          <p>{content.rights}</p>
          <div className="flex gap-12 mt-8 md:mt-0">
            <a href="#" className="hover:text-quantum-400 transition-colors interactive">Compliance</a>
            <a href="#" className="hover:text-quantum-400 transition-colors interactive">Privacy</a>
            <a href="#" className="hover:text-quantum-400 transition-colors interactive">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
