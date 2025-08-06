import { faker } from '@faker-js/faker'
import type {
  Quote,
  Order,
  QuoteStatus,
  Customer,
  SalesRep,
  Product,
  LineItem,
  AcceptanceData,
  RejectionData,
  ExtractionResult,
  OrderSource,
  StatusChange,
} from './types'

// Simulated delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Event emitter for real-time updates
type EventCallback = (event: { type: string; data: any }) => void
class EventEmitter {
  private listeners: Set<EventCallback> = new Set()

  subscribe(callback: EventCallback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  emit(type: string, data: any) {
    this.listeners.forEach(callback => callback({ type, data }))
  }
}

class MockBackendService {
  private quotes: Map<string, Quote> = new Map()
  private orders: Map<string, Order> = new Map()
  private events = new EventEmitter()
  private quoteCounter = 1000
  private orderCounter = 2000

  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Sample products
    const products: Product[] = [
      {
        id: 'prod-1',
        sku: 'PVC-12',
        name: '12" PVC Pipe',
        description: 'Schedule 40 PVC pipe, 12 inch diameter',
        unit_price: 45.50,
        unit_of_measure: 'EA',
        inventory_status: 'in_stock',
        available_quantity: 150,
      },
      {
        id: 'prod-2',
        sku: 'CEMENT-50',
        name: 'Portland Cement 50lb',
        description: 'Type I/II Portland cement, 50 pound bag',
        unit_price: 12.75,
        unit_of_measure: 'BAG',
        inventory_status: 'low_stock',
        available_quantity: 20,
        lead_time_days: 3,
      },
      {
        id: 'prod-3',
        sku: 'REBAR-20',
        name: '#5 Rebar 20ft',
        description: '5/8" diameter reinforcing steel bar, 20 foot length',
        unit_price: 18.25,
        unit_of_measure: 'EA',
        inventory_status: 'in_stock',
        available_quantity: 500,
      },
    ]

    // Sample customer
    const customer: Customer = {
      id: 'cust-1',
      name: 'ACME Construction',
      email: 'purchasing@acmeconstruction.com',
      phone: '512-555-0100',
      type: 'B2B Contractor',
      tax_exempt: true,
      tax_exemption_number: 'TX-EXEMPT-123',
      credit_limit: 50000,
    }

    // Sample sales rep
    const salesRep: SalesRep = {
      id: 'rep-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@camber.ai',
      phone: '512-555-0200',
    }

    // Create a sample draft quote
    const quote: Quote = {
      id: 'quote-1',
      quote_number: `Q-2024-${this.quoteCounter++}`,
      version: 1,
      status: 'draft',
      customer,
      sales_rep: salesRep,
      line_items: products.slice(0, 2).map((product, index) => ({
        id: `line-${index + 1}`,
        product,
        quantity: index === 0 ? 25 : 15,
        unit_price: product.unit_price,
        subtotal: product.unit_price * (index === 0 ? 25 : 15),
        confidence_score: 0.95,
      })),
      billing_address: {
        street: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
      job_site_address: {
        street: '456 Construction Way',
        city: 'Round Rock',
        state: 'TX',
        zip: '78664',
      },
      project_name: 'Westlake Office Complex - Phase 2',
      subtotal: 1328.75,
      tax_rate: 0,
      tax_amount: 0,
      tax_exempt: true,
      tax_exemption_number: 'TX-EXEMPT-123',
      shipping_cost: 125.00,
      total: 1453.75,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
      updated_at: new Date(),
      status_history: [
        {
          from: 'draft' as QuoteStatus,
          to: 'draft' as QuoteStatus,
          timestamp: new Date(),
        },
      ],
    }

    this.quotes.set(quote.id, quote)
  }

  // Subscribe to events
  subscribe(callback: EventCallback) {
    return this.events.subscribe(callback)
  }

  // Quote APIs
  async createQuote(quoteData: Partial<Quote>): Promise<Quote> {
    await delay(500)

    const quote: Quote = {
      id: `quote-${Date.now()}`,
      quote_number: `Q-2024-${this.quoteCounter++}`,
      version: 1,
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
      status_history: [
        {
          from: 'draft' as QuoteStatus,
          to: 'draft' as QuoteStatus,
          timestamp: new Date(),
        },
      ],
      subtotal: 0,
      tax_rate: 0.0825,
      tax_amount: 0,
      shipping_cost: 0,
      total: 0,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ...quoteData,
    } as Quote

    // Calculate totals
    if (quote.line_items) {
      quote.subtotal = quote.line_items.reduce((sum, item) => sum + item.subtotal, 0)
      quote.tax_amount = quote.tax_exempt ? 0 : quote.subtotal * quote.tax_rate
      quote.total = quote.subtotal + quote.tax_amount + quote.shipping_cost
    }

    this.quotes.set(quote.id, quote)
    this.events.emit('quote.created', quote)
    return quote
  }

  async getQuotes(): Promise<Quote[]> {
    await delay(300)
    return Array.from(this.quotes.values())
  }

  async getQuote(id: string): Promise<Quote | null> {
    await delay(200)
    return this.quotes.get(id) || null
  }

  async updateQuote(id: string, updates: Partial<Quote>): Promise<Quote | null> {
    await delay(400)
    const quote = this.quotes.get(id)
    if (!quote || quote.status !== 'draft') {
      return null
    }

    const updated = {
      ...quote,
      ...updates,
      updated_at: new Date(),
      version: quote.version + 1,
    }

    this.quotes.set(id, updated)
    this.events.emit('quote.updated', updated)
    return updated
  }

  async sendQuote(id: string): Promise<Quote | null> {
    await delay(600)
    const quote = this.quotes.get(id)
    if (!quote || quote.status !== 'draft') {
      return null
    }

    const updated = {
      ...quote,
      status: 'sent' as QuoteStatus,
      sent_at: new Date(),
      updated_at: new Date(),
      status_history: [
        ...quote.status_history,
        {
          from: quote.status,
          to: 'sent' as QuoteStatus,
          timestamp: new Date(),
        },
      ],
    }

    this.quotes.set(id, updated)
    this.events.emit('quote.sent', updated)
    return updated
  }

  async acceptQuote(id: string, acceptanceData: AcceptanceData): Promise<Quote | null> {
    await delay(800)
    const quote = this.quotes.get(id)
    if (!quote || !['sent', 'viewed'].includes(quote.status)) {
      return null
    }

    const updated = {
      ...quote,
      status: 'accepted' as QuoteStatus,
      accepted_at: new Date(),
      updated_at: new Date(),
      status_history: [
        ...quote.status_history,
        {
          from: quote.status,
          to: 'accepted' as QuoteStatus,
          timestamp: new Date(),
          changed_by: acceptanceData.accepted_by,
          notes: acceptanceData.acceptance_notes,
        },
      ],
    }

    this.quotes.set(id, updated)
    this.events.emit('quote.accepted', { quote: updated, acceptanceData })

    // Automatically trigger conversion after a delay
    setTimeout(() => {
      this.convertQuoteToOrder(id, acceptanceData.po_number)
    }, 2000)

    return updated
  }

  async rejectQuote(id: string, rejectionData: RejectionData): Promise<Quote | null> {
    await delay(500)
    const quote = this.quotes.get(id)
    if (!quote || !['sent', 'viewed'].includes(quote.status)) {
      return null
    }

    const updated = {
      ...quote,
      status: 'rejected' as QuoteStatus,
      rejected_at: new Date(),
      updated_at: new Date(),
      status_history: [
        ...quote.status_history,
        {
          from: quote.status,
          to: 'rejected' as QuoteStatus,
          timestamp: new Date(),
          changed_by: rejectionData.rejected_by,
          notes: rejectionData.reason,
        },
      ],
    }

    this.quotes.set(id, updated)
    this.events.emit('quote.rejected', { quote: updated, rejectionData })
    return updated
  }

  async convertQuoteToOrder(quoteId: string, poNumber?: string): Promise<Order | null> {
    await delay(1000)
    const quote = this.quotes.get(quoteId)
    if (!quote || quote.status !== 'accepted') {
      return null
    }

    // Create order from quote
    const order: Order = {
      id: `order-${Date.now()}`,
      po_number: poNumber || `PO-${quote.customer.name.split(' ')[0].toUpperCase()}-2024-${this.orderCounter++}`,
      source: 'quote',
      source_metadata: {
        quote_id: quote.id,
        quote_number: quote.quote_number,
      },
      confidence_score: 100, // 100% confidence for quote-originated orders
      customer: quote.customer,
      line_items: quote.line_items.map(item => ({
        ...item,
        matched_product_id: item.product.id,
        match_confidence: 100,
      })),
      billing_address: quote.billing_address,
      shipping_address: quote.job_site_address,
      status: 'pending',
      subtotal: quote.subtotal,
      tax_amount: quote.tax_amount,
      shipping_cost: quote.shipping_cost,
      total: quote.total,
      created_at: new Date(),
      updated_at: new Date(),
      notes: `Created from ${quote.quote_number}. Project: ${quote.project_name}`,
    }

    // Update quote status
    const updatedQuote = {
      ...quote,
      status: 'converted' as QuoteStatus,
      converted_at: new Date(),
      updated_at: new Date(),
      status_history: [
        ...quote.status_history,
        {
          from: quote.status,
          to: 'converted' as QuoteStatus,
          timestamp: new Date(),
          notes: `Converted to order ${order.po_number}`,
        },
      ],
    }

    this.quotes.set(quoteId, updatedQuote)
    this.orders.set(order.id, order)

    this.events.emit('quote.converted', { quote: updatedQuote, order })
    this.events.emit('order.created', order)

    // Simulate auto-processing
    setTimeout(() => {
      this.processOrder(order.id)
    }, 3000)

    return order
  }

  // Order APIs
  async getOrders(): Promise<Order[]> {
    await delay(300)
    return Array.from(this.orders.values())
  }

  async getOrder(id: string): Promise<Order | null> {
    await delay(200)
    return this.orders.get(id) || null
  }

  async processOrder(id: string): Promise<Order | null> {
    await delay(1500)
    const order = this.orders.get(id)
    if (!order) {
      return null
    }

    const updated = {
      ...order,
      status: 'processing' as const,
      processed_at: new Date(),
      updated_at: new Date(),
    }

    this.orders.set(id, updated)
    this.events.emit('order.processing', updated)

    // Simulate completion
    setTimeout(() => {
      const completed = {
        ...updated,
        status: 'approved' as const,
        updated_at: new Date(),
      }
      this.orders.set(id, completed)
      this.events.emit('order.approved', completed)
    }, 2000)

    return updated
  }

  // OCR/Extraction simulation
  async extractFromDocument(file: File): Promise<ExtractionResult> {
    await delay(2000) // Simulate extraction time

    return {
      confidence: 0.92,
      customer: {
        name: 'BuildCo Industries',
        email: 'orders@buildco.com',
        type: 'B2B Contractor',
      },
      line_items: [
        {
          description: '12" PVC Pipe Schedule 40',
          quantity: 30,
          unit_price: 45.50,
          confidence: 0.95,
        },
        {
          description: 'Portland Cement Type I/II 50lb bags',
          quantity: 20,
          unit_price: 12.75,
          confidence: 0.88,
        },
        {
          description: '#5 Rebar 20ft lengths',
          quantity: 50,
          unit_price: 18.25,
          confidence: 0.91,
        },
      ],
      addresses: {
        billing: {
          street: '789 Industrial Blvd',
          city: 'Houston',
          state: 'TX',
          zip: '77001',
        },
        shipping: {
          street: '321 Construction Site Dr',
          city: 'Katy',
          state: 'TX',
          zip: '77450',
        },
      },
      project_name: 'Highway 290 Expansion Project',
      po_number: 'PO-BUILDCO-2024-8892',
      extracted_text: 'Full extracted text from document...',
    }
  }

  // Demo control methods
  async resetDemo() {
    this.quotes.clear()
    this.orders.clear()
    this.quoteCounter = 1000
    this.orderCounter = 2000
    this.initializeSampleData()
    this.events.emit('demo.reset', {})
  }

  async loadScenario(scenario: 'small_contractor' | 'enterprise' | 'distributor') {
    await this.resetDemo()
    // Load specific demo data based on scenario
    this.events.emit('demo.scenario', { scenario })
  }
}

// Singleton instance
export const mockBackend = new MockBackendService()