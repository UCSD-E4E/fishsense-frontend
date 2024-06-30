FROM node as build
WORKDIR /src
COPY . /src

RUN npm ci
RUN npm run build

FROM nginx
COPY --from=build /src /usr/share/nginx/html
