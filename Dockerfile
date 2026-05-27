FROM node:24-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production


FROM nginx:alpine3.23
COPY --from=build /app/dist/locmns-frontend /usr/share/nginx/html

