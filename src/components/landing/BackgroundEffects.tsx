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
  const [particles] = useState<Particle[]>(() => generateParticles(20));

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

// Polygon Morph
function PolygonMorph({ size, color, opacity, top, left, duration, delay }: {
  size: number;
  color: string;
  opacity: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}) {
  const sides = [3, 6, 4, 5, 3];
  const paths = sides.map(n => regularPolygonPath(100, 100, 70, n));

  return (
    <svg
      className="fixed pointer-events-none"
      style={{ width: size, height: size, top, left, opacity, zIndex: 1 }}
      viewBox="0 0 200 200"
    >
      <path fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.12">
        <animate
          attributeName="d"
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          values={paths.join(';')}
        />
      </path>
      <path fill={color} fillOpacity="0.02">
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
// Constellation Canvas — optimized: faster, fewer triangles,
// handles tab visibility, reduced lag
// ============================================================
const ConstellationCanvas = memo(function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const visibleRef = useRef(true);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('mouseleave', () => { mouseRef.current = { x: -999, y: -999 }; }, { passive: true });

    // Handle tab visibility — pause when hidden, resume when visible
    const handleVisibility = () => {
      if (document.hidden) {
        visibleRef.current = false;
        cancelAnimationFrame(animRef.current);
      } else {
        visibleRef.current = true;
        lastTimeRef.current = performance.now();
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility, { passive: true });

    // Node interface
    interface Node {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; baseAlpha: number;
      r: number; g: number; b: number;
    }

    // FEWER nodes for performance
    const nodeCount = 50;
    const connectionDist = 130;
    // MUCH higher threshold = fewer triangles
    const triangleDist = 70;
    const mouseDist = 180;

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      nodes.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        // FASTER movement: 0.8 -> 1.6 base speed
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        size: Math.random() * 1.5 + 0.8,
        color,
        baseAlpha: Math.random() * 0.25 + 0.12,
        r, g, b,
      });
    }

    // Pre-compute color strings to avoid runtime hex parsing
    function nodeRgba(node: Node, a: number): string {
      return `rgba(${node.r},${node.g},${node.b},${a})`;
    }

    function draw(now: number) {
      if (!visibleRef.current) return;

      // Delta time for smooth animation regardless of frame rate
      const dt = Math.min((now - lastTimeRef.current) / 16.67, 3); // cap at 3x speed
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, w(), h());

      // Move nodes
      for (const node of nodes) {
        // Mouse attraction (gentle)
        const mx = mouseRef.current.x - node.x;
        const my = mouseRef.current.y - node.y;
        const md = mx * mx + my * my; // squared distance (avoid sqrt)
        if (md < mouseDist * mouseDist && md > 0) {
          const dist = Math.sqrt(md);
          const force = (1 - dist / mouseDist) * 0.015;
          node.vx += (mx / dist) * force * dt;
          node.vy += (my / dist) * force * dt;
        }

        // Gentle damping
        node.vx *= 0.998;
        node.vy *= 0.998;

        // Clamp max speed
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 2.5) {
          node.vx = (node.vx / speed) * 2.5;
          node.vy = (node.vy / speed) * 2.5;
        }

        node.x += node.vx * dt;
        node.y += node.vy * dt;

        // Bounce
        if (node.x < 0) { node.x = 0; node.vx = Math.abs(node.vx); }
        if (node.x > w()) { node.x = w(); node.vx = -Math.abs(node.vx); }
        if (node.y < 0) { node.y = 0; node.vy = Math.abs(node.vy); }
        if (node.y > h()) { node.y = h(); node.vy = -Math.abs(node.vy); }
      }

      // Draw connections (simple lines, no gradients for performance)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = connectionDist * connectionDist;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / connectionDist);
            const avgAlpha = (nodes[i].baseAlpha + nodes[j].baseAlpha) * 0.5;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = nodeRgba(nodes[i], alpha * 0.2 * avgAlpha);
            ctx.lineWidth = alpha * 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw triangles (HIGH threshold = very few, only very close nodes)
      const triDistSq = triangleDist * triangleDist;
      let triCount = 0;
      const maxTriangles = 8; // hard cap triangles per frame

      for (let i = 0; i < nodes.length && triCount < maxTriangles; i++) {
        for (let j = i + 1; j < nodes.length && triCount < maxTriangles; j++) {
          const dxij = nodes[i].x - nodes[j].x;
          const dyij = nodes[i].y - nodes[j].y;
          const dijSq = dxij * dxij + dyij * dyij;
          if (dijSq > triDistSq) continue;

          for (let k = j + 1; k < nodes.length && triCount < maxTriangles; k++) {
            const dxik = nodes[i].x - nodes[k].x;
            const dyik = nodes[i].y - nodes[k].y;
            const dikSq = dxik * dxik + dyik * dyik;
            if (dikSq > triDistSq) continue;

            const dxjk = nodes[j].x - nodes[k].x;
            const dyjk = nodes[j].y - nodes[k].y;
            const djkSq = dxjk * dxjk + dyjk * dyjk;
            if (djkSq > triDistSq) continue;

            // All three very close — draw subtle filled triangle
            const avgDist = (Math.sqrt(dijSq) + Math.sqrt(dikSq) + Math.sqrt(djkSq)) / 3;
            const closeness = 1 - (avgDist / triangleDist);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.lineTo(nodes[k].x, nodes[k].y);
            ctx.closePath();
            ctx.fillStyle = nodeRgba(nodes[i], closeness * 0.025);
            ctx.fill();
            ctx.strokeStyle = nodeRgba(nodes[i], closeness * 0.06);
            ctx.lineWidth = 0.4;
            ctx.stroke();
            triCount++;
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
            ctx.strokeStyle = `rgba(0,255,255,${alpha * 0.12})`;
            ctx.lineWidth = alpha * 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes (simple dots, no shadow for performance)
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeRgba(node, node.baseAlpha);
        ctx.fill();

        // Tiny bright center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${node.baseAlpha * 0.4})`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('visibilitychange', handleVisibility);
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
      {/* Constellation Canvas */}
      <ConstellationCanvas />

      {/* CSS floating particles — reduced count */}
      {mounted && <FloatingParticles />}

      {/* ========== SHAPE MORPH BLOBS ========== */}
      {mounted && (
        <>
          <ShapeMorphBlob size={300} color="#00ffff" opacity={0.3} top="5%" left="-2%" duration={25} delay={0} blur={2} />
          <ShapeMorphBlob size={220} color="#8800ff" opacity={0.25} top="30%" left="75%" duration={20} delay={3} blur={1} />
          <ShapeMorphBlob size={180} color="#ff0088" opacity={0.2} top="65%" left="10%" duration={18} delay={5} />
          <ShapeMorphBlob size={140} color="#00ff88" opacity={0.2} top="50%" left="50%" duration={22} delay={8} />
          <ShapeMorphBlob size={250} color="#8800ff" opacity={0.15} top="80%" left="65%" duration={28} delay={2} blur={3} />
          <ShapeMorphBlob size={160} color="#00ffff" opacity={0.18} top="15%" left="40%" duration={15} delay={6} />

          {/* ========== POLYGON MORPH SHAPES ========== */}
          <PolygonMorph size={200} color="#00ffff" opacity={0.4} top="8%" left="60%" duration={18} delay={0} />
          <PolygonMorph size={150} color="#8800ff" opacity={0.35} top="40%" left="2%" duration={22} delay={4} />
          <PolygonMorph size={180} color="#ff0088" opacity={0.3} top="75%" left="30%" duration={20} delay={2} />
          <PolygonMorph size={120} color="#00ff88" opacity={0.3} top="55%" left="85%" duration={16} delay={7} />
          <PolygonMorph size={100} color="#00ffff" opacity={0.25} top="20%" left="15%" duration={24} delay={10} />
          <PolygonMorph size={160} color="#8800ff" opacity={0.2} top="45%" left="35%" duration={19} delay={5} />
        </>
      )}

      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="scan-lines" />
      <div className="scan-beam" />
    </>
  );
}
