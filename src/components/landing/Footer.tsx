'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="ArkanProjects"
                className="w-7 h-7 rounded-md"
              />
              <span className="neon-gradient-text font-bold text-lg">
                ArkanProjects
              </span>
            </div>
            <p className="text-xs text-[#8888aa] text-center sm:text-left">
              Dibangun dengan dedikasi untuk komunitas game server hosting.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/PixZ19/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#00ffff] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-xs text-[#555566]">
            &copy; {new Date().getFullYear()} ArkanProjects. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
