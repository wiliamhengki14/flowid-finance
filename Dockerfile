# ============================================================
# PHP Application Container (Production)
# ============================================================
FROM php:8.3-fpm-alpine

# Install essential system packages
RUN apk add --no-cache \
    bash \
    nginx \
    supervisor \
    curl

# Install official PHP extension installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP extensions cleanly (opcache is already built into php-fpm)
RUN install-php-extensions \
    pdo_pgsql \
    pdo_mysql \
    zip \
    intl \
    bcmath \
    gd

# Get official Composer 2
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create runtime directories
RUN mkdir -p /run/nginx /var/log/supervisor /var/log/nginx

# Copy server configurations
COPY conf/nginx/nginx-site.conf /etc/nginx/http.d/default.conf
COPY conf/supervisor/supervisord.conf /etc/supervisord.conf
COPY conf/start.sh /start.sh
RUN sed -i 's/\r$//' /start.sh && chmod +x /start.sh

# Copy application source code (including pre-compiled public/build assets)
COPY . .

# Install PHP dependencies for production
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

# Set storage and cache permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Production environment variables
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

EXPOSE 8080 80

CMD ["/start.sh"]
