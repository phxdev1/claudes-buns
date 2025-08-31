import { existsSync } from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

interface Config {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class ConfigManager {
  private configDir: string;
  private configPath: string;
  private config: Config = {};

  constructor() {
    this.configDir = join(homedir(), '.claude-buns');
    this.configPath = join(this.configDir, 'config.json');
  }

  async init(): Promise<void> {
    // Ensure config directory exists
    if (!existsSync(this.configDir)) {
      await mkdir(this.configDir, { recursive: true });
    }

    // Load existing config or create default
    await this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    try {
      if (existsSync(this.configPath)) {
        const content = await readFile(this.configPath, 'utf-8');
        this.config = JSON.parse(content);
      }
    } catch (error) {
      console.warn('Could not load config file, using defaults');
      this.config = {};
    }

    // Set defaults and environment variables
    this.config = {
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4000,
      temperature: 0.7,
      ...this.config,
      // Environment variables take precedence
      apiKey: process.env.ANTHROPIC_API_KEY || this.config.apiKey,
    };
  }

  async saveConfig(): Promise<void> {
    try {
      const content = JSON.stringify(this.config, null, 2);
      await writeFile(this.configPath, content, 'utf-8');
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  async getConfig(): Promise<Config> {
    return { ...this.config };
  }

  async setConfig(updates: Partial<Config>): Promise<void> {
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
  }

  async setApiKey(apiKey: string): Promise<void> {
    await this.setConfig({ apiKey });
  }
}