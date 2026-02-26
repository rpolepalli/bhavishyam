FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx ng build bhavishyam --configuration production
RUN npx ng build admin --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/bhavishyam/browser /usr/share/nginx/html
COPY --from=build /app/dist/admin/browser /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
