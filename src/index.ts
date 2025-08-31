#!/usr/bin/env bun
import { Command } from 'commander';
import { CommandManager } from './commands/CommandManager';
import { AIService } from './services/AIService';
import { ConfigManager } from './config/ConfigManager';
import chalk from 'chalk';

const program = new Command();
const commandManager = new CommandManager();
const aiService = new AIService();
const configManager = new ConfigManager();

async function main() {
  try {
    // Initialize configuration
    await configManager.init();
    
    // Setup CLI
    program
      .name('claude-buns')
      .description('Claude Code ported to Buns - an agentic coding tool')
      .version('1.0.0');

    // Load custom commands from .claude/commands
    await commandManager.loadCommands();

    // Add interactive mode
    program
      .command('interactive')
      .alias('i')
      .description('Start interactive mode')
      .action(async () => {
        console.log(chalk.blue('🚀 Claude Buns Interactive Mode'));
        await startInteractiveMode();
      });

    // Default behavior - start interactive mode if no command provided
    if (process.argv.length === 2) {
      console.log(chalk.blue('🚀 Claude Buns Interactive Mode'));
      await startInteractiveMode();
    } else {
      await program.parseAsync(process.argv);
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

async function startInteractiveMode() {
  const { default: inquirer } = await import('inquirer');
  
  while (true) {
    try {
      const { input } = await inquirer.prompt([
        {
          type: 'input',
          name: 'input',
          message: chalk.green('claude-buns>'),
          prefix: ''
        }
      ]);

      if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        console.log(chalk.yellow('Goodbye! 👋'));
        break;
      }

      if (input.trim()) {
        await processInput(input);
      }
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\nGoodbye! 👋'));
        break;
      }
      console.error(chalk.red('Error:'), error);
    }
  }
}

async function processInput(input: string) {
  try {
    // Check if it's a command
    const customCommand = commandManager.getCommand(input);
    if (customCommand) {
      await commandManager.executeCommand(input);
      return;
    }

    // Otherwise, send to AI
    console.log(chalk.blue('🤖 Processing with AI...'));
    const response = await aiService.processQuery(input);
    console.log(response);
  } catch (error) {
    console.error(chalk.red('Error processing input:'), error);
  }
}

if (import.meta.main) {
  main();
}