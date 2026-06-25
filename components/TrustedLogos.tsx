import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface TrustedLogosProps {
  lang: Language;
}

const TrustedLogos: React.FC<TrustedLogosProps> = ({ lang }) => {
  const logos = [
    { name: 'EuroQCI', icon: 'solar:shield-bold-duotone' },
    { name: 'Bundeswehr', icon: 'solar:radar-bold-duotone' },
    { name: 'Fraunhofer', icon: 'solar:test-tube-bold-duotone' },
    { name: 'Deutsche Bank', icon: 'solar:banknote-2-bold-duotone' },
    { name: 'ESA', icon: 'solar:planet-3-bold-duotone' },
  ];

  return (
    <div className="py-12 border-y border-surface-border bg-surface-panel/30 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-6">
        <h3 className="text-[10px] font-black text-content-dim uppercase tracking-[0.4em]">
          {lang === Language.EN ? 'Trusted by Global Leaders' : 'Vertraut von globalen Marktführern'}
        </h3>
      </div>
      
      <div className="flex gap-16 animate-marquee whitespace-nowrap items-center w-max opacity-60 hover:opacity-100 transition-opacity duration-500">
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all text-content-main hover:text-quantum-500">
            <iconify-icon icon={logo.icon} width="32"></iconify-icon>
            <span className="text-xl font-display font-bold tracking-tighter">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedLogos;
