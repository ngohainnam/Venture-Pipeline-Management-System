FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:./dev.db

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run db:generate && npm run db:push && npm run db:seed && npm run dev -- --hostname 0.0.0.0"]
