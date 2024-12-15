# Install dependencies only when needed
FROM node:18.17.1-alpine3.18 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

ARG NPM_TOKEN

COPY package*.json ./ 
# Copy package.json and package-lock.json to the working directory 
COPY .npmrc .npmrc
RUN echo '//fisherpaykel-885769945763.d.codeartifact.ap-southeast-2.amazonaws.com/npm/fpapackages/:_authToken=${NPM_TOKEN}' >> .npmrc
RUN cat .npmrc
RUN yarn install

# Remove npmrc
RUN rm -f .npmrc

# Rebuild the source code only when needed
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 bloggroup
RUN adduser --system --uid 1001 bloguser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=501:20 /app/.next/standalone ./
COPY --from=builder --chown=501:20 /app/.next/static ./.next/static

USER 501

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
