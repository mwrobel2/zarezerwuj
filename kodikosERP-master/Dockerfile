# Build:
# docker build -t meanjs/mean .
#
# Run:
# docker run -it meanjs/mean
#
# Compose:
# docker-compose up -d

FROM ubuntu:latest
MAINTAINER MEAN.JS

# 80 = HTTP, 443 = HTTPS, 3000 = MEAN.JS server, 35729 = livereload, 8080 = node-inspector
EXPOSE 4200 4500 4501 4502 5500 5501 5502 35729

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apt-get update -q \
    && apt-get install -yqq \
    curl \
    git \
    ssh \
    gcc \
    make \
    build-essential \
    libkrb5-dev \
    sudo \
    apt-utils \
    lynx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install MEAN.JS Prerequisites
#RUN npm -g install npm 
#RUN npm install -g webpack 
#RUN npm install --quiet -g gulp bower yo mocha karma-cli pm2
#RUN npm rebuild bcrypt
#RUN npm install fsevents --no-optional 
RUN npm cache clean --force

RUN mkdir -p /opt/mean.js/public/lib
WORKDIR /opt/mean.js

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
#COPY backend/package.json /opt/mean.js/package.json
#RUN echo backend install && npm install --quiet
# && npm cache clean
#COPY package.json /opt/mean.js/package.json
#RUN echo frontend install && npm install --quiet
# && npm cache clean

# Install bower packages
#COPY bower.json /opt/mean.js/bower.json
#COPY .bowerrc /opt/mean.js/.bowerrc
#RUN bower install --quiet --allow-root --config.interactive=false

COPY . /opt/mean.js
#RUN npm install bcrypt@latest --save
RUN npm rebuild bcrypt --build-from-source

# Run MEAN.JS server
RUN cd /opt/mean.js && npm install
RUN cd backend && npm install && cd ..
RUN node backend/backendStart.js 5501 HPStal 1>>backendHPStal.log 2>>backendHPStal.err &
RUN npm run build --prod
CMD node serverDeployStatic.js 4501 HPStal 1>>frontendHPStal.log 2>>frontendHPStal.err &
