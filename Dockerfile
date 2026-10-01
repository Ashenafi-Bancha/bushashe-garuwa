# Bushaashe Garuwa: the website and the API in one container.
#
# The website (frontend/) is built to static files; the API (backend/) is built
# and then serves both: /api/... for the forms and the staff area, everything
# else for the website. One app, one address, no cross-site setup.
#
# Needs at run time: DATABASE_URL (PostgreSQL). See backend/.env.example.

# ── 1. build both parts ──────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /repo
RUN npm install -g pnpm@11.9.0

# dependencies first, so this layer is reused until a package.json changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN pnpm install --frozen-lockfile

COPY .figma/make/site.json .figma/make/site.json
COPY frontend frontend
COPY backend backend

# the website calls the API on its own address
ENV VITE_API_URL=/api
RUN pnpm --filter @bushaashe/frontend build && pnpm --filter @bushaashe/backend build

# ── 2. what actually runs: the API, its own packages, the built website ─────
FROM node:22-alpine AS run
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g pnpm@11.9.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN pnpm install --frozen-lockfile --prod --filter @bushaashe/backend && pnpm store prune

COPY --from=build /repo/backend/dist backend/dist
COPY --from=build /repo/frontend/dist web

ENV WEB_DIST=/app/web
ENV PORT=8080
EXPOSE 8080

USER node
WORKDIR /app/backend
CMD ["node", "dist/server.js"]
