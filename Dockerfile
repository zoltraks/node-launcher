FROM alpine:latest

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY server.js server.env* task.json* client.json* ./

COPY public/ ./public/
COPY include/ ./include/
COPY controller/ ./controller/
COPY route/ ./route/
COPY resource/ ./resource/
COPY repository/ ./repository/

RUN ls -lR

RUN apk -U upgrade

RUN apk add bash

RUN apk add npm

RUN npm install

EXPOSE 20002

CMD [ "npm", "start" ]
