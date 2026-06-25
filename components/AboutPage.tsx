import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface AboutPageProps {
  lang: Language;
  content: any;
  onBack: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

const AboutPage: React.FC<AboutPageProps> = ({ lang, content, onBack }) => {
  return (
    <div className="pt-20 min-h-screen bg-surface-base relative z-20">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-content-dim hover:text-quantum-500 mb-8 transition-colors interactive group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">
            <iconify-icon icon="solar:arrow-left-linear"></iconify-icon>
          </span>
          {lang === Language.EN ? 'Back to Core' : 'Zurück zum Kern'}
        </motion.button>
      </div>

      <section id="about" className="pb-24 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-20 mb-8"
          >
            <span className="inline-block text-[10px] font-mono font-bold text-quantum-500 uppercase tracking-[0.35em] mb-4 px-4 py-1.5 rounded-full border border-quantum-500/20 bg-quantum-500/5">
              About QuDay
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-display text-content-main mt-4">
              Pioneering <span className="text-gradient-main">Quantum</span> Security
            </h1>
            <div className="w-24 h-1 bg-quantum-500 mx-auto mt-6 rounded-full opacity-60"></div>
          </motion.div>

          {/* Vision + Values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface-panel border border-surface-border rounded-[2.5rem] p-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-quantum-500/5 to-transparent pointer-events-none rounded-[2.5rem]"></div>
              <h3 className="text-xs font-bold text-quantum-500 uppercase tracking-[0.3em] mb-6">
                {lang === Language.EN ? 'Our Vision' : 'Unsere Vision'}
              </h3>
              <p className="text-3xl md:text-4xl font-light leading-snug text-content-main font-display italic">
                "{content.about.vision}"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {content.about.values.map((v: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-6 group"
                >
                  <div className="w-1.5 rounded-full bg-surface-border group-hover:bg-quantum-500 transition-colors duration-500 flex-shrink-0 mt-1 min-h-[4rem]"></div>
                  <div>
                    <h4 className="text-xl font-black text-content-main mb-2 tracking-tight group-hover:text-quantum-500 transition-colors duration-300">{v.title}</h4>
                    <p className="text-content-dim text-base font-light leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Team Section */}
          <div className="mt-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[10px] font-mono font-bold text-quantum-500 uppercase tracking-[0.35em] mb-4 inline-block">Our People</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 font-display text-content-main">
                  {content.about.title}
                </h2>
                <div className="w-24 h-1 bg-quantum-500 mx-auto rounded-full opacity-50"></div>
              </motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {content.team.map((m: any, i: number) => (
                <motion.a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={m.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                  className="spotlight-card p-10 rounded-[2.5rem] text-center group interactive cursor-pointer block border border-surface-border overflow-hidden relative flex flex-col h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-quantum-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]"></div>

                  <div className="relative mb-8 mx-auto w-40 h-40">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-surface-border group-hover:border-quantum-500/50 transition-all duration-700 group-hover:rotate-180" style={{ transitionDuration: '700ms' }}></div>
                    <img
                      src={m.image}
                      className="absolute inset-2 w-36 h-36 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl border-4 border-surface-panel z-10"
                      alt={m.name}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-surface-base border border-surface-border rounded-full p-2 text-content-dim group-hover:text-quantum-500 group-hover:border-quantum-500/50 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.3)] transition-all duration-500 z-20">
                      <iconify-icon icon="mdi:linkedin" width="20"></iconify-icon>
                    </div>
                  </div>

                  <h4 className="text-2xl font-black text-content-main mb-2 tracking-tight group-hover:text-quantum-500 transition-colors duration-300">{m.name}</h4>
                  <p className="text-quantum-500 text-xs font-bold uppercase tracking-[0.2em] mb-6">{m.role}</p>
                  <p className="text-content-dim text-sm font-light leading-relaxed relative z-10 mt-auto">{m.bio}</p>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
