'use client';

import { useEffect, useRef, useState, useSyncExternalStore, memo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
  type: 'dot' | 'line' | 'cross';
  rotation: number;
}

const colors = ['#00ffff', '#00ff88', '#8800ff', '#ff0088'];

function generateParticles(count: number): Particle[] {
  const types: Particle['type'][] = ['dot', 'dot', 'dot', 'line', 'cross'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.3 + 0.1,
    type: types[Math.floor(Math.random() * types.length)],
    rotation: Math.random() * 360,
  }));
}

// Hydration-safe client detection via useSyncExternalStore
const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Separate memoized component — only renders client-side
const FloatingParticles = memo(function FloatingParticles() {
  const [particles] = useState<Particle[]>(() => generateParticles(35));

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.type === 'dot' ? p.size : p.type === 'line' ? p.size * 8 : p.size * 5,
            height: p.type === 'dot' ? p.size : p.size,
            backgroundColor: p.type === 'dot' ? p.color : 'transparent',
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
            zIndex: 1,
            borderRadius: p.type === 'dot' ? '50%' : '0',
            transform: `rotate(${p.rotation}deg)`,
            ...(p.type === 'line' ? {
              background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
            } : {}),
            ...(p.type === 'cross' ? {
              background: `linear-gradient(0deg, ${p.color}, ${p.color})`,
              boxShadow: `0 0 0 ${p.size * 0.6}px ${p.color}`,
            } : {}),
          }}
        />
      ))}
    </>
  );
});

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useHydrated();
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);

    const dots: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];

    for (let i = 0; i < 50; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = 0.15;
        ctx.fill();

        // Lines to nearby dots
        for (const other of dots) {
          const dx = dot.x - other.x;
          const dy = dot.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = dot.color;
            ctx.globalAlpha = 0.03 * (1 - dist / 120);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        const mx = mouseRef.current.x - dot.x;
        const my = mouseRef.current.y - dot.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < 150) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = '#00ffff';
          ctx.globalAlpha = 0.05 * (1 - md / 150);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* CSS floating particles — client-only via separate component */}
      {mounted && <FloatingParticles />}

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Scan lines */}
      <div className="scan-lines" />

      {/* Scan beam */}
      <div className="scan-beam" />
    </>
  );
}
