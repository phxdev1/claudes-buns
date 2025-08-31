import { existsSync, readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CommandConfig {
  'allowed-tools'?: string[];
  description: string;
  content: string;
}

export class CommandManager {
  private commands: Map<string, CommandConfig> = new Map();
  private commandsDir = '.claude/commands';

  async loadCommands() {
    if (!existsSync(this.commandsDir)) {
      return;
    }

    try {
      const files = readdirSync(this.commandsDir);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const commandName = file.replace('.md', '');
          const filePath = join(this.commandsDir, file);
          const content = await readFile(filePath, 'utf-8');
          
          const config = this.parseCommandFile(content);
          if (config) {
            this.commands.set(commandName, config);
            console.log(chalk.dim(`Loaded command: ${commandName}`));
          }
        }
      }
    } catch (error) {
      console.error(chalk.red('Error loading commands:'), error);
    }
  }

  private parseCommandFile(content: string): CommandConfig | null {
    try {
      const parts = content.split('---');
      if (parts.length < 3) {
        return null;
      }

      const yamlContent = parts[1].trim();
      const markdownContent = parts.slice(2).join('---').trim();
      
      const config = YAML.parse(yamlContent);
      
      return {
        ...config,
        content: markdownContent
      };
    } catch (error) {
      console.error(chalk.red('Error parsing command file:'), error);
      return null;
    }
  }

  getCommand(name: string): CommandConfig | undefined {
    return this.commands.get(name);
  }

  async executeCommand(name: string): Promise<void> {
    const command = this.commands.get(name);
    if (!command) {
      console.log(chalk.red(`Command '${name}' not found`));
      return;
    }

    console.log(chalk.blue(`Executing command: ${name}`));
    console.log(chalk.dim(command.description));

    // Parse and execute any shell commands in the content
    const allowedTools = Array.isArray(command['allowed-tools']) ? command['allowed-tools'] : [];
    await this.executeCommandContent(command.content, allowedTools);
  }

  private async executeCommandContent(content: string, allowedTools: string[]): Promise<void> {
    // Find shell command patterns like !`git status`
    const shellCommandRegex = /!\`([^`]+)\`/g;
    const matches = content.matchAll(shellCommandRegex);

    for (const match of matches) {
      const command = match[1];
      
      // Check if command is allowed
      const isAllowed = allowedTools.some(tool => {
        const toolParts = tool.split('(');
        const toolName = toolParts[0];
        const pattern = toolParts[1]?.replace(')', '');
        return command.startsWith(toolName) || pattern === '*';
      });

      if (!isAllowed && allowedTools.length > 0) {
        console.log(chalk.yellow(`Skipping unauthorized command: ${command}`));
        continue;
      }

      try {
        console.log(chalk.dim(`Running: ${command}`));
        const { stdout, stderr } = await execAsync(command);
        
        if (stdout) {
          console.log(stdout.trim());
        }
        if (stderr) {
          console.error(chalk.yellow(stderr.trim()));
        }
      } catch (error) {
        console.error(chalk.red(`Error executing '${command}':`, error.message));
      }
    }

    // Display the command content (without executed shell commands)
    const displayContent = content.replace(shellCommandRegex, (match, command) => {
      return chalk.dim(`[Executed: ${command}]`);
    });

    console.log('\n' + displayContent);
  }

  listCommands(): string[] {
    return Array.from(this.commands.keys());
  }
}