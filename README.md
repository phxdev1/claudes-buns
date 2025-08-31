# Claude Buns

![](https://img.shields.io/badge/Bun-1.0%2B-brightgreen?style=flat-square) ![](https://img.shields.io/badge/No%20Node.js-required-blue?style=flat-square)

**Claude Buns** is a Bun runtime wrapper for the official `@anthropic-ai/claude-code` package. It lets you run Claude Code without needing Node.js installed - just Bun!

## Why Claude Buns?

- **🚀 No Node.js Required**: Run Claude Code with only Bun installed
- **📦 Official Package**: Uses the official `@anthropic-ai/claude-code` package under the hood
- **⚡ Bun Performance**: Leverages Bun's fast JavaScript runtime and package management
- **🔄 Always Up-to-Date**: Automatically uses the latest official Claude Code version
- **💯 Full Compatibility**: All Claude Code features and commands work exactly as expected

## Quick Start

### 1. Install Bun (if you haven't already)
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone and Install
```bash
git clone https://github.com/your-username/claude-buns.git
cd claude-buns
bun install
```

### 3. Run Claude Code via Bun
```bash
# Interactive mode
bun run claude

# Or use any Claude Code command
bun run claude --help
bun run claude -p "explain this code" 
bun run claude config
```

## What This Does

Claude Buns is a lightweight wrapper that:

1. **Downloads** the official `@anthropic-ai/claude-code` package
2. **Runs** it through Bun's Node.js compatibility layer
3. **Passes through** all commands, options, and functionality seamlessly

You get the **exact same Claude Code experience** but running on **Bun instead of Node.js**.

## Installation Methods

### Method 1: Direct Bun Usage (Recommended)
```bash
# Clone the repo
git clone https://github.com/your-username/claude-buns.git
cd claude-buns

# Install with Bun
bun install

# Use Claude Code
bun run claude
```

### Method 2: Build and Use Binary
```bash
# Build the wrapper
bun run build

# Run the built version
bun run start

# Or run directly
./dist/index.js --help
```

## Available Commands

All official Claude Code commands work through Claude Buns:

```bash
# Start interactive session
bun run claude

# Print mode for scripting
bun run claude -p "help me debug this function"

# Configuration
bun run claude config set theme dark
bun run claude config get

# MCP server management
bun run claude mcp

# Resume conversations
bun run claude -r

# Continue last conversation
bun run claude -c

# Version and help
bun run claude --version
bun run claude --help
```

## Benefits Over Original

| Feature | Node.js + Claude Code | Bun + Claude Buns |
|---------|---------------------|------------------|
| **Runtime Dependency** | Node.js + npm | Just Bun |
| **Installation Time** | Slower (npm install) | Faster (bun install) |
| **Startup Time** | Standard Node.js | Faster Bun runtime |
| **Package Management** | npm/yarn/pnpm | Bun (built-in) |
| **Features** | ✅ Full | ✅ Full (identical) |
| **Updates** | Manual npm update | Automatic with bun install |

## How It Works

```
User Command → Claude Buns Wrapper → Official Claude Code → Claude AI
     ↓              ↓                      ↓                  ↓
bun run claude → src/index.ts → @anthropic-ai/claude-code → Anthropic API
```

Claude Buns simply:
1. Receives your command
2. Spawns the official Claude Code CLI using `bun run`
3. Passes through all input/output seamlessly
4. Handles graceful shutdown and error reporting

## Requirements

- **Bun** 1.0+ (the only requirement!)
- **Internet connection** (for downloading Claude Code package and AI requests)

## Troubleshooting

### "bun: command not found"
Install Bun first:
```bash
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

### "Cannot find module @anthropic-ai/claude-code"
Run the install command:
```bash
bun install
```

### Authentication Issues
Claude Buns uses the same authentication as official Claude Code. Follow the official Claude Code authentication setup.

## Contributing

This is a wrapper project. For Claude Code features and bugs, please report to the [official Claude Code repository](https://github.com/anthropics/claude-code).

For wrapper-specific issues (Bun compatibility, installation, etc.), open an issue in this repository.

## License

MIT License - see the official `@anthropic-ai/claude-code` package for its licensing terms.