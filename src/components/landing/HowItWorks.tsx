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
  duration: string;
  details: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: Cpu,
    title: 'Deteksi Sistem',
    description:
      'Script mendeteksi OS, versi, dan arsitektur CPU secara otomatis. Hanya sistem yang didukung yang dapat melanjutkan.',
    color: '#00ffff',
    duration: '< 5 detik',
    details: 'Mendukung Ubuntu 22/24, Debian 10-13, Rocky Linux 8/9, AlmaLinux 8/9 (amd64/arm64)',
  },
  {
    number: 2,
    icon: Settings,
    title: 'Konfigurasi Interaktif',
    description:
      'Pengguna memasukkan konfigurasi melalui antarmuka CLI: database, FQDN, email, admin account, opsi SSL dan firewall.',
    color: '#00ff88',
    duration: '1-2 menit',
    details: 'Validasi FQDN, DNS, dan persyaratan sistem sebelum memulai instalasi',
  },
  {
    number: 3,
    icon: Package,
    title: 'Instalasi Dependensi',
    description:
      'Semua package yang diperlukan diinstal otomatis: PHP 8.3, MariaDB, Nginx, Redis, Composer, dan lainnya sesuai OS yang terdeteksi.',
    color: '#8800ff',
    duration: '2-3 menit',
    details: 'Menggunakan repository resmi: PPA Ondrej, Sury, EPEL, Remi sesuai distribusi',
  },
  {
    number: 4,
    icon: Server,
    title: 'Setup Panel',
    description:
      'Download panel dari repository resmi Pterodactyl, konfigurasi environment, migrasi database, dan buat akun admin.',
    color: '#ff0088',
    duration: '1-2 menit',
    details: 'Panel v1.0.0 diunduh dari GitHub releases, termasuk Composer dependencies',
  },
  {
    number: 5,
    icon: Container,
    title: 'Setup Wings',
    description:
      'Instalasi Docker, download binary Wings, konfigurasi systemd service, dan opsional database host untuk multi-node.',
    color: '#00ffff',
    duration: '1-2 menit',
    details: 'Wings v1.0.7, Docker CE terbaru, konfigurasi TLS antara Panel dan Wings',
  },
  {
    number: 6,
    icon: CheckCircle2,
    title: 'Post-Install',
    description:
      'SSL dikonfigurasi, firewall diatur, service diaktifkan. Panel siap diakses dan Wings siap menerima konfigurasi dari Panel.',
    color: '#00ff88',
    duration: '< 1 menit',
    details: "Let's Encrypt SSL, UFW/FirewallD, systemd enable, dan ringkasan instalasi",
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="section-glow-green top-10 right-10" />
      <div className="section-glow-purple bottom-10 left-10" />
      <div className="grid-bg-fine" />

      {/* Geometric accents */}
      <div className="absolute top-20 right-[5%] pointer-events-none hidden lg:block">
        <div className="geo-diamond opacity-25" style={{ width: '30px', height: '30px', animationDuration: '35s' }} />
      </div>
      <div className="absolute bottom-20 left-[3%] pointer-events-none hidden lg:block">
        <div className="geo-cross opacity-20" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-4"
            data-aos="fade-down" data-aos-delay="100"
          >
            <div className="glow-dot" style={{ color: '#00ff88', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">ALUR KERJA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Cara Kerja Installer</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto"
            data-aos="fade-up" data-aos-delay="200"
          >
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
          {/* Vertical gradient line */}
          <div className="absolute left-6 top-0 bottom-0 w-px hidden sm:block">
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, #00ffff20, #8800ff20, #00ff8820, #ff008820, #00ffff20)',
              }}
            />
            {/* Animated pulse on the line */}
            <motion.div
              className="absolute top-0 left-0 w-1 h-8 rounded-full bg-gradient-to-b from-transparent via-[#00ffff]/30 to-transparent blur-sm"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative flex gap-5 sm:gap-6 group"
                data-aos="fade-right"
                data-aos-delay={`${index * 80}`}
              >
                {/* Step number */}
                <div className="relative">
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
                  {/* Glow ring around step number */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 15px ${step.color}20, 0 0 30px ${step.color}10`,
                    }}
                  />
                  {/* Animated connecting line to next step */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-[1px] hidden sm:block"
                      style={{
                        height: 'calc(100% + 16px)',
                        background: `linear-gradient(180deg, ${step.color}20, ${steps[index + 1].color}20)`,
                      }}
                    >
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-3 rounded-full"
                        style={{ background: step.color, opacity: 0.4 }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="glass-card p-5 flex-1 rotating-border glow-line-top"
                  style={{ '--glow-color': step.color } as React.CSSProperties}
                >
                  {/* Inner hover glow */}
                  <div
                    className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 0% 50%, ${step.color}06, transparent 60%)`,
                    }}
                  />
                  <div className="relative flex items-start gap-3">
                    <step.icon
                      className="w-5 h-5 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: step.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-base font-semibold text-white/90">
                          {step.title}
                        </h3>
                        {/* Duration badge */}
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${step.color}10`,
                            color: `${step.color}90`,
                            border: `1px solid ${step.color}20`,
                          }}
                        >
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-[#8888aa] leading-relaxed mt-1.5">
                        {step.description}
                      </p>
                      {/* Hover-reveal details */}
                      <div className="mt-2 text-xs text-[#8888aa]/60 max-h-0 overflow-hidden group-hover:max-h-6 transition-all duration-300 leading-relaxed">
                        {step.details}
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-[1px] bg-white/[0.04]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: step.color, opacity: 0.3 }}
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${((index + 1) / steps.length) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: `${step.color}60` }}>
                      {Math.round(((index + 1) / steps.length) * 100)}%
                    </span>
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
