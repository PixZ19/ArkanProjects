'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Instalasi', href: '#install' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Sumber', href: '#sumber' },
  { label: 'Tentang', href: '#tentang' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-4 sm:mx-6 mt-4">
        <nav className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="ArkanProjects"
              className="w-7 h-7 rounded-md"
            />
            <span className="font-bold text-base text-white/90 hidden sm:block">
              Arkan<span className="text-[#00ffff]">Projects</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-sm text-[#8888aa] hover:text-[#00ffff] transition-colors rounded-lg hover:bg-white/[0.03] cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
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
            className="md:hidden p-2 text-[#8888aa] hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-card p-4"
              style={{
                background: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
