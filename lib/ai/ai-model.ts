// lib/ai/ai-model.ts
import OpenAI from 'openai';

// ============================================
// CORE TYPES AND INTERFACES
// ============================================

export interface AIProviderConfig {
  name: string;
  baseURL: string;
  defaultModel: string;
  headers?: Record<string, string>;
}

export interface AIModelConfig {
  apiKey: string;
  provider?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  debug?: boolean;
  timeout?: number;
  retryAttempts?: number;
}

export interface RequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason?: string;
}

// ============================================
// LOGGING SYSTEM
// ============================================

export interface Logger {
  log(type: string, message: string, data?: unknown): void;
  enable(enabled: boolean): void;
}

export class DefaultLogger implements Logger {
  private enabled = false;

  private readonly colors = {
    REQUEST: '\x1b[36m',    // Cyan
    RESPONSE: '\x1b[32m',   // Green
    STREAM: '\x1b[33m',     // Yellow
    ERROR: '\x1b[31m',      // Red
    CONFIG: '\x1b[35m',     // Magenta
    MESSAGE: '\x1b[34m',    // Blue
    reset: '\x1b[0m',
  };

  log(type: string, message: string, data?: unknown): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const color = this.colors[type as keyof typeof this.colors] || this.colors.reset;

    console.log(`\n${color}═══════════════════════════════════════════════════════${this.colors.reset}`);
    console.log(`${color}[${timestamp}] ${type}${this.colors.reset}`);
    console.log(`${color}${message}${this.colors.reset}`);

    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }

    console.log(`${color}═══════════════════════════════════════════════════════${this.colors.reset}\n`);
  }

  enable(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// ============================================
// PROVIDER MANAGEMENT
// ============================================

export class ProviderRegistry {
  private static providers: Map<string, AIProviderConfig> = new Map([
    ['openrouter', {
      name: 'OpenRouter',
      baseURL: 'https://openrouter.ai/api/v1',
      defaultModel: 'z-ai/glm-4.5-air:free',
      headers: {
        'HTTP-Referer': 'https://replyx.ai', // Replace with actual app URL if needed
        'X-Title': 'ReplyX AI',
      }
    }],
    ['openai', {
      name: 'OpenAI',
      baseURL: 'https://api.openai.com/v1',
      defaultModel: 'gpt-3.5-turbo',
    }],
    ['anthropic', {
      name: 'Anthropic',
      baseURL: 'https://api.anthropic.com/v1',
      defaultModel: 'claude-3-haiku-20240307',
    }],
  ]);

  static registerProvider(id: string, config: AIProviderConfig): void {
    if (!id || !config.name || !config.baseURL || !config.defaultModel) {
      throw new Error('Provider configuration requires id, name, baseURL, and defaultModel');
    }
    this.providers.set(id, config);
  }

  static getProvider(id: string): AIProviderConfig | undefined {
    return this.providers.get(id);
  }

  static getAllProviders(): Map<string, AIProviderConfig> {
    return new Map(this.providers);
  }
}

// ============================================
// MAIN AI MODEL CLASS
// ============================================

export class AIModel {
  private client: OpenAI;
  private messages: Message[] = [];
  private config: Required<Omit<AIModelConfig, 'apiKey' | 'provider'>>;
  private provider: AIProviderConfig;
  private logger: Logger;

  constructor(config: AIModelConfig, logger?: Logger) {
    if (!config.apiKey?.trim()) {
      throw new Error('API key is required and cannot be empty');
    }

    this.logger = logger || new DefaultLogger();
    this.logger.enable(!!config.debug);

    const providerId = config.provider || 'openrouter';
    const provider = ProviderRegistry.getProvider(providerId);

    if (!provider) {
      throw new Error(`Provider '${providerId}' not found.`);
    }

    this.provider = provider;

    this.client = new OpenAI({ 
      apiKey: config.apiKey,
      baseURL: provider.baseURL,
      defaultHeaders: provider.headers,
      timeout: config.timeout || 30000,
    });

    this.config = {
      model: config.model || provider.defaultModel,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens || 1000,
      systemPrompt: config.systemPrompt || '',
      debug: config.debug ?? false,
      retryAttempts: config.retryAttempts || 3,
      timeout: config.timeout || 30000,
    };

    this.logger.log('CONFIG', '🚀 AIModel initialized', {
      provider: provider.name,
      model: this.config.model,
    });
  }

  setSystemPrompt(prompt: string): this {
    this.config.systemPrompt = prompt;
    return this;
  }

  addMessage(content: string | MessageContent[], role: 'user' | 'assistant' = 'user'): this {
    this.messages.push({ role, content });
    return this;
  }

  addUserMessage(content: string | MessageContent[]): this {
    return this.addMessage(content, 'user');
  }

  addAssistantMessage(content: string | MessageContent[]): this {
    return this.addMessage(content, 'assistant');
  }

  clearMessages(): this {
    this.messages = [];
    return this;
  }

  private buildMessages(): Message[] {
    const msgs: Message[] = [];
    if (this.config.systemPrompt) {
      msgs.push({ role: 'system', content: this.config.systemPrompt });
    }
    msgs.push(...this.messages);
    return msgs;
  }

  private async makeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    throw lastError || new Error('Request failed');
  }

  async send(options?: RequestOptions): Promise<AIResponse> {
    const messages = this.buildMessages();
    const config = {
        model: options?.model || this.config.model,
        temperature: options?.temperature ?? this.config.temperature,
        maxTokens: options?.maxTokens || this.config.maxTokens,
    };

    this.logger.log('REQUEST', '📤 Sending request', { model: config.model });

    try {
      const completion = await this.makeRequest(() => 
        this.client.chat.completions.create({
          model: config.model,
          messages: messages as any,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: false,
        })
      );

      const content = completion.choices[0]?.message?.content || '';

      this.messages.push({ role: 'assistant', content });

      return {
        content,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason,
      };

    } catch (error) {
      this.logger.log('ERROR', '❌ Request failed', error);
      throw error;
    }
  }
}
