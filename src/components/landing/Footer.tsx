'use client';

import { motion } from 'framer-motion';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 sm:px-6 border-t border-white/[0.04] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-t from-[#00ffff]/[0.02] to-transparent pointer-events-none blur-2xl" />
      <div className="grid-bg-fine" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <motion.div
            className="flex flex-col items-center sm:items-start gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="ArkanProjects"
                  className="w-7 h-7 rounded-md"
                />
                <div className="absolute -inset-1 rounded-md border border-cyan-500/10 opacity-50" />
              </div>
              <span className="neon-gradient-text font-bold text-lg">
                ArkanProjects
              </span>
            </div>
            <p className="text-xs text-[#8888aa] text-center sm:text-left max-w-xs">
              Dibangun dengan dedikasi untuk komunitas game server hosting.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a
              href="https://github.com/PixZ19/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#00ffff] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#555566]">
            &copy; {new Date().getFullYear()} ArkanProjects. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-[#444455] flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-[#ff0088]/40 inline" /> oleh komunitas
          </p>
        </div>
      </div>
    </footer>
  );
}
