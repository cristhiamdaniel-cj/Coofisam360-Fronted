# syntax=docker/dockerfile:1

# Base image for all stages
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

# Install dependencies (with dev deps for build)
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
# Build-time API base (can be overridden at build)
ARG NEXT_PUBLIC_API_BASE=http://backend:8060
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner (lean)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
# Runtime API base (fallback for server-side reads)
ARG NEXT_PUBLIC_API_BASE=http://backend:8060
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

# Install only production deps so `next start` is available
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy build output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/jsconfig.json ./jsconfig.json

# App port (matches package.json start script)
EXPOSE 8061
ENV PORT=8061

CMD ["npm", "run", "start"]

