import type { StorageAdapter } from '../types';

/**
 * In-memory storage adapter for development
 */
export class MemoryStorage implements StorageAdapter {
  private store: Map<string, { value: any; expiresAt?: number }> = new Map();

  async get(key: string): Promise<any> {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }

    // Check expiry
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: any, expiryMs?: number): Promise<void> {
    const item = {
      value,
      expiresAt: expiryMs ? Date.now() + expiryMs : undefined
    };
    this.store.set(key, item);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  // Development helper
  async clear(): Promise<void> {
    this.store.clear();
  }

  // Development helper
  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

/**
 * Vercel KV storage adapter
 */
export class KVStorage implements StorageAdapter {
  private kv: any; // Will be @vercel/kv instance

  constructor(kvInstance: any) {
    this.kv = kvInstance;
  }

  async get(key: string): Promise<any> {
    try {
      return await this.kv.get(key);
    } catch (error) {
      console.error(`KV get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, expiryMs?: number): Promise<void> {
    try {
      if (expiryMs) {
        // KV expects seconds, not milliseconds
        const expirySeconds = Math.floor(expiryMs / 1000);
        await this.kv.set(key, value, { ex: expirySeconds });
      } else {
        await this.kv.set(key, value);
      }
    } catch (error) {
      console.error(`KV set error for key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.kv.del(key);
    } catch (error) {
      console.error(`KV delete error for key ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.kv.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`KV exists error for key ${key}:`, error);
      return false;
    }
  }
}

/**
 * Factory function to create appropriate storage adapter
 */
export function createStorage(): StorageAdapter {
  // Check if we're using Upstash Redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      // Dynamic import to avoid build issues if not installed
      const { createUpstashStorage } = require('./storage/upstash');
      return createUpstashStorage();
    } catch (error) {
      console.warn('Failed to initialize Upstash storage, falling back to memory:', error);
    }
  }
  
  // Check if we're in Vercel environment with KV (deprecated but still support)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      // Dynamic import to avoid build issues if not installed
      const { kv } = require('@vercel/kv');
      return new KVStorage(kv);
    } catch (error) {
      console.warn('Failed to initialize KV storage, falling back to memory:', error);
    }
  }

  // Default to memory storage for development
  console.log('Using in-memory storage (development mode)');
  return new MemoryStorage();
}

/**
 * Browser storage utilities for client-side
 */
// Export storage adapters
export { UpstashStorage, createUpstashStorage } from './storage/upstash';
export * from './storage/browser';

export const browserStorage = {
  /**
   * Get item from localStorage with JSON parsing
   */
  getLocal(key: string): any {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage with JSON stringification
   */
  setLocal(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage set error:', error);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeLocal(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Get item from sessionStorage
   */
  getSession(key: string): any {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in sessionStorage
   */
  setSession(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('sessionStorage set error:', error);
    }
  },

  /**
   * Remove item from sessionStorage
   */
  removeSession(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }
};