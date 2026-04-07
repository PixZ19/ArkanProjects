'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Globe,
  Server,
  ShieldCheck,
  Lock,
  HardDrive,
  Terminal,
  Cpu,
  Archive,
  GitBranch,
  Download,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TechItem {
  icon: LucideIcon;
  name: string;
  version: string;
  description: string;
  color: string;
  bgColor: string;
}

const techStack: TechItem[] = [
  {
    icon: Code2,
    name: 'PHP',
    version: '8.3',
    description: 'Runtime utama Pterodactyl Panel, mendukung fitur terbaru seperti typed properties dan fibers.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
  },
  {
    icon: Database,
    name: 'MariaDB',
    version: '10.11',
    description: 'Database utama untuk menyimpan data panel, user, server, dan konfigurasi node.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
  },
  {
    icon: Globe,
    name: 'Nginx',
    version: '1.24',
    description: 'Web server reverse proxy yang melayani Pterodactyl Panel dengan konfigurasi SSL.',
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
  },
  {
    icon: Server,
    name: 'Redis',
    version: '7.x',
    description: 'Cache layer untuk session, queue, dan cache aplikasi Panel.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
  },
  {
    icon: HardDrive,
    name: 'Docker CE',
    version: 'Latest',
    description: 'Container runtime yang digunakan Wings untuk mengisolasi dan menjalankan game server.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
  },
  {
    icon: Archive,
    name: 'Composer',
    version: '2.x',
    description: 'Dependency manager PHP untuk menginstal package Pterodactyl Panel.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
  },
  {
    icon: ShieldCheck,
    name: "Let's Encrypt",
    version: 'Certbot',
    description: 'Sertifikat SSL gratis yang dikonfigurasi otomatis dengan verifikasi DNS.',
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
  },
  {
    icon: Lock,
    name: 'Certbot',
    version: 'Latest',
    description: 'Tool resmi Let\'s Encrypt untuk penerbitan dan perpanjangan sertifikat SSL.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
  },
  {
    icon: Cpu,
    name: 'Node.js',
    version: 'Build Tool',
    description: 'Digunakan untuk membangun aset frontend Pterodactyl Panel (npm build).',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
  },
  {
    icon: Terminal,
    name: 'tar / zip / unzip',
    version: 'System',
    description: 'Utilitas arsip untuk mengekstrak dan mengelola file installer.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
  },
  {
    icon: GitBranch,
    name: 'git',
    version: 'System',
    description: 'Version control untuk mengkloning repository Pterodactyl.',
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
  },
  {
    icon: Download,
    name: 'curl',
    version: 'System',
    description: 'Tool untuk mengunduh script installer dan mengeksekusi instalasi.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function TechStack() {
  return (
    <section id="teknologi" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="section-glow-cyan top-10 right-0" />
      <div className="section-glow-purple bottom-10 left-0" />
      <div className="grid-bg-fine" />

      {/* Geometric */}
      <div className="absolute top-16 right-[8%] pointer-events-none hidden xl:block">
        <div className="geo-diamond opacity-20" style={{ animationDuration: '35s' }} />
      </div>
      <div className="absolute bottom-16 left-[5%] pointer-events-none hidden xl:block">
        <div className="geo-circle opacity-15" style={{ width: '50px', height: '50px' }} />
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
            <div className="glow-dot" style={{ color: '#8800ff', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">TEKNOLOGI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Tech Stack</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto"
            data-aos="fade-up" data-aos-delay="200"
          >
            Teknologi yang terinstal dan dikonfigurasi oleh ArkanProjects
          </p>
        </motion.div>

        {/* Tech grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="glass-card glow-line-top p-5 group cursor-default"
              style={{ '--glow-color': tech.color } as React.CSSProperties}
              whileHover={{ scale: 1.02 }}
              data-aos="zoom-in"
              data-aos-delay={`${index * 40}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${tech.bgColor}, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: tech.bgColor }}
                  >
                    <tech.icon className="w-5 h-5" style={{ color: tech.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">{tech.name}</h3>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${tech.color}10`,
                        color: `${tech.color}`,
                      }}
                    >
                      {tech.version}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8888aa] leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
