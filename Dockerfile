# Build Stage
FROM node:22.12-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Apply patches
COPY patches/* ./patches/
RUN npm run postinstall

# Copy project files
COPY . .
RUN npm run build && rm .env

# Runtime Stage
FROM node:22.12-alpine AS runner

# Add Midnight Commander
RUN apk --no-cache add mc

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
