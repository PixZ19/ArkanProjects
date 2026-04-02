"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  History,
  Menu,
  X,
} from "lucide-react";
import { CopyToolButton } from "@/components/copy-button";

interface Tool {
  name: string;
  title: string;
  desc: string;
  cmd: string;
  badge: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  type: string;
  title: string;
  description: string;
  changes: string[];
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then(setTools)
      .catch(() => {});
    fetch("/api/changelog")
      .then((r) => r.json())
      .then(setChangelog)
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
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
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
              href="#changelog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Changelog
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
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* ── Mobile Sidebar ── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="fixed top-0 right-0 z-[70] h-full w-72 bg-[#0a0a1a]/95 backdrop-blur-2xl border-l border-border/40 shadow-2xl shadow-black/40 mobile-sidebar-open">
            <div className="flex flex-col h-full">
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-border/30">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Arkan<span className="text-primary">Projects</span>
                </span>
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Sidebar links */}
              <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <SidebarLink href="#tools" label="Tools" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="#features" label="Fitur" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="#demo" label="Demo" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="#changelog" label="Changelog" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="#about" label="Tentang" onClick={() => setSidebarOpen(false)} />
                <div className="my-3 border-t border-border/20" />
                <a
                  href="https://github.com/ArkanProjects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
              {/* Sidebar footer */}
              <div className="px-6 py-4 border-t border-border/30">
                <p className="text-[11px] text-muted-foreground/50">v1.0.0</p>
              </div>
            </div>
          </div>
        </>
      )}

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
                  v1.0
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

            <TerminalDemo />
          </div>
        </section>

        <div className="glow-line max-w-4xl mx-auto" />

        {/* ══════════ CHANGELOG ══════════ */}
        <section id="changelog" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-[11px] font-medium text-primary mb-4">
                <History className="w-3 h-3" />
                Changelog
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Riwayat Perubahan
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Catatan rilis untuk setiap versi ArkanProjects.
              </p>
            </div>

            {changelog.length > 0 ? (
              <div className="space-y-6">
                {changelog.map((entry, i) => (
                  <ChangelogCard key={entry.version} entry={entry} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 mb-4">
                  <History className="w-5 h-5 text-primary/50" />
                </div>
                <p className="text-muted-foreground">Memuat changelog...</p>
              </div>
            )}
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

/* ── Interactive Terminal Demo ── */
type TLine =
  | { type: "cmd"; text: string }
  | { type: "out"; text: string }
  | { type: "ok"; text: string }
  | { type: "ask"; label: string; answer: string }
  | { type: "warn"; text: string }
  | { type: "info"; text: string }
  | { type: "blank" }
  | { type: "cursor" };

const DEMO_SCRIPT: TLine[] = [
  { type: "cmd", text: "bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)" },
  { type: "blank" },
  { type: "out", text: "████████╗██╗  ██╗███████╗ ██████╗██╗  ██╗██╗███╗   ██╗███████╗" },
  { type: "out", text: "╚══██╔══╝██║  ██║██╔════╝██╔════╝██║  ██║██║████╗  ██║██╔════╝" },
  { type: "out", text: "████╗  ███████║█████╗  ██║     ███████║██║██╔██╗ ██║█████╗" },
  { type: "out", text: "██╔══╝  ██╔══██║██╔══╝  ██║     ██╔══██║██║██║╚██╗██║██╔══╝" },
  { type: "out", text: "██║     ██║  ██║██║     ╚██████╗██║  ██║██║██║ ╚████║███████╗" },
  { type: "out", text: "╚═╝     ╚═╝  ╚═╝╚═╝      ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝" },
  { type: "blank" },
  { type: "out", text: "╔═══════════════════════════════════════════════════════════╗" },
  { type: "out", text: "║ ⚡ ARKANPROJECTS — PTERODACTYL MASTER COMMAND            ║" },
  { type: "out", text: "║ ░▒▓█  Pterodactyl Server Management Tool  █▓▒░            ║" },
  { type: "out", text: "╠═══════════════════════════════════════════════════════════╣" },
  { type: "out", text: "║ Version    │  v4.1.0                                         ║" },
  { type: "out", text: "║ Panel       │  v1.0.0                                         ║" },
  { type: "out", text: "║ Wings       │  v1.0.0                                         ║" },
  { type: "out", text: "║ OS          │  Ubuntu 24.04 (x86_64)                              ║" },
  { type: "out", text: "╠═══════════════════════════════════════════════════════════╣" },
  { type: "out", text: "║ https://arkanprojects.vercel.app                       ║" },
  { type: "out", text: "╚═══════════════════════════════════════════════════════════╝" },
  { type: "blank" },
  { type: "warn", text: "──────────────────────────────────────────────────────────" },
  { type: "out", text: " SELECT AN OPTION:" },
  { type: "warn", text: "──────────────────────────────────────────────────────────" },
  { type: "blank" },
  { type: "out", text: " ── INSTALL ───────────────────────────────────────────" },
  { type: "out", text: " [0]  🚀  Install Panel" },
  { type: "out", text: " [1]  🔧  Install Wings" },
  { type: "out", text: " [2]  💎  Install Panel + Wings (same server)" },
  { type: "blank" },
  { type: "out", text: " ── EXTENSIONS ──────────────────────────────────────" },
  { type: "out", text: " [3]  🧩  Install Blueprint / Extension (.blueprint)" },
  { type: "out", text: " [4]  🎨  Install Theme (39 available)" },
  { type: "out", text: " [5]  📦  Install Addons Panel (game server addons)" },
  { type: "out", text: " [6]  ⚡  Load Addon (phpmyadmin, fail2ban, etc.)" },
  { type: "blank" },
  { type: "out", text: " ── LIST / TOOLS ───────────────────────────────────" },
  { type: "out", text: " [7]  📋  List All Themes & Blueprints (39)" },
  { type: "out", text: " [8]  📋  List All Addons" },
  { type: "out", text: " [9]  📊  Status & Health Check" },
  { type: "blank" },
  { type: "out", text: " ── UNINSTALL ──────────────────────────────────────" },
  { type: "out", text: " [10]  🗑️   Uninstall Panel" },
  { type: "out", text: " [11]  🗑️   Uninstall Wings" },
  { type: "blank" },
  { type: "out", text: " [12]  Exit" },
  { type: "warn", text: "──────────────────────────────────────────────────────────" },
  { type: "blank" },
  { type: "ask", label: "Input (0-12)", answer: "2" },
  { type: "blank" },
  { type: "ask", label: "Database name [panel]:", answer: "panel" },
  { type: "ask", label: "Database username [pterodactyl]:", answer: "pterodactyl" },
  { type: "ask", label: "Database password (Enter for random):", answer: "•••••••••••••" },
  { type: "ask", label: "Timezone [UTC]:", answer: "Asia/Jakarta" },
  { type: "ask", label: "Email for Let's Encrypt & panel:", answer: "admin@arkandev.id" },
  { type: "ask", label: "Admin email:", answer: "admin@arkandev.id" },
  { type: "ask", label: "Admin username:", answer: "pixz" },
  { type: "ask", label: "Admin first name:", answer: "Rafif" },
  { type: "ask", label: "Admin last name:", answer: "Developer" },
  { type: "ask", label: "Admin password:", answer: "••••••••" },
  { type: "ask", label: "Panel FQDN (panel.example.com):", answer: "panel.arkandev.id" },
  { type: "ask", label: "Configure UFW firewall (y/N):", answer: "y" },
  { type: "ask", label: "Configure HTTPS with Let's Encrypt (y/N):", answer: "y" },
  { type: "blank" },
  { type: "out", text: "Installing panel dependencies for Ubuntu 24.04..." },
  { type: "ok", text: "Panel dependencies installed" },
  { type: "out", text: "Installing Composer..." },
  { type: "ok", text: "Composer dependencies installed" },
  { type: "out", text: "Downloading Pterodactyl panel..." },
  { type: "ok", text: "Panel files extracted" },
  { type: "out", text: "Configuring panel environment..." },
  { type: "ok", text: "Panel configured" },
  { type: "out", text: "Starting Wings installation..." },
  { type: "ok", text: "Wings binary installed" },
  { type: "ok", text: "Wings service installed" },
  { type: "out", text: "Configuring Let's Encrypt SSL..." },
  { type: "ok", text: "SSL certificate obtained" },
  { type: "out", text: "Configuring firewall (UFW)..." },
  { type: "ok", text: "UFW enabled" },
  { type: "ok", text: "Firewall rules applied (80, 443, 8080, 2022)" },
  { type: "blank" },
  { type: "ok", text: "Panel installation complete" },
  { type: "ok", text: "Wings installation complete" },
  { type: "blank" },
  { type: "warn", text: "──────────────────────────────────────────────────────────" },
  { type: "ok", text: "All operations completed successfully" },
  { type: "warn", text: "──────────────────────────────────────────────────────────" },
  { type: "cursor" },
];

function TerminalDemo() {
  const [lines, setLines] = useState<{ html: string; delay: number }[]>([]);
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const typingSpeed = useCallback((text: string) => {
    return Math.max(20, Math.min(45, 600 / text.length));
  }, []);

  // Intersection Observer — start demo when visible
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let delayAcc = 500;
    const built: { html: string; delay: number }[] = [];

    for (const line of DEMO_SCRIPT) {
      if (line.type === "blank") {
        built.push({ html: "", delay: delayAcc });
        delayAcc += 60;
      } else if (line.type === "cmd") {
        const speed = typingSpeed(line.text);
        const total = speed * line.text.length;
        built.push({
          html: `<span class="text-emerald-400 font-bold select-none">$ </span><span class="cmd-text" data-text="${line.text.replace(/"/g, "&quot;")}"></span>`,
          delay: delayAcc,
        });
        delayAcc += total + 200;
      } else if (line.type === "ask") {
        const speed = typingSpeed(line.answer);
        const total = speed * line.answer.length;
        built.push({
          html: `<span class="text-violet-400 font-bold select-none">[?] </span><span class="text-slate-400">${line.label}</span><span class="ask-text" data-text="${line.answer.replace(/"/g, "&quot;")}"></span>`,
          delay: delayAcc,
        });
        delayAcc += 500 + total + 100;
      } else if (line.type === "out") {
        built.push({
          html: `<span class="text-slate-300/90">${line.text}</span>`,
          delay: delayAcc,
        });
        delayAcc += 40 + Math.random() * 30;
      } else if (line.type === "ok") {
        built.push({
          html: `<span class="text-emerald-400 font-semibold">  [✔] </span><span class="text-emerald-300/80">${line.text}</span>`,
          delay: delayAcc,
        });
        delayAcc += 80 + Math.random() * 60;
      } else if (line.type === "info") {
        built.push({
          html: `<span class="text-cyan-400">  [•] </span><span class="text-cyan-300/80">${line.text}</span>`,
          delay: delayAcc,
        });
        delayAcc += 120;
      } else if (line.type === "warn") {
        built.push({
          html: `<span class="text-indigo-400/60">${line.text}</span>`,
          delay: delayAcc,
        });
        delayAcc += 40;
      } else if (line.type === "cursor") {
        built.push({
          html: `<span class="demo-cursor"></span>`,
          delay: delayAcc,
        });
        delayAcc += 100;
      }
    }

    setLines(built);

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < built.length; i++) {
      timers.push(
        setTimeout(() => {
          setVisible((v) => v + 1);
        }, built[i].delay)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [started, typingSpeed]);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [visible]);

  // Trigger typing animation when new lines appear
  useEffect(() => {
    if (!bodyRef.current) return;
    const newLine = bodyRef.current.children[visible - 1] as HTMLElement | undefined;
    if (!newLine) return;

    const cmdEl = newLine.querySelector(".cmd-text") as HTMLElement | null;
    const askEl = newLine.querySelector(".ask-text") as HTMLElement | null;

    if (cmdEl) {
      const text = cmdEl.dataset.text || "";
      let i = 0;
      const speed = typingSpeed(text);
      const interval = setInterval(() => {
        if (i <= text.length) {
          cmdEl.textContent = text.slice(0, i);
          i++;
          bodyRef.current && (bodyRef.current.scrollTop = bodyRef.current.scrollHeight);
        } else {
          clearInterval(interval);
          cmdEl.classList.add("done");
        }
      }, speed);
    } else if (askEl) {
      const text = askEl.dataset.text || "";
      let i = 0;
      const speed = typingSpeed(text);
      const interval = setInterval(() => {
        if (i <= text.length) {
          askEl.textContent = text.slice(0, i);
          i++;
          bodyRef.current && (bodyRef.current.scrollTop = bodyRef.current.scrollHeight);
        } else {
          clearInterval(interval);
          askEl.classList.add("done");
        }
      }, speed);
    }
  }, [visible, typingSpeed]);

  return (
    <div ref={wrapperRef} className="terminal-window max-w-3xl mx-auto animate-fade-in-up animate-delay-1">
      <div className="terminal-bar">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <div className="terminal-title">root@server — bash — 80×24</div>
        <div className="w-[46px]" />
      </div>
      <div ref={bodyRef} className="terminal-body demo-terminal-body">
        <div className="terminal-matrix-rain">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="rain-column" style={{ left: `${(i + 1) * 10}%`, animationDuration: `${14 + i * 2}s`, animationDelay: `${i * 1.5}s` }}>
              01001101010110010110
            </span>
          ))}
        </div>
        {lines.slice(0, visible).map((line, i) => (
          <div
            key={i}
            className="terminal-line"
            style={{ animationDelay: "0s" }}
            dangerouslySetInnerHTML={{ __html: line.html }}
          />
        ))}
      </div>
      <div className="terminal-status-bar">
        <div className="terminal-status-text">
          <span className="status-version">ARKANPROJECTS v4.1.0</span>
          <span className="status-separator">│</span>
          <span className="status-shell">bash</span>
        </div>
        <div className="terminal-status-indicator">
          <span className="status-label">active</span>
          <span className="status-blink-dot"></span>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar Link (Mobile) ── */
function SidebarLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
      onClick={onClick}
    >
      {label}
    </a>
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

/* ── Changelog Card ── */
function ChangelogCard({
  entry,
  index,
}: {
  entry: ChangelogEntry;
  index: number;
}) {
  const typeLabel =
    entry.type === "major"
      ? "Major"
      : entry.type === "minor"
        ? "Minor"
        : "Patch";
  const typeColor =
    entry.type === "major"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : entry.type === "minor"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  return (
    <div
      className={`glass rounded-2xl p-6 sm:p-8 animate-fade-in-up animate-delay-${(index % 4) + 1}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <History className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
          <span
            className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeColor}`}
          >
            {typeLabel}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{entry.date}</span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        {entry.description}
      </p>

      <div className="space-y-2">
        {entry.changes.map((change, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-emerald-400 mt-0.5 shrink-0">+</span>
            <span className="text-muted-foreground">{change}</span>
          </div>
        ))}
      </div>
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
