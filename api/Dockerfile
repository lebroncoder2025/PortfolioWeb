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
# copy our nginx config with a non-default name to avoid conflicts with any base-image default
COPY api/nginx.conf /etc/nginx/conf.d/portfolio.conf

RUN chown -R www-data:www-data /var/www/html

COPY api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ensure php-fpm listens on TCP 127.0.0.1:9000 (avoid socket mismatch)
RUN if [ -f /usr/local/etc/php-fpm.d/www.conf ]; then \
      sed -i "s/^listen = .*/listen = 127.0.0.1:9000/" /usr/local/etc/php-fpm.d/www.conf || true; \
    fi

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
