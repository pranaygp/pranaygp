FROM nginx as base
COPY . /data/www
COPY nginx.conf /etc/nginx/ngnix.conf
CMD ["nginx", "-c", "/etc/nginx/ngnix.conf", "-g", "daemon off;"]
