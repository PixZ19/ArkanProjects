'use client';

import { motion } from 'framer-motion';
import { Cpu, Settings, Package, Server, Container, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: Cpu,
    title: 'Deteksi Sistem',
    description:
      'Script mendeteksi OS, versi, dan arsitektur CPU secara otomatis. Hanya sistem yang didukung yang dapat melanjutkan.',
    color: '#00ffff',
  },
  {
    number: 2,
    icon: Settings,
    title: 'Konfigurasi Interaktif',
    description:
      'Pengguna memasukkan konfigurasi melalui antarmuka CLI: database, FQDN, email, admin account, opsi SSL dan firewall.',
    color: '#00ff88',
  },
  {
    number: 3,
    icon: Package,
    title: 'Instalasi Dependensi',
    description:
      'Semua package yang diperlukan diinstal otomatis: PHP 8.3, MariaDB, Nginx, Redis, Composer, dan lainnya sesuai OS yang terdeteksi.',
    color: '#8800ff',
  },
  {
    number: 4,
    icon: Server,
    title: 'Setup Panel',
    description:
      'Download panel dari repository resmi Pterodactyl, konfigurasi environment, migrasi database, dan buat akun admin.',
    color: '#ff0088',
  },
  {
    number: 5,
    icon: Container,
    title: 'Setup Wings',
    description:
      'Instalasi Docker, download binary Wings, konfigurasi systemd service, dan opsional database host untuk multi-node.',
    color: '#00ffff',
  },
  {
    number: 6,
    icon: CheckCircle2,
    title: 'Post-Install',
    description:
      'SSL dikonfigurasi, firewall diatur, service diaktifkan. Panel siap diakses dan Wings siap menerima konfigurasi dari Panel.',
    color: '#00ff88',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-gradient-text">Cara Kerja Installer</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto">
            Enam langkah sederhana dari deteksi sistem hingga server siap digunakan
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00ffff]/20 via-[#8800ff]/20 to-[#00ff88]/20 hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative flex gap-5 sm:gap-6"
              >
                {/* Step number */}
                <div
                  className="step-number relative z-10"
                  style={{
                    borderColor: `${step.color}40`,
                    background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                    color: step.color,
                  }}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="glass-card p-5 flex-1 group">
                  <div className="flex items-start gap-3">
                    <step.icon
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: step.color }}
                    />
                    <div>
                      <h3 className="text-base font-semibold text-white/90 mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#8888aa] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
