FROM node as build
WORKDIR /src
COPY . /src

RUN npm ci
RUN npm run build

FROM nginx
RUN rm -rf /usr/share/nginx/html
COPY --from=build /src/build /usr/share/nginx/html
