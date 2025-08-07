// Core types matching production backend

export type QuoteStatus = 
  | 'draft' 
  | 'sent' 
  | 'viewed' 
  | 'accepted' 
  | 'rejected' 
  | 'expired' 
  | 'converted'

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'approved' 
  | 'rejected' 
  | 'completed'

export type OrderSource = 
  | 'quote' 
  | 'email' 
  | 'edi' 
  | 'api'

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  type: 'B2B Contractor' | 'Retailer' | 'Distributor' | 'End User'
  tax_exempt: boolean
  tax_exemption_number?: string
  credit_limit?: number
}

export interface SalesRep {
  id: string
  name: string
  email: string
  phone?: string
}

export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  unit_price: number
  unit_of_measure: string
  inventory_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
  available_quantity?: number
  lead_time_days?: number
}

export interface LineItem {
  id: string
  product: Product
  quantity: number
  unit_price: number
  discount_percentage?: number
  subtotal: number
  notes?: string
  confidence_score?: number
}

export interface Discount {
  percentage: number
  amount: number
  reason: string
}

export interface StatusChange {
  from: QuoteStatus
  to: QuoteStatus
  timestamp: Date
  changed_by?: string
  notes?: string
}

export interface Quote {
  id: string
  quote_number: string
  version: number
  status: QuoteStatus
  customer: Customer
  sales_rep: SalesRep
  line_items: LineItem[]
  billing_address: Address
  job_site_address?: Address
  project_name?: string
  subtotal: number
  discount?: Discount
  tax_rate: number
  tax_amount: number
  tax_exempt: boolean
  tax_exemption_number?: string
  shipping_cost: number
  total: number
  valid_until: Date
  created_at: Date
  updated_at: Date
  sent_at?: Date
  viewed_at?: Date
  accepted_at?: Date
  rejected_at?: Date
  converted_at?: Date
  status_history: StatusChange[]
  notes?: string
  order_id?: string
}

export interface OrderLineItem extends LineItem {
  matched_product_id?: string
  match_confidence: number
}

export interface Order {
  id: string
  po_number: string
  source: OrderSource
  source_metadata?: {
    quote_id?: string
    quote_number?: string
    email_id?: string
    email_subject?: string
    edi_transaction?: string
    api_client?: string
  }
  confidence_score: number
  customer: Customer
  line_items: OrderLineItem[]
  billing_address: Address
  shipping_address?: Address
  status: OrderStatus
  subtotal: number
  tax_amount: number
  shipping_cost: number
  total: number
  created_at: Date
  updated_at: Date
  processed_at?: Date
  notes?: string
}

export interface AcceptanceData {
  po_number: string
  accepted_by: string
  accepted_by_email: string
  acceptance_notes?: string
}

export interface RejectionData {
  reason: string
  rejected_by: string
  rejected_by_email?: string
}

export interface ExtractionResult {
  confidence: number
  customer?: Partial<Customer>
  line_items: Array<{
    description: string
    quantity: number
    unit_price?: number
    confidence: number
  }>
  addresses?: {
    billing?: Partial<Address>
    shipping?: Partial<Address>
  }
  project_name?: string
  po_number?: string
  extracted_text: string
}

// Invoice Types for AR Management
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'disputed' | 'voided'
export type PaymentTerms = 'COD' | 'NET15' | 'NET30' | 'NET45' | 'NET60' | 'NET90' | '2/10NET30'
export type LienWaiverStatus = 'not_required' | 'preliminary_sent' | 'conditional_sent' | 'unconditional_sent' | 'received'

export interface ProgressBilling {
  contract_value: number
  percent_complete: number
  previous_billings: number
  retention_percent: number
  retention_amount: number
  current_billing: number
  remaining_value: number
}

export interface CustomerInvoice {
  id: string
  invoice_number: string
  invoice_date: Date
  due_date: Date
  
  // References
  order_id: string
  order?: Order
  customer_id: string
  customer: Customer
  po_number?: string
  
  // Project/Construction
  project_name?: string
  project_id?: string
  progress_billing?: ProgressBilling
  
  // Amounts (all in dollars)
  subtotal: number
  tax_amount: number
  tax_rate: number
  shipping_cost: number
  discount_amount: number
  retention_withheld: number
  total_amount: number
  amount_paid: number
  balance_due: number
  
  // Status
  status: InvoiceStatus
  payment_terms: PaymentTerms
  days_overdue?: number
  
  // Line Items
  line_items: InvoiceLineItem[]
  
  // Lien Management
  lien_waiver_status?: LienWaiverStatus
  preliminary_notice_date?: Date
  
  // Metadata
  created_at: Date
  updated_at: Date
  sent_at?: Date
  paid_at?: Date
  last_reminder_at?: Date
  notes?: string
}

export interface InvoiceLineItem {
  id: string
  sku: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  extended_amount: number
  tax_amount?: number
  order_line_id?: string
}

export interface InvoicePayment {
  id: string
  invoice_id: string
  payment_date: Date
  amount: number
  method: 'check' | 'ach' | 'wire' | 'credit_card' | 'cash'
  reference_number?: string
  notes?: string
  created_at: Date
}

export interface InvoiceActivity {
  id: string
  invoice_id: string
  action: string
  description: string
  performed_by?: string
  performed_at: Date
  metadata?: Record<string, any>
}