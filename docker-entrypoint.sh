#!/bin/sh

echo "🚀 Starting UrbanThreads Setup..."

# 1. Run Migrations
echo "📦 Running Prisma migrations..."
./node_modules/.bin/prisma migrate deploy

# 2. Run Seed (Only if you want to populate data on every restart, 
#    otherwise you might want to run this manually once)
echo "🌱 Seeding database..."
# Using npx tsx ensures it uses the local installation
npx tsx prisma/seed.ts

# 3. Start the Application
echo "✅ Starting application server..."
exec node server.js