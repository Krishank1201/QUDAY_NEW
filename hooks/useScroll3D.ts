import { useEffect, useRef } from 'react';

/**
 * Custom hook to apply 3D scroll effects to elements
 * Provides perspective-based transformations based on scroll position
 */
export const useScrollEffect3D = (intensity: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;

      // Apply 3D transforms based on scroll position
      const rotateX = scrollPercent * 10 * intensity;
      const translateZ = scrollPercent * 50 * intensity;
      const scale = 1 + scrollPercent * 0.1 * intensity;

      element.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        translateZ(${translateZ}px)
        scale(${scale})
      `;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity]);

  return ref;
};

/**
 * Hook for parallax effect with scroll
 */
export const useParallax = (intensity: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
      const offset = scrollPercent * 100 * intensity;

      ref.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity]);

  return ref;
};

/**
 * Hook for element reveal animation on scroll
 */
export const useRevealOnScroll = (threshold: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
};

/**
 * Hook for mouse tracking 3D effect
 */
export const useMouseTracking3D = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.02)
      `;
    };

    const handleMouseLeave = () => {
      element.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `;
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
};
