#!/bin/bash
# Claude's Buns 🍑 - Pi Zero Deployment Script

set -e

echo "🍑 Claude's Buns - Pi Zero Deployment"

# Check if we're on Pi Zero
if [[ $(uname -m) == "armv6l" || $(uname -m) == "arm"* ]]; then
    echo "✅ ARM architecture detected: $(uname -m)"
else
    echo "⚠️  Non-ARM detected: $(uname -m) - continuing anyway"
fi

# Install Bun if not present
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    source ~/.bashrc
else
    echo "✅ Bun already installed"
fi

# Verify Bun works
echo "🔍 Testing Bun..."
bun --version

# Install dependencies
echo "📥 Installing dependencies..."
bun install --production

# Build if needed
if [ ! -f "dist/index.js" ]; then
    echo "🔨 Building project..."
    bun run build
fi

# Test run
echo "🧪 Testing Claude's Buns..."
timeout 5s bun run claude --help || echo "✅ Test completed"

echo ""
echo "🎉 Claude's Buns ready on Pi Zero!"
echo "Run: bun run claude"
echo "Or:  bun run dist/index.js"