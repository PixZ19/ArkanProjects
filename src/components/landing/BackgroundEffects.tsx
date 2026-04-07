'use client';

import { useEffect, useRef, useState, useSyncExternalStore, memo, useCallback } from 'react';

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

// Hydration-safe client detection
const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Floating particles
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

// SVG Shape Morph — generates smooth morphing shapes
function ShapeMorphBlob({ size, color, opacity, top, left, duration, delay, blur }: {
  size: number;
  color: string;
  opacity: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  blur?: number;
}) {
  // Generate organic blob paths
  const path1 = generateBlobPath(6, 0.7);
  const path2 = generateBlobPath(8, 0.9);
  const path3 = generateBlobPath(5, 0.6);

  return (
    <svg
      className="fixed pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        zIndex: 1,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
      viewBox="0 0 200 200"
    >
      <defs>
        <linearGradient id={`morph-grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#morph-grad-${color.replace('#', '')})`}
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.1"
      >
        <animate
          attributeName="d"
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          values={`${path1};${path2};${path3};${path1}`}
        />
      </path>
    </svg>
  );
}

function generateBlobPath(points: number, radiusFactor: number): string {
  const cx = 100;
  const cy = 100;
  const baseRadius = 80 * radiusFactor;
  const angleStep = (Math.PI * 2) / points;
  const points_arr: string[] = [];

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = baseRadius + (Math.sin(i * 2.5) * 20 + Math.cos(i * 1.7) * 15);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points_arr.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  points_arr.push('Z');
  return points_arr.join(' ');
}

// Triangle Morphing Shape — morphs between triangle, square, pentagon, hexagon
function PolygonMorph({ size, color, opacity, top, left, duration, delay }: {
  size: number;
  color: string;
  opacity: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}) {
  const sides = [3, 6, 4, 5, 3]; // triangle, hexagon, square, pentagon, back to triangle
  const paths = sides.map(n => regularPolygonPath(100, 100, 70, n));

  return (
    <svg
      className="fixed pointer-events-none"
      style={{ width: size, height: size, top, left, opacity, zIndex: 1 }}
      viewBox="0 0 200 200"
    >
      <path
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.12"
      >
        <animate
          attributeName="d"
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          values={paths.join(';')}
        />
      </path>
      {/* Inner filled with low opacity */}
      <path
        fill={color}
        fillOpacity="0.02"
      >
        <animate
          attributeName="d"
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          values={paths.join(';')}
        />
      </path>
    </svg>
  );
}

function regularPolygonPath(cx: number, cy: number, r: number, sides: number): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ') + ' Z';
}

// ============================================================
// Constellation Canvas — dots form lines AND triangles when close
// ============================================================
const ConstellationCanvas = memo(function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });

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
    window.addEventListener('mouseleave', () => { mouseRef.current = { x: -999, y: -999 }; });

    interface Node {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; baseAlpha: number;
    }

    const nodeCount = 80;
    const connectionDist = 150;
    const triangleDist = 120;
    const mouseDist = 200;

    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.3 + 0.15,
      });
    }

    function drawTriangle(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, color: string, alpha: number) {
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * 0.03;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha * 0.08;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function hexToRgba(hex: string, a: number): string {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes
      for (const node of nodes) {
        // Mouse attraction (gentle)
        const mx = mouseRef.current.x - node.x;
        const my = mouseRef.current.y - node.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < mouseDist && md > 0) {
          const force = (1 - md / mouseDist) * 0.008;
          node.vx += (mx / md) * force;
          node.vy += (my / md) * force;
        }

        // Damping
        node.vx *= 0.999;
        node.vy *= 0.999;

        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0) { node.x = 0; node.vx *= -1; }
        if (node.x > canvas.width) { node.x = canvas.width; node.vx *= -1; }
        if (node.y < 0) { node.y = 0; node.vy *= -1; }
        if (node.y > canvas.height) { node.y = canvas.height; node.vy *= -1; }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist);

            // Draw line
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            // Gradient line
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, hexToRgba(nodes[i].color, alpha * 0.25));
            gradient.addColorStop(1, hexToRgba(nodes[j].color, alpha * 0.25));
            ctx.strokeStyle = gradient;
            ctx.lineWidth = alpha * 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw triangles (when 3 nodes are close to each other)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dij = Math.sqrt((nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2);
          if (dij > triangleDist) continue;

          for (let k = j + 1; k < nodes.length; k++) {
            const dik = Math.sqrt((nodes[i].x - nodes[k].x) ** 2 + (nodes[i].y - nodes[k].y) ** 2);
            const djk = Math.sqrt((nodes[j].x - nodes[k].x) ** 2 + (nodes[j].y - nodes[k].y) ** 2);

            if (dik < triangleDist && djk < triangleDist) {
              // All three close — draw filled triangle
              const avgDist = (dij + dik + djk) / 3;
              const closeness = 1 - (avgDist / triangleDist);
              const mixColor = nodes[i].color; // Use first node color
              drawTriangle(
                nodes[i].x, nodes[i].y,
                nodes[j].x, nodes[j].y,
                nodes[k].x, nodes[k].y,
                mixColor,
                closeness
              );
            }
          }
        }
      }

      // Draw mouse connections
      if (mouseRef.current.x > 0) {
        for (const node of nodes) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseDist) {
            const alpha = (1 - dist / mouseDist);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = hexToRgba('#00ffff', alpha * 0.15);
            ctx.lineWidth = alpha * 1;
            ctx.stroke();
          }
        }

        // Mouse glow
        const mouseGrad = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 80);
        mouseGrad.addColorStop(0, 'rgba(0,255,255,0.04)');
        mouseGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(mouseRef.current.x - 80, mouseRef.current.y - 80, 160, 160);
      }

      // Draw nodes (on top of everything)
      for (const node of nodes) {
        // Triangle-shaped dot
        const s = node.size;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - s * 1.2);
        ctx.lineTo(node.x - s, node.y + s * 0.6);
        ctx.lineTo(node.x + s, node.y + s * 0.6);
        ctx.closePath();
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.baseAlpha;
        ctx.fill();

        // Glow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tiny inner circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, s * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = node.baseAlpha * 0.5;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', () => {});
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
});

// ============================================================
// Main Component
// ============================================================
export default function BackgroundEffects() {
  const mounted = useHydrated();

  return (
    <>
      {/* Constellation Canvas — triangle dots forming lines & triangles */}
      <ConstellationCanvas />

      {/* CSS floating particles */}
      {mounted && <FloatingParticles />}

      {/* ========== SHAPE MORPH BLOBS ========== */}
      {mounted && (
        <>
          {/* Large blob top-left */}
          <ShapeMorphBlob
            size={300}
            color="#00ffff"
            opacity={0.3}
            top="5%"
            left="-2%"
            duration={25}
            delay={0}
            blur={2}
          />
          {/* Medium blob right */}
          <ShapeMorphBlob
            size={220}
            color="#8800ff"
            opacity={0.25}
            top="30%"
            left="75%"
            duration={20}
            delay={3}
            blur={1}
          />
          {/* Small blob bottom-left */}
          <ShapeMorphBlob
            size={180}
            color="#ff0088"
            opacity={0.2}
            top="65%"
            left="10%"
            duration={18}
            delay={5}
          />
          {/* Tiny blob center-right */}
          <ShapeMorphBlob
            size={140}
            color="#00ff88"
            opacity={0.2}
            top="50%"
            left="50%"
            duration={22}
            delay={8}
          />
          {/* Extra blob bottom-right */}
          <ShapeMorphBlob
            size={250}
            color="#8800ff"
            opacity={0.15}
            top="80%"
            left="65%"
            duration={28}
            delay={2}
            blur={3}
          />
          {/* Blob top-center */}
          <ShapeMorphBlob
            size={160}
            color="#00ffff"
            opacity={0.18}
            top="15%"
            left="40%"
            duration={15}
            delay={6}
          />

          {/* ========== POLYGON MORPH SHAPES ========== */}
          {/* Morphing triangle↔hexagon↔square — top area */}
          <PolygonMorph
            size={200}
            color="#00ffff"
            opacity={0.4}
            top="8%"
            left="60%"
            duration={18}
            delay={0}
          />
          {/* Morphing shape — middle left */}
          <PolygonMorph
            size={150}
            color="#8800ff"
            opacity={0.35}
            top="40%"
            left="2%"
            duration={22}
            delay={4}
          />
          {/* Morphing shape — bottom area */}
          <PolygonMorph
            size={180}
            color="#ff0088"
            opacity={0.3}
            top="75%"
            left="30%"
            duration={20}
            delay={2}
          />
          {/* Morphing shape — right side */}
          <PolygonMorph
            size={120}
            color="#00ff88"
            opacity={0.3}
            top="55%"
            left="85%"
            duration={16}
            delay={7}
          />
          {/* Morphing shape — small top-left */}
          <PolygonMorph
            size={100}
            color="#00ffff"
            opacity={0.25}
            top="20%"
            left="15%"
            duration={24}
            delay={10}
          />
          {/* Morphing shape — center */}
          <PolygonMorph
            size={160}
            color="#8800ff"
            opacity={0.2}
            top="45%"
            left="35%"
            duration={19}
            delay={5}
          />
        </>
      )}

      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="scan-lines" />
      <div className="scan-beam" />
    </>
  );
}
