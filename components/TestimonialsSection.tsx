import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  metrics: string;
}

interface TestimonialsSectionProps {
  lang: Language;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const testimonials: Testimonial[] = [
    {
      quote: lang === Language.EN 
        ? "QuDay's BBM92 implementation allowed us to secure our inter-branch data center links without replacing our existing dark fiber. The deployment was seamless, and the physical-layer security is unmatched."
        : "Die BBM92-Implementierung von QuDay ermöglichte es uns, unsere Rechenzentrumsverbindungen abzusichern, ohne unsere bestehende Dark Fiber zu ersetzen.",
      author: "Dr. Sarah Lin",
      role: "CISO",
      company: "EuroBank Corp",
      metrics: "0% Interception Rate"
    },
    {
      quote: lang === Language.EN
        ? "Before QuDay, we were concerned about the 'harvest now, decrypt later' threat to our aerospace IP. Their QKD hardware integrated directly into our satellite uplink architecture."
        : "Vor QuDay waren wir besorgt über die Bedrohung durch 'Harvest now, decrypt later'. Ihre QKD-Hardware ließ sich direkt in unsere Satelliten-Uplink-Architektur integrieren.",
      author: "Marcus Voss",
      role: "VP Security",
      company: "AeroSpace Dynamics",
      metrics: "FIPS 140-3 Compliant"
    },
    {
      quote: lang === Language.EN
        ? "The RAMQ system provides us with real-time entanglement fidelity monitoring. It's not just encryption; it's absolute, mathematically proven physical security."
        : "Das RAMQ-System bietet uns eine Echtzeit-Überwachung der Verschränkungsfidelität. Es ist nicht nur Verschlüsselung; es ist absolute physische Sicherheit.",
      author: "Elena Rodriguez",
      role: "Lead Architect",
      company: "Global Health Data Network",
      metrics: "99.9% Uptime"
    }
  ];

  return (
    <div className="py-24 bg-surface-panel/10 border-y border-surface-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter mb-4 text-content-main">
            {lang === Language.EN ? 'Trusted by the Best' : 'Vertrauen der Besten'}
          </h2>
          <p className="text-content-dim font-light max-w-2xl mx-auto">
            {lang === Language.EN ? 'See how global enterprises use QuDay to future-proof their critical infrastructure.' : 'Sehen Sie, wie globale Unternehmen QuDay nutzen, um ihre kritische Infrastruktur zukunftssicher zu machen.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-panel p-10 rounded-[2.5rem] border border-surface-border relative flex flex-col group hover:border-quantum-500/50 transition-colors"
            >
              <iconify-icon icon="solar:quote-left-bold-duotone" className="text-quantum-500/20 text-6xl absolute top-6 right-6"></iconify-icon>
              
              <div className="mb-8 relative z-10 flex-grow">
                <p className="text-content-main font-light leading-relaxed italic text-lg">"{t.quote}"</p>
              </div>

              <div className="border-t border-surface-border pt-6 mt-auto">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-content-main font-black uppercase tracking-wider">{t.author}</h4>
                    <p className="text-[10px] text-content-sub uppercase tracking-widest">{t.role}, <span className="text-quantum-500 font-bold">{t.company}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-quantum-500/10 text-quantum-500 text-[9px] font-bold uppercase tracking-wider rounded-full border border-quantum-500/20">
                      {t.metrics}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
