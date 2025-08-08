import type { StorageAdapter } from '../storage';

export interface UpstashConfig {
  url: string;
  token: string;
}

export class UpstashStorage implements StorageAdapter {
  private headers: HeadersInit;
  private baseUrl: string;

  constructor(config: UpstashConfig) {
    this.baseUrl = config.url;
    this.headers = {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request(command: string[], pipeline = false): Promise<any> {
    const endpoint = pipeline ? '/pipeline' : '';
    const body = pipeline ? command : command;
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Upstash request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return pipeline ? data : data.result;
  }

  async get(key: string): Promise<any> {
    const result = await this.request(['GET', key]);
    if (result === null) return null;
    
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }

  async set(key: string, value: any, expiryMs?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    const command = ['SET', key, serialized];
    
    if (expiryMs) {
      command.push('PX', String(expiryMs));
    }
    
    await this.request(command);
  }

  async delete(key: string): Promise<void> {
    await this.request(['DEL', key]);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.request(['EXISTS', key]);
    return result === 1;
  }

  async increment(key: string): Promise<number> {
    return await this.request(['INCR', key]);
  }

  async expire(key: string, expiryMs: number): Promise<void> {
    const seconds = Math.ceil(expiryMs / 1000);
    await this.request(['EXPIRE', key, String(seconds)]);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.request(['KEYS', pattern]);
  }

  async ttl(key: string): Promise<number> {
    const result = await this.request(['TTL', key]);
    return result * 1000; // Convert seconds to milliseconds
  }

  async flush(): Promise<void> {
    await this.request(['FLUSHDB']);
  }
}

export function createUpstashStorage(
  url?: string,
  token?: string
): UpstashStorage {
  const redisUrl = url || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = token || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    throw new Error(
      'Upstash Redis credentials not found. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.'
    );
  }

  return new UpstashStorage({ url: redisUrl, token: redisToken });
}