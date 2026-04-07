'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Teknologi', href: '#teknologi' },
  { label: 'Instalasi', href: '#install' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Kompatibilitas', href: '#kompatibilitas' },
  { label: 'Blueprint', href: '#blueprint' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Sumber', href: '#sumber' },
  { label: 'Tentang', href: '#tentang' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.querySelector(href);
      if (el) {
        const navHeight = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, isOpen ? 150 : 0);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-4 sm:mx-6 mt-4">
        {/* Nav bar — NO overflow:hidden */}
        <nav
          className="px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer relative z-10"
          >
            <img
              src="/logo.png"
              alt="ArkanProjects"
              className="w-7 h-7 rounded-md"
            />
            <span className="font-bold text-base">
              <span className="neon-gradient-text">Arkan</span><span className="text-white/90">Projects</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-2.5 py-1.5 text-[13px] text-[#8888aa] hover:text-[#00ffff] transition-colors rounded-lg hover:bg-white/[0.03] cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://arkanprojects.vercel.app/installer/pterodactyl.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button px-4 py-2 text-sm font-semibold cursor-pointer"
            >
              <span>Mulai Instalasi</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#8888aa] hover:text-white transition-colors cursor-pointer relative z-10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu — separate from nav, NO AnimatePresence */}
        {isOpen && (
          <div
            className="lg:hidden mt-2 p-4 max-h-[70vh] overflow-y-auto"
            style={{
              background: 'rgba(10, 10, 15, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
            }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-2.5 text-sm text-[#8888aa] hover:text-[#00ffff] transition-colors rounded-lg hover:bg-white/[0.03] text-left cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-2 pt-2 border-t border-white/5">
                <a
                  href="https://arkanprojects.vercel.app/installer/pterodactyl.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-button px-4 py-2.5 text-sm font-semibold cursor-pointer block text-center"
                >
                  <span>Mulai Instalasi</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
