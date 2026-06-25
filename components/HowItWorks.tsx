import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface HowItWorksProps {
  lang: Language;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ lang }) => {
  const steps = [
    {
      num: '01',
      title: lang === Language.EN ? 'Entangled Generation' : 'Verschränkte Erzeugung',
      desc: lang === Language.EN 
        ? 'Our HD Photon Sources generate perfectly entangled photon pairs at the physical layer.' 
        : 'Unsere HD-Photonenquellen erzeugen perfekt verschränkte Photonenpaare auf der physikalischen Ebene.',
      icon: 'solar:atom-bold-duotone'
    },
    {
      num: '02',
      title: lang === Language.EN ? 'Quantum Transmission' : 'Quantenübertragung',
      desc: lang === Language.EN 
        ? 'Photons are transmitted securely over standard dark fiber or satellite uplinks.' 
        : 'Photonen werden sicher über Standard-Dark-Fiber oder Satelliten-Uplinks übertragen.',
      icon: 'solar:routing-3-bold-duotone'
    },
    {
      num: '03',
      title: lang === Language.EN ? 'Measurement & Keys' : 'Messung & Schlüssel',
      desc: lang === Language.EN 
        ? 'Any interception breaks the entanglement. Validated pairs form an unbreakable cryptographic key.' 
        : 'Jedes Abfangen bricht die Verschränkung. Validierte Paare bilden einen unknackbaren kryptografischen Schlüssel.',
      icon: 'solar:key-minimalistic-square-3-bold-duotone'
    }
  ];

  return (
    <div className="py-24 bg-surface-panel/5 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter mb-4 text-content-main">
            {lang === Language.EN ? 'How It Works' : 'Wie es funktioniert'}
          </h2>
          <p className="text-content-dim font-light max-w-2xl mx-auto">
            {lang === Language.EN 
              ? 'A seamless, three-step physical layer security process that integrates into your existing infrastructure.' 
              : 'Ein nahtloser, dreistufiger Sicherheitsprozess auf physikalischer Ebene.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-surface-border z-0">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full w-full bg-quantum-500 origin-left"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 text-center"
            >
              <div className="w-24 h-24 mx-auto bg-surface-base border-4 border-surface-panel rounded-full flex items-center justify-center text-quantum-500 text-4xl mb-6 shadow-xl relative group">
                <div className="absolute inset-0 rounded-full border border-quantum-500/0 group-hover:border-quantum-500/50 group-hover:animate-ping transition-all"></div>
                <iconify-icon icon={step.icon}></iconify-icon>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-content-main text-surface-base flex items-center justify-center text-[10px] font-black">
                  {step.num}
                </div>
              </div>
              <h3 className="text-2xl font-black font-display uppercase text-content-main mb-3">{step.title}</h3>
              <p className="text-content-dim text-sm font-light leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
