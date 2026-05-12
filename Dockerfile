# Multi-stage build for optimized Docker image
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducibility
RUN npm ci --omit=dev

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build Next.js application
RUN npm run build

# Stage 3: Production runner
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy node_modules from dependencies stage
COPY --from=dependencies --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy package files
COPY --chown=nextjs:nodejs package*.json ./

# Copy .next and public from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
