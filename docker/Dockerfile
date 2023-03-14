# 
# Dockerfile for building Freech peer-to-peer micro-blogging 
# 

FROM ubuntu:14.04

WORKDIR /opt
USER root

RUN apt-get update
RUN apt-get install -y git autoconf libtool build-essential libboost-all-dev libssl-dev libdb++-dev libminiupnpc-dev \
    supervisor nodejs nodejs-legacy npm && \
    apt-get clean

RUN git clone https://github.com/martkist/freech-core.git
RUN cd freech-core && \
    ./bootstrap.sh && \
    make

RUN git clone https://github.com/martkist/freech-react.git
RUN git clone https://github.com/martkist/freech-lib-js.git
RUN git clone https://github.com/martkist/freech-proxy.git

RUN npm install -g browserify react-tools

RUN cd freech-lib-js \ npm install

RUN cd freech-proxy && npm install

RUN mv freech-react/index.html freech-react/home.html

COPY settings.json freech-proxy/

RUN mkdir -p /root/.freech
COPY freech.conf /root/.freech/freech.conf
RUN chmod 600 /root/.freech/freech.conf

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

VOLUME ["/root/.freech"]

CMD ["/usr/bin/supervisord"]
ENTRYPOINT []

EXPOSE 80