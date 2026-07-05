# Stage 1: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy dependency files and install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy project source code
COPY . .

# Build the Astro site
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
