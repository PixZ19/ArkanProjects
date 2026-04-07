#!/bin/bash
set -euo pipefail

# ============================================================================
#  ArkanProjects — Pterodactyl All-in-One Installer
#  Version: 1.0.0
#
#  Installasi Pterodactyl Panel & Wings dalam satu script.
#  Dikembangkan berdasarkan analisis mendalam dari:
#    - pterodactyl-installer/pterodactyl-installer
#    - HemanRathore/pterodactyl-installer
#    - MuLTiAcidi/pterodactyl-addons
#
#  Cara menjalankan:
#    bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)
#
#  Lisensi: GNU General Public License v3.0
#  Proyek: https://github.com/PixZ19/ArkanProjects
# ============================================================================

# ======================== VARIABEL GLOBAL ========================

export INSTALLER_VERSION="1.0.0"
export LOG_FILE="/var/log/arkanprojects-installer.log"
export INSTALL_START_TIME=$(date +%s)
export TOTAL_STEPS=0
export CURRENT_STEP=0

# ======================== KONFIGURASI WARNA ========================

C_RESET='\033[0m'
C_BOLD='\033[1m'
C_DIM='\033[2m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_BLUE='\033[0;34m'
C_MAGENTA='\033[0;35m'
C_CYAN='\033[0;36m'
C_WHITE='\033[1;37m'

C_NEON_GREEN='\033[38;2;0;255;136m'
C_NEON_CYAN='\033[38;2;0;255;255m'
C_NEON_PURPLE='\033[38;2;136;0;255m'
C_NEON_PINK='\033[38;2;255;0;136m'

# ======================== VARIABEL SISTEM ========================

export OS=""
export OS_VER=""
export OS_VER_MAJOR=""
export CPU_ARCHITECTURE=""
export ARCH=""
export SUPPORTED=false

export PANEL_DL_URL="https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz"
export WINGS_DL_BASE_URL="https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_"
export MARIADB_URL="https://downloads.mariadb.com/MariaDB/mariadb_repo_setup"

export PTERODACTYL_PANEL_VERSION=""
export PTERODACTYL_WINGS_VERSION=""

export DEBIAN_FRONTEND=noninteractive

# ======================== VARIABEL INSTALASI ========================

export FQDN=""
export MYSQL_DB=""
export MYSQL_USER=""
export MYSQL_PASSWORD=""
export DB_ROOT_PASSWORD=""
export TIMEZONE=""
export EMAIL=""
export USER_EMAIL=""
export USER_USERNAME=""
export USER_FIRSTNAME=""
export USER_LASTNAME=""
export USER_PASSWORD=""
export ASSUME_SSL=false
export CONFIGURE_LETSENCRYPT=false
export CONFIGURE_FIREWALL=false
export INSTALL_PANEL=false
export INSTALL_WINGS=false
export INSTALL_MARIADB_WINGS=false
export CONFIGURE_DBHOST=false
export CONFIGURE_DB_FIREWALL=false
export MYSQL_DBHOST_HOST="127.0.0.1"
export MYSQL_DBHOST_USER="pterodactyluser"
export MYSQL_DBHOST_PASSWORD=""
export EMAIL_WINGS=""
export USE_CANARY=false

# ======================== EMAIL VALIDATION ========================

email_regex="^(([A-Za-z0-9]+((\.|\-|\_|\+)?[A-Za-z0-9]?)*[A-Za-z0-9]+)|[A-Za-z0-9]+)@(([A-Za-z0-9]+)+((\.|\-|\_)?([A-Za-z0-9]+)+)*)+\.([A-Za-z]{2,})+$"

# ======================== PASSWORD GENERATOR ========================

password_charset='A-Za-z0-9!"#%&()*+,-./:;<=>?@[\]^_`{|}~'

gen_passwd() {
    local length=$1
    local password=""
    while [ ${#password} -lt "$length" ]; do
        password=$(echo "$password""$(head -c 100 /dev/urandom | LC_ALL=C tr -dc "$password_charset")" | fold -w "$length" | head -n 1)
    done
    echo "$password"
}

# ======================== FUNGSI UI ========================

print_banner() {
    clear
    echo -e "${C_NEON_CYAN}${C_BOLD}"
    cat << 'BANNER'
     _    _       _       ___  ____   ____ _            _ _   _      _
    | |  | |     | |     / _ \/ ___| / ___| |__   __ _  | | | | ___| |_ __
    | |  | |_ __ | |__  | | | \___ \| |   | '_ \ / _` | | | | |/ _ \ | '_ \
    | |/\| | '_ \| '_ \ | |_| |___) | |___| | | | (_| | | |_| |  __/| | | |
    \  /\  / | | | | | | \___/|____/ \____|_| |_|\__,_|  \___/ \___||_| |_|
     \/  \/|_| |_|_| |_|
BANNER
    echo -e "${C_RESET}"
    echo -e "${C_DIM}     ───────────────────────────────────────────────────────${C_RESET}"
    echo -e "${C_WHITE}     Pterodactyl All-in-One Installer  v${INSTALLER_VERSION}${C_RESET}"
    echo -e "${C_DIM}     https://github.com/PixZ19/ArkanProjects${C_RESET}"
    echo -e "${C_DIM}     ───────────────────────────────────────────────────────${C_RESET}"
    echo ""
}

print_divider() {
    echo -e "${C_DIM}  ──────────────────────────────────────────────────────────────${C_RESET}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${C_NEON_CYAN}${C_BOLD}  ┌──────────────────────────────────────────────────────────┐${C_RESET}"
    echo -e "${C_NEON_CYAN}${C_BOLD}  │  $1${C_RESET}"
    echo -e "${C_NEON_CYAN}${C_BOLD}  └──────────────────────────────────────────────────────────┘${C_RESET}"
    echo ""
}

step_header() {
    local step_num=$1
    local total_num=$2
    local step_desc=$3
    CURRENT_STEP=$step_num
    TOTAL_STEPS=$total_num
    local progress="[$step_num/$total_num]"
    echo ""
    echo -e "${C_NEON_GREEN}${C_BOLD}  ${progress} ${C_WHITE}${step_desc}${C_RESET}"
    echo -e "${C_DIM}  ──────────────────────────────────────────────────${C_RESET}"
}

info() {
    echo -e "${C_NEON_CYAN}  [i]${C_RESET} ${C_WHITE}$1${C_RESET}"
}

success() {
    echo -e "${C_NEON_GREEN}${C_BOLD}  [ok]${C_RESET} ${C_GREEN}$1${C_RESET}"
    echo "$1" >> "$LOG_FILE" 2>/dev/null || true
}

warn() {
    echo -e "${C_YELLOW}${C_BOLD}  [!]${C_RESET} ${C_YELLOW}$1${C_RESET}"
    echo "[WARNING] $1" >> "$LOG_FILE" 2>/dev/null || true
}

error_exit() {
    echo -e "${C_RED}${C_BOLD}  [x]${C_RESET} ${C_RED}$1${C_RESET}"
    echo "[ERROR] $1" >> "$LOG_FILE" 2>/dev/null || true
    exit 1
}

confirm_prompt() {
    echo -e -n "${C_NEON_PURPLE}  [?]${C_RESET} ${C_WHITE}$1${C_RESET} "
}

log() {
    echo "[LOG] $1" >> "$LOG_FILE" 2>/dev/null || true
}

print_elapsed() {
    local end_time=$(date +%s)
    local elapsed=$((end_time - INSTALL_START_TIME))
    local minutes=$((elapsed / 60))
    local seconds=$((elapsed % 60))
    echo -e "${C_DIM}  Waktu pemasangan: ${C_WHITE}${minutes}m ${seconds}s${C_RESET}"
}

# ======================== VALIDASI ========================

valid_email() {
    [[ $1 =~ ${email_regex} ]]
}

invalid_ip() {
    ip route get "$1" >/dev/null 2>&1
    echo $?
}

fn_exists() {
    declare -F "$1" >/dev/null
}

array_contains_element() {
    local e match="$1"
    shift
    for e; do [[ "$e" == "$match" ]] && return 0; done
    return 1
}

# ======================== INPUT USER ========================

required_input() {
    local __resultvar=$1
    local result=''

    while [ -z "$result" ]; do
        echo -e -n "       ${C_NEON_CYAN}>${C_RESET} "
        read -r result
        [ -z "$result" ] && [ -n "${4:-}" ] && result="$4"
        [ -z "$result" ] && [ -n "${3:-}" ] && warn "$3"
    done

    eval "$__resultvar="'$result'""
}

email_input() {
    local __resultvar=$1
    local result=''

    while ! valid_email "$result"; do
        echo -e -n "       ${C_NEON_CYAN}>${C_RESET} "
        read -r result
        valid_email "$result" || warn "Email tidak valid atau kosong"
    done

    eval "$__resultvar="'$result'""
}

password_input() {
    local __resultvar=$1
    local result=''
    local default="${4:-}"

    while [ -z "$result" ]; do
        echo -e -n "       ${C_NEON_CYAN}>${C_RESET} "
        while IFS= read -r -s -n1 char; do
            [[ -z $char ]] && { printf '\n'; break; }
            if [[ $char == $'\x7f' ]]; then
                if [ -n "$result" ]; then
                    result=${result%?}
                    printf '\b \b'
                fi
            else
                result+=$char
                printf '*'
            fi
        done
        [ -z "$result" ] && [ -n "$default" ] && result="$default"
        [ -z "$result" ] && warn "$3"
    done

    eval "$__resultvar="'$result'""
}

confirm_yes_no() {
    local __resultvar=$1
    local result=''

    while [ -z "$result" ]; do
        echo -e -n "       ${C_NEON_CYAN}>${C_RESET} "
        read -r result
        case "$result" in
            [Yy]*) result="true" ;;
            [Nn]*) result="false" ;;
            "") result="false" ;;
            *) warn "Masukkan y atau n"; result="" ;;
        esac
    done

    eval "$__resultvar="'$result'""
}

# ======================== DETEKSI OS ========================

detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$(echo "$ID" | awk '{print tolower($0)}')
        OS_VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si | awk '{print tolower($0)}')
        OS_VER=$(lsb_release -sr)
    elif [ -f /etc/debian_version ]; then
        OS="debian"
        OS_VER=$(cat /etc/debian_version)
    else
        error_exit "Tidak dapat mendeteksi sistem operasi."
    fi

    OS=$(echo "$OS" | awk '{print tolower($0)}')
    OS_VER_MAJOR=$(echo "$OS_VER" | cut -d. -f1)
    CPU_ARCHITECTURE=$(uname -m)

    case "$CPU_ARCHITECTURE" in
        x86_64)  ARCH=amd64 ;;
        arm64|aarch64) ARCH=arm64 ;;
        *) error_exit "Arsitektur $CPU_ARCHITECTURE tidak didukung. Hanya x86_64 dan arm64." ;;
    esac

    case "$OS" in
        ubuntu)
            [ "$OS_VER_MAJOR" == "22" ] && SUPPORTED=true
            [ "$OS_VER_MAJOR" == "24" ] && SUPPORTED=true
            export DEBIAN_FRONTEND=noninteractive
            ;;
        debian)
            [ "$OS_VER_MAJOR" == "10" ] && SUPPORTED=true
            [ "$OS_VER_MAJOR" == "11" ] && SUPPORTED=true
            [ "$OS_VER_MAJOR" == "12" ] && SUPPORTED=true
            [ "$OS_VER_MAJOR" == "13" ] && SUPPORTED=true
            export DEBIAN_FRONTEND=noninteractive
            ;;
        rocky|almalinux)
            [ "$OS_VER_MAJOR" == "8" ] && SUPPORTED=true
            [ "$OS_VER_MAJOR" == "9" ] && SUPPORTED=true
            ;;
        *)
            SUPPORTED=false
            ;;
    esac

    if [ "$SUPPORTED" == false ]; then
        error_exit "$OS $OS_VER tidak didukung. Sistem yang didukung: Ubuntu 22/24, Debian 10-13, Rocky 8/9, AlmaLinux 8/9."
    fi

    info "Sistem operasi terdeteksi: ${C_WHITE}$OS $OS_VER ($ARCH)${C_RESET}"
    log "OS: $OS $OS_VER, ARCH: $ARCH"
}

# ======================== CEK ROOT ========================

check_root() {
    if [[ $EUID -ne 0 ]]; then
        error_exit "Script ini harus dijalankan sebagai root. Gunakan: sudo bash <(curl -s https://arkanprojects.vercel.app/installer/pterodactyl.sh)"
    fi
}

# ======================== CEK DEPENDENSI AWAL ========================

check_prerequisites() {
    if ! [ -x "$(command -v curl)" ]; then
        warn "curl tidak ditemukan. Menginstal curl..."
        case "$OS" in
            ubuntu|debian) apt-get update -qq && apt-get install -y -qq curl ;;
            rocky|almalinux) dnf install -y -q curl ;;
        esac
    fi
    log "Prerequisites check passed"
}

# ======================== VERSI TERBARU ========================

get_latest_release() {
    curl -sL "https://api.github.com/repos/$1/releases/latest" 2>/dev/null | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/'
}

get_latest_versions() {
    info "Mengambil informasi versi terbaru..."
    PTERODACTYL_PANEL_VERSION=$(get_latest_release "pterodactyl/panel")
    PTERODACTYL_WINGS_VERSION=$(get_latest_release "pterodactyl/wings")
    log "Panel: $PTERODACTYL_PANEL_VERSION, Wings: $PTERODACTYL_WINGS_VERSION"
}

# ======================== PACKAGE MANAGER ========================

update_repos() {
    local quiet="${1:-false}"
    local args=""
    [[ "$quiet" == true ]] && args="-qq"

    case "$OS" in
        ubuntu|debian)
            info "Memperbarui repository..."
            apt-get update -y $args || warn "Gagal memperbarui repository."
            ;;
        rocky|almalinux)
            info "Repository otomatis diperbarui di $OS."
            ;;
    esac
}

install_packages() {
    local packages="$1"
    local quiet="${2:-false}"
    local args=""

    if [[ $quiet == true ]]; then
        case "$OS" in
            ubuntu|debian) args="-qq" ;;
            *) args="-q" ;;
        esac
    fi

    case "$OS" in
        ubuntu|debian) eval apt-get -y $args install "$packages" ;;
        rocky|almalinux) eval dnf -y $args install "$packages" ;;
    esac
}

# ======================== FIREWALL ========================

install_firewall() {
    case "$OS" in
        ubuntu|debian)
            if ! [ -x "$(command -v ufw)" ]; then
                update_repos true
                install_packages "ufw" true
            fi
            ufw --force enable
            success "UFW diaktifkan"
            ;;
        rocky|almalinux)
            if ! [ -x "$(command -v firewall-cmd)" ]; then
                install_packages "firewalld" true
            fi
            systemctl --now enable firewalld >/dev/null 2>&1
            success "FirewallD diaktifkan"
            ;;
    esac
}

firewall_allow_ports() {
    local ports="$1"
    case "$OS" in
        ubuntu|debian)
            for port in $ports; do
                ufw allow "$port" >/dev/null 2>&1
            done
            ufw --force reload >/dev/null 2>&1
            ;;
        rocky|almalinux)
            for port in $ports; do
                firewall-cmd --zone=public --add-port="$port"/tcp --permanent --quiet >/dev/null 2>&1
            done
            firewall-cmd --reload -q >/dev/null 2>&1
            ;;
    esac
}

# ======================== DATABASE ========================

create_db_user() {
    local db_user="$1"
    local db_pass="$2"
    local db_host="${3:-127.0.0.1}"

    info "Membuat user database $db_user..."
    mariadb -u root -e "CREATE USER '$db_user'@'$db_host' IDENTIFIED BY '$db_pass';" 2>/dev/null
    mariadb -u root -e "FLUSH PRIVILEGES;" 2>/dev/null
    success "User database $db_user dibuat"
}

grant_all_privileges() {
    local db_name="$1"
    local db_user="$2"
    local db_host="${3:-127.0.0.1}"

    mariadb -u root -e "GRANT ALL PRIVILEGES ON $db_name.* TO '$db_user'@'$db_host' WITH GRANT OPTION;" 2>/dev/null
    mariadb -u root -e "FLUSH PRIVILEGES;" 2>/dev/null
}

create_db() {
    local db_name="$1"
    local db_user="$2"
    local db_host="${3:-127.0.0.1}"

    info "Membuat database $db_name..."
    mariadb -u root -e "CREATE DATABASE $db_name;" 2>/dev/null
    grant_all_privileges "$db_name" "$db_user" "$db_host"
    success "Database $db_name dibuat"
}

# ======================== VIRTUALIZATION CHECK (WINGS) ========================

check_virt() {
    info "Memeriksa virtualisasi..."
    update_repos true
    install_packages "virt-what" true
    export PATH="$PATH:/sbin:/usr/sbin"

    local virt_serv
    virt_serv=$(virt-what 2>/dev/null) || true

    case "$virt_serv" in
        *openvz*|*lxc*)
            warn "Tipe virtualisasi tidak didukung terdeteksi: $virt_serv"
            warn "Docker mungkin tidak berfungsi. Lanjutkan dengan risiko sendiri."
            echo -e -n "       ${C_NEON_CYAN}>${C_RESET} Lanjutkan? (y/N): "
            read -r choice
            [[ ! "$choice" =~ [Yy] ]] && error_exit "Instalasi dibatalkan."
            ;;
        *)
            [ -n "$virt_serv" ] && info "Virtualisasi: $virt_serv terdeteksi."
            ;;
    esac

    if uname -r | grep -q "xxxx" 2>/dev/null; then
        error_exit "Kernel tidak didukung terdeteksi."
    fi

    success "Sistem kompatibel dengan Docker"
}

# ======================== FQDN / DNS VERIFICATION ========================

verify_fqdn() {
    local fqdn="$1"
    info "Memverifikasi DNS untuk $fqdn..."

    local check_url="https://checkip.pterodactyl-installer.se"
    local dns_server="8.8.8.8"

    case "$OS" in
        ubuntu|debian) install_packages "dnsutils" true ;;
        rocky|almalinux) install_packages "bind-utils" true ;;
    esac

    local server_ip dns_record
    server_ip=$(curl -4 -s "$check_url" 2>/dev/null) || true
    dns_record=$(dig +short @"$dns_server" "$fqdn" 2>/dev/null | tail -n1) || true

    if [ "${server_ip}" != "${dns_record}" ]; then
        warn "DNS record ($dns_record) tidak cocok dengan IP server ($server_ip)."
        warn "Pastikan FQDN $fqdn mengarah ke IP server ini."
        warn "Jika menggunakan Cloudflare, nonaktifkan proxy atau keluar dari Let's Encrypt."
        echo -e -n "       ${C_NEON_CYAN}>${C_RESET} Lanjutkan? (y/N): "
        read -r override
        [[ ! "$override" =~ [Yy] ]] && error_exit "FQDN tidak valid atau DNS record salah."
    fi

    success "DNS terverifikasi untuk $fqdn"
}

# ======================== INSTALASI PANEL ========================

install_panel() {
    local panel_steps=8

    step_header 1 "$panel_steps" "Menginstal dependensi untuk $OS $OS_VER..."
    log "=== MULAI INSTALASI PANEL ==="

    # Firewall
    if [ "$CONFIGURE_FIREWALL" == true ]; then
        install_firewall
        info "Membuka port 22 (SSH), 80 (HTTP), 443 (HTTPS)..."
        firewall_allow_ports "22 80 443"
        success "Port firewall dibuka"
    fi

    case "$OS" in
        ubuntu|debian)
            if [ "$OS" == "ubuntu" ]; then
                install_packages "software-properties-common apt-transport-https ca-certificates gnupg"
                add-apt-repository universe -y >/dev/null 2>&1
                LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php >/dev/null 2>&1
            else
                install_packages "dirmngr ca-certificates apt-transport-https lsb-release"
                curl -o /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg 2>/dev/null
                echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list >/dev/null
            fi
            update_repos
            install_packages "php8.3 php8.3-{cli,common,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} mariadb-common mariadb-server mariadb-client nginx redis-server zip unzip tar git cron"
            [ "$CONFIGURE_LETSENCRYPT" == true ] && install_packages "certbot python3-certbot-nginx"
            ;;
        rocky|almalinux)
            install_packages "policycoreutils selinux-policy selinux-policy-targeted setroubleshoot-server setools setools-console mcstrans"
            install_packages "epel-release http://rpms.remirepo.net/enterprise/remi-release-$OS_VER_MAJOR.rpm"
            dnf module enable -y php:remi-8.3 >/dev/null 2>&1
            install_packages "php php-{common,fpm,cli,json,mysqlnd,mcrypt,gd,mbstring,pdo,zip,bcmath,dom,opcache,posix} mariadb mariadb-server nginx redis zip unzip tar git cronie"
            [ "$CONFIGURE_LETSENCRYPT" == true ] && install_packages "certbot python3-certbot-nginx"
            setsebool -P httpd_can_network_connect 1 2>/dev/null || true
            setsebool -P httpd_execmem 1 2>/dev/null || true
            setsebool -P httpd_unified 1 2>/dev/null || true
            ;;
    esac

    # Aktifkan service
    case "$OS" in
        ubuntu|debian)
            systemctl enable redis-server >/dev/null 2>&1
            systemctl start redis-server >/dev/null 2>&1
            ;;
        rocky|almalinux)
            systemctl enable redis >/dev/null 2>&1
            systemctl start redis >/dev/null 2>&1
            ;;
    esac
    systemctl enable nginx >/dev/null 2>&1
    systemctl enable mariadb >/dev/null 2>&1
    systemctl start mariadb >/dev/null 2>&1

    success "Dependensi terinstal"

    step_header 2 "$panel_steps" "Menginstal Composer..."
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer 2>&1 | tail -1
    success "Composer terinstal"

    step_header 3 "$panel_steps" "Mengunduh file Pterodactyl Panel v$PTERODACTYL_PANEL_VERSION..."
    mkdir -p /var/www/pterodactyl
    cd /var/www/pterodactyl || error_exit "Gagal masuk ke direktori instalasi"
    curl -Lo panel.tar.gz "$PANEL_DL_URL" 2>/dev/null
    tar -xzf panel.tar.gz
    rm -f panel.tar.gz
    chmod -R 755 storage/* bootstrap/cache/
    cp .env.example .env
    success "File panel terunduh"

    step_header 4 "$panel_steps" "Menginstal dependensi Composer..."
    case "$OS" in
        rocky|almalinux) export PATH=/usr/local/bin:$PATH ;;
    esac
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction 2>&1 | tail -3
    success "Dependensi Composer terinstal"

    step_header 5 "$panel_steps" "Mengkonfigurasi database..."
    create_db_user "$MYSQL_USER" "$MYSQL_PASSWORD"
    create_db "$MYSQL_DB" "$MYSQL_USER"
    success "Database dikonfigurasi"

    step_header 6 "$panel_steps" "Mengkonfigurasi environment Panel..."
    local app_url="http://$FQDN"
    [ "$ASSUME_SSL" == true ] || [ "$CONFIGURE_LETSENCRYPT" == true ] && app_url="https://$FQDN"

    php artisan key:generate --force 2>/dev/null

    php artisan p:environment:setup \
        --author="$EMAIL" \
        --url="$app_url" \
        --timezone="$TIMEZONE" \
        --cache="redis" \
        --session="redis" \
        --queue="redis" \
        --redis-host="localhost" \
        --redis-pass="null" \
        --redis-port="6379" \
        --settings-ui=true 2>/dev/null

    php artisan p:environment:database \
        --host="127.0.0.1" \
        --port="3306" \
        --database="$MYSQL_DB" \
        --username="$MYSQL_USER" \
        --password="$MYSQL_PASSWORD" 2>/dev/null

    php artisan migrate --seed --force 2>/dev/null

    php artisan p:user:make \
        --email="$USER_EMAIL" \
        --username="$USER_USERNAME" \
        --name-first="$USER_FIRSTNAME" \
        --name-last="$USER_LASTNAME" \
        --password="$USER_PASSWORD" \
        --admin=1 2>/dev/null

    success "Environment Panel dikonfigurasi"

    step_header 7 "$panel_steps" "Mengkonfigurasi Nginx dan service..."
    # Permission folder
    case "$OS" in
        debian|ubuntu) chown -R www-data:www-data ./* ;;
        rocky|almalinux) chown -R nginx:nginx ./* ;;
    esac

    # Nginx config
    local dl_file="nginx.conf"
    [ "$ASSUME_SSL" == true ] && [ "$CONFIGURE_LETSENCRYPT" == false ] && dl_file="nginx_ssl.conf"

    local php_socket config_avail config_enabl
    case "$OS" in
        ubuntu|debian)
            php_socket="/run/php/php8.3-fpm.sock"
            config_avail="/etc/nginx/sites-available"
            config_enabl="/etc/nginx/sites-enabled"
            ;;
        rocky|almalinux)
            php_socket="/var/run/php-fpm/pterodactyl.sock"
            config_avail="/etc/nginx/conf.d"
            config_enabl="$config_avail"
            ;;
    esac

    rm -f "$config_enabl"/default 2>/dev/null || true

    # Buat config nginx inline
    if [ "$dl_file" == "nginx_ssl.conf" ]; then
        cat > "$config_avail"/pterodactyl.conf << NGINXSSL
server {
    listen 80;
    server_name $FQDN;
    return 301 https://\$scheme://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $FQDN;

    root /var/www/pterodactyl/public;
    index index.html index.htm index.php;
    charset utf-8;

    ssl_certificate /etc/letsencrypt/live/$FQDN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$FQDN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/pterodactyl.app-error.log error;

    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php\$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)\$;
        fastcgi_pass $php_socket;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param HTTP_PROXY "";
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINXSSL
    else
        cat > "$config_avail"/pterodactyl.conf << NGINX
server {
    listen 80;
    server_name $FQDN;

    root /var/www/pterodactyl/public;
    index index.html index.htm index.php;
    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/pterodactyl.app-error.log error;

    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php\$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)\$;
        fastcgi_pass $php_socket;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param HTTP_PROXY "";
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX
    fi

    case "$OS" in
        ubuntu|debian) ln -sf "$config_avail"/pterodactyl.conf "$config_enabl"/pterodactyl.conf ;;
    esac

    [ "$ASSUME_SSL" == false ] && [ "$CONFIGURE_LETSENCRYPT" == false ] && systemctl restart nginx

    # Cronjob
    (crontab -l 2>/dev/null | grep -v "pterodactyl"; echo "* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1") | crontab -

    # Pteroq service
    local service_user="www-data"
    [ "$OS" == "rocky" ] || [ "$OS" == "almalinux" ] && service_user="nginx"

    cat > /etc/systemd/system/pteroq.service << PTQEOF
[Unit]
Description=Pterodactyl Queue Worker
After=redis-server.service

[Service]
User=$service_user
Group=$service_user
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
PTQEOF

    systemctl daemon-reload
    systemctl enable pteroq.service >/dev/null 2>&1
    systemctl start pteroq 2>/dev/null

    success "Nginx dan service dikonfigurasi"

    # SSL
    step_header 8 "$panel_steps" "Konfigurasi SSL..."
    if [ "$CONFIGURE_LETSENCRYPT" == true ]; then
        info "Mengkonfigurasi Let's Encrypt..."
        local ssl_failed=false
        certbot --nginx --redirect --no-eff-email --email "$EMAIL" -d "$FQDN" 2>/dev/null || ssl_failed=true

        if [ ! -d "/etc/letsencrypt/live/$FQDN/" ] || [ "$ssl_failed" == true ]; then
            warn "Gagal mendapatkan sertifikat Let's Encrypt."
        else
            success "Sertifikat SSL berhasil dikonfigurasi"
        fi
    else
        info "SSL dilewati sesuai pilihan."
    fi

    log "=== INSTALASI PANEL SELESAI ==="
}

# ======================== INSTALASI WINGS ========================

install_wings() {
    local wings_steps=5

    step_header 1 "$wings_steps" "Menginstal dependensi untuk $OS $OS_VER..."
    log "=== MULAI INSTALASI WINGS ==="

    if [ "$CONFIGURE_FIREWALL" == true ]; then
        install_firewall
        info "Membuka port 22 (SSH), 8080 (Wings), 2022 (SFTP)..."
        firewall_allow_ports "22 8080 2022"
        [ "$CONFIGURE_LETSENCRYPT" == true ] && firewall_allow_ports "80 443"
        [ "$CONFIGURE_DB_FIREWALL" == true ] && firewall_allow_ports "3306"
        success "Port firewall dibuka"
    fi

    case "$OS" in
        ubuntu|debian)
            install_packages "ca-certificates gnupg lsb-release"
            mkdir -p /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/debian/gpg 2>/dev/null | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg 2>/dev/null
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list >/dev/null
            ;;
        rocky|almalinux)
            install_packages "dnf-utils"
            dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo >/dev/null 2>&1
            install_packages "epel-release" 2>/dev/null || true
            install_packages "device-mapper-persistent-data lvm2"
            ;;
    esac

    update_repos
    install_packages "docker-ce docker-ce-cli containerd.io"

    [ "$INSTALL_MARIADB_WINGS" == true ] && install_packages "mariadb-server"
    [ "$CONFIGURE_LETSENCRYPT" == true ] && install_packages "certbot"

    systemctl enable docker >/dev/null 2>&1
    systemctl start docker

    success "Dependensi terinstal"

    step_header 2 "$wings_steps" "Mengunduh Pterodactyl Wings v$PTERODACTYL_WINGS_VERSION..."
    mkdir -p /etc/pterodactyl
    curl -L -o /usr/local/bin/wings "$WINGS_DL_BASE_URL$ARCH" 2>/dev/null
    chmod u+x /usr/local/bin/wings
    success "Wings terunduh"

    step_header 3 "$wings_steps" "Mengkonfigurasi systemd service..."
    cat > /etc/systemd/system/wings.service << WINGSEOF
[Unit]
Description=Pterodactyl Wings Daemon
After=docker.service
Requires=docker.service
PartOf=docker.service

[Service]
User=root
WorkingDirectory=/etc/pterodactyl
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/local/bin/wings
Restart=on-failure
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
WINGSEOF

    systemctl daemon-reload
    systemctl enable wings >/dev/null 2>&1

    success "Service Wings dikonfigurasi"

    step_header 4 "$wings_steps" "Konfigurasi database host..."
    if [ "$CONFIGURE_DBHOST" == true ]; then
        if [ "$INSTALL_MARIADB_WINGS" == true ]; then
            systemctl enable mariadb >/dev/null 2>&1
            systemctl start mariadb
        fi

        create_db_user "$MYSQL_DBHOST_USER" "$MYSQL_DBHOST_PASSWORD" "$MYSQL_DBHOST_HOST"
        grant_all_privileges "*" "$MYSQL_DBHOST_USER" "$MYSQL_DBHOST_HOST"

        if [ "$MYSQL_DBHOST_HOST" != "127.0.0.1" ]; then
            info "Mengubah bind address MySQL..."
            case "$OS" in
                debian|ubuntu) sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mariadb.conf.d/50-server.cnf 2>/dev/null || true ;;
                rocky|almalinux) sed -ne 's/^#bind-address=0.0.0.0$/bind-address=0.0.0.0/' /etc/my.cnf.d/mariadb-server.cnf 2>/dev/null || true ;;
            esac
            systemctl restart mariadb 2>/dev/null || systemctl restart mysqld 2>/dev/null || true
        fi
        success "Database host dikonfigurasi"
    else
        info "Konfigurasi database host dilewati."
    fi

    step_header 5 "$wings_steps" "Konfigurasi SSL..."
    if [ "$CONFIGURE_LETSENCRYPT" == true ] && [ -n "$FQDN" ]; then
        info "Mengkonfigurasi Let's Encrypt untuk Wings..."
        systemctl stop nginx 2>/dev/null || true
        local ssl_failed=false
        certbot certonly --no-eff-email --email "$EMAIL_WINGS" --standalone -d "$FQDN" 2>/dev/null || ssl_failed=true
        systemctl start nginx 2>/dev/null || true

        if [ ! -d "/etc/letsencrypt/live/$FQDN/" ] || [ "$ssl_failed" == true ]; then
            warn "Gagal mendapatkan sertifikat SSL untuk Wings."
        else
            success "SSL Wings dikonfigurasi"
        fi
    else
        info "SSL Wings dilewati."
    fi

    log "=== INSTALASI WINGS SELESAI ==="
}

# ======================== MENU UTAMA ========================

main_menu() {
    echo -e "${C_NEON_PURPLE}${C_BOLD}  PILIHAN INSTALASI${C_RESET}"
    echo ""
    echo -e "  ${C_NEON_GREEN}1${C_RESET}  ${C_WHITE}Instal Panel saja${C_RESET}"
    echo -e "  ${C_NEON_GREEN}2${C_RESET}  ${C_WHITE}Instal Wings saja${C_RESET}"
    echo -e "  ${C_NEON_GREEN}3${C_RESET}  ${C_WHITE}Instal Panel + Wings (satu mesin)${C_RESET}"
    echo ""

    local action=""
    while [ -z "$action" ]; do
        echo -e -n "  ${C_NEON_CYAN}>${C_RESET} Pilih [1-3]: "
        read -r action

        case "$action" in
            1) INSTALL_PANEL=true ;;
            2) INSTALL_WINGS=true ;;
            3) INSTALL_PANEL=true; INSTALL_WINGS=true ;;
            *) warn "Pilihan tidak valid. Masukkan 1, 2, atau 3."; action="" ;;
        esac
    done
}

# ======================== INPUT PANEL ========================

panel_input() {
    print_section "KONFIGURASI PANEL"

    info "Konfigurasi database"
    info "Kredensial ini digunakan untuk komunikasi antara MySQL dan Panel."

    MYSQL_DB="-"
    while [[ "$MYSQL_DB" == *"-"* ]]; do
        echo -e "  ${C_WHITE}Nama database${C_RESET} (panel): "
        required_input MYSQL_DB "" "Nama database tidak boleh kosong" "panel"
        [[ "$MYSQL_DB" == *"-"* ]] && warn "Nama database tidak boleh mengandung tanda hubung"
    done

    MYSQL_USER="-"
    while [[ "$MYSQL_USER" == *"-"* ]]; do
        echo -e "  ${C_WHITE}Username database${C_RESET} (pterodactyl): "
        required_input MYSQL_USER "" "Username tidak boleh kosong" "pterodactyl"
        [[ "$MYSQL_USER" == *"-"* ]] && warn "Username tidak boleh mengandung tanda hubung"
    done

    local rand_pw
    rand_pw=$(gen_passwd 64)
    echo -e "  ${C_WHITE}Password database${C_RESET} (tekan Enter untuk auto-generate): "
    password_input MYSQL_PASSWORD "" "Password tidak boleh kosong" "$rand_pw"

    echo -e "  ${C_WHITE}Zona waktu${C_RESET} (Asia/Jakarta): "
    required_input TIMEZONE "" "" "Asia/Jakarta"

    echo -e "  ${C_WHITE}Email untuk SSL dan Panel${C_RESET}: "
    email_input EMAIL "" "Email tidak valid"

    print_divider

    info "Akun admin awal"
    echo -e "  ${C_WHITE}Email admin${C_RESET}: "
    email_input USER_EMAIL "" "Email admin tidak valid"
    echo -e "  ${C_WHITE}Username admin${C_RESET}: "
    required_input USER_USERNAME "" "Username tidak boleh kosong"
    echo -e "  ${C_WHITE}Nama depan${C_RESET}: "
    required_input USER_FIRSTNAME "" "Nama depan tidak boleh kosong"
    echo -e "  ${C_WHITE}Nama belakang${C_RESET}: "
    required_input USER_LASTNAME "" "Nama belakang tidak boleh kosong"
    echo -e "  ${C_WHITE}Password admin${C_RESET}: "
    password_input USER_PASSWORD "" "Password admin tidak boleh kosong"

    print_divider

    while [ -z "$FQDN" ]; do
        echo -e "  ${C_WHITE}FQDN Panel${C_RESET} (panel.contoh.com): "
        required_input FQDN "" "FQDN tidak boleh kosong"
    done

    # Cek SSL tersedia
    local ssl_available=false
    if [[ $(invalid_ip "$FQDN") == 1 && "$FQDN" != "localhost" ]]; then
        ssl_available=true
    else
        warn "Let's Encrypt tidak tersedia untuk alamat IP. Gunakan domain yang valid."
    fi

    # Firewall
    if [ "$OS" == "ubuntu" ] || [ "$OS" == "debian" ]; then
        echo -e "  ${C_WHITE}Konfigurasi UFW (firewall)?${C_RESET} (y/N): "
    else
        echo -e "  ${C_WHITE}Konfigurasi FirewallD?${C_RESET} (y/N): "
    fi
    confirm_yes_no CONFIGURE_FIREWALL

    # SSL
    if [ "$ssl_available" == true ]; then
        echo -e "  ${C_WHITE}Konfigurasi SSL dengan Let's Encrypt?${C_RESET} (y/N): "
        confirm_yes_no CONFIGURE_LETSENCRYPT

        if [ "$CONFIGURE_LETSENCRYPT" == false ]; then
            echo -e "  ${C_WHITE}Asumsikan SSL sudah dikonfigurasi?${C_RESET} (y/N): "
            confirm_yes_no ASSUME_SSL
        fi

        if [ "$CONFIGURE_LETSENCRYPT" == true ] || [ "$ASSUME_SSL" == true ]; then
            verify_fqdn "$FQDN"
        fi
    fi
}

# ======================== INPUT WINGS ========================

wings_input() {
    print_section "KONFIGURASI WINGS"

    info "Installer akan menginstal Docker dan dependensi yang diperlukan untuk Wings."
    info "Setelah instalasi, buat node di Panel dan tempatkan config.yml ke /etc/pterodactyl/"

    # Firewall
    if [ "$OS" == "ubuntu" ] || [ "$OS" == "debian" ]; then
        echo -e "  ${C_WHITE}Konfigurasi UFW (firewall)?${C_RESET} (y/N): "
    else
        echo -e "  ${C_WHITE}Konfigurasi FirewallD?${C_RESET} (y/N): "
    fi
    confirm_yes_no CONFIGURE_FIREWALL

    # Database host
    echo -e "  ${C_WHITE}Konfigurasi user database host?${C_RESET} (y/N): "
    confirm_yes_no CONFIGURE_DBHOST

    if [ "$CONFIGURE_DBHOST" == true ]; then
        # Cek apakah MySQL sudah ada
        type mysql >/dev/null 2>&1 && HAS_MYSQL=true || HAS_MYSQL=false

        if [ "$HAS_MYSQL" == false ]; then
            INSTALL_MARIADB_WINGS=true
            info "MariaDB belum terinstal. Akan diinstal otomatis."
        fi

        MYSQL_DBHOST_USER="-"
        while [[ "$MYSQL_DBHOST_USER" == *"-"* ]]; do
            echo -e "  ${C_WHITE}Username database host${C_RESET} (pterodactyluser): "
            required_input MYSQL_DBHOST_USER "" "Username tidak boleh kosong" "pterodactyluser"
            [[ "$MYSQL_DBHOST_USER" == *"-"* ]] && warn "Username tidak boleh mengandung tanda hubung"
        done

        echo -e "  ${C_WHITE}Password database host${C_RESET}: "
        password_input MYSQL_DBHOST_PASSWORD "" "Password tidak boleh kosong"

        echo -e "  ${C_WHITE}Konfigurasi akses MySQL eksternal?${C_RESET} (y/N): "
        local db_external="false"
        confirm_yes_no db_external

        if [ "$db_external" == true ]; then
            echo -e "  ${C_WHITE}Alamat Panel${C_RESET} (kosongkan untuk akses dari semua alamat): "
            required_input MYSQL_DBHOST_HOST "" "" "%"
            [ "$CONFIGURE_FIREWALL" == true ] && {
                warn "Membuka port 3306 (MySQL) berpotensi riskan!"
                echo -e "  ${C_WHITE}Buka port 3306?${C_RESET} (y/N): "
                confirm_yes_no CONFIGURE_DB_FIREWALL
            }
        fi
    fi

    # SSL
    warn "Let's Encrypt untuk Wings memerlukan FQDN, bukan IP address."
    echo -e "  ${C_WHITE}Konfigurasi SSL Let's Encrypt untuk Wings?${C_RESET} (y/N): "
    confirm_yes_no CONFIGURE_LETSENCRYPT

    if [ "$CONFIGURE_LETSENCRYPT" == true ]; then
        while [ -z "$FQDN" ]; do
            echo -e "  ${C_WHITE}FQDN untuk Let's Encrypt${C_RESET} (node.contoh.com): "
            required_input FQDN "" "FQDN tidak boleh kosong"

            local ask=false
            [ -d "/etc/letsencrypt/live/$FQDN/" ] && { warn "Sertifikat untuk FQDN ini sudah ada!"; ask=true; }
            [ "$ask" == true ] && { FQDN=""; }
        done

        echo -e "  ${C_WHITE}Email untuk Let's Encrypt${C_RESET}: "
        email_input EMAIL_WINGS "" "Email tidak valid"
    fi
}

# ======================== RINGKASAN ========================

print_summary() {
    echo ""
    echo -e "${C_NEON_CYAN}${C_BOLD}  ┌──────────────────────────────────────────────────────────┐${C_RESET}"
    echo -e "${C_NEON_CYAN}${C_BOLD}  │  RINGKASAN KONFIGURASI                                  │${C_RESET}"
    echo -e "${C_NEON_CYAN}${C_BOLD}  └──────────────────────────────────────────────────────────┘${C_RESET}"
    echo ""
    echo -e "  ${C_DIM}Sistem Operasi:${C_RESET}     ${C_WHITE}$OS $OS_VER ($ARCH)${C_RESET}"
    echo -e "  ${C_DIM}Versi Panel:${C_RESET}       ${C_WHITE}$PTERODACTYL_PANEL_VERSION${C_RESET}"
    echo -e "  ${C_DIM}Versi Wings:${C_RESET}       ${C_WHITE}$PTERODACTYL_WINGS_VERSION${C_RESET}"

    if [ "$INSTALL_PANEL" == true ]; then
        echo ""
        echo -e "  ${C_NEON_GREEN}${C_BOLD}-- PANEL --${C_RESET}"
        echo -e "  ${C_DIM}Database:${C_RESET}           ${C_WHITE}$MYSQL_DB${C_RESET}"
        echo -e "  ${C_DIM}DB User:${C_RESET}            ${C_WHITE}$MYSQL_USER${C_RESET}"
        echo -e "  ${C_DIM}DB Password:${C_RESET}        ${C_WHITE}********${C_RESET}"
        echo -e "  ${C_DIM}Zona Waktu:${C_RESET}         ${C_WHITE}$TIMEZONE${C_RESET}"
        echo -e "  ${C_DIM}Email:${C_RESET}              ${C_WHITE}$EMAIL${C_RESET}"
        echo -e "  ${C_DIM}Admin Email:${C_RESET}        ${C_WHITE}$USER_EMAIL${C_RESET}"
        echo -e "  ${C_DIM}Admin Username:${C_RESET}     ${C_WHITE}$USER_USERNAME${C_RESET}"
        echo -e "  ${C_DIM}Admin Password:${C_RESET}     ${C_WHITE}********${C_RESET}"
        echo -e "  ${C_DIM}FQDN:${C_RESET}               ${C_WHITE}$FQDN${C_RESET}"
        echo -e "  ${C_DIM}Firewall:${C_RESET}           ${C_WHITE}$CONFIGURE_FIREWALL${C_RESET}"
        echo -e "  ${C_DIM}Let's Encrypt:${C_RESET}      ${C_WHITE}$CONFIGURE_LETSENCRYPT${C_RESET}"
        echo -e "  ${C_DIM}Assume SSL:${C_RESET}         ${C_WHITE}$ASSUME_SSL${C_RESET}"
    fi

    if [ "$INSTALL_WINGS" == true ]; then
        echo ""
        echo -e "  ${C_NEON_PURPLE}${C_BOLD}-- WINGS --${C_RESET}"
        echo -e "  ${C_DIM}Firewall:${C_RESET}           ${C_WHITE}$CONFIGURE_FIREWALL${C_RESET}"
        echo -e "  ${C_DIM}DB Host:${C_RESET}            ${C_WHITE}$CONFIGURE_DBHOST${C_RESET}"
        echo -e "  ${C_DIM}Let's Encrypt:${C_RESET}      ${C_WHITE}$CONFIGURE_LETSENCRYPT${C_RESET}"
        [ -n "$FQDN" ] && echo -e "  ${C_DIM}FQDN:${C_RESET}               ${C_WHITE}$FQDN${C_RESET}"
    fi

    echo ""
}

# ======================== PESAN SELESAI ========================

print_completion() {
    print_divider
    echo -e "${C_NEON_GREEN}${C_BOLD}  ┌──────────────────────────────────────────────────────────┐${C_RESET}"
    echo -e "${C_NEON_GREEN}${C_BOLD}  │               INSTALASI SELESAI                        │${C_RESET}"
    echo -e "${C_NEON_GREEN}${C_BOLD}  └──────────────────────────────────────────────────────────┘${C_RESET}"
    echo ""

    if [ "$INSTALL_PANEL" == true ]; then
        local panel_url="http://$FQDN"
        [ "$CONFIGURE_LETSENCRYPT" == true ] || [ "$ASSUME_SSL" == true ] && panel_url="https://$FQDN"

        echo -e "  ${C_NEON_GREEN}Panel${C_RESET} ${C_WHITE}tersedia di:${C_RESET} ${C_NEON_CYAN}${C_BOLD}$panel_url${C_RESET}"
        echo -e "  ${C_WHITE}Admin:${C_RESET} ${C_NEON_CYAN}$USER_EMAIL${C_RESET} / ${C_NEON_CYAN}$USER_USERNAME${C_RESET}"
        [ "$CONFIGURE_FIREWALL" == false ] && echo -e "  ${C_YELLOW}Pastikan port 80/443 terbuka untuk akses Panel.${C_RESET}"
    fi

    echo ""

    if [ "$INSTALL_WINGS" == true ]; then
        echo -e "  ${C_NEON_PURPLE}Wings${C_RESET} ${C_WHITE}terinstal. Langkah selanjutnya:${C_RESET}"
        echo -e "  ${C_WHITE}1.${C_RESET} Buat node di Panel (Admin > Nodes)"
        echo -e "  ${C_WHITE}2.${C_RESET} Salin konfigurasi ke ${C_NEON_CYAN}/etc/pterodactyl/config.yml${C_RESET}"
        echo -e "  ${C_WHITE}3.${C_RESET} Jalankan: ${C_NEON_CYAN}systemctl start wings${C_RESET}"
        echo -e "  ${C_WHITE}4.${C_RESET} Cek status: ${C_NEON_CYAN}systemctl status wings${C_RESET}"
        [ "$CONFIGURE_FIREWALL" == false ] && echo -e "  ${C_YELLOW}Pastikan port 8080 dan 2022 terbuka untuk Wings.${C_RESET}"
    fi

    echo ""
    print_elapsed
    echo -e "  ${C_DIM}Log tersimpan di: $LOG_FILE${C_RESET}"
    echo ""
    echo -e "  ${C_DIM}ArkanProjects — https://github.com/PixZ19/ArkanProjects${C_RESET}"
    echo ""
}

# ======================== FUNGSI UTAMA ========================

main() {
    # Cek root
    check_root

    # Cek curl
    check_prerequisites

    # Banner
    print_banner

    # Deteksi OS
    detect_os

    # Ambil versi terbaru
    get_latest_versions
    echo -e "  ${C_DIM}Panel terbaru: $PTERODACTYL_PANEL_VERSION | Wings terbaru: $PTERODACTYL_WINGS_VERSION${C_RESET}"

    # Cek instalasi yang sudah ada
    if [ -d "/var/www/pterodactyl" ]; then
        warn "Pterodactyl Panel sudah terdeteksi di sistem!"
        echo -e "  ${C_WHITE}Lanjutkan?${C_RESET} (y/N): "
        local proceed="false"
        confirm_yes_no proceed
        [ "$proceed" != true ] && error_exit "Instalasi dibatalkan."
    fi

    if [ -d "/etc/pterodactyl" ]; then
        warn "Pterodactyl Wings sudah terdeteksi di sistem!"
        echo -e "  ${C_WHITE}Lanjutkan?${C_RESET} (y/N): "
        local proceed="false"
        confirm_yes_no proceed
        [ "$proceed" != true ] && error_exit "Instalasi dibatalkan."
    fi

    print_divider

    # Menu utama
    main_menu

    # Cek virtualisasi jika instal Wings
    if [ "$INSTALL_WINGS" == true ]; then
        check_virt
    fi

    # Input konfigurasi
    if [ "$INSTALL_PANEL" == true ]; then
        panel_input
    fi

    if [ "$INSTALL_WINGS" == true ] && [ "$INSTALL_PANEL" == false ]; then
        wings_input
    fi

    # Ringkasan
    print_summary

    # Konfirmasi
    print_divider
    echo -e -n "  ${C_NEON_PURPLE}${C_BOLD}[?]${C_RESET} ${C_WHITE}Konfigurasi sudah benar? Lanjutkan instalasi?${C_RESET} (y/N): "
    local final_confirm=""
    read -r final_confirm
    [[ ! "$final_confirm" =~ [Yy] ]] && error_exit "Instalasi dibatalkan."

    # Mulai instalasi
    echo "" > "$LOG_FILE" 2>/dev/null || LOG_FILE="/tmp/arkanprojects-installer.log"
    log "ArkanProjects Installer v$INSTALLER_VERSION dimulai"
    log "OS: $OS $OS_VER, ARCH: $ARCH"
    log "Panel: $INSTALL_PANEL, Wings: $INSTALL_WINGS"

    if [ "$INSTALL_PANEL" == true ]; then
        print_section "INSTALASI PANEL"
        install_panel
    fi

    if [ "$INSTALL_WINGS" == true ]; then
        if [ "$INSTALL_PANEL" == true ]; then
            # Wings input jika Panel+Wings di mesin yang sama
            echo ""
            print_section "KONFIGURASI WINGS (MESIN YANG SAMA)"
            wings_input
        fi

        print_section "INSTALASI WINGS"
        install_wings
    fi

    # Selesai
    print_completion
}

# ======================== JALANKAN ========================

main "$@"
