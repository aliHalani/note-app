FROM node:12.16.2-alpine3.11

WORKDIR /server

COPY package*.json /server/

RUN npm install

COPY . /server/

EXPOSE 8080

CMD ["node", "server.js"]