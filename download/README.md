# ArkanProjects

Ekosistem deployment tools untuk infrastruktur server. Modular, teruji, dan mudah diskalakan.

## Quick Start

Jalankan installer dengan satu perintah:

```bash
bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)
```

## Struktur Proyek

```
arkanprojects/
├── public/
│   ├── installer/          # Installer scripts (.sh)
│   │   └── pterodactyl.sh  # Pterodactyl Panel + Wings installer v4.1.0
│   ├── themes/             # Blueprint theme files (.blueprint)
│   ├── addons/             # Addon archives (.tar.gz)
│   │   └── scripts/        # Addon bash scripts (.sh)
│   ├── blueprints/         # Extension blueprint files (.blueprint)
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing page (client component)
│   │   ├── layout.tsx      # Root layout + metadata
│   │   ├── globals.css     # Custom dark theme + animations
│   │   └── api/
│   │       └── tools/
│   │           └── route.ts # Auto-discovery API untuk tools
│   ├── components/
│   │   ├── copy-button.tsx  # Tombol copy ke clipboard
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/
│   └── lib/
├── vercel.json              # Routing + Content-Type headers
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Cara Menambah Installer Baru

1. Buat file `.sh` baru di `public/installer/`
2. Tambahkan variabel metadata di bagian atas file:

```bash
readonly TOOL_NAME="Nama Installer Kamu"
readonly TOOL_DESC="Deskripsi singkat apa yang diinstall."
readonly TOOL_BADGE="Stable"  # atau "Beta", "Alpha"
```

3. Commit — website otomatis mendeteksi dan menampilkan installer baru

## Fitur Installer Pterodactyl v4.1.0

### Instalasi
- **Panel** — Pterodactyl Panel lengkap dengan PHP 8.3, Nginx, MariaDB, Redis
- **Wings** — Pterodactyl Wings dengan Docker, systemd service
- **Panel + Wings** — Keduanya sekaligus
- **Uninstall** — Panel atau Wings, termasuk cleanup Docker containers

### Distro yang Didukung
| Distro | Versi |
|--------|-------|
| Ubuntu | 22.04, 24.04 |
| Debian | 10, 11, 12, 13 |
| Rocky Linux | 8, 9 |
| AlmaLinux | 8, 9 |

### Arsitektur
| Platform | Dukungan |
|----------|----------|
| x86_64 (amd64) | ✅ |
| arm64 / aarch64 | ✅ |

### Sistem Blueprint & Extension
- Instal blueprint/extension dari URL atau nama built-in
- Verifikasi otomatis (ZIP archive + conf.yml manifest)
- Parsing identifier, flags, dan konfigurasi dari conf.yml
- Eksekusi install.sh / remove.sh jika flag tersedia
- Database migration otomatis jika dikonfigurasi
- Cache clearing dan permission fixing otomatis

### Sistem Tema (5 Built-in)
- **Nebula** — Theme editor lengkap, sidebar, animasi, efek glass
- **Euphoria** — Theme game server, console copy, player fetch
- **BetterAdmin** — Dark admin panel theme (CSS only)
- **NightAdmin** — Dark admin panel theme (CSS only)
- **Loader** — Client loading animation (dengan migrations)

Semua tema mendukung **self-hosted → upstream fallback** via `ARKAN_BASE_URL`.

### Addons Panel
- Panel addons game server dari MuLTiAcidi (Minecraft, Rust, CS2, FiveM, ARK, GMod, Valheim, dll)
- Backup otomatis sebelum install
- Build frontend dengan yarn/npm
- Migration database otomatis

### Built-in Addons (7)
| Addon | Fungsi |
|-------|--------|
| phpmyadmin | Database management web (port 8081) |
| fail2ban | Proteksi brute-force (SSH + HTTP) |
| backup | Backup otomatis harian dengan cron + rotasi |
| swap | Buat 2GB swap file untuk Docker |
| nodejs | Install Node.js 20.x |
| yarn | Install Yarn package manager |
| addons-panel | Install MuLTiAcidi game server addons |

### Remote Addon Registry
- Mendukung addon dari remote registry (self-hosted → upstream fallback)
- Tinggal tambahkan file `.sh` ke `public/addons/scripts/`

### Keamanan & Jaringan
- **Let's Encrypt SSL** — Otomatis dengan certbot untuk Panel dan Wings
- **Custom SSL** — Assume SSL untuk sertifikat sendiri
- **Firewall** — UFW (Debian/Ubuntu) atau firewalld (Rocky/AlmaLinux)
- **FQDN Verification** — Cek DNS sebelum konfigurasi SSL

### Mode Operasi
- **Interaktif** — Wizard langkah demi langkah (default)
- **Headless / CI** — CLI flags untuk non-interactive mode
- **Debug** — `--debug` untuk verbose output (`set -x`)

### CLI Flags
```
--panel                    Install Panel saja
--wings                    Install Wings saja
--both                     Install Panel + Wings
--install-theme <name>     Install tema (nama atau URL)
--install-blueprint <url>  Install blueprint dari URL
--install-addons-panel     Install addons panel
--addon <name>             Load addon
--list-themes              Daftar tema tersedia
--list-addons              Daftar addon tersedia
--uninstall-panel          Hapus Panel
--uninstall-wings          Hapus Wings
--debug                    Verbose output
--help                     Tampilkan bantuan
```

### Fallback & Redundancy
- **ARKAN_BASE_URL** — Semua asset (tema, addon, blueprint) dilayani dari satu URL
- **Upstream fallback** — Jika self-hosted tidak tersedia, otomatis cek upstream repo
- **Override** — `ARKAN_BASE_URL=https://domain-kamu.com bash pterodactyl.sh`

### Logging & Rollback
- Log lengkap ke `/var/log/arkan-pterodactyl-installer.log`
- Rollback otomatis jika instalasi gagal (trap EXIT)
- Konfirmasi sebelum setiap operasi destruktif

## Website

### Endpoint API
```
GET /api/tools    → Daftar semua installer (auto-scan dari /installer/)
```

Response:
```json
[
  {
    "name": "pterodactyl",
    "title": "Pterodactyl Installer",
    "desc": "Panel + Wings deployment with blueprint support...",
    "cmd": "bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)",
    "badge": "Stable"
  }
]
```

### Static File Serving
```
/installer/*.sh           → text/plain (inline, bukan download)
/themes/*.blueprint        → application/octet-stream
/addons/*.tar.gz           → application/octet-stream
/addons/scripts/*.sh       → text/plain
/blueprints/*.blueprint    → application/octet-stream
```

## Deploy ke Vercel

```bash
npm install
npm run build
vercel deploy
```

## Lisensi

MIT License — © 2025 ArkanProjects contributors
