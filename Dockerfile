FROM node:24-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:1.31-alpine
COPY --from=build /app/dist/locmns-frontend/browser /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/defaut.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]


