import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import { MagneticButton } from './MagneticButton';
import QuDayLogo from './QuDayLogo';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSearch: () => void;
  theme: 'uv' | 'ir';
  toggleTheme: () => void;
  labels: { home: string; services: string; products: string; news: string; contact: string; about: string };
  serviceItems: { id: string; title: string; desc: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ 
  lang, setLang, onNavigate, currentPage, onOpenSearch, theme, toggleTheme, labels, serviceItems
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isDarkMode = theme === 'uv';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menu = [
    { id: 'home', label: labels.home },
    { id: 'services', label: labels.services, hasDropdown: true },
    { id: 'pulse', label: 'PULSE' },
    { id: 'news', label: labels.news },
    { id: 'contact', label: labels.contact },
    { id: 'about', label: labels.about },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[50000] transition-all duration-500 select-none ${(isScrolled || currentPage === 'qkd-dashboard' || currentPage !== 'home') ? 'py-3 border-b border-surface-border/40 shadow-lg' : 'py-6 bg-transparent'}`}
      style={(isScrolled || currentPage === 'qkd-dashboard' || currentPage !== 'home') ? { backgroundColor: 'var(--surface-base)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Dynamic Logo */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <QuDayLogo 
            size="sm" 
            isDark={isDarkMode} 
            animated={true}
          />
          <div className="flex flex-col">
            <span className="text-xl font-display font-black tracking-tighter text-content-main leading-none">QuDay</span>
            <span className="text-[8px] font-mono font-bold tracking-[0.3em] text-quantum-500/60 uppercase">Quantum Systems</span>
          </div>
        </motion.div>

        {/* Nav Items */}
        <div className="hidden lg:flex items-center gap-1 bg-surface-panel/15 backdrop-blur-md p-1 rounded-full border border-surface-border/30 relative z-[50001]">
          {menu.map((item) => (
            <div 
              key={item.id} 
              className={`relative animate-fade-in ${hoveredItem === item.id ? 'z-[60000]' : 'z-[50002]'}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <MagneticButton
                onClick={() => onNavigate(item.id)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all relative z-10 cursor-pointer border-none bg-transparent select-none ${
                  currentPage === item.id 
                    ? 'text-quantum-500 font-extrabold' 
                    : 'text-content-dim hover:text-content-main'
                }`}
                glowColor={theme === 'uv' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(249, 115, 22, 0.20)'}
              >
                {item.label}
              </MagneticButton>
              {currentPage === item.id && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-quantum-500/10 border border-quantum-500/35 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.12)] theme-ir:shadow-[0_0_15px_rgba(239,68,68,0.12)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.55 }}
                />
              )}
              
              {/* Dropdown */}
              <AnimatePresence>
                {item.hasDropdown && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[61000]"
                  >
                    <div className="border-2 border-quantum-500/40 rounded-[2.5rem] p-4 shadow-[0_30px_120px_-15px_rgba(0,0,0,0.95)] backdrop-blur-2xl ring-1 ring-white/5" style={{ backgroundColor: 'var(--surface-base)' }}>
                      {serviceItems.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => onNavigate(service.id)}
                          className="w-full text-left px-5 py-4 rounded-[1.8rem] hover:bg-quantum-500/15 transition-all group/item hover:translate-x-2 duration-300 mb-1 last:mb-0 cursor-pointer"
                        >
                          <div className="text-[12px] font-black text-content-main uppercase tracking-widest group-hover/item:text-quantum-500 transition-colors flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-quantum-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                             {service.title}
                          </div>
                          <div className="text-[10px] text-content-dim group-hover/item:text-content-main font-medium mt-1.5 transition-colors pl-3.5 border-l border-surface-border group-hover/item:border-quantum-500/45">{service.desc}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 p-1 bg-surface-panel/15 rounded-full border border-surface-border/30 backdrop-blur-md">
            <button 
              onClick={onOpenSearch}
              className="w-9 h-9 flex items-center justify-center rounded-full text-content-dim hover:text-quantum-500 hover:bg-quantum-500/10 transition-all cursor-pointer"
            >
              <iconify-icon icon="solar:magnifer-linear" width="18"></iconify-icon>
            </button>
            <div className="w-[1px] h-4 bg-surface-border/40"></div>
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-content-dim hover:text-quantum-500 hover:bg-quantum-500/10 transition-all cursor-pointer"
            >
              <iconify-icon icon={theme === 'uv' ? 'solar:sun-2-linear' : 'solar:moon-linear'} width="18"></iconify-icon>
            </button>
            <div className="w-[1px] h-4 bg-surface-border/40"></div>
            
            {/* Elegant slider language toggle switcher */}
            <div className="h-9 flex items-center bg-surface-base/40 p-0.5 rounded-full border border-surface-border/40 relative overflow-hidden select-none w-[88px]">
              <div 
                className="absolute top-0.5 bottom-0.5 rounded-full bg-quantum-500/15 border border-quantum-500/40 transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.12)] theme-ir:shadow-[0_0_8px_rgba(239,68,68,0.12)]"
                style={{
                  left: lang === Language.EN ? '2px' : '44px',
                  width: '40px',
                }}
              />
              <button
                onClick={() => setLang(Language.EN)}
                className={`w-10 h-full flex items-center justify-center text-[9px] font-mono font-black tracking-wider transition-colors z-10 cursor-pointer ${
                  lang === Language.EN ? 'text-quantum-500' : 'text-content-dim/70 hover:text-content-main'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang(Language.DE)}
                className={`w-10 h-full flex items-center justify-center text-[9px] font-mono font-black tracking-wider transition-colors z-10 cursor-pointer ${
                  lang === Language.DE ? 'text-quantum-500' : 'text-content-dim/70 hover:text-content-main'
                }`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;