'use client';

import { motion } from 'framer-motion';
import {
  Package,
  Monitor,
  Shield,
  ShieldCheck,
  Container,
  Database,
  Code2,
  TerminalSquare,
  RefreshCw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  glow: string;
}

const features: Feature[] = [
  {
    icon: Package,
    title: 'All-in-One Installer',
    description:
      'Instalasi Pterodactyl Panel dan Wings dalam satu script. Tidak perlu menjalankan beberapa installer terpisah. Satu perintah untuk semuanya.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
    glow: 'rgba(0, 255, 255, 0.08)',
  },
  {
    icon: Monitor,
    title: 'Multi-OS Support',
    description:
      'Kompatibel dengan Ubuntu 22/24, Debian 10-13, Rocky Linux 8/9, dan AlmaLinux 8/9. Deteksi sistem operasi dan arsitektur (amd64/arm64) secara otomatis.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
    glow: 'rgba(0, 255, 136, 0.08)',
  },
  {
    icon: Shield,
    title: 'SSL Otomatis',
    description:
      "Konfigurasi Let's Encrypt dengan verifikasi DNS. Sertifikat SSL dikeluarkan dan dikonfigurasi secara otomatis pada Nginx.",
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
    glow: 'rgba(136, 0, 255, 0.08)',
  },
  {
    icon: ShieldCheck,
    title: 'Firewall Terkonfigurasi',
    description:
      'UFW untuk Ubuntu/Debian dan FirewallD untuk Rocky/AlmaLinux. Port yang diperlukan dibuka secara otomatis.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
    glow: 'rgba(255, 0, 136, 0.08)',
  },
  {
    icon: Container,
    title: 'Docker & Wings',
    description:
      'Docker CE diinstal dan dikonfigurasi otomatis sebagai dependensi Wings. Termasuk systemd service untuk manajemen proses.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
    glow: 'rgba(0, 255, 255, 0.08)',
  },
  {
    icon: Database,
    title: 'MariaDB & Redis',
    description:
      'Database dan cache layer dikonfigurasi otomatis. MariaDB untuk penyimpanan data, Redis untuk session, cache, dan queue.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
    glow: 'rgba(0, 255, 136, 0.08)',
  },
  {
    icon: Code2,
    title: 'PHP 8.3 Modern',
    description:
      'Menggunakan PHP 8.3 terbaru melalui repository resmi (PPA Ondrej untuk Ubuntu, Sury untuk Debian, Remi untuk RHEL).',
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
    glow: 'rgba(136, 0, 255, 0.08)',
  },
  {
    icon: TerminalSquare,
    title: 'Antarmuka CLI Modern',
    description:
      'Tampilan terminal berwarna dengan step indicator, progress tracking, dividers, dan feedback jelas untuk setiap tahap instalasi.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
    glow: 'rgba(255, 0, 136, 0.08)',
  },
  {
    icon: RefreshCw,
    title: 'Idempotent & Aman',
    description:
      'Script aman dijalankan ulang. Deteksi instalasi yang sudah ada. Validasi FQDN dan DNS sebelum memulai.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
    glow: 'rgba(0, 255, 255, 0.08)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Features() {
  return (
    <section id="fitur" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background glows */}
      <div className="section-glow-cyan -top-40 -left-40" />
      <div className="section-glow-purple -bottom-40 -right-40" />
      <div className="section-glow-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating geometry */}
      <div className="absolute top-20 right-10 pointer-events-none hidden lg:block">
        <div className="geo-diamond opacity-20" style={{ animationDuration: '40s' }} />
      </div>
      <div className="absolute bottom-20 left-10 pointer-events-none hidden lg:block">
        <div className="geo-circle opacity-20" style={{ animationDuration: '30s' }} />
      </div>
      <div className="absolute top-1/2 right-[3%] pointer-events-none hidden xl:block">
        <div className="geo-cross opacity-20" />
      </div>

      {/* Grid bg */}
      <div className="grid-bg-fine" />

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
            <div className="glow-dot" style={{ color: '#00ffff', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">FITUR UNGGULAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Fitur Utama</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto"
            data-aos="fade-up" data-aos-delay="200"
          >
            Semua yang Anda butuhkan untuk menjalankan Pterodactyl Panel dan Wings
          </p>
          {/* Feature count */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#8888aa]/60"
            data-aos="fade-up" data-aos-delay="250"
          >
            <span className="count-shimmer font-bold text-sm">{features.length}</span>
            <span>fitur terintegrasi</span>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-card rotating-border p-6 group cursor-default glow-line-top"
              style={{ '--glow-color': feature.color } as React.CSSProperties}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              data-aos="fade-up"
              data-aos-delay={`${index * 50}`}
            >
              {/* Inner glow on hover */}
              <div
                className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${feature.glow}, transparent 70%)`,
                }}
              />

              <div className="relative">
                <div
                  className="feature-icon mb-4"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <feature.icon
                    className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3
                  className="text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-4 pt-3 border-t border-white/[0.04]">
                  <div
                    className="h-[2px] rounded-full transition-all duration-500 w-0 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${feature.color}40, transparent)` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
