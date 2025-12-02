
set -e

echo "📦 Running MikroORM migrations..."
npx mikro-orm migration:up

echo "🚀 Starting NestJS application..."
node dist/main.js
