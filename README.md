# Claude Buns

![](https://img.shields.io/badge/Bun-1.0%2B-brightgreen?style=flat-square) [![npm]](https://www.npmjs.com/package/claude-buns)

Claude Buns is a port of Claude Code to the Bun runtime. It's an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows -- all through natural language commands.

## Features

- **Interactive Terminal Interface**: Natural language commands in your terminal
- **Custom Commands**: Define reusable commands with `.claude/commands/*.md` files
- **Git Integration**: Automated git workflows and GitHub operations
- **AI-Powered**: Leverages Claude AI for intelligent code assistance
- **Bun-Native**: Built specifically for Bun runtime for optimal performance

## Get Started

1. Install dependencies:

```sh
bun install
```

2. Set your Anthropic API key:

```sh
export ANTHROPIC_API_KEY=your_api_key_here
```

3. Build the project:

```sh
bun run build
```

4. Run Claude Buns:

```sh
bun run start
```

Or in development mode:

```sh
bun run dev
```

## Usage

### Interactive Mode

Simply run `claude-buns` (or `bun run dev` in development) to start the interactive terminal:

```
🚀 Claude Buns Interactive Mode
claude-buns> help me refactor this function
```

### Custom Commands

Create custom commands in `.claude/commands/` directory. Commands are markdown files with YAML frontmatter:

```markdown
---
allowed-tools: Bash(git:*), Bash(gh:*)
description: Create and push a new feature branch
---

## Your task

1. Create a new feature branch
2. Make your changes
3. Commit and push
4. Create a pull request
```

### Configuration

Configuration is stored in `~/.claude-buns/config.json`. You can also set environment variables:

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)

## Project Structure

```
claude-buns/
├── src/
│   ├── index.ts              # Main entry point
│   ├── commands/
│   │   └── CommandManager.ts # Command loading and execution
│   ├── services/
│   │   └── AIService.ts      # Anthropic AI integration
│   └── config/
│       └── ConfigManager.ts  # Configuration management
├── .claude/
│   └── commands/             # Custom command definitions
└── dist/                     # Built output
```

## Development

### Building

```sh
bun run build
```

### Development Mode

```sh
bun run dev
```

## License

MIT