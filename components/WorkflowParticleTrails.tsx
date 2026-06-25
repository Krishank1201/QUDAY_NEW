import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WorkflowParticleTrailsProps {
  theme?: 'uv' | 'ir';
}

interface Particle {
  progress: number;
  speed: number;
  size: number;
  noiseOffset: THREE.Vector3;
  color: THREE.Color;
  streamIndex: number;
  pathSegment: 1 | 2; // segment 1: step 1->2, segment 2: step 2->3
}

export const WorkflowParticleTrails: React.FC<WorkflowParticleTrailsProps> = ({ theme = 'uv' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Set up Three.js scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const isIR = theme === 'ir' || document.documentElement.classList.contains('theme-ir');
    const primaryColorHex = isIR ? '#ff5a36' : '#a855f7'; // Orange vs Purple
    const secondaryColorHex = isIR ? '#fee2e2' : '#06b6d2'; // Soft Lab White vs Holographic Cyan

    const createParticleTexture = () => {
      const size = 64;
      const cv = document.createElement('canvas');
      cv.width = size;
      cv.height = size;
      const ctx = cv.getContext('2d')!;

      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      return new THREE.CanvasTexture(cv);
    };

    const particleTexture = createParticleTexture();

    const maxParticles = 120;
    const particles: Particle[] = [];
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 16,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const pColor1 = new THREE.Color(primaryColorHex);
    const pColor2 = new THREE.Color(secondaryColorHex);

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        progress: Math.random(),
        speed: 0.0025 + Math.random() * 0.0035,
        size: 5.5 + Math.random() * 18,
        streamIndex: Math.floor(Math.random() * 3),
        pathSegment: i < maxParticles / 2 ? 1 : 2, // Half flow 1->2, half 2->3
        noiseOffset: new THREE.Vector3(
          Math.random() * 80,
          Math.random() * 80,
          Math.random() * 80
        ),
        color: Math.random() > 0.45 ? pColor1.clone() : pColor2.clone(),
      });
    }

    // Coords tracking
    let start2D = new THREE.Vector2(-width / 3, 0);
    let mid2D = new THREE.Vector2(0, 0);
    let end2D = new THREE.Vector2(width / 3, 0);
    let positionsCalibrated = false;

    // Direct cursor and hover excitation tracking
    let containerHovered = false;

    const handleMouseEnter = () => { containerHovered = true; };
    const handleMouseLeave = () => { containerHovered = false; };
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    const updateTargetCoords = () => {
      const step1 = document.getElementById('workflow-step-01');
      const step2 = document.getElementById('workflow-step-02');
      const step3 = document.getElementById('workflow-step-03');
      
      if (step1 && step2 && step3) {
        const containerRect = container.getBoundingClientRect();
        const rect1 = step1.getBoundingClientRect();
        const rect2 = step2.getBoundingClientRect();
        const rect3 = step3.getBoundingClientRect();

        const sX = (rect1.left + rect1.width / 2) - containerRect.left;
        const sY = (rect1.top + rect1.height / 2) - containerRect.top;

        const mX = (rect2.left + rect2.width / 2) - containerRect.left;
        const mY = (rect2.top + rect2.height / 2) - containerRect.top;

        const eX = (rect3.left + rect3.width / 2) - containerRect.left;
        const eY = (rect3.top + rect3.height / 2) - containerRect.top;

        start2D.set(sX - width / 2, -(sY - height / 2));
        mid2D.set(mX - width / 2, -(mY - height / 2));
        end2D.set(eX - width / 2, -(eY - height / 2));
        positionsCalibrated = true;
      } else {
        start2D.set(-width / 3, 0);
        mid2D.set(0, 0);
        end2D.set(width / 3, 0);
        positionsCalibrated = false;
      }
    };

    updateTargetCoords();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        updateTargetCoords();
      }
    });
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      
      // Periodically sync coordinates to keep alignments precise
      if (!positionsCalibrated || Math.floor(time * 10) % 20 === 0) {
        updateTargetCoords();
      }

      const pPosAttr = geometry.attributes.position as THREE.BufferAttribute;
      const pColorAttr = geometry.attributes.color as THREE.BufferAttribute;
      const pSizeAttr = geometry.attributes.size as THREE.BufferAttribute;

      // Accelerated speed and expansion on hover
      const hoverSpeedFactor = containerHovered ? 2.4 : 1.0;

      particles.forEach((p, idx) => {
        p.progress += p.speed * hoverSpeedFactor;
        if (p.progress > 1) {
          p.progress = 0;
          p.speed = 0.0025 + Math.random() * 0.0035;
        }

        const t = p.progress;

        // Curve start/finish pairs based on assigned segment
        let s2d = start2D;
        let e2d = mid2D;
        if (p.pathSegment === 2) {
          s2d = mid2D;
          e2d = end2D;
        }

        const deltaX = e2d.x - s2d.x;
        const deltaY = e2d.y - s2d.y;

        const streamOffsetY = (p.streamIndex - 1) * 12;
        const cpOffsetY = deltaX > 80 ? 45 : 22;

        const p0 = new THREE.Vector3(s2d.x, s2d.y, 0);
        const p1 = new THREE.Vector3(s2d.x + deltaX * 0.35, s2d.y + cpOffsetY + streamOffsetY, 0);
        const p2 = new THREE.Vector3(s2d.x + deltaX * 0.65, s2d.y - cpOffsetY - streamOffsetY, 0);
        const p3 = new THREE.Vector3(e2d.x, e2d.y, 0);

        const oneMinusT = 1 - t;
        const mt2 = oneMinusT * oneMinusT;
        const mt3 = mt2 * oneMinusT;
        const t2 = t * t;
        const t3 = t2 * t;

        const currentPos = new THREE.Vector3()
          .addScaledVector(p0, mt3)
          .addScaledVector(p1, 3 * mt2 * t)
          .addScaledVector(p2, 3 * oneMinusT * t2)
          .addScaledVector(p3, t3);

        const frequencyMultiplier = 3.0 + p.streamIndex * 1.5;
        const amplitude = (3.5 + Math.sin(time * 3 + p.noiseOffset.z) * 2.5) * (containerHovered ? 1.6 : 1.0);
        
        currentPos.x += Math.sin(t * Math.PI * frequencyMultiplier + time * 1.4) * amplitude * 0.4;
        currentPos.y += Math.cos(t * Math.PI * frequencyMultiplier + time * 1.8) * amplitude * 0.5;
        currentPos.z += Math.sin(time * 1.5 + p.noiseOffset.x) * 8;

        pPosAttr.setXYZ(idx, currentPos.x, currentPos.y, currentPos.z);

        const fadeValue = Math.min(1, Math.sin(t * Math.PI) * 1.8);
        const alphaPulse = containerHovered ? 1.25 : 1.0;

        pColorAttr.setXYZ(
          idx, 
          p.color.r * fadeValue * alphaPulse, 
          p.color.g * fadeValue * alphaPulse, 
          p.color.b * fadeValue * alphaPulse
        );

        const sizeMultiplier = containerHovered ? 1.55 : 1.0;
        const pulse = 1 + Math.sin(time * 6.5 + p.noiseOffset.y) * 0.22;
        pSizeAttr.setX(idx, p.size * pulse * fadeValue * sizeMultiplier);
      });

      pPosAttr.needsUpdate = true;
      pColorAttr.needsUpdate = true;
      pSizeAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      renderer.dispose();
      particleTexture.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full opacity-80 md:opacity-95"
      />
    </div>
  );
};

export default WorkflowParticleTrails;
