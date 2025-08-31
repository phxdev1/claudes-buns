#!/bin/bash
# Create minimal Pi Zero package

echo "📦 Creating Pi Zero package..."

# Build locally first
bun run build

# Create minimal package
mkdir -p claude-buns-pi
cp -r dist/ claude-buns-pi/
cp package.json claude-buns-pi/
cp deploy-pi-zero.sh claude-buns-pi/
cp README.md claude-buns-pi/

# Create minimal package.json for Pi
cat > claude-buns-pi/package.json << 'EOF'
{
  "name": "claudes-buns-pi",
  "version": "1.0.0",
  "description": "Claude's Buns 🍑 for Raspberry Pi Zero",
  "main": "dist/index.js",
  "scripts": {
    "start": "bun run dist/index.js",
    "claude": "bun run dist/index.js"
  },
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.98",
    "chalk": "^5.3.0"
  },
  "engines": {
    "bun": ">=1.0.0"
  }
}
EOF

# Create transfer package
tar czf claude-buns-pi-zero.tar.gz claude-buns-pi/

echo "✅ Created claude-buns-pi-zero.tar.gz"
echo ""
echo "Transfer to Pi Zero:"
echo "  scp claude-buns-pi-zero.tar.gz pi@raspberrypi.local:~"
echo ""
echo "On Pi Zero:"
echo "  tar xzf claude-buns-pi-zero.tar.gz"
echo "  cd claude-buns-pi"
echo "  chmod +x deploy-pi-zero.sh"
echo "  ./deploy-pi-zero.sh"

rm -rf claude-buns-pi