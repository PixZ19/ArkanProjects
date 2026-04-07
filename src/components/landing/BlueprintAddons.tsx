'use client';

import { motion } from 'framer-motion';
import {
  Palette, Puzzle, Wrench, Shield, Server, Database,
  Image, Layout, Loader, Bell, Terminal, Users, Package,
  Globe, Layers, Settings, RefreshCw, Star, ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BlueprintItem {
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'theme' | 'admin' | 'minecraft' | 'server' | 'ui';
  color: string;
}

const blueprints: BlueprintItem[] = [
  { name: 'Nebula', description: 'Theme resmi Pterodactyl — tampilan modern dan elegan untuk panel.', icon: Palette, category: 'theme', color: '#8800ff' },
  { name: 'Euphoria Theme', description: 'Theme alternatif dengan desain futuristik dan warna neon.', icon: Layout, category: 'theme', color: '#ff0088' },
  { name: 'Night Admin', description: 'UI admin gelap yang nyaman untuk penggunaan malam hari.', icon: Shield, category: 'theme', color: '#00ffff' },
  { name: 'Blue Tables', description: 'Redesign tampilan tabel database dengan gaya biru modern.', icon: Database, category: 'admin', color: '#00ffff' },
  { name: 'Better Admin', description: 'Tampilan panel admin yang lebih baik dan user-friendly.', icon: Wrench, category: 'admin', color: '#00ff88' },
  { name: 'Loader', description: 'Layar loading kustom dengan animasi saat memuat panel.', icon: Loader, category: 'ui', color: '#00ffff' },
  { name: 'Simple Favicons', description: 'Ganti favicon panel dengan ikon kustom pilihan Anda.', icon: Star, category: 'ui', color: '#ff0088' },
  { name: 'Snowflakes', description: 'Efek salju musiman yang jatuh di tampilan panel.', icon: Star, category: 'ui', color: '#00ffff' },
  { name: 'Server Backgrounds', description: 'Background gambar kustom untuk setiap server game.', icon: Image, category: 'ui', color: '#8800ff' },
  { name: 'Announcements', description: 'Sistem pengumuman untuk memberitahu user penting.', icon: Bell, category: 'admin', color: '#00ff88' },
  { name: 'Lyrdy Announce', description: 'Plugin pengumuman alternatif dari Lyrdy untuk panel.', icon: Bell, category: 'admin', color: '#ff0088' },
  { name: 'Hux Register', description: 'Halaman registrasi kustom dengan desain lebih menarik.', icon: Users, category: 'admin', color: '#00ffff' },
  { name: 'Console Logs', description: 'Viewer log konsol langsung dari antarmuka panel.', icon: Terminal, category: 'admin', color: '#00ff88' },
  { name: 'Laravel Logs', description: 'Viewer log Laravel untuk debugging panel Pterodactyl.', icon: Terminal, category: 'admin', color: '#8800ff' },
  { name: 'DB Edit', description: 'Editor database langsung dari panel tanpa phpMyAdmin.', icon: Database, category: 'admin', color: '#ff0088' },
  { name: 'MC Plugins', description: 'Manajer plugin Minecraft — cari dan instal langsung dari panel.', icon: Puzzle, category: 'minecraft', color: '#00ff88' },
  { name: 'MC Mods', description: 'Manajer mod Minecraft untuk server Forge/Fabric/NeoForge.', icon: Package, category: 'minecraft', color: '#8800ff' },
  { name: 'MC Tools', description: 'Kumpulan tools Minecraft yang berguna untuk admin server.', icon: Wrench, category: 'minecraft', color: '#00ffff' },
  { name: 'MC Logs', description: 'Upload log Minecraft ke mclo.gs untuk sharing dan analisis.', icon: Terminal, category: 'minecraft', color: '#ff0088' },
  { name: 'Icon Changer', description: 'Ganti icon server Minecraft langsung dari panel.', icon: Image, category: 'minecraft', color: '#00ff88' },
  { name: 'Player Manager', description: 'Kelola pemain Minecraft — whitelist, ban, dan info.', icon: Users, category: 'minecraft', color: '#8800ff' },
  { name: 'Plugin Manager', description: 'Plugin manager lanjutan untuk instalasi otomatis.', icon: Puzzle, category: 'minecraft', color: '#00ffff' },
  { name: 'Saga Auto Suspension', description: 'Otomatis suspensi server yang tidak aktif menghemat resource.', icon: Settings, category: 'server', color: '#ff0088' },
  { name: 'Saga Modpack Installer', description: 'Instalasi modpack Minecraft langsung dari panel.', icon: Package, category: 'minecraft', color: '#8800ff' },
  { name: 'Saga Player Manager', description: 'Player manager dari Saga dengan fitur lengkap.', icon: Users, category: 'minecraft', color: '#00ff88' },
  { name: 'Saga Plugin Installer', description: 'Plugin installer otomatis dari repository Saga.', icon: Puzzle, category: 'minecraft', color: '#00ffff' },
  { name: 'Rust Plugin Installer', description: 'Plugin installer untuk server Rust (uMod/Oxide).', icon: RefreshCw, category: 'minecraft', color: '#ff0088' },
  { name: 'Server Properties UI', description: 'Editor server.properties Minecraft dengan antarmuka visual.', icon: Settings, category: 'minecraft', color: '#8800ff' },
  { name: 'Server Sorter', description: 'Sortir dan filter server berdasarkan kategori kustom.', icon: Layers, category: 'server', color: '#00ffff' },
  { name: 'Resource Manager', description: 'Monitor dan kelola resource CPU/RAM/Disk per server.', icon: Server, category: 'server', color: '#00ff88' },
  { name: 'Server Importer', description: 'Impor server dari panel lain ke Pterodactyl.', icon: Package, category: 'server', color: '#ff0088' },
  { name: 'Server Splitter', description: 'Pisahkan resource server menjadi beberapa instansi.', icon: Layers, category: 'server', color: '#8800ff' },
  { name: 'Startup Changer', description: 'Ubah perintah startup server tanpa edit manual.', icon: Terminal, category: 'server', color: '#00ffff' },
  { name: 'Version Changer', description: 'Ganti versi software server dengan satu klik.', icon: RefreshCw, category: 'server', color: '#00ff88' },
  { name: 'Subdomain Manager', description: 'Kelola subdomain untuk server game secara otomatis.', icon: Globe, category: 'server', color: '#ff0088' },
  { name: 'Subdomains', description: 'Sistem subdomain otomatis terintegrasi dengan DNS.', icon: Globe, category: 'server', color: '#8800ff' },
  { name: 'Votifier Tester', description: 'Test koneksi Votifier untuk server Minecraft.', icon: Star, category: 'minecraft', color: '#00ffff' },
  { name: 'Player Listing', description: 'Daftar pemain online lengkap dengan detail status.', icon: Users, category: 'minecraft', color: '#00ff88' },
];

const categories = [
  { key: 'theme', label: 'Theme', color: '#8800ff' },
  { key: 'admin', label: 'Admin', color: '#00ffff' },
  { key: 'minecraft', label: 'Minecraft', color: '#00ff88' },
  { key: 'server', label: 'Server', color: '#ff0088' },
  { key: 'ui', label: 'UI/UX', color: '#00ffff' },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function BlueprintAddons() {
  return (
    <section id="blueprint" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="section-glow-purple top-10 left-[10%]" />
      <div className="section-glow-cyan bottom-10 right-[10%]" />
      <div className="section-glow-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="grid-bg" />

      {/* Geometric */}
      <div className="absolute top-20 right-[5%] pointer-events-none hidden xl:block">
        <div className="geo-ring opacity-20" style={{ width: '60px', height: '60px' }} />
      </div>
      <div className="absolute bottom-20 left-[3%] pointer-events-none hidden xl:block">
        <div className="geo-diamond opacity-20" style={{ animationDuration: '28s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
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
            <div className="glow-dot" style={{ color: '#8800ff', width: '4px', height: '4px' }} />
            <span className="text-xs text-[#8888aa]">EXTENSIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            data-aos="fade-up" data-aos-delay="150"
          >
            <span className="neon-gradient-text">Blueprint & Addons</span>
          </h2>
          <p className="text-[#8888aa] text-lg max-w-2xl mx-auto"
            data-aos="fade-up" data-aos-delay="200"
          >
            Koleksi 38 extension Blueprint untuk Pterodactyl Panel — theme, admin tools, Minecraft utilities, dan server management.
            Berdasarkan repositori{' '}
            <a
              href="https://github.com/HemanRathore/pterodactyl-installer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ffff]/80 hover:text-[#00ffff] underline underline-offset-2 transition-colors"
            >
              HemanRathore/pterodactyl-installer
            </a>
          </p>
        </motion.div>

        {/* Category badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{
                borderColor: `${cat.color}25`,
                color: cat.color,
                backgroundColor: `${cat.color}08`,
              }}
            >
              {cat.label}
            </div>
          ))}
        </motion.div>

        {/* Blueprint grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {blueprints.map((bp, index) => (
            <motion.div
              key={bp.name}
              variants={itemVariants}
              className="glass-card glow-line-top p-4 group cursor-default"
              style={{ '--glow-color': bp.color } as React.CSSProperties}
              whileHover={{ scale: 1.02, y: -2 }}
              data-aos="zoom-in"
              data-aos-delay={`${index * 25}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${bp.color}08, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${bp.color}15` }}
                  >
                    <bp.icon className="w-4 h-4" style={{ color: bp.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white/90 truncate">{bp.name}</h3>
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          backgroundColor: `${bp.color}10`,
                          color: bp.color,
                          borderColor: `${bp.color}25`,
                          border: `1px solid`,
                        }}
                      >
                        .blueprint
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8888aa] leading-relaxed line-clamp-2">
                      {bp.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info box */}
        <motion.div
          className="mt-12 glass-card-colored p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(136, 0, 255, 0.15)' }}
            >
              <ExternalLink className="w-5 h-5 text-[#8800ff]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white/90 mb-1">
                Blueprint Framework
              </h3>
              <p className="text-sm text-[#8888aa] leading-relaxed">
                Blueprint adalah framework extension untuk Pterodactyl Panel yang memungkinkan instalasi theme, plugin, dan tools
                langsung dari panel. Semua 38 extension di atas tersedia di repositori{' '}
                <a
                  href="https://github.com/HemanRathore/pterodactyl-installer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ffff]/80 hover:text-[#00ffff] underline underline-offset-2 transition-colors"
                >
                  HemanRathore/pterodactyl-installer
                </a>{' '}
                dan dapat diinstal melalui menu Blueprints Manager (opsi 21) pada script installer.
                Kunjungi{' '}
                <a
                  href="https://blueprint.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ff88]/80 hover:text-[#00ff88] underline underline-offset-2 transition-colors"
                >
                  blueprint.zip
                </a>{' '}
                untuk dokumentasi lengkap.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
