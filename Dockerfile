# syntax=docker/dockerfile:1.4

FROM node:lts AS base
EXPOSE 80/tcp 443/tcp 3000/tcp 3001/tcp

WORKDIR /home/node
ARG BUILD_MODE=production
ARG COMPONENT=production

SHELL ["/bin/bash", "-c"]

FROM base AS build

COPY --chown=node:node . .

RUN ./config/docker/build.sh --type $BUILD_MODE --component $COMPONENT

RUN npm ci --ommit=dev

CMD ./run.sh
