'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Star, GitFork, Box } from 'lucide-react';

interface Source {
  title: string;
  description: string;
  url: string;
  color: string;
}

const sources: Source[] = [
  {
    title: 'HemanRathore/pterodactyl-installer',
    description:
      'Instalasi terstruktur dengan UI branding khusus',
    url: 'https://github.com/HemanRathore/pterodactyl-installer',
    color: '#00ffff',
  },
  {
    title: 'pterodactyl-installer/pterodactyl-installer',
    description:
      'Installer resmi komunitas oleh Vilhelm Prytz',
    url: 'https://github.com/pterodactyl-installer/pterodactyl-installer',
    color: '#00ff88',
  },
  {
    title: 'MuLTiAcidi/pterodactyl-addons',
    description:
      'Panel dengan addon game dan tema premium',
    url: 'https://github.com/MuLTiAcidi/pterodactyl-addons',
    color: '#8800ff',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Sources() {
  return (
    <section id="sumber" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="section-glow-cyan top-0 left-1/2 -translate-x-1/2" />
      <div className="section-glow-purple bottom-0 right-1/4" />
      <div className="hex-grid" />

      {/* Geometric shapes */}
      <div className="absolute top-16 left-[8%] pointer-events-none hidden xl:block">
        <div className="geo-circle opacity-20" style={{ width: '45px', height: '45px' }} />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Section title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-4">
            <div className="glow-dot" style={{ color: '#ff0088', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">REFERENSI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-gradient-text">Sumber & Referensi</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto">
            Proyek-proyek yang menjadi inspirasi dan referensi ArkanProjects
          </p>
        </motion.div>

        {/* Sources grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {sources.map((source) => (
            <motion.a
              key={source.url}
              variants={itemVariants}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rotating-border p-6 group cursor-pointer block"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Inner hover glow */}
              <div
                className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${source.color}08, transparent 70%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="feature-icon"
                    style={{ backgroundColor: `${source.color}15` }}
                  >
                    <Box
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                      style={{ color: source.color }}
                    />
                  </div>
                  <ExternalLink
                    className="w-4 h-4 text-[#8888aa] opacity-0 group-hover:opacity-100 group-hover:text-[#00ffff] transition-all duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-white/90 mb-2 leading-tight font-mono">
                  {source.title}
                </h3>
                <p className="text-xs text-[#8888aa] leading-relaxed">
                  {source.description}
                </p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-[#8888aa] group-hover:text-[#00ffff]/60 transition-colors">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">GitHub</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8888aa] group-hover:text-[#00ffff]/60 transition-colors">
                    <GitFork className="w-3 h-3" />
                    <span className="text-xs">Open Source</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
