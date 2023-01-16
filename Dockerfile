FROM node:16.17.0-alpine

RUN mkdir -p /usr/instadam && chown -R node:node /usr/instadam

WORKDIR /usr/instadam

COPY package.json yarn.lock ./

USER root

RUN yarn global add pm2

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

RUN chmod -R 777 /usr/instadam/storage

EXPOSE 5123
