'use client';

import { motion } from 'framer-motion';
import { Users, Github, ExternalLink, Shield, Terminal, Layers, Clock } from 'lucide-react';

const developers = [
  { name: 'Muhammad Rafif Rianto C.Ps', role: 'Lead Developer', color: '#00ffff' },
  { name: 'Faturrahman Al Rizky', role: 'Backend Developer', color: '#00ff88' },
  { name: 'Akhbar Alfiansyah', role: 'UI/UX Designer', color: '#8800ff' },
];

const timeline = [
  { version: 'v1.0.0', date: '2025', description: 'Rilis pertama — Panel + Wings + SSL + Firewall', color: '#00ffff' },
  { version: 'v1.1.0', date: 'Rencana', description: 'Dukungan addon game & tema kustom', color: '#8800ff' },
  { version: 'v2.0.0', date: 'Rencana', description: 'Multi-node management & REST API', color: '#ff0088' },
];

export default function About() {
  return (
    <section id="tentang" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="section-glow-purple top-10 left-10" />
      <div className="section-glow-cyan bottom-10 right-10" />
      <div className="grid-bg-fine" />

      {/* Geometric accents */}
      <div className="absolute top-20 right-[8%] pointer-events-none hidden xl:block">
        <div className="geo-ring opacity-20" style={{ width: '60px', height: '60px' }} />
      </div>
      <div className="absolute bottom-20 left-[5%] pointer-events-none hidden xl:block">
        <div className="geo-plus opacity-25" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Section title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-4"
            data-aos="fade-down" data-aos-delay="100"
          >
            <div className="glow-dot" style={{ color: '#00ffff', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">TENTANG KAMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Tentang ArkanProjects</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Description */}
          <div className="glass-card p-6 sm:p-8 mb-8"
            data-aos="fade-up" data-aos-delay="200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ffff]/10 to-[#8800ff]/10 flex items-center justify-center border border-[#00ffff]/10">
                <Layers className="w-5 h-5 text-[#00ffff]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white/90">Visi Proyek</h3>
                <p className="text-xs text-[#8888aa]/60">Menyederhanakan instalasi Pterodactyl</p>
              </div>
            </div>
            <p className="text-[#8888aa] leading-relaxed text-base sm:text-lg">
              ArkanProjects adalah proyek installer Pterodactyl all-in-one yang dikembangkan
              berdasarkan analisis mendalam dari installer-installer Pterodactyl yang sudah ada.
              Tujuannya menyederhanakan proses instalasi Pterodactyl Panel dan Wings menjadi
              satu perintah.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { icon: Shield, label: 'Keamanan', color: '#00ffff' },
                { icon: Terminal, label: 'CLI Modern', color: '#00ff88' },
                { icon: Layers, label: 'Multi-OS', color: '#8800ff' },
                { icon: Clock, label: 'Otomatis', color: '#ff0088' },
              ].map((item) => (
                <div key={item.label} className="text-center py-2 px-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <item.icon className="w-4 h-4 mx-auto mb-1" style={{ color: item.color }} />
                  <span className="text-[10px] text-[#8888aa]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Developers */}
          <div className="glass-card p-6 sm:p-8 mb-8"
            data-aos="fade-up" data-aos-delay="300"
          >
            <div className="flex items-center gap-2 mb-5"
              data-aos="fade-right" data-aos-delay="320"
            >
              <Users className="w-5 h-5 text-[#00ffff]" />
              <h3 className="text-lg font-semibold text-white/90">Tim Pengembang</h3>
            </div>
            <div className="space-y-3 mb-6">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
                  data-aos="fade-right"
                  data-aos-delay={`${340 + index * 60}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${dev.color}15, ${dev.color}08)`,
                      color: dev.color,
                      borderColor: `${dev.color}25`,
                    }}
                  >
                    {dev.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white/90 block truncate">{dev.name}</span>
                    <span className="text-[10px] font-mono" style={{ color: `${dev.color}80` }}>
                      {dev.role}
                    </span>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 pulse-online"
                    style={{ background: dev.color }}
                  />
                </div>
              ))}
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/PixZ19/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#00ffff] hover:text-[#00ff88] transition-colors"
              data-aos="fade-up" data-aos-delay="500"
            >
              <Github className="w-4 h-4" />
              <span>github.com/PixZ19/ArkanProjects</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Project Timeline */}
          <div className="glass-card p-6 sm:p-8"
            data-aos="fade-up" data-aos-delay="400"
          >
            <div className="flex items-center gap-2 mb-5"
              data-aos="fade-right" data-aos-delay="420"
            >
              <Clock className="w-5 h-5 text-[#8800ff]" />
              <h3 className="text-lg font-semibold text-white/90">Timeline Proyek</h3>
            </div>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start"
                  data-aos="fade-right"
                  data-aos-delay={`${440 + index * 60}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}40` }}
                    />
                    {index < timeline.length - 1 && (
                      <div className="w-[1px] h-8 mt-1" style={{ background: `${item.color}15` }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-sm font-semibold font-mono"
                        style={{ color: item.color }}
                      >
                        {item.version}
                      </span>
                      <span className="text-[10px] text-[#8888aa]/50 px-1.5 py-0.5 rounded bg-white/[0.03]">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-[#8888aa] mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
