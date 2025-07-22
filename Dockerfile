# 1. Build stage
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile
COPY . .
RUN rm -rf dist/
RUN npm run build    

# 2. Production dependencies to avoid installing pnpm in stage 3
FROM node:24-alpine AS prod-deps
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile --prod

# 3. Production stage
FROM node:24-alpine AS prod
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/dockerStartup.js"]
