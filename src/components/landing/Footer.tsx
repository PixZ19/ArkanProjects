'use client';

import { motion } from 'framer-motion';
import { Github, Heart, BookOpen, MessageSquare, Terminal, ExternalLink } from 'lucide-react';

const footerLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/PixZ19/ArkanProjects',
    icon: Github,
  },
  {
    label: 'Dokumentasi Pterodactyl',
    href: 'https://pterodactyl.io',
    icon: BookOpen,
  },
  {
    label: 'Komunitas Discord',
    href: 'https://pterodactyl.io/discord.html',
    icon: MessageSquare,
  },
  {
    label: 'Script Installer',
    href: 'https://arkanprojects.vercel.app/installer/pterodactyl.sh',
    icon: Terminal,
  },
];

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 sm:px-6 overflow-hidden">
      {/* Animated top border */}
      <div className="footer-animated-border absolute top-0 left-0 right-0" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-t from-[#00ffff]/[0.02] to-transparent pointer-events-none blur-2xl" />
      <div className="grid-bg-fine" />

      {/* Geometric accents */}
      <div className="absolute bottom-10 left-[10%] pointer-events-none hidden xl:block">
        <div className="geo-cross opacity-15" />
      </div>
      <div className="absolute bottom-16 right-[12%] pointer-events-none hidden xl:block">
        <div className="geo-ring opacity-10" style={{ width: '50px', height: '50px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Links row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {footerLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#00ffff] transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.03]"
              data-aos="fade-up"
              data-aos-delay={`${index * 80}`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </a>
          ))}
        </motion.div>

        {/* Branding & bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <motion.div
            className="flex flex-col items-center sm:items-start gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            data-aos="fade-right" data-aos-delay="200"
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

          {/* GitHub badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            data-aos="fade-left" data-aos-delay="300"
          >
            <a
              href="https://github.com/PixZ19/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card-alt px-4 py-2.5 flex items-center gap-2 hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <Github className="w-4 h-4 text-[#8888aa]" />
              <span className="text-sm text-[#8888aa]">PixZ19/ArkanProjects</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3"
          data-aos="fade-up" data-aos-delay="400"
        >
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
