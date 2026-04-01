"use client";

import { useEffect, useState } from "react";
import {
  Terminal,
  Zap,
  Shield,
  ChevronRight,
  Github,
  Package,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  FileCode2,
  MonitorDot,
  Code2,
  Layers,
  Users,
} from "lucide-react";
import { CopyToolButton } from "@/components/copy-button";

interface Tool {
  name: string;
  title: string;
  desc: string;
  cmd: string;
  badge: string;
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then(setTools)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="gradient-bg" />
      <div className="grid-overlay" />

      {/* ── Navigasi ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl bg-background/60">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-lg font-bold tracking-tight text-foreground">
            Arkan<span className="text-primary">Projects</span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tools
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Fitur
            </a>
            <a
              href="#demo"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tentang
            </a>
            <a
              href="https://github.com/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </nav>
      </header>

      {/* ── Konten Utama ── */}
      <main className="flex-1">
        {/* ══════════ HERO ══════════ */}
        <section className="relative pt-32 pb-28 px-6 overflow-hidden">
          {/* Dot pattern overlay */}
          <div className="dot-pattern" />

          {/* Floating decoration elements */}
          <div className="float-element float-slow w-72 h-72 bg-indigo-500/20 -top-20 -left-32 blur-3xl" />
          <div className="float-element float-medium w-56 h-56 bg-violet-500/15 top-10 -right-20 blur-3xl" />
          <div className="float-element float-fast w-40 h-40 bg-purple-500/10 bottom-0 left-1/3 blur-2xl" />
          <div className="float-element float-slow w-24 h-24 bg-indigo-400/10 top-1/4 right-1/4 blur-xl" />

          {/* Decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/5 pulse-ring pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary/3 pulse-ring pointer-events-none" style={{ animationDelay: "1s" }} />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary">
                <Package className="w-3.5 h-3.5" />
                Ekosistem DevOps
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold uppercase tracking-wider">
                  v4.0
                </span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-fade-in-up animate-delay-1">
              <span className="text-foreground">Arkan</span>
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-2">
              Tools deployment modular untuk infrastruktur server. Setiap installer
              adalah script mandiri — tinggal taruh file{" "}
              <code className="text-sm font-mono text-primary/80">.sh</code> ke
              folder{" "}
              <code className="text-sm font-mono text-primary/80">/installer/</code>,
              website langsung kebaca.
            </p>

            {/* Typing terminal animation */}
            <div className="mt-8 animate-fade-in-up animate-delay-3">
              <div className="inline-block bg-[rgba(10,10,26,0.8)] border border-primary/15 rounded-xl px-5 py-3 max-w-full">
                <div className="hero-typing font-mono text-sm text-primary/70">
                  $ bash &lt;(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-4">
              <a href="#tools" className="neon-btn">
                Lihat Tools
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/ArkanProjects"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-indicator">
            <ChevronDown className="w-6 h-6 text-primary/40" />
          </div>
        </section>

        <div className="glow-line max-w-4xl mx-auto" />

        {/* ══════════ STATS ══════════ */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="stat-card animate-fade-in-up animate-delay-1">
                <div className="stat-number">{tools.length > 0 ? tools.length : "—"}</div>
                <p className="mt-2 text-sm text-muted-foreground">Tools Tersedia</p>
              </div>
              <div className="stat-card animate-fade-in-up animate-delay-2">
                <div className="stat-number">2K+</div>
                <p className="mt-2 text-sm text-muted-foreground">Total Baris Kode</p>
              </div>
              <div className="stat-card animate-fade-in-up animate-delay-3">
                <div className="stat-number">6</div>
                <p className="mt-2 text-sm text-muted-foreground">Distro Didukung</p>
              </div>
              <div className="stat-card animate-fade-in-up animate-delay-4">
                <div className="stat-number">15+</div>
                <p className="mt-2 text-sm text-muted-foreground">Fitur Installer</p>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-line max-w-4xl mx-auto" />

        {/* ══════════ TOOLS ══════════ */}
        <section id="tools" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-[11px] font-medium text-primary mb-4">
                <FileCode2 className="w-3 h-3" />
                Installer
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Tools Tersedia
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Semua tools bisa dijalankan dengan satu perintah. Installer mendukung
                mode interaktif dan mode tanpa intervensi untuk CI/CD.
              </p>
            </div>

            {tools.length > 0 ? (
              <div className="space-y-6">
                {tools.map((tool, i) => (
                  <ToolCard key={tool.name} tool={tool} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 mb-4">
                  <Package className="w-5 h-5 text-primary/50" />
                </div>
                <p className="text-muted-foreground">Memuat tools...</p>
              </div>
            )}

            <div className="mt-10 text-center animate-fade-in-up animate-delay-3">
              <p className="text-sm text-muted-foreground">
                Tools lainnya segera hadir. Ekosistem ini berkembang setiap ada file{" "}
                <code className="text-xs font-mono text-primary/80">.sh</code> baru
                di{" "}
                <code className="text-xs font-mono text-primary/80">
                  /installer/
                </code>
                .
              </p>
            </div>
          </div>
        </section>

        <div className="glow-line max-w-4xl mx-auto" />

        {/* ══════════ FEATURES ══════════ */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-[11px] font-medium text-primary mb-4">
                <Layers className="w-3 h-3" />
                Keunggulan
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Kenapa ArkanProjects
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Prinsip yang berlaku di setiap tools yang kami buat.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Deploy Sekali Klik"
                description="Setiap installer dirancang untuk dijalankan dari satu perintah di server baru. Tanpa prasyarat selain akses root dan curl. Resolusi dependensi, konfigurasi, dan setup layanan berjalan otomatis di semua distro yang didukung."
                delay={1}
              />
              <FeatureCard
                icon={<Package className="w-6 h-6" />}
                title="Tools Otomatis"
                description="Taruh file .sh dengan variabel TOOL_NAME dan TOOL_DESC ke folder /installer/, website langsung mendeteksinya — tanpa ubah kode apapun. Halaman utama, API, dan perintah curl ikut update otomatis."
                delay={2}
              />
              <FeatureCard
                icon={<Terminal className="w-6 h-6" />}
                title="Interaktif + Headless"
                description="Jalankan tanpa flag untuk wizard langkah demi langkah, atau tambahkan argumen CLI untuk mode non-interaktif penuh. Setiap installer mendukung keduanya — cocok untuk setup manual maupun pipeline CI/CD."
                delay={3}
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Rollback Aman"
                description="Installer mencatat setiap operasi destruktif dan membalikkannya secara terbalik jika ada langkah yang gagal. Ditambah logging lengkap ke /var/log/, debugging masalah produksi jadi lebih mudah."
                delay={1}
              />
              <FeatureCard
                icon={<ArrowRight className="w-6 h-6" />}
                title="Dapat Diperluas"
                description="Sistem blueprint dan addon memungkinkan perluasan fungsionalitas tanpa fork. Tema, integrasi game, alat admin, dan manajer database — semua bisa dimuat saat instalasi maupun setelahnya."
                delay={2}
              />
              <FeatureCard
                icon={<Github className="w-6 h-6" />}
                title="Teruji di Lapangan"
                description="Diuji di Ubuntu 22.04/24.04, Debian 10–13, Rocky Linux 8/9, dan AlmaLinux 8/9 pada arsitektur x86_64 dan arm64. Provider hosting dan hobiis menjalankan installer ini di lingkungan produksi setiap hari."
                delay={3}
              />
            </div>
          </div>
        </section>

        <div className="glow-line max-w-4xl mx-auto" />

        {/* ══════════ TERMINAL DEMO ══════════ */}
        <section id="demo" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-[11px] font-medium text-primary mb-4">
                <MonitorDot className="w-3 h-3" />
                Demo
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Lihat Aksinya
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Satu perintah — semua terinstal. Begitulah cara kerja ArkanProjects.
              </p>
            </div>

            <div className="terminal-window max-w-3xl mx-auto animate-fade-in-up animate-delay-1">
              <div className="terminal-bar">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <div className="terminal-title">arkan@server — bash</div>
                <div className="w-[46px]" />
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="text-emerald-400 font-semibold">$</span> bash &lt;(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)
                </div>
                <div className="terminal-line">
                  <span className="text-primary/60">* </span>ArkanProjects — Pterodactyl Installer <span className="text-violet-400">v4.0.0</span>
                </div>
                <div className="terminal-line">
                  <span className="text-primary/60">* </span>OS: Ubuntu 24.04 | Arch: x86_64 <span className="text-muted-foreground/50">(amd64)</span>
                </div>
                <div className="terminal-line">
                  <span className="text-primary/60">* </span>Menginstal panel dependencies...
                </div>
                <div className="terminal-line">
                  <span className="text-emerald-400">✔ OK:</span> Panel dependencies installed
                </div>
                <div className="terminal-line">
                  <span className="text-emerald-400">✔ OK:</span> Composer dependencies installed
                </div>
                <div className="terminal-line">
                  <span className="text-emerald-400">✔ OK:</span> Panel installation complete
                </div>
                <div className="terminal-line">
                  <span className="text-emerald-400">✔ OK:</span> Wings installation complete
                </div>
                <span className="terminal-cursor" />
              </div>
            </div>
          </div>
        </section>

        <div className="glow-line max-w-4xl mx-auto" />

        {/* ══════════ TENTANG ══════════ */}
        <section id="about" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-[11px] font-medium text-primary mb-4">
                <Users className="w-3 h-3" />
                Tim
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Tentang
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Dibangun oleh siswa, didorong oleh ambisi. Tools nyata dari
                generasi insinyur berikutnya.
              </p>
            </div>

            <div className="about-glass p-8 sm:p-10 animate-fade-in-up animate-delay-1">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  ArkanProjects didirikan oleh tiga siswa dari{" "}
                  <span className="text-foreground font-semibold">
                    SMPIT Arkan Cendekia
                  </span>{" "}
                  yang memiliki visi yang sama: membuat infrastruktur server menjadi
                  mudah diakses, andal, dan modern. Apa yang dimulai sebagai proyek
                  sekolah berkembang menjadi ekosistem tools deployment yang digunakan
                  oleh provider hosting dan hobiis.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Proyek ini dirancang untuk bisa diskalakan — setiap installer di{" "}
                  <code className="text-xs font-mono text-primary/80">
                    /installer/
                  </code>{" "}
                  adalah tools mandiri. Menambahkan script deployment baru tidak perlu
                  mengubah website sedikitpun. Tulis file .sh dengan variabel{" "}
                  <code className="text-xs font-mono text-primary/80">
                    TOOL_NAME
                  </code>{" "}
                  dan{" "}
                  <code className="text-xs font-mono text-primary/80">
                    TOOL_DESC
                  </code>
                  , taruh di folder, dan website langsung mendeteksinya.
                </p>

                <div className="pt-6 border-t border-border/30">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">
                    Tim Inti
                  </h3>
                  <div className="space-y-4">
                    <ContributorRow
                      name="Muhammad Rafif Rianto C.Ps"
                      role="Lead Developer"
                      description="Arsitektur utama installer, desain modular, dan pengembangan fitur inti."
                    />
                    <ContributorRow
                      name="Faturrahman Al Rizky"
                      role="Systems Engineer"
                      description="Integrasi sistem operasi, manajemen dependensi, dan dukungan multi-distro."
                    />
                    <ContributorRow
                      name="Akhbar Alfiansyah"
                      role="Infrastructure"
                      description="Infrastruktur deployment, pengujian di lingkungan produksi, dan dokumentasi."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 backdrop-blur-xl bg-background/40">
        <div className="max-w-6xl mx-auto px-6">
          {/* Quick links */}
          <div className="py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                Tools
              </h4>
              <a
                href="#tools"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Installer
              </a>
              <a
                href="#demo"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                Demo Terminal
              </a>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                Fitur
              </h4>
              <a
                href="#features"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Deploy Sekali Klik
              </a>
              <a
                href="#features"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                Rollback Aman
              </a>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                Tentang
              </h4>
              <a
                href="#about"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tim Inti
              </a>
              <a
                href="#about"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                ArkanProjects
              </a>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                Sumber Terbuka
              </h4>
              <a
                href="https://github.com/ArkanProjects"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/ArkanProjects"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
              >
                Kontribusi
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="glow-line" />

          {/* Copyright */}
          <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ArkanProjects
            </p>
            <a
              href="https://github.com/ArkanProjects"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Tool Card ── */
function ToolCard({
  tool,
  index,
}: {
  tool: Tool;
  index: number;
}) {
  return (
    <div
      className={`tool-card glass rounded-2xl p-6 sm:p-8 animate-fade-in-up animate-delay-${(index % 4) + 1}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {tool.title}
            </h3>
            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
              {tool.badge}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {tool.desc}
          </p>
        </div>
      </div>

      <div className="code-block flex items-center justify-between gap-4">
        <code className="flex-1 truncate">
          bash &lt;(curl -s https://arkanprojects.vercel.app/installer/{tool.name}.sh)
        </code>
        <CopyToolButton cmd={tool.cmd} />
      </div>

      <div className="mt-4">
        <a
          href={`https://arkanprojects.vercel.app/installer/${tool.name}.sh`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Lihat Script
        </a>
      </div>
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className={`feature-card glass rounded-2xl p-6 animate-fade-in-up animate-delay-${delay}`}
    >
      <div className="feature-icon-bg w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ── Contributor Row ── */
function ContributorRow({
  name,
  role,
  description,
}: {
  name: string;
  role: string;
  description: string;
}) {
  return (
    <div className="contributor-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-3 px-4 rounded-xl bg-secondary/20 border border-border/20">
      <div>
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground ml-2 sm:ml-3">
          {role}
        </span>
      </div>
      <span className="text-xs text-muted-foreground/70 sm:text-right">
        {description}
      </span>
    </div>
  );
}
