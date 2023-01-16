FROM node:16.17.0-alpine

RUN mkdir -p /usr/instadam && chown -R node:node /usr/instadam

WORKDIR /usr/instadam

COPY package.json yarn.lock ./

USER root

RUN yarn global add pm2

RUN yarn install --pure-lockfile

COPY --chown=root:root . .

EXPOSE 5123
