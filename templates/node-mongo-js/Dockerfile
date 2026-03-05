# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── Runtime stage ────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Create uploads directory with correct permissions
RUN mkdir -p Src/Uploads/Logs && chown -R appuser:appgroup Src/Uploads

USER appuser

EXPOSE 3000

CMD ["npm", "run", "dev"]
