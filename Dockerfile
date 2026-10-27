FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG BUILD_ENV=production
RUN npm run build -- --configuration $BUILD_ENV



FROM nginx:1.31-alpine
COPY --from=build /app/dist/locmns-frontend/browser /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]


