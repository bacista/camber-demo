'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SourceBadge } from '@/components/shared/SourceBadge'
import { ConfidenceMeter } from '@/components/shared/ConfidenceMeter'
import { sampleOrders, sampleQuotes, analyticsData } from '@/lib/mock-data'
import { 
  Search,
  Filter,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Mail,
  Radio,
  Zap,
  DollarSign,
  Building,
  MapPin,
  Sparkles,
  ArrowRight,
  BarChart,
  RefreshCw
} from 'lucide-react'

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(sampleOrders[0])
  const [showMetadata, setShowMetadata] = useState(true)
  const [filterSource, setFilterSource] = useState<string | null>(null)
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set())

  const handleAutoProcess = (orderId: string) => {
    setProcessingOrders(new Set([...processingOrders, orderId]))
    setTimeout(() => {
      setProcessingOrders(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }, 3000)
  }

  const filteredOrders = filterSource 
    ? sampleOrders.filter(o => o.source === filterSource)
    : sampleOrders

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Purchase Order Queue</h1>
              <Badge variant="outline" className="text-sm">
                Intelligent Processing
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search orders..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Filter by Source:</span>
              <Button
                variant={filterSource === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSource(null)}
              >
                All
              </Button>
              <Button
                variant={filterSource === 'quote' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSource('quote')}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                From Quotes
              </Button>
              <Button
                variant={filterSource === 'email' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSource('email')}
                className="flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                Email
              </Button>
              <Button
                variant={filterSource === 'edi' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSource('edi')}
                className="flex items-center gap-1"
              >
                <Radio className="h-3 w-3" />
                EDI
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                Showing <span className="font-semibold">{filteredOrders.length}</span> orders
              </span>
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                3 Auto-Processing
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Order List */}
          <div className="col-span-5 space-y-4">
            {/* Conversion Metrics */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion by Source</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs">Quote: 100%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs">Email: 78%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-xs">EDI: 95%</span>
                      </div>
                    </div>
                  </div>
                  <BarChart className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* Order Cards */}
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isProcessing = processingOrders.has(order.id)
                const relatedQuote = order.source === 'quote' 
                  ? sampleQuotes.find(q => q.id === order.source_metadata?.quote_id)
                  : null

                return (
                  <Card 
                    key={order.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder.id === order.id 
                        ? 'ring-2 ring-blue-500 shadow-md' 
                        : ''
                    } ${order.source === 'quote' ? 'border-l-4 border-l-emerald-500' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {order.source === 'quote' && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                                🌟 NEW FROM QUOTE
                              </Badge>
                            )}
                            <span className="font-semibold text-lg">{order.po_number}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <SourceBadge source={order.source} size="sm" />
                            <StatusBadge status={order.status} type="order" size="sm" />
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-gray-600">{order.line_items.length} items • ${order.total.toFixed(2)}</p>
                      </div>
                      
                      <ConfidenceMeter confidence={order.confidence_score} size="sm" />
                      
                      {relatedQuote && (
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded text-sm">
                          <FileText className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-700">Quote {relatedQuote.quote_number}</span>
                        </div>
                      )}

                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Auto-Processing</span>
                            <span className="text-blue-600 font-medium">In Progress</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created {new Date(order.created_at).toLocaleTimeString()}</span>
                        {order.confidence_score < 80 && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Review Required
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="col-span-7 space-y-4">
            {selectedOrder && (
              <>
                {/* Order Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedOrder.po_number}</CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <SourceBadge source={selectedOrder.source} showDescription />
                          <StatusBadge status={selectedOrder.status} type="order" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${selectedOrder.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ConfidenceMeter confidence={selectedOrder.confidence_score} size="lg" />
                  </CardContent>
                </Card>

                {/* Quote Metadata (if from quote) */}
                {selectedOrder.source === 'quote' && selectedOrder.source_metadata?.quote_id && (
                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        Quote Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Original Quote</p>
                          <p className="font-semibold">{selectedOrder.source_metadata.quote_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversion Time</p>
                          <p className="font-semibold">2.3 hours</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white rounded-lg space-y-2">
                        <p className="text-sm font-medium">Quote Comparison</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>All items match quote ✅</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Quantities confirmed ✅</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Pricing preserved ✅</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Discount applied: 5% ✅</span>
                          </div>
                        </div>
                      </div>

                      {selectedOrder.notes && (
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-sm font-medium mb-1">Project Details</p>
                          <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Customer & Addresses */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Customer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {selectedOrder.customer.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{selectedOrder.customer.email}</p>
                        <p>{selectedOrder.customer.phone}</p>
                      </div>
                      {selectedOrder.customer.tax_exempt && (
                        <Badge variant="outline" className="bg-green-50">
                          Tax Exempt
                        </Badge>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Addresses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Billing</p>
                        <p className="text-sm">
                          {selectedOrder.billing_address.street}<br />
                          {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.zip}
                        </p>
                      </div>
                      {selectedOrder.shipping_address && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Shipping</p>
                          <p className="text-sm">
                            {selectedOrder.shipping_address.street}<br />
                            {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Line Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Line Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedOrder.line_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.product.sku}</span>
                              <span className="text-gray-600">| {item.product.name}</span>
                              {item.match_confidence < 100 && (
                                <Badge variant="outline" className="text-xs">
                                  {item.match_confidence}% match
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.quantity} {item.product.unit_of_measure} @ ${item.unit_price.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Automation Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrder.confidence_score === 100 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Ready for Auto-Processing</span>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            100% Confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          This order originated from an accepted quote and requires no manual review.
                        </p>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleAutoProcess(selectedOrder.id)}
                          disabled={processingOrders.has(selectedOrder.id)}
                        >
                          {processingOrders.has(selectedOrder.id) ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Process to ERP
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <span className="font-medium">Manual Review Required</span>
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                            {selectedOrder.confidence_score}% Confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          This order was extracted from {selectedOrder.source === 'email' ? 'an email' : 'EDI'} and should be reviewed before processing.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            Review Items
                          </Button>
                          <Button className="flex-1">
                            Approve & Process
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}