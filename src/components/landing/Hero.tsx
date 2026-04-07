'use client';

import { motion } from 'framer-motion';
import { Terminal, Github } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-[120px]" />
        <div className="orb-2 absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-600/10 to-transparent blur-[100px]" />
        <div className="orb-3 absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-green-500/8 to-transparent blur-[110px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-cyan-500/10">
              <img
                src="/logo.png"
                alt="ArkanProjects Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="neon-gradient-text">Arkan</span>
            <span className="text-white/90">Projects</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-[#8888aa] max-w-2xl mx-auto mb-10 leading-relaxed"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <a
              href="https://arkanprojects.vercel.app/installer/pterodactyl.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button px-8 py-3.5 text-base font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Mulai Instalasi
              </span>
            </a>
            <a
              href="https://github.com/PixZ19/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button-secondary px-8 py-3.5 text-base font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center pt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-1 h-2 rounded-full bg-[#00ffff]/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
