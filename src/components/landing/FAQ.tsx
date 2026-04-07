'use client';

import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Apa itu Pterodactyl Panel?',
    answer:
      'Pterodactyl Panel adalah panel manajemen game server open-source yang dirancang untuk mengelola banyak game server dari satu antarmuka web. Panel ini menggunakan Wings sebagai daemon node untuk menjalankan dan mengelola container Docker yang berisi game server. Pterodactyl mendukung berbagai game seperti Minecraft, FiveM, Rust, ARK, dan banyak lagi melalui egg system.',
  },
  {
    question: 'Apa perbedaan Panel dan Wings?',
    answer:
      'Panel adalah antarmuka web (frontend + backend) yang digunakan admin untuk mengelola server, user, dan konfigurasi. Panel diinstal pada satu server utama. Wings adalah daemon yang berjalan pada setiap node (server) yang menjalankan game server. Wings berkomunikasi dengan Panel melalui WebSocket dan mengelola lifecycle container Docker. Satu Panel dapat mengelola banyak node Wings.',
  },
  {
    question: 'Berapa kebutuhan hardware minimum?',
    answer:
      'Untuk Panel saja: minimal 1 core CPU, 2GB RAM, dan 20GB disk. Untuk Wings (node game server): tambahan minimal 1GB RAM per node. Untuk menjalankan Panel dan Wings di satu server yang sama, diperlukan minimal 2 core CPU, 3GB RAM, dan 30GB disk. Spesifikasi ini adalah batas minimum — untuk produksi, disarankan RAM lebih tinggi tergantung jumlah game server yang akan dijalankan.',
  },
  {
    question: 'Apakah bisa diinstal tanpa domain?',
    answer:
      'Ya, Panel bisa diinstal tanpa domain menggunakan IP address langsung. Namun, fitur SSL otomatis menggunakan Let\'s Encrypt memerlukan domain yang sudah dikonfigurasi DNS-nya mengarah ke IP server. Jika menggunakan IP address, Anda harus mengatur SSL secara manual atau menggunakan self-signed certificate. Instalasi script akan mendeteksi dan menyesuaikan opsi SSL berdasarkan konfigurasi yang dipilih.',
  },
  {
    question: 'Bagaimana cara update Panel setelah instalasi?',
    answer:
      'Untuk update Pterodactyl Panel, jalankan perintah update melalui backup panel terlebih dahulu, lalu download versi terbaru dari repository resmi. ArkanProjects juga menyediakan opsi update dalam script. Proses update meliputi: backup database, download release baru, update Composer dependencies, migrasi database, dan cache clear. Selalu backup sebelum melakukan update.',
  },
  {
    question: 'Apakah script ini aman?',
    answer:
      'Script hanya menginstal package dari repository resmi distribusi Linux dan source resmi Pterodactyl dari GitHub. Tidak ada modifikasi pada package yang diinstal. Script mendukung firewall (UFW/FirewallD) untuk mengamankan port. Validasi FQDN dan DNS dilakukan sebelum memulai instalasi. Seluruh proses berjalan dengan hak root yang diperlukan untuk konfigurasi sistem. Source code script terbuka dan dapat diperiksa di repository GitHub.',
  },
  {
    question: 'OS apa saja yang didukung?',
    answer:
      'Ubuntu 22.04 LTS (Jammy Jellyfish) dan 24.04 LTS (Noble Numbat) dengan dukungan amd64 dan arm64. Debian 10 (Buster), 11 (Bullseye), 12 (Bookworm), dan 13 (Trixie) dengan dukungan amd64. Rocky Linux 8 dan 9 dengan dukungan amd64. AlmaLinux 8 dan 9 dengan dukungan amd64. Script mendeteksi OS dan arsitektur secara otomatis.',
  },
  {
    question: 'Apakah bisa diinstal di VPS dengan RAM 1GB?',
    answer:
      'Tidak disarankan. Pterodactyl Panel membutuhkan minimal 2GB RAM agar berjalan dengan stabil. MariaDB dan Redis sendiri membutuhkan RAM yang cukup. Jika hanya 1GB tersedia, swap memory bisa membantu, namun performa akan sangat terbatas. Untuk VPS dengan RAM 1GB, pertimbangkan untuk menjalankan Wings saja (tanpa Panel) di node terpisah, atau gunakan VPS dengan minimal 2GB RAM.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="section-glow-purple top-10 left-1/4" />
      <div className="section-glow-cyan bottom-10 right-1/4" />
      <div className="grid-bg-fine" />

      {/* Geometric */}
      <div className="absolute top-20 right-[6%] pointer-events-none hidden xl:block">
        <div className="geo-plus opacity-20" />
      </div>
      <div className="absolute bottom-20 left-[4%] pointer-events-none hidden xl:block">
        <div className="geo-diamond opacity-15" style={{ width: '35px', height: '35px', animationDuration: '25s' }} />
      </div>

      <div className="max-w-3xl mx-auto relative">
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
            <HelpCircle className="w-3 h-3 text-[#ff0088]" />
            <span className="text-xs text-[#8888aa]">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Pertanyaan Umum</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-xl mx-auto"
            data-aos="fade-up" data-aos-delay="200"
          >
            Jawaban untuk pertanyaan yang sering diajukan tentang instalasi Pterodactyl
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                className="glass-card-alt overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                data-aos="fade-up"
                data-aos-delay={`${250 + index * 50}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
                >
                  <span className="text-sm font-medium text-white/90 group-hover:text-[#00ffff] transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8888aa] flex-shrink-0 faq-chevron ${isOpen ? 'open' : ''}`}
                  />
                </button>
                <div
                  className={`faq-content ${isOpen ? 'open' : ''}`}
                  style={{ maxHeight: isOpen ? '500px' : '0px' }}
                >
                  <div className="px-5 pb-5 text-sm text-[#8888aa] leading-relaxed border-t border-white/[0.04] pt-4">
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
