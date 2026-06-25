import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import * as d3 from 'd3';
import { Language } from '../types';

interface QKDDashboardProps {
  lang: Language;
  onBack: () => void;
  theme: 'uv' | 'ir';
  toggleTheme: () => void;
}

type Tab = 'overview' | 'singles' | 'protocol' | 'support';

// Mock Data Generators for Dashboard
const generateCoincidences = () => Array.from({ length: 40 }, (_, i) => ({
  time: i, value: 4000 + Math.sin(i / 3) * 2000 + Math.random() * 800
}));

const generateHeralding = () => Array.from({ length: 50 }, (_, i) => ({
  time: i, 
  local: 2 + Math.sin(i / 2) * 0.5 + Math.random() * 0.2,
  remote: 1.5 + Math.cos(i / 2) * 0.4 + Math.random() * 0.2,
}));

const delayDataGen = (peak: number, spread: number) => {
  return Array.from({ length: 40 }, (_, i) => {
    const x = i - 20;
    const y = Math.exp(-0.5 * Math.pow((x - peak) / spread, 2)) * 100 + Math.random() * 5;
    return { x, y };
  });
};

// D3 engine chart visualizing secure key entropy rates
interface D3LineChartProps {
  data: Array<{ time: number; rate: number }>;
}

const D3KeyExchangeChart: React.FC<D3LineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 220 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: width || 600, height: height || 220 });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    d3.select(svg).selectAll('*').remove();

    const margin = { top: 15, right: 30, bottom: 25, left: 55 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    if (chartWidth <= 0 || chartHeight <= 0) return;

    const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.time) || 0, d3.max(data, d => d.time) || 60])
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([1800, 2150]) // Focus scale specifically on standard output key rates
      .range([chartHeight, 0]);

    const g = d3.select(svg)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const defs = d3.select(svg).append('defs');
    
    const areaGrad = defs.append('linearGradient')
      .attr('id', 'd3-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', '0.22');

    areaGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', '0.00');

    // Gridlines style matching QKDDashboard design rules
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x)
        .tickSize(-chartHeight)
        .tickFormat(() => '')
      )
      .selectAll('.tick line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', '0.15');

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-chartWidth)
        .tickFormat(() => '')
      )
      .selectAll('.tick line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', '0.15');

    // Ticks formatters
    const xAxisFormat = d3.axisBottom(x)
      .ticks(Math.max(4, Math.floor(chartWidth / 80)))
      .tickFormat((d) => {
        const lastElem = data[data.length - 1];
        if (!lastElem) return '';
        const diff = lastElem.time - (d as number);
        return diff === 0 ? 'Now' : `${diff}s ago`;
      });

    const yAxisFormat = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `${d} bps`);

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxisFormat)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '8px')
      .attr('color', '#64748b')
      .selectAll('.domain, .tick line')
      .attr('stroke', '#334155');

    g.append('g')
      .call(yAxisFormat)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '8px')
      .attr('color', '#64748b')
      .selectAll('.domain, .tick line')
      .attr('stroke', '#334155');

    const area = d3.area<{ time: number; rate: number }>()
      .x(d => x(d.time))
      .y0(chartHeight)
      .y1(d => y(d.rate))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#d3-area-grad)')
      .attr('d', area);

    const line = d3.line<{ time: number; rate: number }>()
      .x(d => x(d.time))
      .y(d => y(d.rate))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line)
      .style('filter', 'drop-shadow(0 0 5px rgba(16,185,129,0.3))');

    const focus = g.append('g').style('display', 'none');

    focus.append('circle')
      .attr('r', 5)
      .attr('fill', '#10b981')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('filter', 'drop-shadow(0 0 6px #10b981)');

    focus.append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    const tooltipDiv = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'absolute bg-slate-950/95 border border-slate-800 text-[9px] font-mono p-2 rounded-lg pointer-events-none text-slate-200 shadow-2xl opacity-0 transition-opacity duration-200 z-50');

    g.append('rect')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseover', () => {
        focus.style('display', null);
        tooltipDiv.style('opacity', 1);
      })
      .on('mouseout', () => {
        focus.style('display', 'none');
        tooltipDiv.style('opacity', 0);
      })
      .on('mousemove', (event) => {
        const mouseX = d3.pointer(event)[0];
        const xValue = x.invert(mouseX);
        const bisect = d3.bisector<{ time: number; rate: number }, number>(d => d.time).center;
        const index = bisect(data, xValue);
        const d = data[index];

        if (d) {
          const px = x(d.time);
          const py = y(d.rate);
          focus.attr('transform', `translate(${px},${py})`);
          focus.select('line').attr('transform', `translate(0,${-py})`);

          const lastElem = data[data.length - 1];
          const secAgo = lastElem ? Math.max(0, lastElem.time - d.time) : 0;
          
          tooltipDiv
            .html(`<strong>Rate:</strong> ${Math.round(d.rate)} bps<br/><strong>Time:</strong> ${secAgo === 0 ? 'Live' : `${secAgo}s ago`}`)
            .style('right', `${chartWidth - px > 110 ? 'auto' : '15px'}`)
            .style('left', `${chartWidth - px > 110 ? `${px + margin.left + 15}px` : 'auto'}`)
            .style('top', `${py}px`);
        }
      });

    return () => {
      tooltipDiv.remove();
    };
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="w-full relative h-[220px]">
      <svg ref={svgRef} className="w-full h-full overflow-visible"></svg>
    </div>
  );
};

const QKDDashboard: React.FC<QKDDashboardProps> = ({ lang, onBack, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [tick, setTick] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogIndex, setBootLogIndex] = useState(0);

  // Boot logs simulation
  const bootLogs = [
    "[CALIBRATING] Coherent single-photon source frequency...",
    "[CONNECTED] Symmetric physical key core established on 810nm channel.",
    "[MEASURING] Entanglement state correlations... Fidelity: 95.00%",
    "[INTERACTION] Sync level optimized at 99.8%. Phase lock: verified.",
    "[QBER] Evaluating background dark count fault rate (QBER: 1.39%)",
    "[SECURITY] Quantum key rate established: 1.95 kBps.",
    "[SYSTEM] Authorization key link verified. Secure telemetry online."
  ];

  // Progressive Boot Loader
  useEffect(() => {
    if (!isBooting) return;

    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsBooting(false), 300);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    const logInterval = setInterval(() => {
      setBootLogIndex((prev) => {
        if (prev < bootLogs.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [isBooting]);

  // Live Data State
  const [coincidencesData, setCoincidencesData] = useState(generateCoincidences());
  const [heraldingData, setHeraldingData] = useState(generateHeralding());
  const [keyExchangeHistory, setKeyExchangeHistory] = useState(() => 
    Array.from({ length: 60 }, (_, i) => ({
      time: i,
      rate: 1950 + Math.sin(i / 5) * 80 + Math.random() * 50
    }))
  );

  const [stats, setStats] = useState({
    sync: 100,
    qber: 1.39,
    fidelity: 97.2,
    keyRate: 2000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      
      const newKeyRate = 1950 + Math.random() * 100;
      setStats(prev => ({
        sync: 99.5 + Math.random() * 0.5,
        qber: 1.2 + Math.random() * 0.4,
        fidelity: 96.5 + Math.random() * 1.5,
        keyRate: newKeyRate
      }));

      setCoincidencesData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          value: 4000 + Math.sin((prev[prev.length - 1].time + 1) / 3) * 2000 + Math.random() * 800
        });
        return newData;
      });

      setHeraldingData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          local: 2 + Math.sin((prev[prev.length - 1].time + 1) / 2) * 0.5 + Math.random() * 0.2,
          remote: 1.5 + Math.cos((prev[prev.length - 1].time + 1) / 2) * 0.4 + Math.random() * 0.2,
        });
        return newData;
      });

      setKeyExchangeHistory(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = prev[prev.length - 1]?.time || 60;
        newData.push({
          time: lastTime + 1,
          rate: newKeyRate
        });
        return newData;
      });

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const singlesRadarData = [
    { subject: 'H', local: 380, remote: 350, fullMark: 500 },
    { subject: 'V', local: 390, remote: 340, fullMark: 500 },
    { subject: 'D', local: 150, remote: 140, fullMark: 500 },
    { subject: 'A', local: 280, remote: 260, fullMark: 500 },
  ];

  const polarizationData = [
    { name: 'HH', value1: 2.35, value2: 1.8 },
    { name: 'VV', value1: 2.97, value2: 2.1 },
    { name: 'HV', value1: 0.04, value2: 0.02 },
    { name: 'VH', value1: 0.05, value2: 0.03 },
    { name: 'DD', value1: 1.32, value2: 1.1 },
    { name: 'AA', value1: 1.81, value2: 1.5 },
    { name: 'DA', value1: 0.016, value2: 0.01 },
    { name: 'AD', value1: 0.028, value2: 0.02 },
  ];

  return (
    <div className="w-full min-h-screen pt-28 pb-12 flex flex-col lg:flex-row text-slate-200 font-sans selection:bg-cyan-500/30 relative bg-slate-950 z-10 overflow-hidden"
         style={{ backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' }}>
      
      {/* Cinematic OS Boot Screen Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#020617] z-[999] flex flex-col items-center justify-center p-6 md:p-12 font-mono text-content-main cursor-wait"
          >
            {/* Background sweeping lines and matrix grids */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1/2 w-full animate-[pulse_3s_infinite] pointer-events-none"></div>
            
            {/* Glowing sweep scanner line running infinitely from top to bottom */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#22d3ee,0_0_6px_#06b6d4] pointer-events-none top-0 z-[1000] opacity-80"
                 style={{ animation: 'bootScan 2.6s linear infinite' }} />

            <div className="w-full max-w-2xl relative">
              {/* Retro scanning aperture indicator */}
              <div className="flex justify-center mb-10 relative">
                <div className="w-24 h-24 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center animate-spin" style={{ animationDuration: '15s' }}>
                  <div className="w-20 h-20 rounded-full border border-double border-red-500/20 flex items-center justify-center animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <span className="text-[10px] font-bold text-cyan-400 tracking-tighter">{Math.floor(bootProgress)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="text-center mb-10">
                <h1 className="text-sm font-black tracking-[0.4em] text-cyan-400 mb-2 uppercase">QuDay OPERATING PROTOCOL ACTIVE</h1>
                <p className="text-[8px] text-slate-500 tracking-widest uppercase mb-1">DEC_KEY_LEN: 256 || SYMMETRIC SHANDSHAKE CORE</p>
                <div className="h-[2px] w-12 bg-cyan-500/30 mx-auto"></div>
              </div>

              {/* Boot Loader Log Stream */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-56 flex flex-col justify-end overflow-hidden mb-8 shadow-inner select-none backdrop-blur-sm hologram-flicker">
                <div className="space-y-2 mt-auto text-left">
                  {bootLogs.slice(0, bootLogIndex + 1).map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-[10px] tracking-wider leading-relaxed ${i === bootLogIndex ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}
                    >
                      <span className="text-cyan-500/50 mr-2">&gt;&gt;</span>
                      {log}
                    </motion.div>
                  ))}
                  <div className="text-[10px] text-red-400 font-black animate-pulse flex items-center gap-1">
                    <span>_</span>
                  </div>
                </div>
              </div>

              {/* Cyber-Physic Loading Bar */}
              <div className="space-y-2 select-none">
                <div className="flex justify-between text-[9px] text-slate-500 tracking-widest font-black uppercase">
                  <span>DEPLOYING SECURE STATIONS</span>
                  <span>{Math.floor(bootProgress)}% LOADED</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 via-cyan-500 to-purple-500 rounded-full"
                    style={{ width: `${bootProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blueprint Grid Background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-slate-950/80 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col p-6 lg:p-8 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex-shrink-0 lg:sticky lg:top-28 lg:h-[calc(100vh-140px)] rounded-2xl lg:rounded-none lg:overflow-visible mx-4 lg:mx-0">
        <div className="mb-14 space-y-4">
           <div className="text-center space-y-1 relative">
              <div className="absolute -inset-4 bg-cyan-500/5 blur-2xl rounded-full"></div>
              <h1 className="text-xs font-black tracking-[0.25em] leading-tight text-cyan-400 font-mono">QKD SYSTEM</h1>
              <h1 className="text-xs font-black tracking-[0.25em] leading-tight text-slate-100 font-mono">EVALUATION INTERFACE</h1>
              <div className="inline-block mt-3 px-2 py-0.5 border border-cyan-500/30 bg-cyan-500/10 text-[9px] font-bold text-cyan-400 uppercase tracking-[0.3em] rounded">
                Version 2.0
              </div>
           </div>
        </div>

        <nav className="space-y-4 flex-grow relative z-10">
           {[
             { id: 'overview', label: 'Overview', icon: 'solar:widget-bold-duotone' },
             { id: 'singles', label: 'Singles & Coincidences', icon: 'solar:chart-square-bold-duotone' },
             { id: 'protocol', label: 'Delay Monitor', icon: 'solar:pulse-bold-duotone' },
             { id: 'support', label: 'Help & Support', icon: 'solar:question-circle-bold-duotone' }
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as Tab)}
               className={`w-full group flex items-center gap-4 px-6 py-4 rounded-xl transition-all relative overflow-hidden font-mono text-xs uppercase tracking-widest ${
                 activeTab === item.id 
                   ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                   : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
               }`}
             >
               <iconify-icon icon={item.icon} width="20"></iconify-icon>
               {item.label}
               {activeTab === item.id && (
                 <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
               )}
             </button>
           ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800 relative z-10">
           <button 
             onClick={onBack}
             className="w-full py-4 rounded-full border border-slate-700 bg-slate-900 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-red-950/40 hover:border-red-500/50 transition-all group flex items-center justify-center gap-3 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 group-hover:shadow-[0_0_10px_#ef4444] transition-shadow"></div>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 font-mono group-hover:text-red-400 transition-colors">PAUSE SYSTEM</span>
           </button>
           <div className="text-center mt-8 flex flex-col items-center gap-2">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">DEVELOPED BY</p>
              <div className="flex items-center gap-2 text-slate-400">
                <iconify-icon icon="solar:q-circle-bold-duotone" width="16"></iconify-icon>
                <h2 className="text-[10px] font-black text-slate-300 tracking-[0.2em]">QuDay</h2>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 lg:p-8 relative z-10 min-w-0">
         <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col gap-8"
              >
                {/* Visual Connection Map Schematic */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 rounded-[2rem] p-12 shadow-2xl flex flex-col items-center justify-center relative min-h-[400px] flex-shrink-0">
                   <div className="absolute top-6 left-8 text-[10px] font-mono text-cyan-500/50 uppercase tracking-[0.4em] flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                     Live Telemetry
                   </div>
                   
                   <div className="flex items-center w-full max-w-5xl justify-between relative mt-4">
                      {/* Node Local */}
                      <div className="flex flex-col items-center gap-4 relative z-10 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                         <div className="text-[10px] font-mono text-cyan-400 tracking-widest border border-cyan-900 bg-cyan-950/50 px-3 py-1 rounded">LOCAL</div>
                         <h4 className="text-2xl font-black tracking-tight text-slate-100 font-mono">IOF-Demo-01</h4>
                         <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2 w-full text-center">UPTIME: 0d 00:32:08</div>
                      </div>

                      {/* Animated Data Stream */}
                      <div className="flex-grow flex flex-col items-center justify-center relative h-10 px-8">
                         <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                               <motion.div 
                                 animate={{ x: ["0%", "100%", "100%", "0%"] }}
                                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                 className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                               />
                            </div>
                         </div>
                         <div className="absolute inset-0 flex flex-col justify-between items-center -top-8 -bottom-8 pointer-events-none">
                            <div className="text-cyan-400 font-mono text-[10px] font-bold bg-slate-900 px-3 py-1 border border-cyan-900 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                               → {(1.8 + Math.sin(tick / 5) * 0.1).toFixed(2)} MBit/s
                            </div>
                            <div className="text-magenta-400 text-[#d946ef] font-mono text-[10px] font-bold bg-slate-900 px-3 py-1 border border-[#d946ef]/30 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.2)] mt-auto">
                               ← {(18.5 + Math.cos(tick / 5) * 0.8).toFixed(1)} MBit/s
                            </div>
                         </div>
                         
                         {/* Connection Stats Overlay */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-xl text-center z-10">
                            <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase">Channel Uptime</p>
                            <h2 className="text-xl font-mono text-slate-200 mt-1">0d 00:32:15</h2>
                         </div>
                      </div>

                      {/* Node Remote */}
                      <div className="flex flex-col items-center gap-4 relative z-10 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                         <div className="text-[10px] font-mono text-cyan-400 tracking-widest border border-cyan-900 bg-cyan-950/50 px-3 py-1 rounded">REMOTE</div>
                         <h4 className="text-2xl font-black tracking-tight text-slate-100 font-mono">IOF-Demo-02</h4>
                         <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2 w-full text-center">UPTIME: 0d 00:32:20</div>
                      </div>
                   </div>
                </div>

                {/* Hexagonal / Radial Glowing Stats */}
                <div className="grid grid-cols-4 gap-8 flex-grow">
                   {[
                     { label: 'Sync Level', value: `${stats.sync.toFixed(1)}%`, percent: stats.sync, color: '#eab308' },
                     { label: 'QBER', value: `${stats.qber.toFixed(2)}%`, percent: (stats.qber / 2) * 100, color: '#3b82f6' },
                     { label: 'Fidelity', value: `${stats.fidelity.toFixed(1)}%`, percent: stats.fidelity, color: '#d946ef' },
                     { label: 'Avg. Key Rate [bps]', value: `${(stats.keyRate / 1000).toFixed(2)}k`, percent: (stats.keyRate / 3000) * 100, color: '#10b981' }
                   ].map((gauge, i) => (
                     <div key={i} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Glowing Hexagon Background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <svg viewBox="0 0 100 100" className="w-48 h-48" style={{ filter: `drop-shadow(0 0 20px ${gauge.color})` }}>
                             <polygon points="50,5 93,27 93,73 50,95 7,73 7,27" fill="none" stroke={gauge.color} strokeWidth="0.5"/>
                          </svg>
                        </div>

                        <div className="relative w-32 h-32 mb-6 mt-4">
                           <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                              <circle cx="50" cy="50" r="46" fill="none" className="stroke-slate-800" strokeWidth="4" />
                              <circle 
                                cx="50" cy="50" r="46" fill="none" stroke={gauge.color} strokeWidth="4" 
                                strokeDasharray="289" strokeDashoffset={`${289 - (gauge.percent / 100) * 289}`} strokeLinecap="round"
                                className="transition-all duration-1000 ease-in-out"
                                style={{ filter: `drop-shadow(0 0 8px ${gauge.color})`}}
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-3xl font-mono text-slate-100 tabular-nums">{gauge.value}</span>
                           </div>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-[0.2em] relative z-10 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">{gauge.label}</div>
                     </div>
                   ))}
                </div>

                {/* Real-time D3 line chart displaying the 'Key Exchange Rate' history over the last 60 seconds */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-8 right-8 flex items-center gap-3 z-10">
                     <span className="flex h-2 w-2 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                     </span>
                     <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">SECURE ENTROPY QUANTUM FLOW (D3)</span>
                  </div>
                  <h3 className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase mb-8 flex items-center gap-2">
                    <iconify-icon icon="solar:round-alt-arrow-right-line-duotone" class="text-emerald-500"></iconify-icon>
                    Key Exchange Rate [Last 60 Seconds History]
                  </h3>
                  <div className="w-full">
                     <D3KeyExchangeChart data={keyExchangeHistory} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'singles' && (
              <motion.div 
                key="singles"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-12 grid-rows-2 gap-8 h-full"
              >
                {/* Singles - Radar Chart (Top Left) */}
                <div className="col-span-12 lg:col-span-6 row-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col">
                   <h3 className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase mb-4 flex items-center gap-2">
                     <iconify-icon icon="solar:round-alt-arrow-right-line-duotone" class="text-cyan-500"></iconify-icon>
                     Singles [k] Radar
                   </h3>
                   <div className="flex-grow">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="70%" data={singlesRadarData}>
                           <PolarGrid stroke="#1e293b" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                           <PolarRadiusAxis angle={30} domain={[0, 500]} tick={false} axisLine={false} />
                           <Radar name="Local" dataKey="local" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                           <Radar name="Remote" dataKey="remote" stroke="#d946ef" fill="#d946ef" fillOpacity={0.3} />
                           <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }} iconType="circle"/>
                           <RechartsTooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontFamily: 'monospace' }} itemStyle={{color: '#fff'}} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Coincidences Area Chart (Top Right) */}
                <div className="col-span-12 lg:col-span-6 row-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden">
                   <div className="absolute top-8 right-8 flex items-center gap-3 z-10">
                      <div className="px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] font-mono shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                         LIVE: {Math.round(coincidencesData[coincidencesData.length-1].value)} P/s
                      </div>
                   </div>
                   <h3 className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase mb-4 flex items-center gap-2 relative z-10">
                     <iconify-icon icon="solar:round-alt-arrow-right-line-duotone" class="text-red-500"></iconify-icon>
                     Coincidences [Pairs/s]
                   </h3>
                   <div className="flex-grow -mx-4 -mb-4 relative z-0">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={coincidencesData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorCoincidences" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} domain={['dataMin - 500', 'dataMax + 500']} orientation="right" width={40} />
                            <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#colorCoincidences)" isAnimationActive={false} />
                            {/* Glowing Playhead emulation */}
                            <line x1="99%" y1="0" x2="99%" y2="100%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ filter: 'drop-shadow(0 0 5px #ef4444)'}} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Coincidences per Polarization 3D-ish Bar Chart (Bottom Left) */}
                <div className="col-span-12 lg:col-span-6 row-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col">
                   <h3 className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase mb-4 flex items-center gap-2">
                     <iconify-icon icon="solar:round-alt-arrow-right-line-duotone" class="text-[#22c55e]"></iconify-icon>
                     Polarization Analysis
                   </h3>
                   <div className="flex-grow">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={polarizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} unit="k" />
                            <RechartsTooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontFamily: 'monospace', color: '#fff' }} />
                            <Bar dataKey="value1" fill="#22c55e" radius={[4,4,0,0]} barSize={12} name="Set Alpha" />
                            <Bar dataKey="value2" fill="#d946ef" radius={[4,4,0,0]} barSize={12} name="Set Beta" style={{ transform: 'translate(-4px, 4px)' }} />
                            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }} iconType="circle"/>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Heralding Oscilloscope (Bottom Right) */}
                <div className="col-span-12 lg:col-span-6 row-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col">
                   <h3 className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase mb-4 flex items-center gap-2">
                     <iconify-icon icon="solar:round-alt-arrow-right-line-duotone" class="text-blue-500"></iconify-icon>
                     Heralding [%] Wave
                   </h3>
                   <div className="flex-grow relative bg-[#020617] rounded-2xl border border-slate-800 p-2 overflow-hidden">
                      {/* Grid overlay for oscilloscope feel */}
                      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                      
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={heraldingData}>
                            <YAxis domain={[0, 4]} hide />
                            <Line type="monotone" dataKey="local" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} style={{ filter: 'drop-shadow(0 0 6px #3b82f6)'}} name="Local" />
                            <Line type="step" dataKey="remote" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} style={{ filter: 'drop-shadow(0 0 6px #eab308)'}} name="Remote" />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#fff' }} iconType="plainline"/>
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'protocol' && (
              <motion.div 
                key="protocol"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 gap-8 h-full overflow-y-auto pr-2 pb-8"
              >
                 {/* Server 1 Column */}
                 <div className="space-y-6">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center sticky top-0 z-10 shadow-lg">
                      <h3 className="text-xs font-mono font-black tracking-[0.3em] text-slate-100 uppercase">SERVER 1: DELAY DISTRIBUTION</h3>
                    </div>
                    {[{ label: 'Sync Channel', color: '#eab308', peak: 0, tag: '0.11 ns' }, // Yellow
                      { label: 'Polarization V', color: '#22c55e', peak: -5, tag: '-0.47 ns' }, // Green
                      { label: 'Polarization D', color: '#d946ef', peak: 2, tag: '0.23 ns' }, // Magenta
                      { label: 'Polarization A', color: '#ef4444', peak: 1, tag: '0.14 ns' }  // Red
                     ].map((cfg, i) => (
                       <div key={i} className="h-48 bg-slate-900/40 backdrop-blur rounded-2xl border border-slate-800/50 p-6 relative group overflow-hidden">
                          <h4 className="text-[10px] font-mono text-slate-400 absolute top-4 left-6 uppercase tracking-widest">{cfg.label}</h4>
                          <div className="absolute top-4 right-6 text-[10px] font-mono font-black text-slate-100 bg-slate-950 px-2 py-1 rounded border border-slate-800 shadow-lg z-10" style={{ borderColor: cfg.color, color: cfg.color }}>
                            {cfg.tag}
                          </div>
                          <ResponsiveContainer width="100%" height="100%" className="-ml-4 mt-4">
                             <AreaChart data={delayDataGen(cfg.peak, 3)}>
                               <defs>
                                 <linearGradient id={`gradS1_${i}`} x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor={cfg.color} stopOpacity={0.4}/>
                                   <stop offset="95%" stopColor={cfg.color} stopOpacity={0}/>
                                 </linearGradient>
                               </defs>
                               <Area type="monotone" dataKey="y" stroke={cfg.color} strokeWidth={2} fill={`url(#gradS1_${i})`} />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                     ))}
                 </div>

                 {/* Server 2 Column */}
                 <div className="space-y-6">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center sticky top-0 z-10 shadow-lg">
                      <h3 className="text-xs font-mono font-black tracking-[0.3em] text-slate-100 uppercase">SERVER 2: DELAY DISTRIBUTION</h3>
                    </div>
                    {[{ label: 'Sync Channel', color: '#eab308', peak: 0, tag: '0.11 ns' }, // Yellow
                      { label: 'Polarization V', color: '#22c55e', peak: -3, tag: '-0.33 ns' }, // Green
                      { label: 'Polarization D', color: '#d946ef', peak: 1, tag: '0.15 ns' }, // Magenta
                      { label: 'Polarization A', color: '#ef4444', peak: 4, tag: '0.55 ns' }  // Red
                     ].map((cfg, i) => (
                       <div key={i} className="h-48 bg-slate-900/40 backdrop-blur rounded-2xl border border-slate-800/50 p-6 relative group overflow-hidden">
                          <h4 className="text-[10px] font-mono text-slate-400 absolute top-4 left-6 uppercase tracking-widest">{cfg.label}</h4>
                          <div className="absolute top-4 right-6 text-[10px] font-mono font-black text-slate-100 bg-slate-950 px-2 py-1 rounded border border-slate-800 shadow-lg z-10" style={{ borderColor: cfg.color, color: cfg.color }}>
                            {cfg.tag}
                          </div>
                          <ResponsiveContainer width="100%" height="100%" className="-ml-4 mt-4">
                             <AreaChart data={delayDataGen(cfg.peak, 4)}>
                               <defs>
                                 <linearGradient id={`gradS2_${i}`} x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor={cfg.color} stopOpacity={0.4}/>
                                   <stop offset="95%" stopColor={cfg.color} stopOpacity={0}/>
                                 </linearGradient>
                               </defs>
                               <Area type="monotone" dataKey="y" stroke={cfg.color} strokeWidth={2} fill={`url(#gradS2_${i})`} />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                     ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div 
                key="support"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center p-8"
              >
                <div className="text-center p-20 bg-slate-900/70 backdrop-blur border border-slate-800 rounded-[3rem] w-full max-w-2xl relative overflow-hidden">
                   <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                   <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-magenta-500/10 rounded-full blur-3xl"></div>
                   
                   <div className="w-32 h-32 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center mx-auto mb-12 relative z-10">
                      <iconify-icon icon="solar:shield-keyhole-bold-duotone" width="60" class="text-cyan-500"></iconify-icon>
                      <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }}></div>
                   </div>
                   
                   <h2 className="text-2xl font-mono font-black tracking-widest text-slate-100 uppercase mb-4 relative z-10">Restricted Area</h2>
                   <div className="h-px w-20 bg-cyan-500/50 mx-auto mb-8 relative z-10"></div>
                   <p className="text-slate-400 font-mono text-xs tracking-widest uppercase leading-relaxed relative z-10">
                     System logs and diagnostic tools require Level 4 Authorization.<br/>
                     Please connect your physical security key or contact your QuDay administrator.
                   </p>
                </div>
              </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Theme Toggle Override (Invisible but present for structure adherence) */}
      <div className="hidden" onClick={toggleTheme}></div>
    </div>
  );
};

export default QKDDashboard;
