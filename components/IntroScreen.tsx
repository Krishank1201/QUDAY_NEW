import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuDayLogo from './QuDayLogo';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 5500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Quantum wave lines animation
  const generateWaveLines = (count: number) => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      delay: i * 0.08,
      duration: 3 + Math.random() * 1.5,
    }));
  };

  const waveLines = generateWaveLines(20);

  // Floating quantum particles
  const quantumParticles = [...Array(25)].map((_, i) => ({
    id: i,
    x: Math.random() * 400 - 200,
    y: Math.random() * 600 - 300,
    delay: i * 0.1,
    duration: 4 + Math.random() * 2,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, backdropFilter: 'blur(0px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] overflow-hidden select-none"
          style={{
            background: 'linear-gradient(135deg, #0a0820 0%, #1a1640 25%, #2d1b69 50%, #1a1640 75%, #0f0c29 100%)',
            userSelect: 'none',
          }}
        >
          {/* Animated gradient background layers */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -50, 50, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -50, 50, 0],
                y: [0, 50, -50, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
            />
          </div>

          {/* Wave lines emanating from center */}
          {waveLines.map((line) => (
            <motion.div
              key={`wave-${line.id}`}
              className="absolute top-1/2 left-1/2 origin-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0, 3, 5] }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                delay: line.delay,
                ease: 'easeOut',
              }}
            >
              <div
                className="w-1 h-1 rounded-full"
                style={{
                  background: `linear-gradient(135deg, #0EA5E9, #06B6D4)`,
                  width: '2px',
                  height: '2px',
                }}
              />
            </motion.div>
          ))}

          {/* Quantum particles */}
          {quantumParticles.map((particle) => (
            <motion.div
              key={`particle-${particle.id}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                x: particle.x,
                y: particle.y,
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: `hsl(${200 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`,
                  boxShadow: `0 0 8px hsl(${200 + Math.random() * 60}, 100%, ${60 + Math.random() * 20}%)`,
                }}
              />
            </motion.div>
          ))}

          {/* Main content container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Logo with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 80 }}
              className="mb-8 relative"
            >
              {/* Outer glow halo */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(14, 165, 233, 0.3)',
                    '0 0 80px rgba(14, 165, 233, 0.6)',
                    '0 0 40px rgba(14, 165, 233, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full"
                style={{ width: '180px', height: '180px', left: '-10px', top: '-10px' }}
              />

              <QuDayLogo size="xl" isDark={true} animated={true} />
            </motion.div>

            {/* Main title with quantum effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center"
            >
              <motion.h1
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl md:text-7xl font-black tracking-wider mb-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% 200%' }}
              >
                QuDay
              </motion.h1>

              {/* Subtitle with character-by-character reveal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-xl md:text-2xl font-light tracking-[0.2em] text-cyan-200/70 uppercase"
              >
                <motion.span
                  animate={{
                    color: ['#a5f3fc', '#06b6d4', '#0ea5e9', '#a5f3fc'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Quantum Day
                </motion.span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="text-sm md:text-base text-cyan-300/50 mt-6 font-light tracking-wider"
              >
                CYBER-SOVEREIGNTY EVOLVED
              </motion.p>
            </motion.div>

            {/* Circular progress with pulsing effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-1/4"
            >
              <div className="flex flex-col items-center gap-6">
                {/* Main circular progress */}
                <svg className="w-20 h-20" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(14, 165, 233, 0.1)"
                    strokeWidth="2"
                  />
                  
                  {/* Animated progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradientProgress)"
                    strokeWidth="2.5"
                    strokeDasharray="282.7"
                    initial={{ strokeDashoffset: 282.7 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 5, ease: 'easeInOut' }}
                    strokeLinecap="round"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradientProgress" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Loading text */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xs text-cyan-300/60 tracking-[0.3em] uppercase font-light"
                >
                  Quantum Initializing
                </motion.div>
              </div>
            </motion.div>

            {/* Corner quantum nodes */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`corner-node-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                  top: i < 2 ? '20%' : '80%',
                  left: i % 2 === 0 ? '10%' : '90%',
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Discover Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, boxShadow: '0 20px 60px rgba(14, 165, 233, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsVisible(false);
                setTimeout(onComplete, 600);
              }}
              className="absolute bottom-1/3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-cyan-300/50 z-20"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              ✨ Discover the Quantum World
            </motion.button>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `hsl(${180 + i * 30}, 100%, 60%)`,
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translateX(${80 + i * 30}px)`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
