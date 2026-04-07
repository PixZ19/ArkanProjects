'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check, AlertCircle, Server, Globe, MemoryStick, Shield } from 'lucide-react';

export default function InstallGuide() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        'bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)'
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = 'bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const requirements = [
    { icon: Shield, text: 'Akses root (sudo)' },
    { icon: Server, text: 'OS yang didukung (Ubuntu/Debian/Rocky/AlmaLinux)' },
    { icon: Globe, text: 'curl terinstal' },
    { icon: MemoryStick, text: 'RAM 2GB+ untuk Panel' },
    { icon: Globe, text: 'Domain/FQDN mengarah ke IP server (untuk SSL)' },
  ];

  return (
    <section id="install" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-gradient-text">Cara Instalasi</span>
          </h2>
          <p className="text-[#8888aa] text-lg">
            Jalankan satu perintah, sisanya dikerjakan script
          </p>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="code-block p-1">
            {/* Code block header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <span className="text-xs text-[#8888aa] ml-2 font-mono">terminal</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#8888aa] hover:text-[#00ffff] transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-white/5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00ff88]" />
                    <span className="text-[#00ff88]">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            {/* Code content */}
            <div className="p-4 sm:p-5 overflow-x-auto">
              <code className="text-sm sm:text-base text-[#00ffff] font-mono whitespace-nowrap">
                <span className="text-[#8888aa]">$</span>{' '}
                <span className="text-white/80">bash</span>{' '}
                <span className="text-[#00ff88]">&lt;(</span>
                <span className="text-white/80">curl</span>{' '}
                <span className="text-[#8800ff]">-s</span>{' '}
                <span className="text-[#ff0088]">https://arkanprojects.vercel.app/installer/pterodactyl.sh</span>
                <span className="text-[#00ff88]">)</span>
              </code>
            </div>
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="w-5 h-5 text-[#ff0088]" />
            <h3 className="text-lg font-semibold text-white/90">Persyaratan</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-sm text-[#8888aa] py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <req.icon className="w-4 h-4 text-[#00ffff]/60 flex-shrink-0" />
                <span>{req.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
