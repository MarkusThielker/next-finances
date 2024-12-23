FROM oven/bun AS base

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install


# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# dependencies have to be changed depending on target architecture
RUN bun install @node-rs/argon2-linux-x64-musl # arm64 = @node-rs/argon2-linux-arm64-musl
RUN bun install @node-rs/bcrypt-linux-x64-musl # arm64 = @node-rs/bcrypt-linux-arm64-musl

COPY prisma/ ./prisma/

RUN bunx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
