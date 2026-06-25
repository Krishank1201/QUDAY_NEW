import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import QuantumBackground from './components/QuantumBackground';
import SystemHUD from './components/SystemHUD';
import ProductDetailsModal from './components/ProductDetailsModal';
import ConsultancyPage from './components/ConsultancyPage';
import SoftwarePage from './components/SoftwarePage';
import HardwarePage from './components/HardwarePage';
import QKDDashboard from './components/QKDDashboard';
import QuantumAssistant from './components/QuantumAssistant';
import PulsePage from './components/PulsePage';
import MagneticButton from './components/MagneticButton';
import AboutPage from './components/AboutPage';
import TrustedLogos from './components/TrustedLogos';
import ComplianceBadges from './components/ComplianceBadges';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import HowItWorks from './components/HowItWorks';

import { Language, Product, JourneyMilestone } from './types';
import { getLocalizedContent } from './constants';

const SearchOverlay: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  lang: Language;
  onNavigate: (id: string) => void;
}> = ({ isOpen, onClose, lang, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const keywordsMap: Record<string, string> = {
    'hardware': 'hardware',
    'software': 'software',
    'consultancy': 'consultancy',
    'services': 'services',
    'products': 'products',
    'systems': 'products',
    'news': 'news',
    'pulse': 'pulse',
    'journey': 'news',
    'contact': 'contact',
    'connect': 'contact',
    'about': 'about',
    'team': 'about',
    'home': 'home',
    'core': 'home',
    'qkd': 'qkd-dashboard',
    'quantum': 'home'
  };

  const allKeywords = Object.keys(keywordsMap);

  useEffect(() => {
    if (isOpen) {
      const initialLogs = [
        "> INITIALIZING QUANTUM SEARCH ENGINE...",
        "> ESTABLISHING SYMMETRIC LINKS...",
        "> AUTHENTICATING ACCESS PORTAL...",
        "> READY FOR INPUT."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < initialLogs.length) {
          setLogs(prev => [...prev, initialLogs[i]]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    } else {
      setLogs([]);
      setQuery('');
      setSuggestions([]);
      setError(null);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Update suggestions on query change
  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    
    // Find keywords that include the query string (partial match)
    const matches = allKeywords.filter(k => k.includes(q));
    setSuggestions(matches);
    setActiveIndex(-1);
    if (error) setError(null);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          executeSearch(suggestions[activeIndex]);
        }
      }
    }
  };

  const executeSearch = (searchQuery: string) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return;

    // Direct match or partial match fallback
    let target = keywordsMap[q];
    
    if (!target) {
      // Find the best partial match if no exact match
      const match = allKeywords.find(k => k.includes(q));
      if (match) target = keywordsMap[match];
    }

    if (target) {
      onNavigate(target);
      onClose();
    } else {
      setError(lang === Language.EN ? `"${searchQuery}" NOT FOUND!` : `"${searchQuery}" NICHT GEFUNDEN!`);
      setLogs(prev => [...prev, `> ERROR: KEYWORD_MISMATCH [${q.toUpperCase()}]`]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[1200] bg-surface-base/95 backdrop-blur-3xl"
    >
      <div className="absolute top-6 right-6 md:top-12 md:right-12 z-[99999]">
        <button 
          type="button"
          onClick={(e) => { 
            e.stopPropagation();
            onNavigate('home'); 
            onClose(); 
          }} 
          className="text-content-dim hover:text-quantum-500 transition-all p-3 bg-surface-base backdrop-blur-xl rounded-full border-2 border-surface-border hover:bg-surface-panel shadow-2xl hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center pointer-events-auto"
        >
          <iconify-icon icon="solar:close-circle-linear" width="40" className="transition-transform duration-300 pointer-events-none"></iconify-icon>
        </button>
      </div>
      <div className="w-full h-full overflow-y-auto p-6 md:p-24 flex flex-col items-center">
        <div className="w-full max-w-3xl pt-20 flex flex-col items-center">
        <div className="w-full mb-8 font-mono text-[10px] sm:text-xs text-quantum-500 flex flex-col gap-1 opacity-60 uppercase">
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
        
        <div className="w-full relative">
          <motion.form 
            onSubmit={handleSearch}
            initial={{ y: 15, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6 }} 
            className="w-full relative z-20"
          >
            <div className="relative flex items-center bg-surface-panel/30 backdrop-blur-xl border-2 border-surface-border focus-within:border-quantum-500 focus-within:bg-surface-panel/50 shadow-2xl focus-within:shadow-[0_0_30px_rgba(168,85,247,0.2)] theme-ir:focus-within:shadow-[0_0_30px_rgba(239,68,68,0.2)] rounded-3xl px-6 py-4 transition-all duration-300">
              <iconify-icon icon="solar:minimalistic-magnifer-linear" width="28" className="text-quantum-500 mr-4 opacity-70"></iconify-icon>
              <input 
                autoFocus 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder={lang === Language.EN ? "Search..." : "Suchen..."} 
                className="w-full bg-transparent text-2xl md:text-4xl font-display font-medium text-content-main focus:outline-none transition-all placeholder:text-content-sub/30 tracking-tight" 
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-content-sub hover:text-quantum-500 transition-colors px-2">
                  <iconify-icon icon="solar:close-circle-bold" width="24"></iconify-icon>
                </button>
              )}
            </div>
          </motion.form>

          {/* Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-4 bg-surface-base border border-surface-border rounded-3xl p-3 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-[100] max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-quantum-500/50 scrollbar-track-transparent"
              >
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      executeSearch(suggestion);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all duration-200 ${activeIndex === index ? 'bg-quantum-500/10 border-l-4 border-quantum-500 text-quantum-500 pl-5' : 'hover:bg-surface-base/50 border-l-4 border-transparent text-content-main'}`}
                  >
                    <iconify-icon icon="solar:arrow-right-linear" width="20" className={`mr-4 ${activeIndex === index ? 'opacity-100' : 'opacity-0'} transition-opacity`}></iconify-icon>
                    <span className="text-xl font-display uppercase tracking-wider">{suggestion}</span>
                    <span className="ml-auto text-xs font-mono text-content-sub opacity-50 capitalize">
                      Navigate to {keywordsMap[suggestion]}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 font-mono text-sm uppercase tracking-widest flex items-center gap-3"
            >
              <iconify-icon icon="solar:danger-triangle-bold-duotone" width="24"></iconify-icon>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-20 w-full"
        >
          <div className="text-xs font-mono text-content-sub/60 uppercase tracking-widest mb-6 px-2 text-center">
            {lang === Language.EN ? "Popular Queries" : "Beliebte Suchanfragen"}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['hardware', 'software', 'consultancy', 'pulse', 'qkd', 'news', 'team', 'contact'].map((hint) => (
              <button 
                key={hint}
                onClick={() => {
                  setQuery(hint);
                  executeSearch(hint);
                }}
                className="px-6 py-3 rounded-full bg-surface-panel/30 border border-surface-border text-sm font-medium text-content-sub hover:bg-quantum-500/10 hover:border-quantum-500 hover:text-quantum-500 transition-all uppercase tracking-wider hover:scale-105 active:scale-95"
              >
                {hint}
              </button>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [theme, setTheme] = useState<'uv' | 'ir'>(() => {
    return (localStorage.getItem('QuDay-theme') as 'uv' | 'ir') || 'ir';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [view, setView] = useState<'home' | 'consultancy' | 'software' | 'hardware' | 'qkd-dashboard' | 'pulse' | 'about'>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preDashboardTheme, setPreDashboardTheme] = useState<'uv' | 'ir' | null>(null);

  const content = useMemo(() => getLocalizedContent(lang), [lang]);

  useEffect(() => {
    if (view === 'qkd-dashboard') {
      if (!preDashboardTheme) setPreDashboardTheme(theme);
      if (theme !== 'uv') setTheme('uv');
    } else {
      if (preDashboardTheme) {
        setTheme(preDashboardTheme);
        setPreDashboardTheme(null);
      }
    }
  }, [view, theme, preDashboardTheme]);

  useEffect(() => {
    if (theme === 'ir') {
      document.documentElement.classList.add('theme-ir');
      document.documentElement.classList.remove('theme-uv', 'dark');
    } else {
      document.documentElement.classList.add('theme-uv', 'dark');
      document.documentElement.classList.remove('theme-ir');
    }
    localStorage.setItem('QuDay-theme', theme);
  }, [theme]);

  // Removed double-click text phase-shift effect for better UX
  // Users can now select and interact with text normally

  useEffect(() => {
    if (view !== 'home') return; 

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
           setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'services', 'products', 'news', 'contact', 'about'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [view]);

  const toggleTheme = () => setTheme(prev => prev === 'uv' ? 'ir' : 'uv');

  const handleNavigate = (id: string) => {
    const fullPageViews = ['consultancy', 'software', 'hardware', 'qkd-dashboard', 'pulse', 'about'];
    if (fullPageViews.includes(id)) {
      window.scrollTo(0, 0);
      setView(id as any);
    } else {
      // Navigating to a home section
      if (view !== 'home') {
        // Switch to home immediately - no setTimeout race condition
        window.scrollTo(0, 0);
        setView('home');
        // After a tiny frame delay so home renders first, then scroll
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (id !== 'home') {
              const tryScroll = (attempts = 0) => {
                const el = document.getElementById(id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (attempts < 10) {
                  setTimeout(() => tryScroll(attempts + 1), 50);
                }
              };
              tryScroll();
            }
          });
        });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col transition-colors duration-700 bg-surface-base text-content-main selection:bg-quantum-500/20">
        <QuantumBackground theme={theme} />
      
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        onNavigate={handleNavigate} 
        currentPage={view === 'home' ? activeSection : view} 
        onOpenSearch={() => setIsSearchOpen(true)} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        labels={content.nav} 
        serviceItems={content.services}
      />

      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {view === 'consultancy' && <ConsultancyPage lang={lang} content={content.consultancyPage} onBack={() => setView('home')} onNavigate={handleNavigate} />}
        {view === 'software' && <SoftwarePage lang={lang} content={content.softwarePage} onBack={() => setView('home')} onLaunchDashboard={() => handleNavigate('qkd-dashboard')} />}
        {view === 'hardware' && <HardwarePage lang={lang} content={content.hardwarePage} protocols={content.protocols} products={content.products.items} onBack={() => setView('home')} onProductSelect={setSelectedProduct} theme={theme} />}
        {view === 'qkd-dashboard' && <QKDDashboard lang={lang} onBack={() => { window.scrollTo(0, 0); setView('software'); }} theme={theme} toggleTheme={toggleTheme} />}
        {view === 'pulse' && <PulsePage lang={lang} />}
        {view === 'about' && <AboutPage lang={lang} content={content} onBack={() => setView('home')} />}

        {view === 'home' && (
          <>
            <section id="home" className="relative pt-20 pb-16 min-h-[70vh] flex flex-col justify-center overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap gap-4 mb-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-quantum-400/20 bg-quantum-400/5 backdrop-blur-md"
                      >
                        <span className="text-[9px] font-mono font-bold text-quantum-600 uppercase tracking-widest">ENTANGLEMENT FIDELITY: 95.00%</span>
                      </motion.div>
                    </div>
                    
                    <h1 className="hero-headline font-black font-display mb-8 text-content-main max-w-5xl leading-[0.9]">
                      <motion.span initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {content.hero.title.split(' ')[0]}
                      </motion.span>
                      <br/>
                      <motion.span 
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-content-main via-quantum-500 to-content-sub"
                      >
                        {content.hero.title.split(' ').slice(1).join(' ')}
                      </motion.span>
                    </h1>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-lg md:text-xl text-content-dim max-w-2xl leading-relaxed mb-12 font-light"
                    >
                      {content.hero.desc}
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
                      className="flex flex-wrap gap-4"
                    >
                      <MagneticButton 
                        onClick={() => handleNavigate('hardware')} 
                        className="px-10 py-4 rounded-full bg-quantum-500 text-surface-base font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-quantum-500/20"
                        glowColor={theme === 'uv' ? 'rgba(168, 85, 247, 0.45)' : 'rgba(249, 115, 22, 0.35)'}
                      >
                        {content.hero.cta}
                      </MagneticButton>
                    </motion.div>
                  </div>

                  <div className="lg:col-span-5">
                    <SystemHUD />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-y border-surface-border py-4 bg-surface-base/50 backdrop-blur-sm overflow-hidden">
                <div className="flex gap-20 animate-marquee whitespace-nowrap text-[9px] font-mono text-quantum-500/60 uppercase tracking-[0.3em] font-bold">
                  {[...content.ticker, ...content.ticker].map((item, i) => <span key={i} className="flex items-center gap-3"><iconify-icon icon="solar:star-bold"></iconify-icon> {item}</span>)}
                </div>
              </div>
            </section>

            <TrustedLogos lang={lang} />
            <ComplianceBadges />
            <HowItWorks lang={lang} />

            <section id="services" className="py-24 bg-surface-panel/10 border-b border-surface-border">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black font-display tracking-tighter mb-4">{lang === Language.EN ? 'Our Services' : 'Unsere Dienstleistungen'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {content.services.map((service: any, i: number) => (
                      <motion.div 
                        key={service.id}
                        id={service.id}
                        onClick={() => handleNavigate(service.id)}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className="spotlight-card p-10 rounded-[2.5rem] flex flex-col h-full group scroll-mt-32 cursor-pointer interactive"
                      >
                        <div className="mb-6 w-12 h-12 rounded-2xl bg-quantum-500/10 flex items-center justify-center text-quantum-500 group-hover:bg-quantum-500 group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-quantum-500/30">
                          <iconify-icon icon={i === 0 ? 'solar:code-square-linear' : i === 1 ? 'solar:cpu-linear' : 'solar:users-group-rounded-linear'} width="24"></iconify-icon>
                        </div>
                        <h3 className="text-2xl font-black mb-2 font-display text-content-main group-hover:text-quantum-500 transition-colors duration-300">{service.title}</h3>
                        <p className="text-content-dim text-sm font-light mb-8">{service.desc}</p>
                        <ul className="space-y-4 mt-auto">
                          {service.items.map((item: string, idx: number) => (
                            <li key={idx} className="flex gap-3 items-center text-xs font-bold uppercase tracking-widest text-content-sub">
                                <div className="w-1.5 h-1.5 rounded-full bg-quantum-500/30"></div>
                                {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                </div>
              </div>
            </section>

            <section id="news" className="py-20 md:py-32 bg-surface-panel/5 border-y border-surface-border overflow-hidden relative">
              <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12 md:mb-20">
                  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-quantum-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Our Trajectory</motion.span>
                  <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black tracking-tighter font-display text-content-main">
                    {content.nav.news}
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-content-dim mt-4 max-w-lg mx-auto text-base md:text-lg font-light">
                    It started with a single photon. It ends with a secured world.
                  </motion.p>
                </div>

                <div className="relative">
                  {/* Timeline spine */}
                  <div className="absolute left-[16px] md:left-1/2 top-0 bottom-0 w-[2px] bg-surface-border md:-ml-[1px]"></div>
                  <motion.div 
                    className="absolute left-[16px] md:left-1/2 top-0 bottom-0 w-[2px] md:-ml-[1px]"
                    style={{ background: `linear-gradient(to bottom, var(--q-500), transparent)` }}
                    initial={{ scaleY: 0, originY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />

                  <div className="space-y-10 md:space-y-16">
                    {content.journey.map((milestone: JourneyMilestone, i: number) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-50px", once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`flex flex-col md:flex-row gap-4 md:gap-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                      >
                        <div className="flex-1 hidden md:block"></div>
                        <div className="relative flex-shrink-0 w-[32px] flex justify-center">
                          <motion.div 
                            className={`w-3.5 h-3.5 rounded-full border-2 border-surface-base z-10 relative ${i === 2 ? 'bg-quantum-500 shadow-[0_0_16px_var(--q-500)]' : 'bg-surface-border'}`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                          >
                             {i === 2 && <div className="absolute inset-0 rounded-full bg-quantum-500 animate-ping opacity-40"></div>}
                          </motion.div>
                        </div>
                        <div className={`flex-1 pl-10 md:pl-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                           <div className="glass-panel p-5 md:p-8 rounded-2xl border border-surface-border hover:border-quantum-500/30 transition-all group relative">
                              <div className={`hidden md:block absolute top-6 w-10 h-[1px] bg-quantum-500/20 ${i % 2 === 0 ? '-right-12' : '-left-12'}`}></div>
                              
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-2xl md:text-3xl font-display font-black tracking-tighter ${i === 2 ? 'text-quantum-500' : 'text-content-sub'}`}>{milestone.year}</span>
                                <div className="w-8 h-8 rounded-full bg-surface-panel flex items-center justify-center text-content-dim group-hover:text-quantum-500 transition-colors">
                                   <iconify-icon icon={milestone.icon} width="16"></iconify-icon>
                                </div>
                              </div>
                              
                              <h3 className="text-lg md:text-xl font-black text-content-main mb-2">{milestone.title}</h3>
                              <p className="text-content-dim font-light leading-relaxed text-sm mb-4">{milestone.content}</p>
                              
                              <div className="flex items-center gap-4 pt-4 border-t border-surface-border text-xs">
                                 <div>
                                    <span className="block text-[8px] font-black uppercase tracking-widest text-content-sub mb-0.5">Status</span>
                                    <span className="font-mono text-content-dim">{milestone.tag}</span>
                                 </div>
                                 <div className="w-[1px] h-6 bg-surface-border"></div>
                                 <div>
                                    <span className="block text-[8px] font-black uppercase tracking-widest text-content-sub mb-0.5">Data</span>
                                    <span className="font-mono text-quantum-500">{milestone.stats}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <TestimonialsSection lang={lang} />
            <FAQSection lang={lang} />

            <section id="contact">
              <ContactPage lang={lang} content={content.contact} />
            </section>
          </>
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer lang={lang} content={content.footer} theme={theme} />
      
      <AnimatePresence>
        {isSearchOpen && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} lang={lang} onNavigate={handleNavigate} />}
        {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} lang={lang} />}
      </AnimatePresence>
      </div>
    </>
  );
};

export default App;
