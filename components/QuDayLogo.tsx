import React from 'react';
import { motion } from 'framer-motion';

interface QuDayLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDark?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 38,
  md: 56,
  lg: 96,
  xl: 150,
};

const QuDayLogo: React.FC<QuDayLogoProps> = ({ 
  size = 'md', 
  isDark = true, 
  animated = true,
  className = ''
}) => {
  const logoSize = sizeMap[size];
  
  // Dark mode (UV): purple glow
  // Light mode (IR): orange glow
  const gradId = `qgrd-${size}-${isDark ? 'd' : 'l'}`;

  const colors = isDark
    ? { from: '#c084fc', mid: '#a855f7', to: '#7e22ce', glow: 'rgba(168,85,247,0.6)', ring: 'rgba(168,85,247,' }
    : { from: '#fdba74', mid: '#f97316', to: '#c2410c', glow: 'rgba(249,115,22,0.45)', ring: 'rgba(249,115,22,' };

  const glowFilter = isDark
    ? `drop-shadow(0 0 10px ${colors.glow}) drop-shadow(0 0 22px rgba(139,92,246,0.4))`
    : `drop-shadow(0 0 6px ${colors.glow})`;

  const ringOpBase = isDark ? 0.25 : 0.2;
  const ringOpMid  = isDark ? 0.42 : 0.35;

  const logoContent = (
    <svg
      viewBox="0 0 220 220"
      width={logoSize}
      height={logoSize}
      className={className}
      style={{ filter: glowFilter, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="50%" stopColor={colors.mid} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
      </defs>

      {/* Wave rings — left-arc concentric rings propagating outward */}
      <motion.path
        d="M 88 35 A 78 78 0 1 0 88 185"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={isDark ? 3.5 : 2.5}
        strokeLinecap="round"
        style={{ transformOrigin: '118px 110px' }}
        animate={animated ? { 
          opacity: [0, ringOpBase * 2, 0],
          scale: [0.85, 1.15],
          x: [5, -8]
        } : { opacity: ringOpBase }}
        transition={animated ? { duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0 } : {}}
      />
      <motion.path
        d="M 95 46 A 64 64 0 1 0 95 174"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={isDark ? 4 : 3}
        strokeLinecap="round"
        style={{ transformOrigin: '118px 110px' }}
        animate={animated ? { 
          opacity: [0, ringOpMid * 1.5, 0],
          scale: [0.85, 1.15],
          x: [5, -8]
        } : { opacity: ringOpMid }}
        transition={animated ? { duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1.25 } : {}}
      />

      {/* Main Q circle */}
      <motion.circle
        cx="118"
        cy="110"
        r="52"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={isDark ? 14 : 13}
        strokeLinecap="round"
        strokeDasharray="290 30"
        strokeDashoffset="0"
        animate={animated ? {
          filter: isDark
            ? ['drop-shadow(0 0 4px rgba(168,85,247,0.5))', 'drop-shadow(0 0 16px rgba(168,85,247,0.9))', 'drop-shadow(0 0 4px rgba(168,85,247,0.5))']
            : ['drop-shadow(0 0 4px rgba(249,115,22,0.3))', 'drop-shadow(0 0 12px rgba(249,115,22,0.7))', 'drop-shadow(0 0 4px rgba(249,115,22,0.3))'],
        } : {}}
        transition={animated ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } : {}}
      />

      {/* Q tail */}
      <motion.line
        x1="152"
        y1="143"
        x2="176"
        y2="172"
        stroke={`url(#${gradId})`}
        strokeWidth={isDark ? 14 : 13}
        strokeLinecap="round"
        animate={animated ? {
          filter: isDark
            ? ['drop-shadow(0 0 4px rgba(168,85,247,0.4))', 'drop-shadow(0 0 12px rgba(168,85,247,0.8))', 'drop-shadow(0 0 4px rgba(168,85,247,0.4))']
            : ['drop-shadow(0 0 4px rgba(249,115,22,0.3))', 'drop-shadow(0 0 10px rgba(249,115,22,0.6))', 'drop-shadow(0 0 4px rgba(249,115,22,0.3))'],
        } : {}}
        transition={animated ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 } : {}}
      />
    </svg>
  );

  return animated ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120, damping: 14 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
    >
      {logoContent}
    </motion.div>
  ) : (
    <>{logoContent}</>
  );
};

export default QuDayLogo;
