#!/usr/bin/env bash

set -euo pipefail

# website metadata — jangan rename
readonly TOOL_NAME="Pterodactyl Installer"
readonly TOOL_DESC="Panel + Wings deployment with blueprint support, theme engine, game addons, SSL, firewall, and fail-safe rollback."
readonly TOOL_BADGE="Stable"

# version & source
readonly ARKAN_VERSION="4.1.0"
readonly ARKAN_RELEASE="stable"
readonly ARKAN_BASE_URL="${ARKAN_BASE_URL:-https://arkanprojects.vercel.app}"
readonly PANEL_DL_URL="https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz"
readonly WINGS_DL_BASE="https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_"
readonly LOG_FILE="/var/log/arkan-pterodactyl-installer.log"

# themes — blueprint files, install via blueprint -install
readonly THEME_DIR="${ARKAN_BASE_URL}/themes"

# addons panel
readonly ADDONS_PANEL_SELF_URL="${ARKAN_BASE_URL}/addons/pterodactyl-addons-panel.tar.gz"
readonly ADDONS_PANEL_UPSTREAM_URL="https://github.com/MuLTiAcidi/pterodactyl-addons/releases/latest/download/pterodactyl-addons-panel.tar.gz"

# addon scripts
readonly ADDON_REGISTRY_SELF="${ARKAN_BASE_URL}/addons/scripts"
readonly ADDON_REGISTRY_UPSTREAM="https://raw.githubusercontent.com/MuLTiAcidi/pterodactyl-addons/main"

# rollback trap
_ROLLBACK_CMDS=()
trap '_on_exit' EXIT

_on_exit() {
  local rc=$?
  if [[ $rc -ne 0 && ${#_ROLLBACK_CMDS[@]} -gt 0 ]]; then
    _warn "Installation failed (exit $rc). Rolling back..."
    local i
    for (( i=${#_ROLLBACK_CMDS[@]}-1; i>=0; i-- )); do
      _log "rollback: ${_ROLLBACK_CMDS[$i]}"
      eval "${_ROLLBACK_CMDS[$i]}" 2>/dev/null || true
    done
    _err "Rollback complete. Check $LOG_FILE for details."
  fi
}


readonly C_RED='\033[0;31m'
readonly C_GRN='\033[0;32m'
readonly C_YEL='\033[1;33m'
readonly C_CYN='\033[0;36m'
readonly C_DIM='\033[2m'
readonly C_NC='\033[0m'


_log()   { echo -e "$(date '+%Y-%m-%d %H:%M:%S') * $*" >> "$LOG_FILE"; }
_out()   { echo -e "* $*"; _log "$*"; }
_ok()    { echo -e "* ${C_GRN}OK${C_NC}: $*"; _log "OK: $*"; }
_warn()  { echo -e "* ${C_YEL}WARN${C_NC}: $*" >&2; _log "WARN: $*"; }
_err()   { echo -e "* ${C_RED}ERROR${C_NC}: $*" >&2; _log "ERROR: $*"; }
_fatal() { _err "$*"; exit 1; }
_brake() { local n=${1:-60}; printf '#%.0s' $(seq 1 "$n"); echo; }

_info_brake() {
  _brake 60
  _out "$ARKAN_VERSION — Pterodactyl Installer"
  _out ""
  _out "ArkanProjects  |  https://arkanprojects.vercel.app"
  _out "OS: $OS $OS_VER  |  Arch: $CPU_ARCH ($ARCH)"
  _brake 60
}

_link() { echo -e "\e]8;;${1}\a${1}\e]8;;\a"; }

_email_re='^(([A-Za-z0-9]+((\.|\-|\_|\+)?[A-Za-z0-9]?)*[A-Za-z0-9]+)|[A-Za-z0-9]+)@(([A-Za-z0-9]+)+((\.|\-|\_)?([A-Za-z0-9]+)+)*)+\.([A-Za-z]{2,})+$'
_pw_charset='A-Za-z0-9!"#%&()*+,-./:;<=>?@[\]^_`{|}~'

_valid_email()  { [[ $1 =~ $_email_re ]]; }
_is_ip_address() { [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; }

_gen_passwd() {
  local len=${1:-64}
  tr -dc "$_pw_charset" </dev/urandom | head -c "$len"
}

_array_contains() {
  local val="$1"; shift
  local e
  for e in "$@"; do [[ "$e" == "$val" ]] && return 0; done
  return 1
}


DEBUG_MODE="${DEBUG_MODE:-false}"


_ask() {
  local var="$1" prompt="$2" req="${3:-}" def="${4:-}"
  local result=""
  while [[ -z "$result" ]]; do
    echo -n "* $prompt"
    read -r result
    [[ -z "$result" && -n "$def" ]] && result="$def"
    [[ -z "$result" && -n "$req" ]] && _err "$req"
  done
  eval "$var=\"\$result\""
}

_ask_email() {
  local var="$1" prompt="$2"
  local result=""
  while ! _valid_email "$result"; do
    echo -n "* $prompt"
    read -r result
    _valid_email "$result" || _err "Invalid email address."
  done
  eval "$var=\"\$result\""
}

_ask_pw() {
  local var="$1" prompt="$2" def="${3:-}"
  local result=""
  while [[ -z "$result" ]]; do
    echo -n "* $prompt"
    while IFS= read -r -s -n1 ch; do
      [[ -z "$ch" ]] && { printf '\n'; break; }
      if [[ "$ch" == $'\x7f' ]]; then
        [[ -n "$result" ]] && result=${result%?} && printf '\b \b'
      else
        result+=$ch; printf '*'
      fi
    done
    [[ -z "$result" && -n "$def" ]] && result="$def"
    [[ -z "$result" ]] && _err "Password cannot be empty."
  done
  eval "$var=\"\$result\""
}

_confirm() {
  local prompt="${1:-} (y/N): "
  echo -n "* $prompt"
  read -r ans
  [[ "$ans" =~ [Yy] ]]
}


OS="" OS_VER="" OS_VER_MAJOR="" CPU_ARCH="" ARCH="" SUPPORTED=false

_detect_os() {
  if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$(echo "$ID" | awk '{print tolower($0)}')
    OS_VER=$VERSION_ID
  elif type lsb_release &>/dev/null; then
    OS=$(lsb_release -si | awk '{print tolower($0)}')
    OS_VER=$(lsb_release -sr)
  elif [[ -f /etc/debian_version ]]; then
    OS="debian"; OS_VER=$(cat /etc/debian_version)
  else
    _fatal "Cannot detect operating system."
  fi

  OS=$(echo "$OS" | awk '{print tolower($0)}')
  OS_VER_MAJOR=$(echo "$OS_VER" | cut -d. -f1)
  CPU_ARCH=$(uname -m)

  case "$CPU_ARCH" in
    x86_64) ARCH=amd64 ;;
    arm64|aarch64) ARCH=arm64 ;;
    *) _fatal "Unsupported architecture: $CPU_ARCH. Only x86_64 and arm64 are supported." ;;
  esac

  case "$OS" in
    ubuntu)   [[ "$OS_VER_MAJOR" == "22" || "$OS_VER_MAJOR" == "24" ]] && SUPPORTED=true ;;
    debian)   [[ "$OS_VER_MAJOR" =~ ^(10|11|12|13)$ ]] && SUPPORTED=true ;;
    rocky|almalinux) [[ "$OS_VER_MAJOR" =~ ^(8|9)$ ]] && SUPPORTED=true ;;
  esac

  export DEBIAN_FRONTEND=noninteractive
  [[ "$SUPPORTED" == false ]] && _fatal "$OS $OS_VER is not supported."
}


_preflight() {
  [[ $EUID -ne 0 ]] && _fatal "This script must be run as root."

  if ! command -v curl &>/dev/null; then
    _out "Installing curl..."
    if command -v apt-get &>/dev/null; then
      apt-get update -qq && apt-get install -y -qq curl
    elif command -v dnf &>/dev/null; then
      dnf install -y -q curl
    else
      _fatal "curl is required. Please install it manually."
    fi
  fi

  _detect_os
  _info_brake
}


_update_repos() {
  case "$OS" in
    ubuntu|debian)
      _out "Updating package repositories..."
      apt-get update -y -qq || _warn "Repository update failed (may be non-fatal)."
      ;;
    rocky|almalinux)
      _out "Skipping repository update (handled automatically)."
      ;;
  esac
}

_install_pkgs() {
  local quiet=""
  case "$OS" in
    ubuntu|debian) [[ "${2:-false}" == true ]] && quiet="-qq"; eval apt-get -y $quiet install "$1" ;;
    rocky|almalinux) [[ "${2:-false}" == true ]] && quiet="-q"; eval dnf -y $quiet install "$1" ;;
  esac
}


_mysql_cmd() { mariadb -u root "$@"; }

_create_db_user() {
  local user="$1" pass="$2" host="${3:-127.0.0.1}"
  _out "Creating database user '$user'@'$host'..."
  _mysql_cmd -e "CREATE USER '$user'@'$host' IDENTIFIED BY '$pass';"
  _mysql_cmd -e "FLUSH PRIVILEGES;"
  _ok "Database user created."
}

_grant_all() {
  local db="$1" user="$2" host="${3:-127.0.0.1}"
  _mysql_cmd -e "GRANT ALL PRIVILEGES ON $db.* TO '$user'@'$host' WITH GRANT OPTION;"
  _mysql_cmd -e "FLUSH PRIVILEGES;"
}

_create_db() {
  local db="$1" user="$2" host="${3:-127.0.0.1}"
  _out "Creating database '$db'..."
  _mysql_cmd -e "CREATE DATABASE $db;"
  _grant_all "$db" "$user" "$host"
  _ok "Database created."
}

# Firewall
_firewall_install() {
  case "$OS" in
    ubuntu|debian)
      if ! command -v ufw &>/dev/null; then
        _update_repos
        _install_pkgs "ufw" true
      fi
      ufw --force enable
      _ok "UFW enabled."
      ;;
    rocky|almalinux)
      if ! command -v firewall-cmd &>/dev/null; then
        _install_pkgs "firewalld" true
      fi
      systemctl --now enable firewalld >/dev/null 2>&1
      _ok "FirewallD enabled."
      ;;
  esac
}

_firewall_allow() {
  for port in "$@"; do
    case "$OS" in
      ubuntu|debian)  ufw allow "$port" ;;
      rocky|almalinux) firewall-cmd --zone=public --add-port="$port/tcp" --permanent ;;
    esac
  done
  case "$OS" in
    ubuntu|debian) ufw --force reload ;;
    rocky|almalinux) firewall-cmd --reload -q ;;
  esac
}


_verify_fqdn() {
  local fqdn="$1"
  if ! dig +short "$fqdn" >/dev/null 2>&1; then
    _warn "DNS resolution for '$fqdn' failed."
    return 1
  fi
  return 0
}


_panel_dep() {
  _out "Installing panel dependencies for $OS $OS_VER..."

  _update_repos

  case "$OS" in
    ubuntu)
      _install_pkgs "software-properties-common apt-transport-https ca-certificates gnupg"
      add-apt-repository universe -y
      LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php
      ;;
    debian)
      _install_pkgs "dirmngr ca-certificates apt-transport-https lsb-release"
      curl -fsSL -o /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
      echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list
      ;;
    rocky|almalinux)
      _install_pkgs "policycoreutils selinux-policy selinux-policy-targeted \
        setroubleshoot-server setools setools-console mcstrans"
      _install_pkgs "epel-release http://rpms.remirepo.net/enterprise/remi-release-$OS_VER_MAJOR.rpm"
      dnf module enable -y php:remi-8.3
      ;;
  esac

  _update_repos

  case "$OS" in
    ubuntu|debian)
      _install_pkgs "php8.3 php8.3-{cli,common,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} \
        mariadb-common mariadb-server mariadb-client \
        nginx redis-server \
        zip unzip tar git cron curl"

      [[ "$CFG_LE" == true ]] && _install_pkgs "certbot python3-certbot-nginx"
      ;;
    rocky|almalinux)
      _install_pkgs "php php-{common,fpm,cli,json,mysqlnd,mcrypt,gd,mbstring,pdo,zip,bcmath,dom,opcache,posix} \
        mariadb mariadb-server \
        nginx redis \
        zip unzip tar git cronie curl"

      [[ "$CFG_LE" == true ]] && _install_pkgs "certbot python3-certbot-nginx"

      setsebool -P httpd_can_network_connect 1 2>/dev/null || true
      setsebool -P httpd_execmem 1 2>/dev/null || true
      setsebool -P httpd_unified 1 2>/dev/null || true
      ;;
  esac

  case "$OS" in
    ubuntu|debian)
      systemctl enable redis-server && systemctl start redis-server
      ;;
    rocky|almalinux)
      systemctl enable redis && systemctl start redis
      ;;
  esac
  systemctl enable nginx mariadb && systemctl start mariadb

  _ok "Panel dependencies installed."
}

_panel_download() {
  _out "Downloading Pterodactyl panel..."
  mkdir -p /var/www/pterodactyl
  cd /var/www/pterodactyl || _fatal "Cannot cd to /var/www/pterodactyl"
  curl -Lo panel.tar.gz "$PANEL_DL_URL"
  tar -xzf panel.tar.gz
  rm -f panel.tar.gz
  chmod -R 755 storage/* bootstrap/cache/
  cp .env.example .env
  _ok "Panel files extracted."
}

_panel_composer() {
  _out "Installing Composer..."
  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  [[ "$OS" == "rocky" || "$OS" == "almalinux" ]] && export PATH=/usr/local/bin:$PATH
  _out "Installing PHP dependencies..."
  COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction
  _ok "Composer dependencies installed."
}

_panel_configure() {
  _out "Configuring panel environment..."

  local app_url="http://$PANEL_FQDN"
  [[ "$CFG_SSL_ASSUME" == true || "$CFG_LE" == true ]] && app_url="https://$PANEL_FQDN"

  php artisan key:generate --force

  php artisan p:environment:setup \
    --author="$PANEL_EMAIL" \
    --url="$app_url" \
    --timezone="$PANEL_TZ" \
    --cache="redis" \
    --session="redis" \
    --queue="redis" \
    --redis-host="localhost" \
    --redis-pass="null" \
    --redis-port="6379" \
    --settings-ui=true

  php artisan p:environment:database \
    --host="127.0.0.1" \
    --port="3306" \
    --database="$DB_NAME" \
    --username="$DB_USER" \
    --password="$DB_PASS"

  php artisan migrate --seed --force

  php artisan p:user:make \
    --email="$USR_EMAIL" \
    --username="$USR_NAME" \
    --name-first="$USR_FIRST" \
    --name-last="$USR_LAST" \
    --password="$USR_PASS" \
    --admin=1

  _ok "Panel configured."
}

_panel_permissions() {
  case "$OS" in
    debian|ubuntu) chown -R www-data:www-data /var/www/pterodactyl ;;
    rocky|almalinux) chown -R nginx:nginx /var/www/pterodactyl ;;
  esac
}

_panel_cron() {
  (crontab -l 2>/dev/null | grep -v "pterodactyl"; echo "* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1") | crontab -
  _ok "Cronjob installed."
}

_panel_pteroq() {
  _out "Installing pteroq service..."
  local pteroq_user="www-data"
  [[ "$OS" == "rocky" || "$OS" == "almalinux" ]] && pteroq_user="nginx"

  cat > /etc/systemd/system/pteroq.service <<EOF
[Unit]
Description=Pterodactyl Queue Worker
After=redis-server.service

[Service]
User=${pteroq_user}
Group=${pteroq_user}
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable pteroq
  systemctl start pteroq
  _ok "pteroq service installed."
}

_panel_nginx() {
  _out "Configuring nginx..."
  local php_sock=""
  local cfg_dir=""
  local cfg_en=""

  case "$OS" in
    ubuntu|debian)
      php_sock="/run/php/php8.3-fpm.sock"
      cfg_dir="/etc/nginx/sites-available"
      cfg_en="/etc/nginx/sites-enabled"
      ;;
    rocky|almalinux)
      php_sock="/var/run/php-fpm/pterodactyl.sock"
      cfg_dir="/etc/nginx/conf.d"
      cfg_en="$cfg_dir"
      ;;
  esac

  rm -f "$cfg_en/default"

  if [[ "$CFG_SSL_ASSUME" == true && "$CFG_LE" == false ]]; then
    local dl_file="nginx_ssl"
  else
    local dl_file="nginx_http"
  fi

  if [[ "$dl_file" == "nginx_ssl" ]]; then
    cat > "$cfg_dir/pterodactyl.conf" <<NGINXEOF
server {
    listen 80;
    server_name ${PANEL_FQDN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${PANEL_FQDN};

    root /var/www/pterodactyl/public;
    index index.html index.htm index.php;
    charset utf-8;

    ssl_certificate     /etc/letsencrypt/live/${PANEL_FQDN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${PANEL_FQDN}/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php\$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)\$;
        fastcgi_pass unix:${php_sock};
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

    location ~ /\.ht { deny all; }
}
NGINXEOF
  else
    cat > "$cfg_dir/pterodactyl.conf" <<NGINXEOF
server {
    listen 80;
    server_name ${PANEL_FQDN};

    root /var/www/pterodactyl/public;
    index index.html index.htm index.php;
    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php\$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)\$;
        fastcgi_pass unix:${php_sock};
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

    location ~ /\.ht { deny all; }
}
NGINXEOF
  fi

  [[ "$OS" == "ubuntu" || "$OS" == "debian" ]] && ln -sf "$cfg_dir/pterodactyl.conf" "$cfg_en/pterodactyl.conf"

  if [[ "$CFG_SSL_ASSUME" == false && "$CFG_LE" == false ]]; then
    systemctl restart nginx
  fi

  _ok "Nginx configured."
}

_panel_letsencrypt() {
  _out "Configuring Let's Encrypt SSL..."
  if certbot --nginx --redirect --no-eff-email --email "$PANEL_EMAIL" -d "$PANEL_FQDN"; then
    _ok "Let's Encrypt certificate obtained."
  else
    _warn "Let's Encrypt failed. Falling back to HTTP."
    CFG_SSL_ASSUME=false
    CFG_LE=false
    _panel_nginx
  fi
}

_panel_install() {
  _out "Starting panel installation..."
  _panel_dep
  _panel_composer
  _panel_download
  _create_db "$DB_NAME" "$DB_USER"
  _panel_configure
  _panel_permissions
  _panel_cron
  _panel_pteroq
  _panel_nginx
  [[ "$CFG_LE" == true ]] && _panel_letsencrypt
  _ok "Panel installation complete."
}


_wings_dep() {
  _out "Installing Wings dependencies for $OS $OS_VER..."

  case "$OS" in
    ubuntu|debian)
      _install_pkgs "ca-certificates gnupg lsb-release"
      mkdir -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list
      ;;
    rocky|almalinux)
      _install_pkgs "dnf-utils"
      dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
      _install_pkgs "device-mapper-persistent-data lvm2"
      [[ "$CFG_LE" == true ]] && _install_pkgs "epel-release"
      ;;
  esac

  _update_repos
  _install_pkgs "docker-ce docker-ce-cli containerd.io"

  [[ "$WINGS_INSTALL_MARIADB" == true ]] && _install_pkgs "mariadb-server"
  [[ "$CFG_LE" == true ]] && _install_pkgs "certbot"

  systemctl enable docker && systemctl start docker
  _ok "Wings dependencies installed."
}

_wings_download() {
  _out "Downloading Pterodactyl Wings..."
  mkdir -p /etc/pterodactyl
  curl -L -o /usr/local/bin/wings "${WINGS_DL_BASE}${ARCH}"
  chmod u+x /usr/local/bin/wings
  _ok "Wings binary installed."
}

_wings_systemd() {
  _out "Installing Wings systemd service..."
  cat > /etc/systemd/system/wings.service <<EOF
[Unit]
Description=Pterodactyl Wings Daemon
After=docker.service

[Service]
User=root
Group=root
LimitNOFILE=infinity
LimitNPROC=infinity
Restart=always
RestartSec=5s
ExecStart=/usr/local/bin/wings
StartLimitInterval=180
StartLimitBurst=30

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable wings
  _ok "Wings service installed."
}

_wings_install() {
  _out "Starting Wings installation..."
  _wings_dep
  _wings_download
  _wings_systemd

  if [[ "$WINGS_CFG_MYSQL" == true ]]; then
    _create_db_user "$WINGS_DB_USER" "$WINGS_DB_PASS" "$WINGS_DB_HOST"
    _grant_all "*" "$WINGS_DB_USER" "$WINGS_DB_HOST"

    if [[ "$WINGS_DB_HOST" != "127.0.0.1" ]]; then
      _out "Changing MariaDB bind address..."
      case "$OS" in
        debian|ubuntu)
          sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mariadb.conf.d/50-server.cnf
          ;;
        rocky|almalinux)
          sed -i 's/^#bind-address=0.0.0.0$/bind-address=0.0.0.0/' /etc/my.cnf.d/mariadb-server.cnf
          ;;
      esac
      systemctl restart mariadb
    fi
  fi

  if [[ "$CFG_LE" == true && -n "$WINGS_FQDN" ]]; then
    systemctl stop nginx 2>/dev/null || true
    if certbot certonly --no-eff-email --email "$WINGS_EMAIL" --standalone -d "$WINGS_FQDN"; then
      _ok "Wings SSL certificate obtained."
    else
      _warn "Wings SSL failed."
    fi
    systemctl start nginx 2>/dev/null || true
  fi

  _ok "Wings installation complete."
}


_blueprint_parse_identifier() {
  local conf_file="$1"
  local identifier=""
  if [[ -f "$conf_file" ]]; then
    identifier=$(grep -E '^\s*identifier:' "$conf_file" | head -1 | sed 's/identifier:[[:space:]]*//' | tr -d '"' | tr -d "'" | xargs)
  fi
  echo "$identifier"
}

_blueprint_parse_flags() {
  local conf_file="$1"
  local flags=""
  if [[ -f "$conf_file" ]]; then
    flags=$(grep -E '^\s*flags:' "$conf_file" | head -1 | sed 's/flags:[[:space:]]*//' | xargs)
  fi
  echo "$flags"
}

_blueprint_has_flag() {
  local conf_file="$1"
  local flag="$2"
  local flags
  flags=$(_blueprint_parse_flags "$conf_file")
  [[ " $flags " == *" $flag "* ]]
}

_blueprint_parse_field() {
  local conf_file="$1"
  local section="$2"
  local field="$3"
  local in_section=false
  local value=""
  if [[ -f "$conf_file" ]]; then
    while IFS= read -r line; do
      if [[ "$line" =~ ^[a-z]+: && ! "$line" =~ ^[[:space:]]# ]]; then
        if [[ "$line" == "${section}:"* ]]; then
          in_section=true
        else
          in_section=false
        fi
        continue
      fi
      if [[ "$in_section" == true ]]; then
        if [[ "$line" =~ ^[[:space:]]+${field}: ]]; then
          value=$(echo "$line" | sed "s/.*${field}:[[:space:]]*//" | xargs)
          break
        fi
      fi
    done < "$conf_file"
  fi
  echo "$value"
}

_install_blueprint() {
  local blueprint_url="$1"
  local tmp_dir="/tmp/arkan-blueprint-$$"
  local tmp_file="$tmp_dir/archive.zip"
  local extract_dir="$tmp_dir/extracted"

  _out "Installing blueprint from: $blueprint_url"

  mkdir -p "$tmp_dir" "$extract_dir"

  _out "Downloading blueprint file..."
  if ! curl -fsSL -o "$tmp_file" "$blueprint_url"; then
    _err "Failed to download blueprint from $blueprint_url"
    rm -rf "$tmp_dir"
    return 1
  fi

  if ! file "$tmp_file" | grep -qi "zip archive"; then
    _err "Downloaded file is not a valid ZIP archive."
    rm -rf "$tmp_dir"
    return 1
  fi

  _out "Extracting blueprint..."
  if ! unzip -o -q "$tmp_file" -d "$extract_dir"; then
    _err "Failed to extract blueprint archive."
    rm -rf "$tmp_dir"
    return 1
  fi

  local conf_file=""
  if [[ -f "$extract_dir/conf.yml" ]]; then
    conf_file="$extract_dir/conf.yml"
  else
    conf_file=$(find "$extract_dir" -name "conf.yml" -type f 2>/dev/null | head -1)
  fi

  if [[ -z "$conf_file" || ! -f "$conf_file" ]]; then
    _err "Blueprint does not contain a conf.yml manifest."
    rm -rf "$tmp_dir"
    return 1
  fi

  local identifier=""
  identifier=$(_blueprint_parse_identifier "$conf_file")
  if [[ -z "$identifier" ]]; then
    _err "Could not parse 'identifier' from conf.yml. Blueprint is invalid."
    rm -rf "$tmp_dir"
    return 1
  fi

  if [[ ! "$identifier" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    _err "Invalid identifier '$identifier'. Must be alphanumeric with hyphens/underscores."
    rm -rf "$tmp_dir"
    return 1
  fi

  _out "Blueprint identifier: $identifier"

  local ext_dir="/var/www/pterodactyl/.blueprint/extensions/$identifier"

  if [[ -d "$ext_dir" ]]; then
    _out "Extension '$identifier' already exists. Backing up..."
    mv "$ext_dir" "${ext_dir}.bak.$(date +%s)"
  fi

  mkdir -p "$ext_dir"

  cp -a "$extract_dir"/. "$ext_dir"/
  _ok "Blueprint files installed to $ext_dir"

  if _blueprint_has_flag "$conf_file" "hasInstallScript"; then
    _out "Running install script..."
    local install_script=""
    if [[ -f "$ext_dir/data/install.sh" ]]; then
      install_script="$ext_dir/data/install.sh"
    elif [[ -f "$ext_dir/private/install.sh" ]]; then
      install_script="$ext_dir/private/install.sh"
    fi

    if [[ -n "$install_script" && -f "$install_script" ]]; then
      chmod +x "$install_script"
      if (cd /var/www/pterodactyl && \
          PTERODACTYL_DIRECTORY=/var/www/pterodactyl \
          BLUEPRINT_DEVELOPER=false \
          bash "$install_script"); then
        _ok "Install script completed successfully."
      else
        _warn "Install script exited with an error."
      fi
    else
      _warn "hasInstallScript flag set but no install script found."
    fi
  fi

  local migrations
  migrations=$(_blueprint_parse_field "$conf_file" "database" "migrations")
  if [[ -n "$migrations" ]]; then
    _out "Running database migrations..."
    (cd /var/www/pterodactyl && php artisan migrate --force) && \
      _ok "Migrations completed." || \
      _warn "Database migrations failed."
  fi

  _out "Clearing panel caches..."
  (cd /var/www/pterodactyl && php artisan view:cache && php artisan config:cache) && \
    _ok "Caches cleared." || \
    _warn "Cache clear failed."

  _panel_permissions

  rm -rf "$tmp_dir"

  _ok "Blueprint '$identifier' installed successfully."
  return 0
}

_remove_blueprint() {
  local identifier="$1"
  local ext_dir="/var/www/pterodactyl/.blueprint/extensions/$identifier"
  local conf_file=""

  if [[ ! -d "$ext_dir" ]]; then
    _err "Extension '$identifier' is not installed."
    return 1
  fi

  _out "Removing blueprint: $identifier"

  if [[ -f "$ext_dir/conf.yml" ]]; then
    conf_file="$ext_dir/conf.yml"
  fi

  if [[ -n "$conf_file" ]] && _blueprint_has_flag "$conf_file" "hasRemovalScript"; then
    _out "Running removal script..."
    local remove_script=""
    if [[ -f "$ext_dir/data/remove.sh" ]]; then
      remove_script="$ext_dir/data/remove.sh"
    elif [[ -f "$ext_dir/private/remove.sh" ]]; then
      remove_script="$ext_dir/private/remove.sh"
    fi

    if [[ -n "$remove_script" && -f "$remove_script" ]]; then
      chmod +x "$remove_script"
      if (cd /var/www/pterodactyl && \
          PTERODACTYL_DIRECTORY=/var/www/pterodactyl \
          BLUEPRINT_DEVELOPER=false \
          bash "$remove_script"); then
        _ok "Removal script completed."
      else
        _warn "Removal script exited with an error."
      fi
    fi
  fi

  rm -rf "$ext_dir"
  _ok "Extension directory removed."

  _out "Clearing panel caches..."
  (cd /var/www/pterodactyl && php artisan view:cache && php artisan config:cache) 2>/dev/null && \
    _ok "Caches cleared." || true

  _ok "Blueprint '$identifier' removed successfully."
  return 0
}


_list_themes() {
  _brake 55
  _out "Available themes (11):"
  _out ""
  _out "  ${C_CYN}nebula${C_NC}        — Nebula: full theme editor, sidebar, animations, glass effects"
  _out "  ${C_CYN}darkenate${C_NC}     — Darkenate: dark theme with purple accents"
  _out "  ${C_CYN}euphoria${C_NC}      — Euphoria: game server theme, console copy, player fetch"
  _out "  ${C_CYN}betteradmin${C_NC}   — BetterAdmin: enhanced admin panel UI"
  _out "  ${C_CYN}nightadmin${C_NC}    — Night Admin: dark admin panel UI"
  _out "  ${C_CYN}loader${C_NC}        — Loader: client loading animation"
  _out "  ${C_CYN}abysspurple${C_NC}   — Abyss Purple: dark purple theme"
  _out "  ${C_CYN}crimsonabyss${C_NC}  — Crimson Abyss: dark crimson theme"
  _out "  ${C_CYN}amberabyss${C_NC}    — Amber Abyss: dark amber theme"
  _out "  ${C_CYN}emeraldabyss${C_NC}  — Emerald Abyss: dark emerald theme"
  _out ""
  _out "Usage: --install-theme <nama>"
  _brake 55
}

_install_theme() {
  local theme_input="$1"
  [[ ! -d "/var/www/pterodactyl" ]] && \
    _fatal "Pterodactyl panel is not installed. Install the panel first."

  local url="$theme_input"
  if [[ "$theme_input" != http://* && "$theme_input" != https://* ]]; then
    local name="${theme_input%.blueprint}"
    local bp_file="${name}.blueprint"
    url="${THEME_DIR}/${bp_file}"
    if ! curl -fsSL -o /dev/null "$url" 2>/dev/null; then
      url="${BP_REGISTRY_SELF}/${bp_file}"
    fi
    _out "Installing theme: $name"
  fi

  _install_blueprint "$url"
}


_install_addons_panel() {
  [[ ! -d "/var/www/pterodactyl" ]] && \
    _fatal "Pterodactyl panel is not installed at /var/www/pterodactyl. Install the panel first."

  _out "Installing Pterodactyl Addons Panel (game server addons)..."
  _brake 55
  _out "This will replace your panel with the MuLTiAcidi addons-enhanced panel."
  _out "Includes game-specific addons for Minecraft, Rust, CS2, FiveM, ARK, and more."
  _out ""
  _out "Supported games: Minecraft (Modrinth, Hangar, Modpacks), Rust (uMod),"
  _out "  CS2 (Plugins, Maps, Workshop), FiveM (Resources), ARK (Steam Workshop),"
  _out "  GMod (Addons), Valheim (Thunderstore), 7 Days to Die, and more."
  _brake 55

  _confirm "Backup existing panel and install addons panel" || _fatal "Installation aborted."

  local backup_dir="/var/www/pterodactyl.bak.$(date +%Y%m%d-%H%M%S)"

  _out "Backing up existing panel to $backup_dir..."
  cp -r /var/www/pterodactyl "$backup_dir"
  _ok "Panel backed up."

  _out "Downloading addons panel..."
  local tmp_file="/tmp/pterodactyl-addons-panel.tar.gz"
  if ! _fetch_asset "$ADDONS_PANEL_SELF_URL" "$ADDONS_PANEL_UPSTREAM_URL" "$tmp_file"; then
    _err "Failed to download addons panel."
    _warn "Restoring backup..."
    rm -rf /var/www/pterodactyl
    mv "$backup_dir" /var/www/pterodactyl
    return 1
  fi

  _out "Extracting addons panel..."
  rm -rf /var/www/pterodactyl/*
  if ! tar -xzf "$tmp_file" -C /var/www/pterodactyl; then
    _err "Failed to extract addons panel."
    _warn "Restoring backup..."
    rm -rf /var/www/pterodactyl
    mv "$backup_dir" /var/www/pterodactyl
    rm -f "$tmp_file"
    return 1
  fi
  rm -f "$tmp_file"

  if [[ -f "$backup_dir/.env" && ! -f /var/www/pterodactyl/.env ]]; then
    cp "$backup_dir/.env" /var/www/pterodactyl/.env
  fi

  mkdir -p /var/www/pterodactyl/storage /var/www/pterodactyl/bootstrap/cache
  chmod -R 755 /var/www/pterodactyl/storage/* /var/www/pterodactyl/bootstrap/cache/ 2>/dev/null || true

  cd /var/www/pterodactyl || _fatal "Cannot cd to /var/www/pterodactyl"
  _out "Installing PHP dependencies..."
  COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction
  _ok "Composer dependencies installed."

  _out "Running database migrations..."
  php artisan migrate --force && _ok "Migrations completed." || _warn "Migrations failed or had no changes."

  if command -v yarn &>/dev/null; then
    _out "Building frontend assets..."
    yarn install --frozen-lockfile 2>/dev/null || yarn install
    yarn build 2>/dev/null && _ok "Frontend built." || _warn "Frontend build failed (may need manual build)."
  elif command -v npm &>/dev/null; then
    _out "Building frontend assets with npm..."
    npm install --legacy-peer-deps 2>/dev/null || npm install
    npm run build 2>/dev/null && _ok "Frontend built." || _warn "Frontend build failed (may need manual build)."
  else
    _warn "Neither yarn nor npm found. Install Node.js and yarn to build the frontend."
    _out "Run: _load_addon nodejs && _load_addon yarn && cd /var/www/pterodactyl && yarn && yarn build"
  fi

  php artisan view:cache && php artisan config:cache && php artisan route:cache 2>/dev/null || true

  _panel_permissions

  systemctl restart pteroq 2>/dev/null || true
  systemctl restart php8.3-fpm 2>/dev/null || true
  systemctl restart php-fpm 2>/dev/null || true
  systemctl restart nginx

  _ok "Addons panel installed successfully."
  _out "Backup saved at: $backup_dir"
  _out "Your panel now includes game server addons for Minecraft, Rust, CS2, FiveM, ARK, and more."
  return 0
}


_fetch_asset() {
  local self_url="$1"
  local upstream_url="$2"
  local output="$3"

  if curl -fsSL -o "$output" "$self_url" 2>/dev/null; then
    _ok "Fetched from ArkanProjects: $(basename "$self_url")"
    return 0
  fi

  _warn "Self-hosted asset not found. Trying upstream..."
  if curl -fsSL -o "$output" "$upstream_url" 2>/dev/null; then
    _ok "Fetched from upstream: $(basename "$upstream_url")"
    return 0
  fi

  _err "Failed to download asset from both self-hosted and upstream sources."
  _err "  Self-hosted:  $self_url"
  _err "  Upstream:     $upstream_url"
  return 1
}


_addon_phpmyadmin() {
  _out "Installing phpMyAdmin..."
  local pma_dir="/var/www/phpmyadmin"
  local pma_version="5.2.1"
  local pma_url="https://files.phpmyadmin.net/phpMyAdmin/${pma_version}/phpMyAdmin-${pma_version}-all-languages.tar.gz"
  local tmp_file="/tmp/phpmyadmin.tar.gz"

  curl -fsSL -o "$tmp_file" "$pma_url" || { _err "Failed to download phpMyAdmin."; return 1; }

  mkdir -p "$pma_dir"
  tar -xzf "$tmp_file" -C "$pma_dir" --strip-components=1
  rm -f "$tmp_file"

  local blowfish_secret
  blowfish_secret=$(_gen_passwd 32)

  cp "${pma_dir}/config.sample.inc.php" "${pma_dir}/config.inc.php"
  sed -i "s|\\\$cfg\\['blowfish_secret'\\] = ''|\\\$cfg['blowfish_secret'] = '${blowfish_secret}'|g" "${pma_dir}/config.inc.php"
  sed -i "s|\\\$cfg\\['Servers'\\]\\[\\\$i\\]\\['host'\\] = 'localhost'|\\\$cfg['Servers'][\\\$i]['host'] = '127.0.0.1'|g" "${pma_dir}/config.inc.php"

  mkdir -p "${pma_dir}/tmp"
  chmod 777 "${pma_dir}/tmp"

  case "$OS" in
    debian|ubuntu) chown -R www-data:www-data "$pma_dir" ;;
    rocky|almalinux) chown -R nginx:nginx "$pma_dir" ;;
  esac

  if [[ -d "/var/www/pterodactyl" ]] && command -v nginx &>/dev/null; then
    _out "Configuring nginx for phpMyAdmin..."
    local cfg_dir=""
    case "$OS" in
      ubuntu|debian) cfg_dir="/etc/nginx/sites-available" ;;
      rocky|almalinux) cfg_dir="/etc/nginx/conf.d" ;;
    esac

    local php_sock=""
    case "$OS" in
      ubuntu|debian) php_sock="/run/php/php8.3-fpm.sock" ;;
      rocky|almalinux) php_sock="/var/run/php-fpm/pterodactyl.sock" ;;
    esac

    local pma_fqdn="${PANEL_FQDN:-pma.localhost}"
    cat > "${cfg_dir}/phpmyadmin.conf" <<PHPMAEOF
server {
    listen 8081;
    server_name ${pma_fqdn};

    root ${pma_dir};
    index index.php index.html;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php\$ {
        fastcgi_pass unix:${php_sock};
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
    }

    location ~ /\.ht { deny all; }
}
PHPMAEOF

    [[ "$OS" == "ubuntu" || "$OS" == "debian" ]] && \
      ln -sf "${cfg_dir}/phpmyadmin.conf" "/etc/nginx/sites-enabled/phpmyadmin.conf"
    systemctl reload nginx
    _ok "phpMyAdmin available at http://${pma_fqdn}:8081"
  fi

  _ok "phpMyAdmin installed successfully."
}

_addon_fail2ban() {
  _out "Installing fail2ban..."
  _install_pkgs "fail2ban"

  cat > /etc/fail2ban/jail.local <<'F2BEOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = systemd

[pterodactyl]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 10
findtime = 600
bantime = 7200
F2BEOF

  systemctl enable fail2ban
  systemctl start fail2ban
  _ok "fail2ban installed and configured."
}

_addon_backup() {
  _out "Setting up automated panel backups..."
  local backup_dir="/var/backups/pterodactyl"
  local backup_script="/usr/local/bin/ptero-backup.sh"
  local backup_retention=7

  mkdir -p "$backup_dir"

  _ask BACKUP_RETENTION "Number of daily backups to keep [7]: " "" "7"
  backup_retention="${BACKUP_RETENTION:-7}"

  cat > "$backup_script" <<'BKSHEOF'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/pterodactyl"
RETENTION="${1:-7}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/pterodactyl-${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

# Dump database
DB_NAME=$(grep -oP 'DB_DATABASE=\K.*' /var/www/pterodactyl/.env 2>/dev/null || echo "panel")
DB_USER=$(grep -oP 'DB_USERNAME=\K.*' /var/www/pterodactyl/.env 2>/dev/null || echo "pterodactyl")
DB_PASS=$(grep -oP 'DB_PASSWORD=\K.*' /var/www/pterodactyl/.env 2>/dev/null || echo "")
DB_FILE="${BACKUP_DIR}/db-${TIMESTAMP}.sql"

if [[ -n "$DB_PASS" ]]; then
  mariadb-dump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$DB_FILE" 2>/dev/null || true
else
  mariadb-dump -u "$DB_USER" "$DB_NAME" > "$DB_FILE" 2>/dev/null || true
fi

# Create uncompressed archive first
local uncompressed="${BACKUP_FILE%.gz}"
tar -cf "$uncompressed" \
  -C /var/www \
  --exclude='pterodactyl/node_modules' \
  --exclude='pterodactyl/vendor' \
  pterodactyl/ 2>/dev/null || true

# Append database dump, then compress
if [[ -f "$DB_FILE" ]]; then
  tar -rf "$uncompressed" -C "$BACKUP_DIR" "db-${TIMESTAMP}.sql" 2>/dev/null || true
  rm -f "$DB_FILE"
fi
gzip -f "$uncompressed" 2>/dev/null || true

# Cleanup old backups
cd "$BACKUP_DIR"
ls -tp pterodactyl-*.tar.gz 2>/dev/null | tail -n +"$((RETENTION + 1))" | xargs -r rm --

echo "$(date '+%Y-%m-%d %H:%M:%S') Backup created: $BACKUP_FILE"
BKSHEOF

  chmod +x "$backup_script"

  (crontab -l 2>/dev/null | grep -v "ptero-backup"; echo "0 2 * * * $backup_script $backup_retention >> /var/log/pterodactyl-backup.log 2>&1") | crontab -

  _ok "Automated backups configured. Daily at 2:00 AM, keeping $backup_retention backups."
  _out "Manual backup: $backup_script"
}

_addon_swap() {
  _out "Configuring swap space for Docker..."
  local swap_size_mb=2048
  local swap_file="/swapfile"

  if [[ -f "$swap_file" ]]; then
    _warn "Swap file already exists."
    _confirm "Recreate swap file" || return 0
    swapoff "$swap_file" 2>/dev/null || true
    rm -f "$swap_file"
  fi

  _out "Creating ${swap_size_mb}MB swap file..."
  dd if=/dev/zero of="$swap_file" bs=1M count="$swap_size_mb" status=progress
  chmod 600 "$swap_file"
  mkswap "$swap_file"
  swapon "$swap_file"

  if ! grep -q "$swap_file" /etc/fstab; then
    echo "$swap_file none swap sw 0 0" >> /etc/fstab
    _ok "Swap entry added to /etc/fstab."
  fi

  sysctl -w vm.swappiness=10
  if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=10" >> /etc/sysctl.conf
  fi

  _ok "Swap configured: ${swap_size_mb}MB at $swap_file"
}

_addon_nodejs() {
  _out "Installing Node.js 20.x..."
  local node_version="20"

  if command -v node &>/dev/null; then
    local existing_ver
    existing_ver=$(node -v 2>/dev/null | grep -oP '\d+' | head -1)
    if [[ "$existing_ver" -ge "$node_version" ]]; then
      _ok "Node.js $(node -v) already installed."
      return 0
    fi
    _warn "Node.js $(node -v) found. Upgrading to v${node_version}..."
  fi

  case "$OS" in
    ubuntu|debian)
      curl -fsSL https://deb.nodesource.com/setup_${node_version}.x | bash -
      _install_pkgs "nodejs"
      ;;
    rocky|almalinux)
      curl -fsSL https://rpm.nodesource.com/setup_${node_version}.x | bash -
      _install_pkgs "nodejs"
      ;;
  esac

  _ok "Node.js $(node -v) installed."
}

_addon_yarn() {
  _out "Installing Yarn package manager..."
  if command -v yarn &>/dev/null; then
    _ok "Yarn $(yarn -v 2>/dev/null) already installed."
    return 0
  fi

  if ! command -v npm &>/dev/null; then
    _warn "npm not found. Installing Node.js first..."
    _addon_nodejs
  fi

  npm install -g yarn 2>/dev/null || corepack enable

  if command -v yarn &>/dev/null; then
    _ok "Yarn $(yarn -v 2>/dev/null) installed."
  else
    _err "Failed to install Yarn."
  fi
}

_load_addon() {
  local addon_name="$1"
  local addon_name_lower
  addon_name_lower=$(echo "$addon_name" | awk '{print tolower($0)}')

  _out "Loading addon: $addon_name"

  case "$addon_name_lower" in
    phpmyadmin)
      _addon_phpmyadmin
      ;;
    fail2ban)
      _addon_fail2ban
      ;;
    backup)
      _addon_backup
      ;;
    swap)
      _addon_swap
      ;;
    nodejs|node)
      _addon_nodejs
      ;;
    yarn)
      _addon_yarn
      ;;
    addons-panel|addonspanel|addons)
      _install_addons_panel
      ;;
    *)
      local addon_self="${ADDON_REGISTRY_SELF}/${addon_name_lower}.sh"
      local addon_upstream="${ADDON_REGISTRY_UPSTREAM}/${addon_name_lower}.sh"
      local addon_tmp="/tmp/arkan-addon-${addon_name_lower}.sh"
      _out "Checking addon registry for: $addon_name_lower..."
      if _fetch_asset "$addon_self" "$addon_upstream" "$addon_tmp"; then
        bash "$addon_tmp"
        _ok "Addon '$addon_name' applied."
        rm -f "$addon_tmp"
      else
        _err "Addon '$addon_name' not found locally or in remote registry."
        _out "Run with --list-addons to see all available addons."
        return 1
      fi
      ;;
  esac
}

_available_addons() {
  _brake 58
  _out "Available built-in addons:"
  _out ""
  _out "  ${C_CYN}phpmyadmin${C_NC}     — Install phpMyAdmin for database management"
  _out "  ${C_CYN}fail2ban${C_NC}       — Install fail2ban brute-force protection"
  _out "  ${C_CYN}backup${C_NC}         — Configure automated panel backups (daily cron)"
  _out "  ${C_CYN}swap${C_NC}           — Create 2GB swap file for Docker"
  _out "  ${C_CYN}nodejs${C_NC}         — Install Node.js 20.x"
  _out "  ${C_CYN}yarn${C_NC}           — Install Yarn package manager"
  _out "  ${C_CYN}addons-panel${C_NC}   — Install MuLTiAcidi game server addons panel"
  _out ""
  _out "Usage: Load an addon with --addon <name> or via the interactive menu."
  _out "Remote addons are fetched from ${ARKAN_BASE_URL}/addons/scripts/"
  _out "Override with: ARKAN_BASE_URL=https://your-domain.com bash pterodactyl.sh"
  _brake 58
}


_uninstall_panel() {
  _warn "This will REMOVE the Pterodactyl panel and ALL associated data."
  _warn "  - Panel files (/var/www/pterodactyl)"
  _warn "  - pteroq queue worker service"
  _warn "  - Cron schedule entries"
  _warn "  - Nginx configuration"
  _warn "  - Database and database user"
  _confirm "Are you sure you want to continue" || _fatal "Uninstall aborted."

  _out "Stopping pteroq service..."
  systemctl stop pteroq 2>/dev/null || true
  systemctl disable pteroq 2>/dev/null || true
  rm -f /etc/systemd/system/pteroq.service
  systemctl daemon-reload

  _out "Stopping PHP-FPM..."
  systemctl stop php8.3-fpm 2>/dev/null || true
  systemctl stop php-fpm 2>/dev/null || true

  _out "Removing panel files..."
  rm -rf /var/www/pterodactyl
  rm -rf /var/www/pterodactyl.bak.* 2>/dev/null || true

  _out "Removing nginx configuration..."
  rm -f /etc/nginx/sites-enabled/pterodactyl.conf
  rm -f /etc/nginx/sites-available/pterodactyl.conf
  rm -f /etc/nginx/conf.d/pterodactyl.conf
  systemctl reload nginx 2>/dev/null || true

  _out "Removing cron entries..."
  crontab -l 2>/dev/null | grep -v "pterodactyl" | crontab - 2>/dev/null || true

  _out "Removing database..."
  local db_name="${DB_NAME:-panel}"
  local db_user="${DB_USER:-pterodactyl}"
  _mysql_cmd -e "DROP DATABASE IF EXISTS $db_name;" 2>/dev/null || true
  _mysql_cmd -e "DROP USER IF EXISTS '$db_user'@'127.0.0.1';" 2>/dev/null || true
  _mysql_cmd -e "DROP USER IF EXISTS '$db_user'@'localhost';" 2>/dev/null || true
  _mysql_cmd -e "FLUSH PRIVILEGES;" 2>/dev/null || true

  _ok "Panel fully uninstalled."
  _out "Note: MariaDB, Redis, PHP, and Nginx packages were NOT removed."
  _out "Remove them manually if no longer needed."
}

_uninstall_wings() {
  _warn "This will REMOVE Pterodactyl Wings and ALL server data."
  _warn "  - Wings binary and configuration"
  _warn "  - Wings systemd service"
  _warn "  - All Docker containers and images (game servers)"
  _confirm "Are you sure you want to continue" || _fatal "Uninstall aborted."

  _out "Stopping Wings service..."
  systemctl stop wings 2>/dev/null || true
  systemctl disable wings 2>/dev/null || true
  rm -f /etc/systemd/system/wings.service
  systemctl daemon-reload

  _out "Removing Wings binary..."
  rm -f /usr/local/bin/wings

  _out "Removing Wings configuration..."
  rm -rf /etc/pterodactyl

  _out "Cleaning up Docker containers and images..."
  if command -v docker &>/dev/null; then
    docker ps -a -q --filter "label=pterodactyl.server" 2>/dev/null | xargs -r docker rm -f 2>/dev/null || true
    docker images -q --filter "label=pterodactyl.server" 2>/dev/null | xargs -r docker rmi -f 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    _ok "Docker cleanup completed."
  else
    _warn "Docker not found. Skipping Docker cleanup."
  fi

  _out "Removing server data directory..."
  rm -rf /var/lib/pterodactyl

  _ok "Wings fully uninstalled."
  _out "Note: Docker engine was NOT removed."
  _out "Remove Docker manually if no longer needed: apt remove docker-ce docker-ce-cli containerd.io"
}


_main_menu() {
  _welcome

  while true; do
    echo ""
    _brake 55
    _out "Select an option:"
    _out "  ${C_GRN}[0]${C_NC} Install Panel"
    _out "  ${C_GRN}[1]${C_NC} Install Wings"
    _out "  ${C_GRN}[2]${C_NC} Install Panel + Wings"
    _out "  ${C_GRN}[3]${C_NC} Install Theme (after panel)"
    _out "  ${C_GRN}[4]${C_NC} Install Blueprint / Extension"
    _out "  ${C_GRN}[5]${C_NC} Install Addons Panel (game server addons)"
    _out "  ${C_GRN}[6]${C_NC} Load Addon (phpmyadmin, fail2ban, etc.)"
    _out "  ${C_CYN}[7]${C_NC} List Available Themes"
    _out "  ${C_CYN}[8]${C_NC} List Available Addons"
    _out "  ${C_RED}[9]${C_NC} Uninstall Panel"
    _out "  ${C_RED}[10]${C_NC} Uninstall Wings"
    _out "  ${C_DIM}[11]${C_NC} Exit"
    _brake 55
    echo -n "* Input (0-11): "
    read -r choice

    case "$choice" in
      0)  _ui_panel; _panel_install ;;
      1)  _ui_wings; _wings_install ;;
      2)  _ui_panel; _panel_install; _out ""; _ui_wings; _wings_install ;;
      3)
        _list_themes
        echo ""
        local theme_input=""
        _ask theme_input "Enter theme name or URL: " "Theme name or URL is required."
        _install_theme "$theme_input"
        ;;
      4)
        local bp_url=""
        _ask bp_url "Enter blueprint / extension URL (.blueprint or .ainx): " "URL is required."
        _install_blueprint "$bp_url"
        ;;
      5)  _install_addons_panel ;;
      6)
        _available_addons
        echo ""
        local addon_name=""
        _ask addon_name "Enter addon name: " "Addon name is required."
        _load_addon "$addon_name"
        ;;
      7)  _list_themes ;;
      8)  _available_addons ;;
      9)  _uninstall_panel ;;
      10) _uninstall_wings ;;
      11) _out "Goodbye."; exit 0 ;;
      *)  _err "Invalid option. Enter 0-11." ;;
    esac
  done
}

_welcome() {
  local panel_ver
  panel_ver=$(curl -sL "https://api.github.com/repos/pterodactyl/panel/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
  [[ -z "$panel_ver" ]] && panel_ver="(could not fetch)"

  _brake 60
  _out "ArkanProjects — Pterodactyl Installer v$ARKAN_VERSION"
  _out ""
  _out "https://arkanprojects.vercel.app"
  _out "Latest panel release: $panel_ver"
  _out "OS: $OS $OS_VER  |  Arch: $CPU_ARCH ($ARCH)"
  _brake 60
}


_ui_panel() {
  if [[ -d "/var/www/pterodactyl" ]]; then
    _warn "Existing Pterodactyl panel detected at /var/www/pterodactyl."
    _confirm "Proceed anyway" || _fatal "Installation aborted."
  fi

  _out "=== Panel Configuration ==="
  _out ""

  DB_NAME="-"
  while [[ "$DB_NAME" == *"-"* ]]; do
    _ask DB_NAME "Database name [panel]: " "" "panel"
    [[ "$DB_NAME" == *"-"* ]] && _err "Database name cannot contain hyphens."
  done

  DB_USER="-"
  while [[ "$DB_USER" == *"-"* ]]; do
    _ask DB_USER "Database username [pterodactyl]: " "" "pterodactyl"
    [[ "$DB_USER" == *"-"* ]] && _err "Username cannot contain hyphens."
  done

  DB_PASS=$(_gen_passwd 64)
  _ask_pw DB_PASS "Database password (Enter for random): " "$DB_PASS"

  _ask PANEL_TZ "Timezone [UTC]: " "" "UTC"
  _ask_email PANEL_EMAIL "Email for Let's Encrypt & panel: "
  _ask_email USR_EMAIL "Admin email: "
  _ask USR_NAME "Admin username: " "Username required."
  _ask USR_FIRST "Admin first name: " "Name required."
  _ask USR_LAST "Admin last name: " "Name required."
  _ask_pw USR_PASS "Admin password: "

  while [[ -z "$PANEL_FQDN" ]]; do
    _ask PANEL_FQDN "Panel FQDN (panel.example.com): " "FQDN required."
  done

  CFG_FIREWALL=false; CFG_SSL_ASSUME=false; CFG_LE=false

  case "$OS" in
    ubuntu|debian)
      _confirm "Configure UFW firewall" && CFG_FIREWALL=true
      ;;
    rocky|almalinux)
      _confirm "Configure firewall-cmd" && CFG_FIREWALL=true
      ;;
  esac

  local ssl_available=false
  ! _is_ip_address "$PANEL_FQDN" && ssl_available=true

  if [[ "$ssl_available" == true ]]; then
    if _confirm "Configure HTTPS with Let's Encrypt"; then
      CFG_LE=true
    elif _confirm "Assume SSL (provide your own certificate)"; then
      CFG_SSL_ASSUME=true
    fi
  else
    _warn "Let's Encrypt is not available for IP addresses."
  fi

  if [[ "$CFG_LE" == true || "$CFG_SSL_ASSUME" == true ]]; then
    _verify_fqdn "$PANEL_FQDN" || _warn "DNS verification failed — SSL may not work."
  fi

  if [[ "$CFG_FIREWALL" == true ]]; then
    _firewall_install
    _firewall_allow 22 80 443
    _ok "Firewall ports 22, 80, 443 opened."
  fi

  _brake 55
  _out "Panel configuration summary:"
  _out "  FQDN:              $PANEL_FQDN"
  _out "  Database:          $DB_NAME"
  _out "  DB user:           $DB_USER"
  _out "  Timezone:          $PANEL_TZ"
  _out "  Email:             $PANEL_EMAIL"
  _out "  Admin:             $USR_NAME <$USR_EMAIL>"
  _out "  Firewall:          $CFG_FIREWALL"
  _out "  Let's Encrypt:     $CFG_LE"
  _out "  Assume SSL:        $CFG_SSL_ASSUME"
  _brake 55

  _confirm "Proceed with panel installation" || _fatal "Installation aborted."
}


_ui_wings() {
  if [[ -d "/etc/pterodactyl" ]]; then
    _warn "Existing Wings installation detected at /etc/pterodactyl."
    _confirm "Proceed anyway" || _fatal "Installation aborted."
  fi

  _out "=== Wings Configuration ==="
  _out ""
  _out "The installer will set up Docker, required dependencies,"
  _out "and Wings itself. After installation, configure Wings via"
  _out "the panel or manually at /etc/pterodactyl/config.yml"
  _out ""

  WINGS_INSTALL_MARIADB=false
  WINGS_CFG_MYSQL=false
  CFG_FIREWALL=false
  CFG_LE=false
  WINGS_FQDN=""
  WINGS_EMAIL=""

  _out "Checking virtualization compatibility..."
  _update_repos
  _install_pkgs "virt-what" true
  export PATH="$PATH:/sbin:/usr/sbin"
  local virt_serv; virt_serv=$(virt-what 2>/dev/null || true)
  case "$virt_serv" in
    *openvz*|*lxc*)
      _warn "Unsupported virtualization: $virt_serv. Docker may not work."
      _confirm "Proceed at your own risk" || _fatal "Installation aborted."
      ;;
    *)
      [[ -n "$virt_serv" ]] && _warn "Virtualization: $virt_serv detected."
      ;;
  esac
  _ok "System is compatible with Docker."

  case "$OS" in
    ubuntu|debian) _confirm "Configure UFW firewall" && CFG_FIREWALL=true ;;
    rocky|almalinux) _confirm "Configure firewall-cmd" && CFG_FIREWALL=true ;;
  esac

  if _confirm "Configure database host user"; then
    WINGS_CFG_MYSQL=true
    if ! command -v mysql &>/dev/null; then
      WINGS_INSTALL_MARIADB=true
    fi
    _ask WINGS_DB_USER "Database host username [pterodactyluser]: " "" "pterodactyluser"
    _ask_pw WINGS_DB_PASS "Database host password: "
    _ask WINGS_DB_HOST "Database host address [127.0.0.1]: " "" "127.0.0.1"
  fi

  _warn "Let's Encrypt requires a valid FQDN (not an IP address)."
  if _confirm "Configure HTTPS with Let's Encrypt for Wings"; then
    CFG_LE=true
    while [[ -z "$WINGS_FQDN" ]]; do
      _ask WINGS_FQDN "Wings FQDN (node.example.com): " "FQDN required."
      _verify_fqdn "$WINGS_FQDN" || { _err "Invalid FQDN."; WINGS_FQDN=""; }
    done
    _ask_email WINGS_EMAIL "Email for Let's Encrypt: "
  fi

  if [[ "$CFG_FIREWALL" == true ]]; then
    _firewall_install
    _firewall_allow 22 8080 2022
    [[ "$CFG_LE" == true ]] && _firewall_allow 80 443
    _ok "Firewall ports 22, 8080, 2022 opened."
  fi

  _confirm "Proceed with Wings installation" || _fatal "Installation aborted."
}


_print_usage() {
  cat <<USAGE
ArkanProjects Pterodactyl Installer v$ARKAN_VERSION

Usage:
  curl -sSL https://arkanprojects.vercel.app/installer/pterodactyl.sh | bash -s -- [OPTIONS]

Installation:
  --panel              Install panel only
  --wings              Install wings only
  --both               Install panel + wings

Themes & Extensions:
  --install-theme <name|url>   Install a theme by name or URL
  --install-blueprint <url>    Install a blueprint / extension from URL
  --install-addons-panel       Install MuLTiAcidi game server addons panel
  --list-themes                List available built-in themes
  --list-addons                List available built-in addons

Addons:
  --addon <name>       Apply a post-install addon

Uninstall:
  --uninstall-panel    Remove panel (files, services, cron, database)
  --uninstall-wings    Remove wings (binary, config, Docker cleanup)

General:
  --debug              Enable verbose debug output
  --help               Show this help message

Interactive mode (no flags):
  Displays a menu to select the installation type.

Environment variables (for non-interactive / CI):
  PANEL_FQDN, DB_NAME, DB_USER, DB_PASS, DB_HOST
  PANEL_EMAIL, PANEL_TZ, USR_EMAIL, USR_NAME, USR_FIRST, USR_LAST, USR_PASS
  CFG_FIREWALL, CFG_LE, CFG_SSL_ASSUME
  WINGS_FQDN, WINGS_EMAIL, WINGS_INSTALL_MARIADB
  WINGS_CFG_MYSQL, WINGS_DB_USER, WINGS_DB_PASS, WINGS_DB_HOST

Theme names: nebula, euphoria, betteradmin, nightadmin, loader

Examples:
  curl -sSL https://arkanprojects.vercel.app/installer/pterodactyl.sh | bash
  curl -sSL ... | bash -s -- --panel
  curl -sSL ... | bash -s -- --both --debug
  curl -sSL ... | bash -s -- --install-theme nebula
  curl -sSL ... | bash -s -- --install-blueprint https://example.com/theme.blueprint
  curl -sSL ... | bash -s -- --install-addons-panel
  curl -sSL ... | bash -s -- --addon phpmyadmin
  curl -sSL ... | bash -s -- --list-themes
USAGE
}

_parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --panel)                 RUN_MODE="panel" ;;
      --wings)                 RUN_MODE="wings" ;;
      --both)                  RUN_MODE="both" ;;
      --uninstall-panel)       RUN_MODE="uninstall-panel" ;;
      --uninstall-wings)       RUN_MODE="uninstall-wings" ;;
      --install-theme)         shift; RUN_INSTALL_THEME="$1" ;;
      --install-blueprint)     shift; RUN_INSTALL_BLUEPRINT="$1" ;;
      --install-addons-panel)  RUN_INSTALL_ADDONS_PANEL=true ;;
      --list-themes)           RUN_LIST_THEMES=true ;;
      --list-addons)           RUN_LIST_ADDONS=true ;;
      --addon)                 shift; RUN_ADDON="$1" ;;
      --debug)                 DEBUG_MODE=true; set -x ;;
      --help|-h)               _print_usage; exit 0 ;;
      *)                       _err "Unknown option: $1"; _print_usage; exit 1 ;;
    esac
    shift
  done
}


RUN_MODE=""  # empty = interactive menu
RUN_ADDON=""
RUN_INSTALL_THEME=""
RUN_INSTALL_BLUEPRINT=""
RUN_INSTALL_ADDONS_PANEL=false
RUN_LIST_THEMES=false
RUN_LIST_ADDONS=false

main() {
  _parse_args "$@"
  _preflight

  if [[ "$RUN_LIST_THEMES" == true ]]; then
    _list_themes
    exit 0
  fi

  if [[ "$RUN_LIST_ADDONS" == true ]]; then
    _available_addons
    exit 0
  fi

  if [[ -n "$RUN_INSTALL_THEME" ]]; then
    _install_theme "$RUN_INSTALL_THEME"
  fi

  if [[ -n "$RUN_INSTALL_BLUEPRINT" ]]; then
    _install_blueprint "$RUN_INSTALL_BLUEPRINT"
  fi

  if [[ "$RUN_INSTALL_ADDONS_PANEL" == true ]]; then
    _install_addons_panel
  fi

  case "$RUN_MODE" in
    panel)
      _ui_panel; _panel_install
      ;;
    wings)
      _ui_wings; _wings_install
      ;;
    both)
      _ui_panel; _panel_install
      _out ""
      _ui_wings; _wings_install
      ;;
    uninstall-panel)
      _uninstall_panel
      ;;
    uninstall-wings)
      _uninstall_wings
      ;;
    "")
      _main_menu
      ;;
  esac

  if [[ -n "$RUN_ADDON" ]]; then
    _load_addon "$RUN_ADDON"
  fi

  _ok "All operations completed successfully."
  _brake 60
  _out "Thank you for using ArkanProjects Pterodactyl Installer."
  _out "https://arkanprojects.vercel.app"
  _brake 60
}

main "$@"
