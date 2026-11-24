# Multi-stage Dockerfile para Nuxt 4 en Dokploy
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=build /app/.output ./

EXPOSE 3000
CMD ["node", "server/index.mjs"]
