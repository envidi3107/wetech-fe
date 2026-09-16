# ======================
# Stage 1: Build React app
# ======================
FROM node:20-alpine AS build

WORKDIR /app

# REACT_APP_* duoc nhung vao bundle luc BUILD, khong doc duoc luc chay.
# => URL backend phai truyen vao day, khong phai qua environment cua container.
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package*.json ./
RUN npm install

COPY . .

# Xoa .env de no khong ghi de ARG o tren (.dockerignore khong loai .env)
RUN rm -f .env .env.local

RUN npm run build

# ======================
# Stage 2: Serve with Nginx
# ======================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
