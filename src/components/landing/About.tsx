'use client';

import { motion } from 'framer-motion';
import { Users, Github, ExternalLink } from 'lucide-react';

const developers = [
  'Muhammad Rafif Rianto C.Ps',
  'Faturrahman Al Rizky',
  'Akhbar Alfiansyah',
];

export default function About() {
  return (
    <section id="tentang" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-gradient-text">Tentang ArkanProjects</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Description */}
          <div className="glass-card p-6 sm:p-8 mb-8">
            <p className="text-[#8888aa] leading-relaxed text-base sm:text-lg">
              ArkanProjects adalah proyek installer Pterodactyl all-in-one yang dikembangkan
              berdasarkan analisis mendalam dari installer-installer Pterodactyl yang sudah ada.
              Tujuannya menyederhanakan proses instalasi Pterodactyl Panel dan Wings menjadi
              satu perintah.
            </p>
          </div>

          {/* Developers */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-[#00ffff]" />
              <h3 className="text-lg font-semibold text-white/90">Pengembang</h3>
            </div>
            <div className="space-y-3 mb-6">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#8800ff]/20 flex items-center justify-center text-xs font-bold text-[#00ffff] border border-[#00ffff]/20">
                    {dev.charAt(0)}
                  </div>
                  <span className="text-sm text-white/80">{dev}</span>
                </div>
              ))}
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/PixZ19/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#00ffff] hover:text-[#00ff88] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>github.com/PixZ19/ArkanProjects</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
