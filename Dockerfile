FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build


FROM base AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

EXPOSE 4321

# CMD ["pnpm", "astro", "preview", "--host", "0.0.0.0", "--port", "4321"]
CMD ["node", "./dist/server/entry.mjs"]