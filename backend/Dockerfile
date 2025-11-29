# ---- Builder image ----
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy package + lock
COPY package*.json ./
COPY tsconfig*.json nest-cli.json ./

# Install all deps (including dev) for build
RUN npm install

# Copy the source
COPY . .

# Build Nest (TS -> JS)
RUN npm run build

# ---- Runtime image ----
FROM node:20-alpine AS backend-production

WORKDIR /app

# Copy package + lock
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Copy compiled JS from builder
COPY --from=backend-builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/main.js"]
