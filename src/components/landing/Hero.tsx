'use client';

import { motion } from 'framer-motion';
import { Terminal, Github, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const terminalLines = [
  { text: '$ bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)', color: '#00ffff', delay: 0 },
  { text: '', color: '', delay: 0.3 },
  { text: '  ArkanProjects — Pterodactyl All-in-One Installer', color: '#00ffff', delay: 0.6 },
  { text: '  https://github.com/PixZ19/ArkanProjects', color: '#8888aa', delay: 0.8 },
  { text: '', color: '', delay: 1.0 },
  { text: '  [i] Sistem operasi terdeteksi: Ubuntu 24.04 (amd64)', color: '#00ff88', delay: 1.3 },
  { text: '  [i] Panel terbaru: v1.0.0 | Wings terbaru: v1.0.7', color: '#00ff88', delay: 1.6 },
  { text: '', color: '', delay: 1.8 },
  { text: '  [?] Pilih [1-3]: 3', color: '#8888aa', delay: 2.1 },
  { text: '  [i] Memverifikasi DNS...', color: '#00ffff', delay: 2.5 },
  { text: '  [ok] DNS terverifikasi', color: '#00ff88', delay: 2.9 },
  { text: '  [1/8] Menginstal dependensi...', color: '#00ffff', delay: 3.3 },
  { text: '  [ok] Dependensi terinstal', color: '#00ff88', delay: 3.8 },
];

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card">
      <div className="count-shimmer text-2xl sm:text-3xl font-bold mb-1">
        {count}{suffix}
      </div>
      <div className="text-xs text-[#8888aa]">{label}</div>
    </div>
  );
}

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Floating orbs - more of them, layered */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/8 to-transparent blur-[120px]" />
        <div className="orb-2 absolute top-[40%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-purple-600/8 to-transparent blur-[100px]" />
        <div className="orb-3 absolute bottom-[15%] left-[25%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-green-500/6 to-transparent blur-[110px]" />
        <div className="orb-4 absolute top-[60%] left-[60%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-500/5 to-transparent blur-[100px]" />
        <div className="orb-5 absolute top-[20%] right-[35%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-cyan-400/5 to-transparent blur-[90px]" />
      </div>

      {/* Aurora effect */}
      <div className="aurora top-[-20%] left-[-10%]" />
      <div className="aurora bottom-[-20%] right-[-10%]" style={{ animationDelay: '-7s' }} />

      {/* Grid pattern */}
      <div className="grid-bg" />
      <div className="grid-bg-fine" />

      {/* Hex grid overlay */}
      <div className="hex-grid" />

      {/* Floating geometric shapes */}
      <div className="absolute top-[15%] right-[10%] pointer-events-none">
        <div className="geo-diamond opacity-40" />
      </div>
      <div className="absolute bottom-[25%] left-[8%] pointer-events-none">
        <div className="geo-circle opacity-40" />
      </div>
      <div className="absolute top-[55%] right-[20%] pointer-events-none">
        <div className="geo-triangle opacity-60" />
      </div>
      <div className="absolute top-[30%] left-[5%] pointer-events-none">
        <div className="geo-ring opacity-50" />
      </div>
      <div className="absolute bottom-[35%] right-[5%] pointer-events-none">
        <div className="geo-diamond opacity-20" style={{ width: '25px', height: '25px', animationDuration: '20s' }} />
      </div>
      <div className="absolute top-[70%] left-[40%] pointer-events-none hidden lg:block">
        <div className="geo-circle opacity-20" style={{ width: '40px', height: '40px', animationDuration: '35s' }} />
      </div>

      {/* Glow dots */}
      <div className="absolute top-[22%] left-[30%] pointer-events-none">
        <div className="glow-dot" style={{ color: '#00ffff' }} />
      </div>
      <div className="absolute top-[45%] right-[25%] pointer-events-none">
        <div className="glow-dot" style={{ color: '#8800ff', animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-[30%] left-[50%] pointer-events-none">
        <div className="glow-dot" style={{ color: '#00ff88', animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Logo */}
            <motion.div
              className="mb-8 flex justify-center lg:justify-start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-cyan-500/10">
                  <img src="/logo.png" alt="ArkanProjects Logo" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -inset-1 rounded-2xl border border-cyan-500/10 pulse-ring" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="neon-gradient-text">Arkan</span>
              <span className="text-white/90">Projects</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-[#8888aa] max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Pterodactyl All-in-One Installer — Solusi lengkap untuk instalasi{' '}
              <span className="text-[#00ffff]/80">Pterodactyl Panel</span> dan{' '}
              <span className="text-[#00ff88]/80">Wings</span> dalam satu script.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <a
                href="https://arkanprojects.vercel.app/installer/pterodactyl.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-button px-8 py-3.5 text-base font-semibold cursor-pointer w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Mulai Instalasi
                  <ChevronRight className="w-4 h-4" />
                </span>
              </a>
              <a
                href="https://github.com/PixZ19/ArkanProjects"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-button-secondary px-8 py-3.5 text-base font-semibold cursor-pointer w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub
                </span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-3 mt-10 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <StatCounter value={5} label="OS Didukung" />
              <StatCounter value={8} label="Fitur Utama" />
              <StatCounter value={1} label="Perintah" />
            </motion.div>
          </motion.div>

          {/* Right: Terminal mockup */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="terminal-mockup relative">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
                </div>
                <span className="text-xs text-[#8888aa] ml-2 font-mono">arkanprojects — bash</span>
              </div>

              {/* Terminal body */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[320px] relative">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="leading-6"
                    style={{ color: line.color || 'transparent' }}
                  >
                    {line.text || '\u00A0'}
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                {visibleLines < terminalLines.length && (
                  <span className="typing-cursor" />
                )}

                {/* Subtle scan line inside terminal */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                  }}
                />
              </div>

              {/* Terminal glow effect */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#00ffff]/5 blur-xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs text-[#8888aa]/50">Gulir ke bawah</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-[#00ffff]/50" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
