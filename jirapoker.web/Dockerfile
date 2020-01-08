FROM node:lts-alpine as build-stage

ARG VUE_APP_HOST_BACKEND_URL

ENV TZ "Asia/Taipei"
ENV VUE_APP_HOST_BACKEND_URL $VUE_APP_HOST_BACKEND_URL

WORKDIR /app

COPY . .

# build stage
RUN npm install
RUN npm run build -- --mode docker --dest publish


# production stage
FROM nginx:stable-alpine as production-stage

ENV VUE_APP_HOST_FRONTEND_PORT $VUE_APP_HOST_FRONTEND_PORT

COPY --from=build-stage /app/publish /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE $VUE_APP_HOST_FRONTEND_PORT
CMD ["nginx", "-g", "daemon off;"]

