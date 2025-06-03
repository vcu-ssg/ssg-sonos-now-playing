# docker/frontend.Dockerfile

FROM nginx:alpine

# Copy built frontend
COPY ../frontend/dist /usr/share/nginx/html

# Replace default NGINX config
COPY ../docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
