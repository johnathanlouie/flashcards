FROM php:5.5-apache

WORKDIR /var/www/html
RUN a2enmod rewrite

ENTRYPOINT [ "apache2-foreground" ]
