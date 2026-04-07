'use client';

import { motion } from 'framer-motion';
import { Monitor, Cpu, HardDrive } from 'lucide-react';

interface OSItem {
  name: string;
  codename: string;
  version: string;
  archs: string[];
  status: 'LTS' | 'Stable';
  color: string;
}

const osList: OSItem[] = [
  { name: 'Ubuntu', codename: 'Jammy Jellyfish', version: '22.04 LTS', archs: ['amd64', 'arm64'], status: 'LTS', color: '#ff8800' },
  { name: 'Ubuntu', codename: 'Noble Numbat', version: '24.04 LTS', archs: ['amd64', 'arm64'], status: 'LTS', color: '#ff8800' },
  { name: 'Debian', codename: 'Buster', version: '10', archs: ['amd64'], status: 'Stable', color: '#ff0088' },
  { name: 'Debian', codename: 'Bullseye', version: '11', archs: ['amd64'], status: 'Stable', color: '#ff0088' },
  { name: 'Debian', codename: 'Bookworm', version: '12', archs: ['amd64'], status: 'Stable', color: '#ff0088' },
  { name: 'Debian', codename: 'Trixie', version: '13', archs: ['amd64'], status: 'Stable', color: '#ff0088' },
  { name: 'Rocky Linux', codename: 'Green Obsidian', version: '8', archs: ['amd64'], status: 'LTS', color: '#00ff88' },
  { name: 'Rocky Linux', codename: 'Blue Onyx', version: '9', archs: ['amd64'], status: 'LTS', color: '#00ff88' },
  { name: 'AlmaLinux', codename: 'Sapphire Caracal', version: '8', archs: ['amd64'], status: 'LTS', color: '#8800ff' },
  { name: 'AlmaLinux', codename: 'Purple Sultan', version: '9', archs: ['amd64'], status: 'LTS', color: '#8800ff' },
];

const requirements = [
  { icon: Cpu, label: 'CPU', value: '1 Core minimum', color: '#00ffff' },
  { icon: Monitor, label: 'RAM (Panel)', value: '2GB minimum', color: '#00ff88' },
  { icon: HardDrive, label: 'Disk', value: '20GB minimum', color: '#8800ff' },
  { icon: Monitor, label: 'RAM (Wings)', value: '+1GB per node', color: '#ff0088' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function Compatibility() {
  return (
    <section id="kompatibilitas" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="section-glow-green top-0 left-1/2 -translate-x-1/2" />
      <div className="section-glow-cyan bottom-0 right-0" />
      <div className="grid-bg" />
      <div className="hex-grid" />

      {/* Geometric */}
      <div className="absolute top-20 left-[5%] pointer-events-none hidden xl:block">
        <div className="geo-triangle opacity-30" />
      </div>
      <div className="absolute bottom-20 right-[8%] pointer-events-none hidden xl:block">
        <div className="geo-cross opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-4"
            data-aos="fade-down" data-aos-delay="100"
          >
            <div className="glow-dot" style={{ color: '#00ff88', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">KOMPATIBILITAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Sistem yang Didukung</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto"
            data-aos="fade-up" data-aos-delay="200"
          >
            ArkanProjects kompatibel dengan distribusi Linux populer
          </p>
        </motion.div>

        {/* Requirements */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {requirements.map((req, index) => (
            <div
              key={req.label}
              className="glass-card-alt p-4 text-center group"
              data-aos="zoom-in"
              data-aos-delay={`${250 + index * 50}`}
            >
              <req.icon className="w-5 h-5 mx-auto mb-2 transition-transform group-hover:scale-110" style={{ color: req.color }} />
              <div className="text-[10px] text-[#8888aa] uppercase tracking-wider mb-1">{req.label}</div>
              <div className="text-sm font-semibold" style={{ color: req.color }}>{req.value}</div>
            </div>
          ))}
        </motion.div>

        {/* OS Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {osList.map((os, index) => (
            <motion.div
              key={`${os.name}-${os.version}`}
              variants={itemVariants}
              className="glass-card glow-line-top p-4 group cursor-default"
              style={{ '--glow-color': os.color } as React.CSSProperties}
              whileHover={{ scale: 1.03, y: -2 }}
              data-aos="fade-up"
              data-aos-delay={`${index * 40}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${os.color}08, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white/90">{os.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${os.status === 'LTS' ? 'status-lts' : 'status-stable'}`}>
                    {os.status}
                  </span>
                </div>
                <div className="text-[10px] text-[#8888aa] font-mono mb-2">{os.version}</div>
                <div className="text-[10px] text-[#8888aa]/60 mb-3 italic">{os.codename}</div>
                <div className="flex flex-wrap gap-1">
                  {os.archs.map((arch) => (
                    <span key={arch} className="arch-tag">{arch}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
