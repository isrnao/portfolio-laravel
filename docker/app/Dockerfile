FROM php:8.4-cli-alpine

# Install system dependencies
RUN apk add --no-cache git bash curl \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS

# Install PHP extensions (PostgreSQL)
RUN docker-php-ext-install pdo_pgsql pgsql

# Install Composer (copy from official image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
