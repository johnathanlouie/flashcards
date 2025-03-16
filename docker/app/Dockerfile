FROM php:5.5-apache

WORKDIR /var/www/html
RUN a2enmod rewrite
COPY 50-include_path.ini /usr/local/etc/php/conf.d

ENTRYPOINT [ "apache2-foreground" ]
