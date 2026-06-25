import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
  id?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  glowColor = 'rgba(249, 115, 22, 0.45)',
  id
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Springs for magnetic translation
  const springX = useSpring(0, { stiffness: 180, damping: 18, mass: 0.7 });
  const springY = useSpring(0, { stiffness: 180, damping: 18, mass: 0.7 });

  // Shine sweep mapped from spring X position
  const shineX = useTransform(springX, [-30, 30], ['-110%', '210%']);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const dx = e.clientX - (left + width / 2);
    const dy = e.clientY - (top + height / 2);
    const dist = Math.hypot(dx, dy);
    const radius = 110;

    if (dist < radius) {
      const strength = (1 - dist / radius);
      springX.set((dx / radius) * 15 * strength);
      springY.set((dy / radius) * 15 * strength);
    } else {
      springX.set(0);
      springY.set(0);
    }
  }, [springX, springY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    springX.set(0);
    springY.set(0);
  }, [springX, springY]);

  return (
    <div
      ref={ref}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="inline-block relative"
    >
      <motion.button
        onClick={onClick}
        style={{
          x: springX,
          y: springY,
          // Dynamic glow that intensifies on press
          boxShadow: isPressed
            ? `0 0 40px ${glowColor}, 0 0 80px ${glowColor.replace(/[\d.]+\)$/, '0.2)')}`
            : isHovered
            ? `0 0 22px ${glowColor}`
            : 'none',
        }}
        animate={{
          scale: isPressed ? 0.93 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className={`relative overflow-hidden group interactive select-none ${className}`}
      >
        {/* Shine sweep on hover */}
        <motion.span
          className="absolute inset-y-0 w-2/5 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"
          style={{ left: shineX }}
        />

        {/* Pulsing border ring on hover */}
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: isHovered ? `1px solid ${glowColor}` : '1px solid transparent',
            boxShadow: isHovered ? `inset 0 0 12px ${glowColor.replace(/[\d.]+\)$/, '0.12)')}` : 'none',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
        />

        {/* Click ripple */}
        {isPressed && (
          <span
            className="absolute inset-0 rounded-full animate-ping pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor.replace(/[\d.]+\)$/, '0.15)')} 0%, transparent 70%)`,
            }}
          />
        )}

        <span className="relative z-20 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    </div>
  );
};

export default MagneticButton;
