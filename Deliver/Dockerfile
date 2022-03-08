FROM node as builder

COPY . /app
WORKDIR /app 

RUN npm install
RUN npm run build 

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

