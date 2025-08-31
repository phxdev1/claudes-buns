#!/usr/bin/env bun
import { spawn } from 'child_process';
import { resolve } from 'path';
import chalk from 'chalk';

/**
 * Claude's Buns 🍑 - Run Claude Code through Bun runtime
 * 
 * This wrapper allows you to use the official @anthropic-ai/claude-code package
 * without needing Node.js installed - just Bun!
 */

async function main() {
  console.log(chalk.blue('🚀 Claude\'s Buns 🍑 - Running Claude Code via Bun'));
  
  try {
    // Path to the official claude-code CLI
    const claudeCliPath = resolve('./node_modules/@anthropic-ai/claude-code/cli.js');
    
    // Get command line arguments (excluding the first two which are bun and script path)
    const args = process.argv.slice(2);
    
    console.log(chalk.dim('Starting official Claude Code...'));
    
    // Spawn the official claude-code CLI using Bun's Node.js compatibility
    const child = spawn('bun', ['run', claudeCliPath, ...args], {
      stdio: 'inherit', // Pass through stdin/stdout/stderr
      env: process.env,
      shell: true
    });
    
    // Handle process exit
    child.on('exit', (code) => {
      process.exit(code || 0);
    });
    
    // Handle errors
    child.on('error', (error) => {
      console.error(chalk.red('Error launching Claude Code:'), error.message);
      
      // Provide helpful error messages
      if (error.message.includes('ENOENT')) {
        console.error(chalk.yellow('\nTroubleshooting:'));
        console.error(chalk.yellow('1. Make sure you ran: bun install'));
        console.error(chalk.yellow('2. Ensure @anthropic-ai/claude-code is installed'));
        console.error(chalk.yellow('3. Check that Bun is properly installed'));
      }
      
      process.exit(1);
    });
    
  } catch (error) {
    console.error(chalk.red('Failed to start Claude Code:'), error);
    
    // Provide installation instructions
    console.error(chalk.yellow('\nTo install dependencies:'));
    console.error(chalk.white('  bun install'));
    console.error(chalk.yellow('\nTo run Claude Buns:'));
    console.error(chalk.white('  bun run start'));
    
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Goodbye from Claude\'s Buns! 🍑'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

if (import.meta.main) {
  main().catch((error) => {
    console.error(chalk.red('Unexpected error:'), error);
    process.exit(1);
  });
}