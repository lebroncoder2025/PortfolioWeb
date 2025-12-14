FROM php:8.2-fpm-bullseye

# Install nginx and required packages
RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx ca-certificates libzip-dev zip unzip \
  && docker-php-ext-install pdo pdo_mysql \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy API sources into the webroot (handle repo-root build context)
COPY api/ /var/www/html/

# Nginx config: serve PHP through php-fpm, fallback to index.php for SPA
RUN rm /etc/nginx/sites-enabled/default || true
COPY api/nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R www-data:www-data /var/www/html

COPY api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
