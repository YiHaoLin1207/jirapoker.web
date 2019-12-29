FROM node:lts-alpine

ENV TZ "Asia/Taipei"
RUN npm install -g http-server
RUN npm run build

WORKDIR /app

COPY ./dist ./dist

EXPOSE 8081

CMD [ "http-server", "./dist", "-p", "8081" ]
