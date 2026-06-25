import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingLog: React.FC<{ logs: string[] }> = ({ logs }) => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLogIndex < logs.length) {
      const timer = setTimeout(() => {
        if (currentCharIndex < logs[currentLogIndex].length) {
          setCurrentCharIndex(prev => prev + 1);
        } else {
          setVisibleLogs(prev => [...prev, logs[currentLogIndex]]);
          setCurrentLogIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [currentLogIndex, currentCharIndex, logs]);

  return (
    <div className="space-y-1.5 font-mono text-[10px] uppercase tracking-tighter">
      {visibleLogs.map((log, i) => (
        <div key={i} className="text-content-dim/60 flex gap-2">
          <span className="text-quantum-500 opacity-40">[{i.toString().padStart(2, '0')}]</span>
          <span>{log}</span>
        </div>
      ))}
      {currentLogIndex < logs.length && (
        <div className="text-quantum-500 flex gap-2">
          <span className="text-quantum-500 opacity-40">[{currentLogIndex.toString().padStart(2, '0')}]</span>
          <span>
            {logs[currentLogIndex].substring(0, currentCharIndex)}
            <span className="animate-pulse">_</span>
          </span>
        </div>
      )}
    </div>
  );
};

const SystemHUD: React.FC = () => {
  const [metrics, setMetrics] = useState({
    fidelity: 95.00,
    keyRate: 95.0,
    qber: 0.03
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        fidelity: 94.95 + Math.random() * 0.1,
        keyRate: 90.0 + Math.random() * 10.0,
        qber: 0.025 + Math.random() * 0.01
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const logs = [
    "TRACE_SYNC: ESTABLISHED",
    "BBM92_PROTOCOL: ACTIVE",
    "HDR_KEY_GEN: SYNCHRONIZING",
    "ENTANGLEMENT_FIDELITY: OPTIMAL",
    "QUANTUM_CHANNEL_01: SECURE",
    "PHOTON_SOURCE: STABLE"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md mx-auto lg:ml-auto"
    >
      <div className="glass-panel rounded-[2.5rem] p-8 border border-surface-border shadow-2xl relative overflow-hidden group">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-quantum-500/10 blur-[80px] rounded-full group-hover:bg-quantum-500/20 transition-colors duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-quantum-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-quantum-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-content-dim">System Status • Live</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-surface-panel border border-surface-border text-[8px] font-mono text-quantum-500 uppercase tracking-widest">
              Node: Jena-01
            </div>
          </div>

          <div className="space-y-4">
            {/* Fidelity Metric */}
            <div className="group bg-surface-base/40 border border-surface-border/50 p-4 rounded-2xl hover:border-[#0ea5e9]/40 hover:bg-surface-base/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0ea5e9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex justify-between items-end mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0ea5e9]/10 flex items-center justify-center border border-[#0ea5e9]/20">
                    <iconify-icon icon="solar:link-circle-linear" class="text-[#0ea5e9]" width="14"></iconify-icon>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">Entanglement Fidelity</span>
                </div>
                <span className="text-xl font-mono font-bold text-content-main tabular-nums drop-shadow-[0_0_10px_rgba(56,189,248,0.4)] group-hover:text-[#0ea5e9] transition-colors">{metrics.fidelity.toFixed(2)}%</span>
              </div>
              <div className="h-2 w-full bg-surface-panel/80 rounded-full overflow-hidden border border-surface-border/50 relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.fidelity}%` }}
                  className="h-full bg-gradient-to-r from-[#0369a1] to-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.8)] relative"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] opacity-70"></div>
                </motion.div>
              </div>
            </div>

            {/* Key Rate Metric */}
            <div className="group bg-surface-base/40 border border-surface-border/50 p-4 rounded-2xl hover:border-emerald-500/40 hover:bg-surface-base/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex justify-between items-end mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <iconify-icon icon="solar:shield-keyhole-linear" class="text-emerald-500" width="14"></iconify-icon>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Secured Key Rate</span>
                </div>
                <span className="text-xl font-mono font-bold text-content-main tabular-nums drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] group-hover:text-emerald-500 transition-colors">{metrics.keyRate.toFixed(1)} Mb/s</span>
              </div>
              <div className="h-2 w-full bg-surface-panel/80 rounded-full overflow-hidden border border-surface-border/50 relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.keyRate}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] relative"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] opacity-70"></div>
                </motion.div>
              </div>
            </div>

            {/* QBER Metric */}
            <div className="group bg-surface-base/40 border border-surface-border/50 p-4 rounded-2xl hover:border-orange-500/40 hover:bg-surface-base/70 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex justify-between items-end mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <iconify-icon icon="solar:pulse-2-linear" class="text-orange-500" width="14"></iconify-icon>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">QBER</span>
                </div>
                <span className="text-xl font-mono font-bold text-content-main tabular-nums drop-shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:text-orange-500 transition-colors">{metrics.qber.toFixed(3)}</span>
              </div>
              <div className="h-2 w-full bg-surface-panel/80 rounded-full overflow-hidden border border-surface-border/50 relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.qber * 100}%` }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.8)] relative"
                >
                   <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] opacity-70"></div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[8px] font-mono text-content-sub uppercase tracking-widest">
            <span>Uptime: 142:12:05</span>
            <span className="text-emerald-500 font-bold">All Systems Nominal</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemHUD;
