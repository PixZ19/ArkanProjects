'use client';

import { motion } from 'framer-motion';
import {
  Terminal, Github, ChevronRight,
  Code2, Database, Cpu, Braces,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// Interactive Wizard Terminal — bot types through install wizard
// ============================================================

interface WizardStep {
  type: 'output' | 'input' | 'blank' | 'progress';
  text: string;
  color: string;
  typingDelay: number; // ms per character for typing effect
  charPause?: number;  // pause after each character
  lineDelay?: number;  // delay before this line starts (ms)
}

const wizardScript: WizardStep[] = [
  // Command to run installer
  { type: 'input', text: '$ bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)', color: '#00ffff', typingDelay: 8, lineDelay: 400 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 300 },
  // Banner
  { type: 'output', text: '  ArkanProjects', color: '#00ffff', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  ──────────────────────────────────────────────', color: '#444466', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  Pterodactyl All-in-One Installer  v1.0.0', color: '#cccccc', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  https://github.com/PixZ19/ArkanProjects', color: '#8888aa', typingDelay: 0, lineDelay: 40 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 120 },
  // OS detection
  { type: 'output', text: '  [i] Sistem operasi terdeteksi: Ubuntu 24.04 (amd64)', color: '#00ff88', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [i] Panel terbaru: v1.0.0 | Wings terbaru: v1.0.7', color: '#00ff88', typingDelay: 0, lineDelay: 100 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  // Menu selection (4 options)
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#00ffff', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  │  PILIHAN INSTALASI                │', color: '#00ffff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#00ffff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '', color: '', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  1  Instal Panel saja', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  2  Instal Wings saja', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  3  Instal Panel + Wings (satu mesin)', color: '#00ff88', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  4  Instal Blueprint, Theme & Addon', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  // User picks option 3
  { type: 'input', text: '  > Pilih [1-4]: 3', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 150 },
  // Wizard configuration
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#00ffff', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  │  KONFIGURASI PANEL                │', color: '#00ffff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#00ffff', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  [i] Konfigurasi database', color: '#00ffff', typingDelay: 0, lineDelay: 100 },
  { type: 'input', text: '  > Nama database (panel): panel', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'input', text: '  > Username database (pterodactyl): pterodactyl', color: '#8888aa', typingDelay: 8, lineDelay: 150 },
  { type: 'input', text: '  > Password database: •••••••••••••••••••••••••••••••', color: '#8888aa', typingDelay: 4, lineDelay: 120 },
  { type: 'input', text: '  > Zona waktu (Asia/Jakarta): Asia/Jakarta', color: '#8888aa', typingDelay: 8, lineDelay: 100 },
  { type: 'input', text: '  > Email untuk SSL: admin@contoh.com', color: '#8888aa', typingDelay: 8, lineDelay: 150 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  [i] Akun admin awal', color: '#00ffff', typingDelay: 0, lineDelay: 100 },
  { type: 'input', text: '  > Email admin: admin@contoh.com', color: '#8888aa', typingDelay: 8, lineDelay: 150 },
  { type: 'input', text: '  > Username admin: arkan', color: '#8888aa', typingDelay: 8, lineDelay: 120 },
  { type: 'input', text: '  > Nama depan: Arkan', color: '#8888aa', typingDelay: 8, lineDelay: 100 },
  { type: 'input', text: '  > Nama belakang: Dev', color: '#8888aa', typingDelay: 8, lineDelay: 100 },
  { type: 'input', text: '  > Password admin: •••••••••••••', color: '#8888aa', typingDelay: 4, lineDelay: 120 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'input', text: '  > FQDN Panel: panel.contoh.com', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'input', text: '  > Konfigurasi UFW? (y/N): y', color: '#8888aa', typingDelay: 8, lineDelay: 120 },
  { type: 'input', text: '  > Konfigurasi SSL Let\'s Encrypt? (y/N): y', color: '#8888aa', typingDelay: 8, lineDelay: 120 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 120 },
  // DNS verification
  { type: 'output', text: '  [i] Memverifikasi DNS untuk panel.contoh.com...', color: '#00ffff', typingDelay: 0, lineDelay: 200 },
  { type: 'output', text: '  [ok] DNS terverifikasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  // === PANEL INSTALLATION ===
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#00ff88', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  │  INSTALASI PANEL                  │', color: '#00ff88', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#00ff88', typingDelay: 0, lineDelay: 60 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  { type: 'output', text: '  [1/8] Menginstal dependensi untuk Ubuntu 24.04...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Dependensi terinstal ✓', color: '#00ff88', typingDelay: 0, lineDelay: 350 },
  { type: 'output', text: '  [2/8] Menginstal Composer...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Composer terinstal ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'output', text: '  [3/8] Mengunduh file Pterodactyl Panel v1.0.0...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] File panel terunduh ✓', color: '#00ff88', typingDelay: 0, lineDelay: 400 },
  { type: 'output', text: '  [4/8] Menginstal dependensi Composer...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Dependensi Composer terinstal ✓', color: '#00ff88', typingDelay: 0, lineDelay: 350 },
  { type: 'output', text: '  [5/8] Mengkonfigurasi database...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Database dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [6/8] Mengkonfigurasi environment Panel...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Environment Panel dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'output', text: '  [7/8] Mengkonfigurasi Nginx dan service...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Nginx dan service dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [8/8] Konfigurasi SSL...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Sertifikat SSL berhasil dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 400 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  // === WINGS INSTALLATION ===
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#8800ff', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  │  KONFIGURASI WINGS (MESIN YANG SAMA) │', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#8800ff', typingDelay: 0, lineDelay: 60 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'input', text: '  > Konfigurasi UFW? (y/N): y', color: '#8888aa', typingDelay: 8, lineDelay: 120 },
  { type: 'input', text: '  > Konfigurasi user database host? (y/N): n', color: '#8888aa', typingDelay: 8, lineDelay: 120 },
  { type: 'input', text: '  > Konfigurasi SSL Let\'s Encrypt? (y/N): n', color: '#8888aa', typingDelay: 8, lineDelay: 120 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#8800ff', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  │  INSTALASI WINGS                  │', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#8800ff', typingDelay: 0, lineDelay: 60 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  { type: 'output', text: '  [1/5] Menginstal Docker & dependensi...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Docker terinstal ✓', color: '#00ff88', typingDelay: 0, lineDelay: 350 },
  { type: 'output', text: '  [2/5] Mengunduh Pterodactyl Wings v1.0.7...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Wings terunduh ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'output', text: '  [3/5] Mengkonfigurasi systemd service...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Service Wings dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [4/5] Konfigurasi database host...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Database host dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 200 },
  { type: 'output', text: '  [5/5] Konfigurasi SSL...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] SSL Wings dikonfigurasi ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  // === COMPLETION ===
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#00ff88', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  │      INSTALASI SELESAI ✓          │', color: '#00ff88', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#00ff88', typingDelay: 0, lineDelay: 40 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  Panel: https://panel.contoh.com', color: '#00ffff', typingDelay: 0, lineDelay: 60 },
  { type: 'output', text: '  Admin: admin@contoh.com / arkan', color: '#cccccc', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  Waktu: 2m 34s', color: '#8888aa', typingDelay: 0, lineDelay: 40 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  // === BLUEPRINT INSTALLATION ===
  { type: 'input', text: '  > Instal Blueprint, Theme, atau Addon? (y/N): y', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#8800ff', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  │  BLUEPRINT, THEME & ADDON          │', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  1  Blueprint — konfigurasi egg/server', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  2  Theme — tema panel kustom', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  3  Addon — ekstensi untuk panel', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  0  Kembali', color: '#666688', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  // Pick Blueprint (option 1)
  { type: 'input', text: '  > Pilih [0-3]: 1', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#ff0088', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  │  INSTALASI BLUEPRINT              │', color: '#ff0088', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#ff0088', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'output', text: '  1  Blueprint Minecraft (Vanilla, Fabric, Forge)', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  2  Blueprint Server (CS2, Rust, FiveM)', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  3  Blueprint Database (PostgreSQL, MongoDB)', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  4  Blueprint Lainnya (TF2, dll)', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'input', text: '  > Pilih blueprint [0-4]: 1', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  { type: 'output', text: '  [1/3] Mengunduh Blueprint Minecraft...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Blueprint Minecraft terunduh ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'output', text: '  [2/3] Mengimpor blueprint ke Panel...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] minecraft.json berhasil diimpor ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [3/3] Membersihkan cache...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Cache dibersihkan ✓', color: '#00ff88', typingDelay: 0, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  // === THEME INSTALLATION ===
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#8800ff', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  │  BLUEPRINT, THEME & ADDON          │', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'input', text: '  > Pilih [0-3]: 2', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  1  Pterodactyl Blue Admin Theme', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  2  Pterodactyl Twilight Theme', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  3  Pterodactyl Styx Theme', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'input', text: '  > Pilih theme [0-3]: 1', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  { type: 'output', text: '  [1/4] Mengunduh pterodactyl-blue-admin...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Theme terunduh ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'output', text: '  [2/4] Memasang theme ke Panel...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] File theme dipasang ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [3/4] Mengatur permission...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Permission diatur ✓', color: '#00ff88', typingDelay: 0, lineDelay: 200 },
  { type: 'output', text: '  [4/4] Membersihkan cache...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Cache dibersihkan ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  // === ADDON INSTALLATION ===
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#8800ff', typingDelay: 0, lineDelay: 50 },
  { type: 'output', text: '  │  BLUEPRINT, THEME & ADDON          │', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#8800ff', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'input', text: '  > Pilih [0-3]: 3', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  { type: 'output', text: '  1  Billing Extension', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  2  Give Eggs via Discord', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  3  Advanced Ban System', color: '#cccccc', typingDelay: 0, lineDelay: 30 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'input', text: '  > Pilih addon [0-3]: 1', color: '#8888aa', typingDelay: 8, lineDelay: 200 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 100 },
  { type: 'output', text: '  [1/5] Mengunduh pterodactyl-billing...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Addon terunduh ✓', color: '#00ff88', typingDelay: 0, lineDelay: 300 },
  { type: 'output', text: '  [2/5] Memasang addon ke Panel...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] File addon dipasang ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [3/5] Menginstal dependensi...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Dependensi diperbarui ✓', color: '#00ff88', typingDelay: 0, lineDelay: 200 },
  { type: 'output', text: '  [4/5] Menjalankan migrasi database...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Migrasi database berhasil ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'output', text: '  [5/5] Membersihkan cache...', color: '#00ffff', typingDelay: 0, lineDelay: 150 },
  { type: 'output', text: '  [ok] Cache dibersihkan ✓', color: '#00ff88', typingDelay: 0, lineDelay: 250 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 80 },
  // === FINAL ===
  { type: 'output', text: '  ┌───────────────────────────────────┐', color: '#00ff88', typingDelay: 0, lineDelay: 40 },
  { type: 'output', text: '  │  SEMUA FITUR TERINSTAL ✓          │', color: '#00ff88', typingDelay: 0, lineDelay: 30 },
  { type: 'output', text: '  └───────────────────────────────────┘', color: '#00ff88', typingDelay: 0, lineDelay: 40 },
  { type: 'blank', text: '', color: '', typingDelay: 0, lineDelay: 60 },
  { type: 'output', text: '  ArkanProjects — https://github.com/PixZ19/ArkanProjects', color: '#666688', typingDelay: 0, lineDelay: 50 },
];

function useTypingWizard(steps: WizardStep[]) {
  const [lines, setLines] = useState<{ text: string; color: string; type: string; visible: boolean; id: number }[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentType, setCurrentType] = useState('output');
  const [isTyping, setIsTyping] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const idCounterRef = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, currentLine]);

  // Handle visibility — pause typing when tab hidden, resume when visible
  useEffect(() => {
    const handleVis = () => {
      pausedRef.current = document.hidden;
      setPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVis, { passive: true });
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // Make lines visible with fade-in (triggered after mount)
  useEffect(() => {
    const hiddenLines = lines.filter(l => !l.visible);
    if (hiddenLines.length === 0) return;
    
    // Use requestAnimationFrame to ensure the opacity:0 is painted first
    const raf = requestAnimationFrame(() => {
      setLines(prev => prev.map(l => l.visible ? l : { ...l, visible: true }));
    });
    return () => cancelAnimationFrame(raf);
  }, [lines.length]); // Only trigger when new lines are added

  // Advance to next line
  const advanceLine = useCallback((idx: number) => {
    lineIndexRef.current = idx + 1;
    setLineIndex(idx + 1);
    setCharIndex(0);
    charIndexRef.current = 0;
  }, []);

  useEffect(() => {
    if (lineIndex >= steps.length) return;
    if (paused) return;

    const step = steps[lineIndex];
    const delay = lineIndex === 0 ? (step.lineDelay || 0) : (step.lineDelay || 0);

    // Initial delay before processing this line
    if (charIndex === 0) {
      timeoutRef.current = setTimeout(() => {
        if (pausedRef.current) return;

        // Blank lines — instant
        if (step.type === 'blank' || step.text === '') {
          const id = idCounterRef.current++;
          setLines(prev => [...prev, { text: '', color: '', type: 'blank', visible: true, id }]);
          advanceLine(lineIndex);
          return;
        }

        // OUTPUT lines — appear INSTANTLY with fade-in (no typing)
        if (step.type === 'output') {
          const id = idCounterRef.current++;
          // Add line as invisible first, then the useEffect above will make it visible
          setLines(prev => [...prev, { text: step.text, color: step.color, type: 'output', visible: false, id }]);
          advanceLine(lineIndex);
          return;
        }

        // INPUT lines — typing effect (faster)
        setCurrentColor(step.color);
        setCurrentType(step.type);
        setCurrentLine(step.text[0] || '');
        setCharIndex(1);
        charIndexRef.current = 1;
        setIsTyping(true);
      }, delay);
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }

    // Only input lines reach here — typing effect
    if (step.type !== 'input') return;

    if (charIndex < step.text.length) {
      // Faster typing — 5ms per char base
      const typeDelay = 5 + Math.random() * 4;
      timeoutRef.current = setTimeout(() => {
        if (pausedRef.current) return;
        const next = charIndexRef.current + 1;
        charIndexRef.current = next;
        setCharIndex(next);
        setCurrentLine(step.text.slice(0, next));
      }, typeDelay);
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }

    // Input line complete
    timeoutRef.current = setTimeout(() => {
      if (pausedRef.current) return;
      const id = idCounterRef.current++;
      setLines(prev => [...prev, { text: step.text, color: step.color, type: 'input', visible: true, id }]);
      setCurrentLine('');
      setIsTyping(false);
      advanceLine(lineIndex);
    }, 100);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [lineIndex, charIndex, paused, steps, advanceLine]);

  return { lines, currentLine, currentColor, currentType, isTyping, scrollRef, isDone: lineIndex >= steps.length };
}

const floatingSnippets = [
  { text: 'apt install -y php8.3', x: '5%', y: '12%', delay: 0 },
  { text: 'systemctl enable wings', x: '75%', y: '18%', delay: 1.5 },
  { text: 'mariadb -u root', x: '10%', y: '70%', delay: 3 },
  { text: 'docker ps', x: '80%', y: '65%', delay: 2 },
  { text: 'nginx -t', x: '15%', y: '40%', delay: 4 },
  { text: 'redis-cli ping', x: '70%', y: '42%', delay: 1 },
];

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card" data-aos="zoom-in" data-aos-delay="200">
      <div className="count-shimmer text-2xl sm:text-3xl font-bold mb-1">
        {count}{suffix}
      </div>
      <div className="text-xs text-[#8888aa]">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { lines, currentLine, currentColor, currentType, isTyping, scrollRef, isDone } = useTypingWizard(wizardScript);
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-24 pb-8">
      {/* Mouse following glow */}
      <div ref={glowRef} className="mouse-glow" style={{ opacity: 0.6 }} />

      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/8 to-transparent blur-[120px]" />
        <div className="orb-2 absolute top-[40%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-purple-600/8 to-transparent blur-[100px]" />
        <div className="orb-3 absolute bottom-[15%] left-[25%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-green-500/6 to-transparent blur-[110px]" />
        <div className="orb-4 absolute top-[60%] left-[60%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-500/5 to-transparent blur-[100px]" />
        <div className="orb-5 absolute top-[20%] right-[35%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-cyan-400/5 to-transparent blur-[90px]" />
      </div>

      {/* Aurora effect */}
      <div className="aurora top-[-20%] left-[-10%]" />
      <div className="aurora bottom-[-20%] right-[-10%]" style={{ animationDelay: '-7s' }} />

      {/* Grid pattern */}
      <div className="grid-bg" />
      <div className="grid-bg-fine" />
      <div className="hex-grid" />

      {/* Floating code snippets */}
      {floatingSnippets.map((snippet, i) => (
        <div
          key={i}
          className="floating-code absolute hidden lg:block text-[10px] font-mono text-[#00ffff]/10 whitespace-nowrap"
          style={{
            left: snippet.x,
            top: snippet.y,
            animationDelay: `${snippet.delay}s`,
          }}
        >
          {snippet.text}
        </div>
      ))}

      {/* Floating geometric shapes */}
      <div className="absolute top-[15%] right-[10%] pointer-events-none">
        <div className="geo-diamond opacity-40" />
      </div>
      <div className="absolute bottom-[25%] left-[8%] pointer-events-none">
        <div className="geo-circle opacity-40" />
      </div>
      <div className="absolute top-[55%] right-[20%] pointer-events-none">
        <div className="geo-triangle opacity-60" />
      </div>
      <div className="absolute top-[30%] left-[5%] pointer-events-none">
        <div className="geo-ring opacity-50" />
      </div>

      {/* Glow dots */}
      <div className="absolute top-[22%] left-[30%] pointer-events-none">
        <div className="glow-dot" style={{ color: '#00ffff' }} />
      </div>
      <div className="absolute top-[45%] right-[25%] pointer-events-none">
        <div className="glow-dot" style={{ color: '#8800ff', animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-[30%] left-[50%] pointer-events-none">
        <div className="glow-dot" style={{ color: '#00ff88', animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Title with inline logo — NO effects on logo */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Mobile: logo above title — Desktop: logo beside title */}
              <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 lg:gap-4 mb-6">
                <img
                  src="/logo.png"
                  alt="ArkanProjects"
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl flex-shrink-0"
                />
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-center lg:text-left">
                  <span className="inline-flex flex-col sm:flex-row sm:items-center sm:gap-0">
                    <span className="neon-gradient-text">Arkan</span>
                    <span className="text-white/90">Projects</span>
                  </span>
                </h1>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-[#8888aa] max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Pterodactyl All-in-One Installer — Solusi lengkap untuk instalasi{' '}
              <span className="text-[#00ffff]/80">Pterodactyl Panel</span> dan{' '}
              <span className="text-[#00ff88]/80">Wings</span> dalam satu script.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <a
                href="https://arkanprojects.vercel.app/installer/pterodactyl.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-button px-8 py-3.5 text-base font-semibold cursor-pointer w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Mulai Instalasi
                  <ChevronRight className="w-4 h-4" />
                </span>
              </a>
              <a
                href="https://github.com/PixZ19/ArkanProjects"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-button-secondary px-8 py-3.5 text-base font-semibold cursor-pointer w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub
                </span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-3 mt-10 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <StatCounter value={10} label="OS Didukung" />
              <StatCounter value={4} label="Fitur Utama" />
              <StatCounter value={1} label="Perintah" />
            </motion.div>
          </motion.div>

          {/* Right: Interactive Wizard Terminal */}
          <motion.div
            className="w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="terminal-mockup relative">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
                </div>
                <span className="text-xs text-[#8888aa] ml-2 font-mono">arkanprojects — bash</span>
                <div className="ml-auto flex items-center gap-1.5 opacity-40">
                  <Code2 className="w-3 h-3" />
                  <Database className="w-3 h-3" />
                  <Cpu className="w-3 h-3" />
                  <Braces className="w-3 h-3" />
                </div>
              </div>

              {/* Terminal body with scrollable content */}
              <div
                ref={scrollRef}
                className="p-3 sm:p-4 lg:p-5 font-mono text-[10px] sm:text-[11px] lg:text-xs min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] max-h-[350px] sm:max-h-[420px] lg:max-h-[480px] overflow-auto relative"
                style={{
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0,255,255,0.15) transparent',
                }}
              >
                {/* Scan line effect inside terminal */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                  }}
                />

                {/* Completed lines */}
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className="leading-[1.6]"
                    style={{
                      color: line.color || 'transparent',
                      minHeight: '1.6em',
                      opacity: line.visible ? 1 : 0,
                      transform: line.visible ? 'translateY(0)' : 'translateY(4px)',
                      transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                    }}
                  >
                    <span className="whitespace-pre">{line.text || '\u00A0'}</span>
                  </div>
                ))}

                {/* Currently typing line */}
                {isTyping && (
                  <div className="leading-[1.6]" style={{ color: currentColor }}>
                    <span className="whitespace-pre">{currentLine}</span>
                    <span className="typing-cursor" />
                  </div>
                )}

                {/* Show cursor after done */}
                {isDone && (
                  <div className="leading-[1.6] mt-1" style={{ color: '#8888aa' }}>
                    <span className="typing-cursor" />
                  </div>
                )}
              </div>

              {/* Terminal glow effect */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#00ffff]/5 blur-xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
      {/* Bottom padding on mobile for terminal breathing room */}
      <div className="h-8 lg:hidden" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs text-[#8888aa]/50">Gulir ke bawah</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-[#00ffff]/50" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
