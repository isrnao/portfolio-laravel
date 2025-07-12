FROM php:8.4-cli-alpine

RUN apk add --no-cache git bash curl \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS

RUN docker-php-ext-install pdo_pgsql pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
