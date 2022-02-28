##
## Dependencies
##
FROM node:lts-alpine AS deps
LABEL maintainer="Pedro Sanders <psanders@fonoster.com>"

WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat g++ make python3

# copy the package.json to install dependencies
COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn,sharing=locked,target=/usr/local/share/.cache/yarn yarn install --frozen-lockfile

##
## Build
##
FROM node:lts-alpine as builder
WORKDIR /app

# get the node environment to use at build time
ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

# Rebuild the source code only when needed
# This is because you may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build

##
## Runner
##
# Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /app

ARG APP_ENV=production
ARG NODE_ENV=production
ARG PORT=3000
ARG HOST=0.0.0.0

ENV APP_ENV=${APP_ENV} \
    NODE_ENV=${NODE_ENV} \
    PORT=${PORT} \
    HOST=${HOST}

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN mkdir -p /app/.next/cache/images && chown nextjs:nodejs /app/.next/cache/images
VOLUME /app/.next/cache/images

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE ${PORT}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

HEALTHCHECK  --interval=5m --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD sh -c "PORT=\$PORT node_modules/.bin/next start"
