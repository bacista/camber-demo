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
import { sampleQuotes, sampleProducts, sampleCustomers } from '@/lib/mock-data'
import type { Quote, LineItem } from '@/lib/types'
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
  const [selectedQuote, setSelectedQuote] = useState(sampleQuotes[0])
  const [selectedLineItems, setSelectedLineItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'dense' | 'standard'>('dense')
  const [showCustomerPanel, setShowCustomerPanel] = useState(true)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [showUploadOverlay, setShowUploadOverlay] = useState(false)

  const handleSelectAll = () => {
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

    setSelectedQuote({
      ...selectedQuote,
      line_items: extractedItems
    })
    setShowUploadOverlay(false)
  }

  const handleCopyFromPrevious = (quote: Quote) => {
    // Copy line items from the selected quote
    setSelectedQuote({
      ...selectedQuote,
      line_items: quote.line_items.map((item, index) => ({
        ...item,
        id: `copied-${index}-${Date.now()}`,
        // Recalculate prices based on current pricing
        unit_price: item.product.unit_price,
        confidence_score: 100 // High confidence since it's from a previous quote
      }))
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
          <Input placeholder="SKU/PN" className="h-7 w-32 text-xs" />
          <Input placeholder="Customer" className="h-7 w-32 text-xs" />
          <Input type="date" className="h-7 w-32 text-xs" />
          <select className="h-7 px-2 text-xs border rounded">
            <option>All Status</option>
            <option>Draft</option>
            <option>Sent</option>
            <option>Accepted</option>
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
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-2 border-b">
            <Button className="w-full h-8 text-xs" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              New Quote (Ctrl+N)
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {sampleQuotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                className={`p-2 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedQuote.id === quote.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
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
          <div className="p-2 border-t bg-gray-50">
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
          {/* Quote Header Bar */}
          <div className="bg-white border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold">{selectedQuote.quote_number}</h2>
                <Badge variant="outline" className="text-xs">v{selectedQuote.version}</Badge>
                <StatusBadge status={selectedQuote.status} size="sm" />
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

          {/* Validation Indicators Strip */}
          <ValidationStrip quote={selectedQuote} />

          {/* Main Work Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
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
                      <span className="text-gray-600">{selectedQuote.billing_address.street}, {selectedQuote.billing_address.city}</span>
                      <button className="text-blue-600 hover:underline">Edit</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">Ship:</span>
                      <span className="text-gray-600">
                        {selectedQuote.job_site_address ? 
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
                        <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                          <Send className="h-3 w-3 mr-1" />
                          Send Quote
                        </Button>
                      )}
                      {selectedQuote.status === 'sent' && (
                        <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept Quote
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Customer Context (Collapsible) */}
            {showCustomerPanel && (
              <div className="w-80 bg-white border-l flex flex-col">
                <div className="p-3 border-b">
                  <h3 className="text-sm font-semibold">Customer Intelligence</h3>
                </div>
                <div className="flex-1 overflow-auto p-3 space-y-4">
                  {/* Account Hierarchy */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Account Structure</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <Building className="h-3 w-3" />
                        <span className="font-medium">ACME Corp (Parent)</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center gap-2 p-1">
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          ACME Construction (Current)
                        </div>
                        <div className="flex items-center gap-2 p-1">
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                          ACME Plumbing
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Recent Orders</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs p-1">
                        <span>PO-2024-8821</span>
                        <span>$12,450</span>
                        <span className="text-gray-500">3 days ago</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-1">
                        <span>PO-2024-8756</span>
                        <span>$8,200</span>
                        <span className="text-gray-500">1 week ago</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-1">
                        <span>PO-2024-8699</span>
                        <span>$15,800</span>
                        <span className="text-gray-500">2 weeks ago</span>
                      </div>
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
                      <div className="flex items-center justify-between text-xs">
                        <span>Credit Limit:</span>
                        <span className="font-medium">$50,000</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Available:</span>
                        <span className="font-medium text-green-600">$35,000</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Payment Terms:</span>
                        <span className="font-medium">Net 30</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Avg Days to Pay:</span>
                        <span className="font-medium">28 days</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Account Notes</h4>
                    <div className="text-xs text-gray-600 p-2 bg-yellow-50 rounded">
                      Prefers delivery on Tuesdays. Contact Jim for approvals over $10K. Tax exempt - certificate on file.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
            <span>Items: {selectedQuote.line_items.length}</span>
            <span>|</span>
            <span>Selected: {selectedLineItems.size}</span>
            <span>|</span>
            <span>Total: ${selectedQuote.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}