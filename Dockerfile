FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



