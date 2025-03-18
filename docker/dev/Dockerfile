FROM php:5.5

RUN echo "deb http://archive.debian.org/debian jessie main contrib non-free" > /etc/apt/sources.list && \
    echo "deb http://archive.debian.org/debian-security jessie/updates main contrib non-free" >> /etc/apt/sources.list && \
    apt-get update && apt-get install -y --force-yes ca-certificates && \
    update-ca-certificates

RUN apt-get install -y --force-yes git

ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN install-php-extensions @composer-1 xdebug

CMD ["sleep", "infinity"]
