import Anthropic from '@anthropic-ai/sdk';
import { ConfigManager } from '../config/ConfigManager';
import chalk from 'chalk';

export class AIService {
  private client: Anthropic | null = null;
  private configManager: ConfigManager;

  constructor() {
    this.configManager = new ConfigManager();
  }

  private async initClient(): Promise<void> {
    if (this.client) return;

    const config = await this.configManager.getConfig();
    
    if (!config.apiKey) {
      throw new Error('Anthropic API key not found. Please set ANTHROPIC_API_KEY environment variable or configure it.');
    }

    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async processQuery(query: string): Promise<string> {
    try {
      await this.initClient();
      
      if (!this.client) {
        throw new Error('Failed to initialize Anthropic client');
      }

      const message = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `You are Claude Buns, a helpful coding assistant built with Bun. Help the user with their coding tasks.

User query: ${query}`
          }
        ],
      });

      if (message.content[0].type === 'text') {
        return message.content[0].text;
      }
      
      return 'Sorry, I received an unexpected response format.';
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('authentication')) {
          return chalk.red('Authentication failed. Please check your Anthropic API key.');
        }
        return chalk.red(`Error: ${error.message}`);
      }
      return chalk.red('An unexpected error occurred.');
    }
  }

  async executeCodeTask(task: string, context?: string): Promise<string> {
    const prompt = `
You are a coding assistant. The user wants you to: ${task}

${context ? `Additional context: ${context}` : ''}

Please provide a helpful response that addresses their request. If code is needed, provide clear, well-commented code examples.
`;

    return this.processQuery(prompt);
  }
}