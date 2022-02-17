FROM php:5.5.38-apache
RUN a2enmod rewrite
CMD apache2-foreground
