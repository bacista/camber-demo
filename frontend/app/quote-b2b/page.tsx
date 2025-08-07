'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { FileUploadOverlay } from '@/components/quote/FileUploadOverlay'
import { PreviousQuoteSelect } from '@/components/quote/PreviousQuoteSelect'
import { ValidationStrip } from '@/components/quote/ValidationStrip'
import { RecentOrderModal } from '@/components/orders/RecentOrderModal'
import { QuoteToOrderModal } from '@/components/quote/QuoteToOrderModal'
import { Toast, useToast } from '@/components/ui/toast'
import { sampleQuotes, sampleProducts, sampleCustomers, sampleOrders, sampleSalesRep } from '@/lib/mock-data'
import type { Quote, LineItem, Order } from '@/lib/types'
import { cn } from '@/lib/utils'
import { 
  Search,
  Plus,
  Save,
  Send,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle,
  Package,
  FileText,
  DollarSign,
  Building,
  CreditCard,
  TrendingUp,
  Clock,
  ChevronRight,
  ChevronDown,
  Filter,
  Keyboard,
  Grid3x3,
  List,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  Check,
  X,
  RefreshCw,
  Upload,
  History,
  Users,
  MapPin,
  Truck,
  AlertCircle,
  Info
} from 'lucide-react'

export default function QuoteB2BPage() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [selectedLineItems, setSelectedLineItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'dense' | 'standard'>('dense')
  const [showCustomerPanel, setShowCustomerPanel] = useState(false)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [showUploadOverlay, setShowUploadOverlay] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast, showToast, hideToast } = useToast()

  const handleSelectAll = () => {
    if (!selectedQuote) return
    if (selectedLineItems.size === selectedQuote.line_items.length) {
      setSelectedLineItems(new Set())
    } else {
      setSelectedLineItems(new Set(selectedQuote.line_items.map(item => item.id)))
    }
  }

  const handleLineItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedLineItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedLineItems(newSelected)
  }

  const handleFileUpload = (file: File) => {
    // Simulate extracting line items from the file
    const extractedItems: LineItem[] = sampleProducts.slice(0, 15).map((product, index) => ({
      id: `extracted-${index}`,
      product,
      quantity: Math.floor(Math.random() * 50) + 10,
      unit_price: product.unit_price,
      discount_percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
      subtotal: 0,
      notes: '',
      confidence_score: Math.floor(Math.random() * 20) + 80
    }))
    
    // Calculate subtotals
    extractedItems.forEach(item => {
      const discount = item.discount_percentage || 0
      item.subtotal = item.quantity * item.unit_price * (1 - discount / 100)
    })

    // If no quote is selected, create a new one
    if (!selectedQuote) {
      const newQuote: Quote = {
        id: `quote-new-${Date.now()}`,
        quote_number: `Q-2024-${Math.floor(Math.random() * 1000) + 2000}`,
        version: 1,
        status: 'draft',
        customer: sampleCustomers[0], // Default customer, should be selectable
        sales_rep: sampleSalesRep,
        line_items: extractedItems,
        billing_address: sampleCustomers[0].billing_address,
        shipping_address: sampleCustomers[0].shipping_address,
        subtotal: extractedItems.reduce((sum, item) => sum + item.subtotal, 0),
        tax_rate: 0.0825,
        tax_amount: 0,
        shipping_cost: 0,
        total: 0,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        created_at: new Date(),
        updated_at: new Date(),
        status_history: []
      }
      newQuote.tax_amount = newQuote.subtotal * newQuote.tax_rate
      newQuote.total = newQuote.subtotal + newQuote.tax_amount + newQuote.shipping_cost
      setSelectedQuote(newQuote)
    } else {
      setSelectedQuote({
        ...selectedQuote,
        line_items: extractedItems
      })
    }
    setShowUploadOverlay(false)
  }

  const handleCopyFromPrevious = (quote: Quote) => {
    if (!selectedQuote) return
    
    // Copy line items with recalculated pricing
    const copiedItems = quote.line_items.map((item, index) => {
      // Simulate fetching current pricing (in real app, this would be an API call)
      // Add 2-5% price variation to simulate market price changes
      const priceVariation = 1 + (Math.random() * 0.05 - 0.025)
      const currentUnitPrice = item.product.unit_price * priceVariation
      
      return {
        ...item,
        id: `copied-${index}-${Date.now()}`,
        unit_price: currentUnitPrice,
        subtotal: currentUnitPrice * item.quantity,
        confidence_score: 100 // High confidence since it's from a previous quote
      }
    })
    
    // Calculate new totals
    const newSubtotal = copiedItems.reduce((sum, item) => sum + item.subtotal, 0)
    const newTaxAmount = selectedQuote.tax_exempt ? 0 : newSubtotal * selectedQuote.tax_rate
    const newTotal = newSubtotal + newTaxAmount + selectedQuote.shipping_cost
    
    setSelectedQuote({
      ...selectedQuote,
      line_items: copiedItems,
      subtotal: newSubtotal,
      tax_amount: newTaxAmount,
      total: newTotal
    })
    
    // Show success message
    showToast({
      message: `Copied ${copiedItems.length} items from ${quote.quote_number} with updated pricing`,
      type: 'success',
      duration: 4000
    })
  }

  const handleViewOrder = (orderId: string) => {
    const order = sampleOrders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setShowOrderModal(true)
    }
  }

  const handleCopyOrderToQuote = (order: Order) => {
    // Copy line items from the order to the current quote
    setSelectedQuote({
      ...selectedQuote,
      line_items: order.line_items.map((item, index) => ({
        ...item,
        id: `order-copied-${index}-${Date.now()}`,
        confidence_score: 100
      }))
    })
    setShowOrderModal(false)
  }

  const handleAcceptQuote = () => {
    if (!selectedQuote) return
    // Update quote status to accepted
    setSelectedQuote({
      ...selectedQuote,
      status: 'accepted'
    })
    // Show conversion modal
    setShowConvertModal(true)
  }

  const handleSendQuote = () => {
    if (!selectedQuote) return
    // Update quote status to sent
    setSelectedQuote({
      ...selectedQuote,
      status: 'sent'
    })
    // Show success toast
    showToast({
      message: `Quote ${selectedQuote.quote_number} sent to ${selectedQuote.customer.name}`,
      type: 'success',
      duration: 4000
    })
  }

  const handleConvertToOrder = (orderData: any) => {
    // Create a new order ID
    const newOrderId = `ORD-2024-${Math.floor(Math.random() * 1000) + 1000}`
    
    // Update the quote to show it's been converted
    if (selectedQuote) {
      setSelectedQuote({
        ...selectedQuote,
        status: 'accepted',
        order_id: newOrderId
      })
    }
    
    // Show success toast with action to view order
    showToast({
      message: `Order ${newOrderId} created with PO: ${orderData.po_number}`,
      type: 'success',
      duration: 5000,
      action: {
        label: 'View Order',
        onClick: () => {
          // In a real app, this would navigate to the order
          console.log(`Navigating to order ${newOrderId}`)
        }
      }
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Compact Header Bar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Quote Builder</h1>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Keyboard className="h-3 w-3" />
              <span>Ctrl+N New</span>
              <span className="mx-1">|</span>
              <span>Ctrl+S Save</span>
              <span className="mx-1">|</span>
              <span>Ctrl+E Export</span>
              <span className="mx-1">|</span>
              <span>F2 Edit</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded p-0.5">
              <button
                onClick={() => setViewMode('dense')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                  viewMode === 'dense' ? 'bg-white shadow' : ''
                }`}
              >
                <Grid3x3 className="h-3 w-3" />
                Dense
              </button>
              <button
                onClick={() => setViewMode('standard')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                  viewMode === 'standard' ? 'bg-white shadow' : ''
                }`}
              >
                <List className="h-3 w-3" />
                Standard
              </button>
            </div>
            {/* View Controls */}
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Input placeholder="Customer" className="h-7 w-32 text-xs" />
          <Input type="date" className="h-7 w-32 text-xs" />
          <select 
            className="h-7 px-2 text-xs border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="converted">Converted</option>
          </select>
          <Input placeholder="Amount >" className="h-7 w-24 text-xs" />
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Save Filter
          </Button>
          <select className="h-7 px-2 text-xs border rounded ml-auto">
            <option>My Filters</option>
            <option>High Value (>$10K)</option>
            <option>Urgent</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Quote List */}
        <div className="w-64 bg-[#F8F8F8] border-r flex flex-col">
          <div className="p-2 border-b">
            <Button 
              className="w-full h-8 text-xs" 
              size="sm"
              onClick={() => setSelectedQuote(null)}
            >
              <Plus className="h-3 w-3 mr-1" />
              New Quote (Ctrl+N)
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {sampleQuotes
              .filter(quote => statusFilter === 'all' || quote.status === statusFilter)
              .map((quote) => (
              <div
                key={quote.id}
                onClick={() => {
                  setSelectedQuote(quote)
                }}
                className={`p-2 border-b cursor-pointer hover:bg-blue-50 ${
                  selectedQuote?.id === quote.id ? 'bg-blue-100 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{quote.quote_number}</span>
                  <StatusBadge status={quote.status} size="sm" showIcon={false} />
                </div>
                <div className="text-xs text-gray-600 truncate">{quote.customer.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {quote.line_items.length} items
                  </span>
                  <span className="text-xs font-medium">
                    ${quote.total.toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t bg-gray-100">
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Total Pipeline:</span>
                <span className="font-semibold">$247,892</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Avg Close:</span>
                <span className="font-semibold">2.3 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selectedQuote ? (
            // Empty state when no quote is selected
            <div className="flex-1 flex items-center justify-center bg-white relative">
              <FileUploadOverlay
                isVisible={true}
                onFileSelect={handleFileUpload}
                isAbsolute={false}
                className="w-full max-w-2xl h-96"
              />
            </div>
          ) : (
            <>
              {/* Quote Header Bar */}
              <div className="bg-white border-b px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="font-semibold">{selectedQuote.quote_number}</h2>
                    <Badge variant="outline" className="text-xs">v{selectedQuote.version}</Badge>
                    <StatusBadge status={selectedQuote.status} size="sm" />
                    {selectedQuote.order_id && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        <Package className="h-3 w-3 mr-1" />
                        Converted to {selectedQuote.order_id}
                      </Badge>
                    )}
                    <PreviousQuoteSelect
                      recentQuotes={sampleQuotes.filter(q => q.id !== selectedQuote.id)}
                      onSelectQuote={handleCopyFromPrevious}
                      currentCustomerId={selectedQuote.customer.id}
                    />
                <span className="text-xs text-gray-500">
                  Valid until {new Date(selectedQuote.valid_until).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <History className="h-3 w-3 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Copy className="h-3 w-3 mr-1" />
                  Clone
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Bar */}
          <div className="bg-blue-50 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">{selectedQuote.customer.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedQuote.customer.type}
                  </Badge>
                  {selectedQuote.customer.tax_exempt && (
                    <Badge variant="outline" className="text-xs bg-green-50">
                      Tax Exempt
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    Credit: $35K available
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Net 30
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    $1.2M YTD
                  </span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => setShowCustomerPanel(!showCustomerPanel)}
              >
                {showCustomerPanel ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Details
              </Button>
            </div>
          </div>

          {/* Main Content Area with Customer Intelligence */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Content - Validation and Table */}
            <div className="flex-1 flex flex-col">
              {/* Validation Indicators Strip */}
              <ValidationStrip quote={selectedQuote} />
              {/* Bulk Actions Bar (shows when items selected) */}
              {selectedLineItems.size > 0 && (
                <div className="bg-yellow-50 border-b px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedLineItems.size} items selected
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Edit2 className="h-3 w-3 mr-1" />
                        Bulk Edit
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs text-red-600">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedLineItems(new Set())}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Line Items Table */}
              <div className="flex-1 overflow-auto bg-white relative">
                {/* File Upload Overlay - shows when no line items */}
                {selectedQuote.line_items.length === 0 && (
                  <FileUploadOverlay
                    isVisible={true}
                    onFileSelect={handleFileUpload}
                    className="rounded-lg"
                  />
                )}
                
                {/* Show upload overlay on demand even with items */}
                {showUploadOverlay && selectedQuote.line_items.length > 0 && (
                  <FileUploadOverlay
                    isVisible={true}
                    onFileSelect={handleFileUpload}
                    onDismiss={() => setShowUploadOverlay(false)}
                    className="rounded-lg"
                  />
                )}
                
                {/* Quick Add by SKU */}
                {selectedQuote.line_items.length > 0 && (
                  <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-blue-700">Quick Add:</label>
                      <Input 
                        placeholder="Enter SKU or Part Number" 
                        className="h-7 w-48 text-xs"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // Add item logic here
                            const input = e.target as HTMLInputElement
                            if (input.value) {
                              // Find matching product or create new line item
                              const newItem: LineItem = {
                                id: `item-${Date.now()}`,
                                product: {
                                  id: `prod-${Date.now()}`,
                                  sku: input.value,
                                  name: 'Quick Add Item',
                                  unit_price: 0,
                                  unit_of_measure: 'EA'
                                },
                                quantity: 1,
                                unit_price: 0,
                                subtotal: 0
                              }
                              setSelectedQuote({
                                ...selectedQuote,
                                line_items: [...selectedQuote.line_items, newItem]
                              })
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Input 
                        type="number" 
                        placeholder="Qty" 
                        className="h-7 w-16 text-xs"
                        defaultValue="1"
                      />
                      <Button size="sm" className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                      <span className="text-xs text-gray-500 ml-2">
                        Press Enter to add • Supports fuzzy matching
                      </span>
                    </div>
                  </div>
                )}
                
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="p-2 text-left w-10">
                        <input 
                          type="checkbox"
                          checked={selectedLineItems.size === selectedQuote.line_items.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-2 text-left">
                        <div className="flex items-center gap-1">
                          SKU/Part #
                          <ArrowUpDown className="h-3 w-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-center">Stock</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-center">UOM</th>
                      <th className="p-2 text-right">Unit Price</th>
                      <th className="p-2 text-center">Disc %</th>
                      <th className="p-2 text-right">Extended</th>
                      <th className="p-2 text-center">Confidence</th>
                      <th className="p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.line_items.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <input 
                            type="checkbox"
                            checked={selectedLineItems.has(item.id)}
                            onChange={() => handleLineItemSelect(item.id)}
                          />
                        </td>
                        <td className="p-2 font-medium">
                          <div className="flex items-center gap-1">
                            {item.product.sku}
                            <button className="text-blue-600 hover:text-blue-800">
                              <Info className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs">
                            {item.product.name}
                            {item.product.description && (
                              <div className="text-gray-500">{item.product.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {item.product.inventory_status === 'in_stock' && (
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">{item.product.available_quantity}</span>
                            </div>
                          )}
                          {item.product.inventory_status === 'low_stock' && (
                            <div className="flex items-center justify-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-yellow-600" />
                              <span className="text-xs text-yellow-600">{item.product.available_quantity}</span>
                            </div>
                          )}
                          {item.product.inventory_status === 'out_of_stock' && (
                            <div className="flex items-center justify-center gap-1">
                              <X className="h-3 w-3 text-red-600" />
                              <span className="text-xs text-red-600">0</span>
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editingCell === `qty-${item.id}` ? (
                            <Input 
                              type="number" 
                              defaultValue={item.quantity} 
                              className="h-7 w-16 text-center"
                              autoFocus
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab') {
                                  setEditingCell(null)
                                }
                              }}
                            />
                          ) : (
                            <div 
                              className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                              onDoubleClick={() => setEditingCell(`qty-${item.id}`)}
                            >
                              {item.quantity}
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-center text-xs">
                          {item.product.unit_of_measure}
                        </td>
                        <td className="p-2 text-right">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          {item.discount_percentage || '-'}
                        </td>
                        <td className="p-2 text-right font-medium">
                          ${item.subtotal.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className={`w-8 h-1 rounded-full ${
                              item.confidence_score! >= 90 ? 'bg-green-500' :
                              item.confidence_score! >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="text-xs">{item.confidence_score}%</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="text-gray-400 hover:text-gray-600">
                              <RefreshCw className="h-3 w-3" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Add Line Item Row */}
                    <tr className="bg-gray-50">
                      <td colSpan={11} className="p-2">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Line
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => setShowUploadOverlay(true)}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Import File
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Recent Items
                          </Button>
                          <span className="ml-auto text-xs text-gray-500">
                            Press Tab on last row to add new line
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Summary Bar */}
              <div className="bg-white border-t">
                <div className="px-4 py-2">
                  {/* Addresses Row */}
                  <div className="flex items-center gap-4 text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">Bill:</span>
                      <span className="text-gray-600">
                        {selectedQuote.billing_address ? 
                          `${selectedQuote.billing_address.street}, ${selectedQuote.billing_address.city}` :
                          'No billing address set'
                        }
                      </span>
                      <button className="text-blue-600 hover:underline">Edit</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">Ship:</span>
                      <span className="text-gray-600">
                        {selectedQuote.shipping_address ? 
                          `${selectedQuote.shipping_address.street}, ${selectedQuote.shipping_address.city}` :
                          selectedQuote.job_site_address ? 
                            `${selectedQuote.job_site_address.street}, ${selectedQuote.job_site_address.city}` :
                            'Same as billing'
                        }
                      </span>
                      <button className="text-blue-600 hover:underline">Edit</button>
                    </div>
                    {selectedQuote.project_name && (
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">Project:</span>
                        <span className="text-gray-600">{selectedQuote.project_name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Totals Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <span>Subtotal: <span className="font-semibold">${selectedQuote.subtotal.toFixed(2)}</span></span>
                      <span>Discount: <span className="font-semibold text-red-600">-${selectedQuote.discount?.amount.toFixed(2) || '0.00'}</span></span>
                      <span>Tax: <span className="font-semibold">${selectedQuote.tax_amount.toFixed(2)}</span></span>
                      <span>Shipping: <span className="font-semibold">${selectedQuote.shipping_cost.toFixed(2)}</span></span>
                      <span className="text-lg font-bold">Total: <span className="text-green-600">${selectedQuote.total.toFixed(2)}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Save className="h-3 w-3 mr-1" />
                        Save (Ctrl+S)
                      </Button>
                      {selectedQuote.status === 'draft' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={handleSendQuote}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send Quote
                        </Button>
                      )}
                      {selectedQuote.status === 'sent' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs bg-green-600 hover:bg-green-700"
                          onClick={handleAcceptQuote}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept Quote
                        </Button>
                      )}
                      {selectedQuote.status === 'accepted' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
                          onClick={() => setShowConvertModal(true)}
                        >
                          <Package className="h-3 w-3 mr-1" />
                          Convert to Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Customer Context (Collapsible) */}
            {showCustomerPanel && (
              <div className="w-80 bg-[#F8F8F8] border-l flex flex-col">
                <div className="flex-1 overflow-auto p-3 space-y-4">
                  {/* Account Hierarchy */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Account Structure</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <Building className="h-3 w-3" />
                        <span className="font-medium">{selectedQuote.customer.name}</span>
                      </div>
                      <div className="ml-4 space-y-1 text-gray-500">
                        <div className="flex items-center gap-2 p-1">
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          Type: {selectedQuote.customer.type}
                        </div>
                        {selectedQuote.customer.credit_limit && (
                          <div className="flex items-center gap-2 p-1">
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                            Credit: ${selectedQuote.customer.credit_limit.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Recent Orders</h4>
                    <div className="space-y-1">
                      {sampleOrders
                        .filter(order => order.customer.id === selectedQuote.customer.id)
                        .slice(0, 3)
                        .map(order => (
                          <div 
                            key={order.id}
                            onClick={() => handleViewOrder(order.id)}
                            className="flex items-center justify-between text-xs p-2 hover:bg-white rounded cursor-pointer transition-colors"
                          >
                            <span className="font-medium text-blue-600 hover:text-blue-800">
                              {order.po_number}
                            </span>
                            <span className="font-medium">${order.total.toFixed(0)}</span>
                            <span className="text-gray-500">
                              {Math.floor((Date.now() - Date.parse(order.created_at)) / 86400000)} days ago
                            </span>
                          </div>
                        ))
                      }
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full h-7 text-xs mt-2"
                        onClick={() => {/* Would navigate to orders filtered by customer */}}
                      >
                        View All Orders →
                      </Button>
                    </div>
                  </div>

                  {/* Contract Pricing */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Contract Pricing</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between p-1 bg-green-50 rounded">
                        <span>PVC Pipes</span>
                        <span className="font-medium text-green-700">-8% Contract</span>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-green-50 rounded">
                        <span>Cement Products</span>
                        <span className="font-medium text-green-700">-5% Volume</span>
                      </div>
                    </div>
                  </div>

                  {/* Credit & Terms */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Credit Status</h4>
                    <div className="space-y-2">
                      {selectedQuote.customer.credit_limit && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span>Credit Limit:</span>
                            <span className="font-medium">${selectedQuote.customer.credit_limit.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Available:</span>
                            <span className="font-medium text-green-600">
                              ${(selectedQuote.customer.credit_limit * 0.7).toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span>Payment Terms:</span>
                        <span className="font-medium">Net 30</span>
                      </div>
                      {selectedQuote.customer.tax_exempt && (
                        <div className="flex items-center justify-between text-xs">
                          <span>Tax Status:</span>
                          <span className="font-medium text-green-600">Exempt</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Account Notes</h4>
                    <div className="text-xs text-gray-600 p-2 bg-yellow-50 rounded">
                      {selectedQuote.customer.tax_exempt && selectedQuote.customer.tax_exemption_number && 
                        `Tax exempt - ${selectedQuote.customer.tax_exemption_number} on file. `}
                      {selectedQuote.notes || 'No special notes for this customer.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
            </>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Ready</span>
            <span>|</span>
            <span>Last saved: 2 minutes ago</span>
            <span>|</span>
            <span>Auto-save: On</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Items: {selectedQuote?.line_items.length || 0}</span>
            <span>|</span>
            <span>Selected: {selectedLineItems.size}</span>
            <span>|</span>
            <span>Total: ${selectedQuote?.total.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Recent Order Modal */}
      <RecentOrderModal 
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setSelectedOrder(null)
        }}
        onCopyToQuote={handleCopyOrderToQuote}
      />

      {/* Quote to Order Conversion Modal */}
      {selectedQuote && (
        <QuoteToOrderModal
          quote={selectedQuote}
          isOpen={showConvertModal}
          onClose={() => setShowConvertModal(false)}
          onConvert={handleConvertToOrder}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          action={toast.action}
          onClose={hideToast}
        />
      )}
    </div>
  )
}