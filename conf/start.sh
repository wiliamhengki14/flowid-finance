#!/usr/bin/env bash
set -e

PORT="${PORT:-8080}"
echo "==> Configuring Nginx to listen on port: $PORT"
mkdir -p /run/nginx /var/log/supervisor /var/log/nginx

cat <<EOF > /etc/nginx/http.d/default.conf
server {
    listen ${PORT} default_server;
    listen [::]:${PORT} default_server;
EOF

if [ "$PORT" != "8080" ]; then
cat <<EOF >> /etc/nginx/http.d/default.conf
    listen 8080;
    listen [::]:8080;
EOF
fi

if [ "$PORT" != "80" ]; then
cat <<EOF >> /etc/nginx/http.d/default.conf
    listen 80;
    listen [::]:80;
EOF
fi

cat <<'EOF' >> /etc/nginx/http.d/default.conf

    server_name _;
    root /var/www/html/public;

    access_log /dev/stdout;
    error_log /dev/stderr warn;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

echo "==> Testing Nginx configuration:"
nginx -t

echo "==> Preparing Laravel environment..."
if [ -n "$DATABASE_URL" ] && [ -z "$DB_CONNECTION" ]; then
    echo "==> DATABASE_URL detected, setting DB_CONNECTION=pgsql"
    export DB_CONNECTION=pgsql
fi

if [ ! -f /var/www/html/.env ]; then
    echo "==> Copying .env.example to .env..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

if [ -z "$APP_KEY" ]; then
    echo "==> APP_KEY not detected, generating key..."
    php artisan key:generate --force || true
fi

echo "==> Ensuring storage symlink..."
php artisan storage:link || true

echo "==> Running database migrations and seeders..."
php artisan migrate --force --seed || true

echo "==> Caching Laravel routes and views..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "==> Starting web services via Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
