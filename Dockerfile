# Multi-stage Dockerfile for Audio Video Separator
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and source code
COPY package.json pnpm-lock.yaml* ./
COPY . .

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install pnpm
RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create uploads and outputs directories
RUN mkdir -p uploads outputs temp
RUN chown nextjs:nodejs uploads outputs temp

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]