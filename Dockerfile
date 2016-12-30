FROM nginx:latest

MAINTAINER Sasha Novik <alex@nvx.me>

COPY nginx.conf /etc/nginx/nginx.conf

ADD dist /var/www/dist