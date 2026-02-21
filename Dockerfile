FROM node:22.4 as build
WORKDIR /app
COPY .  .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/accio-invest/browser usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 82
CMD ["nginx", "-g", "daemon off;"]
# RUN npm install @angular/cli -g
# RUN npm run start:prod
# EXPOSE 4200
# CMD ["ng", "serve", "--host", "0.0.0.0"]
