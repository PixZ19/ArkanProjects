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
}

const features: Feature[] = [
  {
    icon: Package,
    title: 'All-in-One Installer',
    description:
      'Instalasi Pterodactyl Panel dan Wings dalam satu script. Tidak perlu menjalankan beberapa installer terpisah. Satu perintah untuk semuanya.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
  },
  {
    icon: Monitor,
    title: 'Multi-OS Support',
    description:
      'Kompatibel dengan Ubuntu 22/24, Debian 10-13, Rocky Linux 8/9, dan AlmaLinux 8/9. Deteksi sistem operasi dan arsitektur (amd64/arm64) secara otomatis.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
  },
  {
    icon: Shield,
    title: 'SSL Otomatis',
    description:
      "Konfigurasi Let's Encrypt dengan verifikasi DNS. Sertifikat SSL dikeluarkan dan dikonfigurasi secara otomatis pada Nginx.",
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
  },
  {
    icon: ShieldCheck,
    title: 'Firewall Terkonfigurasi',
    description:
      'UFW untuk Ubuntu/Debian dan FirewallD untuk Rocky/AlmaLinux. Port yang diperlukan dibuka secara otomatis.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
  },
  {
    icon: Container,
    title: 'Docker & Wings',
    description:
      'Docker CE diinstal dan dikonfigurasi otomatis sebagai dependensi Wings. Termasuk systemd service untuk manajemen proses.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
  },
  {
    icon: Database,
    title: 'MariaDB & Redis',
    description:
      'Database dan cache layer dikonfigurasi otomatis. MariaDB untuk penyimpanan data, Redis untuk session, cache, dan queue.',
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.1)',
  },
  {
    icon: Code2,
    title: 'PHP 8.3 Modern',
    description:
      'Menggunakan PHP 8.3 terbaru melalui repository resmi (PPA Ondrej untuk Ubuntu, Sury untuk Debian, Remi untuk RHEL).',
    color: '#8800ff',
    bgColor: 'rgba(136, 0, 255, 0.1)',
  },
  {
    icon: TerminalSquare,
    title: 'Antarmuka CLI Modern',
    description:
      'Tampilan terminal berwarna dengan step indicator, progress tracking, dividers, dan feedback jelas untuk setiap tahap instalasi.',
    color: '#ff0088',
    bgColor: 'rgba(255, 0, 136, 0.1)',
  },
  {
    icon: RefreshCw,
    title: 'Idempotent & Aman',
    description:
      'Script aman dijalankan ulang. Deteksi instalasi yang sudah ada. Validasi FQDN dan DNS sebelum memulai.',
    color: '#00ffff',
    bgColor: 'rgba(0, 255, 255, 0.1)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
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
    <section id="fitur" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-gradient-text">Fitur Utama</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto">
            Semua yang Anda butuhkan untuk menjalankan Pterodactyl Panel dan Wings
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-card p-6 group"
            >
              <div
                className="feature-icon mb-4"
                style={{ backgroundColor: feature.bgColor }}
              >
                <feature.icon
                  className="w-5 h-5"
                  style={{ color: feature.color }}
                />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: feature.color }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-[#8888aa] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
