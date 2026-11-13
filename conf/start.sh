#!/usr/bin/env bash
set -e

PORT=${PORT:-80}
echo "==> Configuring Nginx port to $PORT..."
sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/http.d/default.conf
sed -i "s/listen \[::\]:80;/listen \[::\]:$PORT;/g" /etc/nginx/http.d/default.conf

echo "==> Optimizing Laravel cache..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "==> Running database migrations and seeders..."
php artisan migrate --force --seed || true

echo "==> Ensuring storage symlink..."
php artisan storage:link || true

echo "==> Starting web services via Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
