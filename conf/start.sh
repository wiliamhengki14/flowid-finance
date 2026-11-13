#!/usr/bin/env bash
set -e

PORT=${PORT:-80}
echo "==> Configuring Nginx port to $PORT..."
mkdir -p /run/nginx /var/log/supervisor

# Replace port 80 with $PORT
if [ "$PORT" != "80" ]; then
    sed -i "s/listen 80 default_server;/listen ${PORT} default_server;/g" /etc/nginx/http.d/default.conf
    sed -i "s/listen \[::\]:80 default_server;/listen \[::\]:${PORT} default_server;/g" /etc/nginx/http.d/default.conf
fi

echo "==> Verified Nginx listen ports:"
grep -n "listen" /etc/nginx/http.d/default.conf || true

echo "==> Optimizing Laravel cache..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "==> Ensuring storage symlink..."
php artisan storage:link || true

echo "==> Running database migrations and seeders..."
php artisan migrate --force --seed || true

echo "==> Starting web services via Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
