# Stage 1: Builder (optional, if you want to rebuild in Docker)
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build Next.js app (optional if you already built in Jenkins)
RUN npm run build

# ----------------------------
# Stage 2: Production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy only necessary files from Jenkins or builder
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy the built Next.js app from builder or Jenkins workspace
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the app
CMD ["npx", "next", "start"]
