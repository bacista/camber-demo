import { mockBackend } from './mock-backend'
import type {
  Quote,
  Order,
  AcceptanceData,
  RejectionData,
  ExtractionResult,
} from './types'

// Configuration
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class ApiClient {
  private baseUrl: string
  private useMock: boolean

  constructor(config?: { baseUrl?: string; useMock?: boolean }) {
    this.baseUrl = config?.baseUrl || API_BASE_URL
    this.useMock = config?.useMock ?? USE_MOCK
  }

  // Helper for production API calls
  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Quote APIs
  async createQuote(quoteData: Partial<Quote>): Promise<Quote> {
    if (this.useMock) {
      return mockBackend.createQuote(quoteData)
    }
    return this.fetch<Quote>('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    })
  }

  async getQuotes(params?: {
    status?: string
    customer_id?: string
    sales_rep_id?: string
    limit?: number
    offset?: number
  }): Promise<Quote[]> {
    if (this.useMock) {
      const quotes = await mockBackend.getQuotes()
      // Apply filters if needed
      let filtered = quotes
      if (params?.status) {
        filtered = filtered.filter(q => q.status === params.status)
      }
      return filtered
    }

    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }
    return this.fetch<Quote[]>(`/quotes?${searchParams}`)
  }

  async getQuote(id: string): Promise<Quote | null> {
    if (this.useMock) {
      return mockBackend.getQuote(id)
    }
    return this.fetch<Quote>(`/quotes/${id}`)
  }

  async updateQuote(id: string, updates: Partial<Quote>): Promise<Quote> {
    if (this.useMock) {
      const result = await mockBackend.updateQuote(id, updates)
      if (!result) throw new Error('Quote not found or not editable')
      return result
    }
    return this.fetch<Quote>(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async sendQuote(id: string): Promise<Quote> {
    if (this.useMock) {
      const result = await mockBackend.sendQuote(id)
      if (!result) throw new Error('Failed to send quote')
      return result
    }
    return this.fetch<Quote>(`/quotes/${id}/send`, {
      method: 'POST',
    })
  }

  async acceptQuote(id: string, acceptanceData: AcceptanceData): Promise<Quote> {
    if (this.useMock) {
      const result = await mockBackend.acceptQuote(id, acceptanceData)
      if (!result) throw new Error('Failed to accept quote')
      return result
    }
    return this.fetch<Quote>(`/quotes/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify(acceptanceData),
    })
  }

  async rejectQuote(id: string, rejectionData: RejectionData): Promise<Quote> {
    if (this.useMock) {
      const result = await mockBackend.rejectQuote(id, rejectionData)
      if (!result) throw new Error('Failed to reject quote')
      return result
    }
    return this.fetch<Quote>(`/quotes/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(rejectionData),
    })
  }

  async convertQuoteToOrder(id: string): Promise<Order> {
    if (this.useMock) {
      const result = await mockBackend.convertQuoteToOrder(id)
      if (!result) throw new Error('Failed to convert quote')
      return result
    }
    return this.fetch<Order>(`/quotes/${id}/convert`, {
      method: 'POST',
    })
  }

  // Order APIs
  async getOrders(params?: {
    source?: string
    status?: string
    confidence_min?: number
    limit?: number
    offset?: number
  }): Promise<Order[]> {
    if (this.useMock) {
      const orders = await mockBackend.getOrders()
      // Apply filters if needed
      let filtered = orders
      if (params?.source) {
        filtered = filtered.filter(o => o.source === params.source)
      }
      if (params?.status) {
        filtered = filtered.filter(o => o.status === params.status)
      }
      if (params?.confidence_min) {
        filtered = filtered.filter(o => o.confidence_score >= params.confidence_min)
      }
      return filtered
    }

    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }
    return this.fetch<Order[]>(`/orders?${searchParams}`)
  }

  async getOrder(id: string): Promise<Order | null> {
    if (this.useMock) {
      return mockBackend.getOrder(id)
    }
    return this.fetch<Order>(`/orders/${id}`)
  }

  async processOrder(id: string): Promise<Order> {
    if (this.useMock) {
      const result = await mockBackend.processOrder(id)
      if (!result) throw new Error('Failed to process order')
      return result
    }
    return this.fetch<Order>(`/orders/${id}/process`, {
      method: 'POST',
    })
  }

  // Document extraction
  async extractFromDocument(file: File): Promise<ExtractionResult> {
    if (this.useMock) {
      return mockBackend.extractFromDocument(file)
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/documents/extract`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Extraction failed: ${response.status}`)
    }

    return response.json()
  }

  // Event subscription (mock only for now)
  subscribe(callback: (event: { type: string; data: any }) => void) {
    if (this.useMock) {
      return mockBackend.subscribe(callback)
    }
    // In production, this would set up WebSocket or SSE connection
    console.warn('Real-time events not implemented for production API')
    return () => {}
  }

  // Demo control (mock only)
  async resetDemo() {
    if (this.useMock) {
      return mockBackend.resetDemo()
    }
    throw new Error('Demo reset only available in mock mode')
  }

  async loadScenario(scenario: 'small_contractor' | 'enterprise' | 'distributor') {
    if (this.useMock) {
      return mockBackend.loadScenario(scenario)
    }
    throw new Error('Demo scenarios only available in mock mode')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for custom configurations
export { ApiClient }