FROM php:8.2-apache

RUN apt-get update \
  && apt-get install -y --no-install-recommends libzip-dev zip unzip \
  && docker-php-ext-install pdo pdo_mysql \
  && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

WORKDIR /var/www/html

# Copy API sources into the webroot (assumes this Dockerfile is in the `api/` folder)
COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
