#!/bin/bash
set -e

echo "🔨 Building Jackie Peanuts Application..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run TypeScript check
echo "✅ Running TypeScript check..."
pnpm check

# Build the application
echo "🏗️ Building application..."
pnpm build

# Run tests
echo "🧪 Running tests..."
pnpm test

echo "✨ Build completed successfully!"
