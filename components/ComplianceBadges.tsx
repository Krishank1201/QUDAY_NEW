import React from 'react';
import { motion } from 'framer-motion';

const ComplianceBadges: React.FC = () => {
  const badges = [
    { name: 'ISO 27001', desc: 'Information Security Management', icon: 'solar:shield-check-bold' },
    { name: 'SOC 2 Type II', desc: 'Security, Availability, Confidentiality', icon: 'solar:server-square-bold' },
    { name: 'FIPS 140-3', desc: 'Cryptographic Module Standard', icon: 'solar:lock-keyhole-bold' }
  ];

  return (
    <div className="py-12 bg-surface-base border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {badges.map((badge, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 bg-surface-panel/50 px-6 py-4 rounded-2xl border border-surface-border hover:border-quantum-500/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-quantum-500/10 flex items-center justify-center text-quantum-500 group-hover:bg-quantum-500 group-hover:text-surface-base transition-colors">
                <iconify-icon icon={badge.icon} width="24"></iconify-icon>
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-content-main">{badge.name}</h4>
                <p className="text-[10px] text-content-dim uppercase tracking-wider">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceBadges;
