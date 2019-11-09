FROM node:lts-alpine

ENV TZ "Asia/Taipei"
RUN npm install -g http-server

WORKDIR /app

COPY . .

EXPOSE 8081

CMD [ "http-server", "publish/docker", "-p", "8081" ]
