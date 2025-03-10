# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

RUN apk add --no-cache openssl

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY prisma/schema.prisma ./

RUN yarn run prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
#ENV NEW_RELIC_NO_CONFIG_FILE=true
#ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
#ENV NEW_RELIC_LOG=stdout

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 core

COPY prisma ./

COPY --from=builder --chown=core:nodejs /app/dist ./dist
COPY --from=builder --chown=core:nodejs /app/templates ./templates
COPY --from=builder --chown=core:nodejs /app/newrelic.js ./newrelic.js
COPY --from=deps --chown=core:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=core:nodejs /app/package.json ./package.json
COPY --from=deps --chown=core:nodejs /app/yarn.lock ./yarn.lock

USER core

EXPOSE 3000

CMD ["yarn", "start"]
