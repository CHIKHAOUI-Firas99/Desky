FROM node:16.18-alpine AS build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install --verbose

RUN npm run build --prod


FROM nginx:latest

COPY --from=build /usr/local/app/dist/fuse /usr/share/nginx/html

EXPOSE 80
