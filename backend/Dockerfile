# ---- Builder image ----
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy package + lock + TS/Nest config
COPY package*.json ./
COPY tsconfig*.json nest-cli.json ./

# Install all deps (incl. dev) for build
RUN npm install

# Copy the source
COPY . .

# Build Nest (TS -> JS into /app/dist)
RUN npm run build

# ---- Runtime image ----
FROM node:20-alpine AS backend-production

WORKDIR /app
ENV NODE_ENV=production

# Copy package + lock
COPY package*.json ./

# Install only production deps (includes @mikro-orm/cli now)
RUN npm install --omit=dev

# Copy compiled JS from builder
COPY --from=backend-builder /app/dist ./dist

# Copy MikroORM config (JS)
COPY mikro-orm.config.js ./mikro-orm.config.js

# Copy entrypoint script
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5000

CMD ["./entrypoint.sh"]
