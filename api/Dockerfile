# Force rebuild on Railway - v3
FROM php:8.2-apache-bullseye

# Clean up any existing MPM modules first
RUN apt-get update && apt-get install -y apache2-dev && \
    a2dismod mpm_prefork mpm_worker mpm_event mpm_prefork || true

RUN apt-get update \
  && apt-get install -y --no-install-recommends libzip-dev zip unzip \
  && docker-php-ext-install pdo pdo_mysql \
  && rm -rf /var/lib/apt/lists/*

# Enable only prefork MPM and rewrite
RUN a2enmod mpm_prefork rewrite

WORKDIR /var/www/html

# Copy API sources into the webroot
COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
