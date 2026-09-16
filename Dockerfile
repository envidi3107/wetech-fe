# ======================
# Stage 1: Build React app
# ======================
FROM node:20-alpine AS build

WORKDIR /app

# REACT_APP_* duoc nhung vao bundle luc BUILD, khong doc duoc luc chay.
# => URL backend phai truyen vao day, khong phai qua environment cua container.
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Repo dung pnpm (packageManager + pnpm-lock.yaml), KHONG co package-lock.json.
# Cai bang "npm install" se bo qua lockfile va resolve lai toan bo dai ^,
# cho ra cay dependency khac may dev => loi kieu
# "'use' is not exported from 'react'".
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN npm install -g corepack@latest && corepack enable

# Copy lockfile TRUOC source de tan dung cache layer cua Docker:
# doi code khong lam cai lai dependency.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Xoa .env de no khong ghi de ARG o tren (.dockerignore khong loai .env)
RUN rm -f .env .env.local

RUN pnpm run build

# ======================
# Stage 2: Serve with Nginx
# ======================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
