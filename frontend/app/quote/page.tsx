'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { sampleQuotes, sampleProducts, analyticsData } from '@/lib/mock-data'
import { 
  FileText, 
  Download, 
  Mail, 
  Share2, 
  TrendingUp, 
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  MapPin,
  User,
  Calendar,
  ChevronDown,
  Upload,
  Sparkles,
  Plus,
  Minus,
  Copy
} from 'lucide-react'

export default function QuotePage() {
  const [selectedQuote, setSelectedQuote] = useState(sampleQuotes[0])
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [discountPercent, setDiscountPercent] = useState(5)
  const [taxExempt, setTaxExempt] = useState(true)

  const handleFileUpload = () => {
    setIsExtracting(true)
    setExtractionProgress(0)
    const interval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExtracting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleStatusChange = () => {
    const statusFlow = ['draft', 'sent', 'accepted', 'converted']
    const currentIndex = statusFlow.indexOf(selectedQuote.status)
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length] as any
    setSelectedQuote({ ...selectedQuote, status: nextStatus })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Quote Builder</h1>
              <Badge variant="outline" className="text-sm">
                AI-Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sarah Chen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Quote List & Analytics */}
          <div className="col-span-3 space-y-4">
            {/* Quote List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Quotes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sampleQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    onClick={() => setSelectedQuote(quote)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedQuote.id === quote.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{quote.quote_number}</span>
                      <StatusBadge status={quote.status} size="sm" showIcon={false} />
                    </div>
                    <div className="text-xs text-gray-600">{quote.customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Analytics Widget */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  This Week's Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quotes Sent</span>
                  <span className="font-semibold">{analyticsData.quotesThisWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acceptance Rate</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{analyticsData.acceptanceRate}%</span>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Time to Accept</span>
                  <span className="font-semibold">{analyticsData.avgTimeToAccept} hrs</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue Pipeline</span>
                    <span className="font-bold text-green-600">
                      ${(analyticsData.revenuePipeline / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Quote Form */}
          <div className="col-span-9 space-y-4">
            {/* Quote Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{selectedQuote.quote_number}</h2>
                      <Badge variant="outline">v{selectedQuote.version}</Badge>
                      <StatusBadge status={selectedQuote.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedQuote.sales_rep.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(selectedQuote.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Valid until {new Date(selectedQuote.valid_until).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Export Dropdown */}
                    <div className="relative group">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Download PDF
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Send via Email
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Download className="h-4 w-4" /> Export to CSV
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Share2 className="h-4 w-4" /> Share Link
                        </button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Clone
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Extraction Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI Document Extraction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isExtracting ? (
                  <div 
                    onClick={handleFileUpload}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium">Drop RFQ here or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supports PDF, Excel, Images</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Extracting document...</span>
                      <span className="text-sm text-gray-600">{extractionProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${extractionProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      AI is analyzing your document and extracting line items...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer & Addresses */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Customer</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input value={selectedQuote.customer.name} readOnly />
                      <Badge variant={selectedQuote.customer.type === 'B2B Contractor' ? 'default' : 'secondary'}>
                        {selectedQuote.customer.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input value={selectedQuote.customer.email} readOnly className="text-sm mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input value={selectedQuote.customer.phone} readOnly className="text-sm mt-1" />
                    </div>
                  </div>
                  {selectedQuote.customer.tax_exempt && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Tax Exempt: {selectedQuote.customer.tax_exemption_number}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium">Billing Address</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                      {selectedQuote.billing_address.street}<br />
                      {selectedQuote.billing_address.city}, {selectedQuote.billing_address.state} {selectedQuote.billing_address.zip}
                    </div>
                  </div>
                  {selectedQuote.job_site_address && (
                    <div>
                      <Label className="text-xs font-medium">Job Site Address</Label>
                      <div className="mt-1 p-2 bg-blue-50 rounded text-sm">
                        {selectedQuote.job_site_address.street}<br />
                        {selectedQuote.job_site_address.city}, {selectedQuote.job_site_address.state} {selectedQuote.job_site_address.zip}
                      </div>
                    </div>
                  )}
                  {selectedQuote.project_name && (
                    <div>
                      <Label className="text-xs">Project Name</Label>
                      <Input value={selectedQuote.project_name} className="mt-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedQuote.line_items.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.product.sku}</span>
                            <span className="text-gray-600">| {item.product.name}</span>
                            {item.product.inventory_status === 'in_stock' && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                In Stock ({item.product.available_quantity})
                              </Badge>
                            )}
                            {item.product.inventory_status === 'low_stock' && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Low Stock ({item.product.available_quantity})
                              </Badge>
                            )}
                            {item.product.inventory_status === 'out_of_stock' && (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.product.description}
                          </div>
                          {item.confidence_score && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">Match Confidence:</span>
                              <div className="flex items-center gap-1">
                                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      item.confidence_score >= 90 ? 'bg-green-500' : 
                                      item.confidence_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${item.confidence_score}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium">{item.confidence_score}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input 
                                value={item.quantity} 
                                className="w-16 text-center" 
                                readOnly 
                              />
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              @ ${item.unit_price.toFixed(2)} per {item.product.unit_of_measure}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${item.subtotal.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Totals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Discounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${selectedQuote.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Discount Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Label>Manual Discount</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={discountPercent} 
                          onChange={(e) => setDiscountPercent(Number(e.target.value))}
                          className="w-16" 
                        />
                        <span className="text-sm">%</span>
                      </div>
                      <Input placeholder="Reason" className="w-32" defaultValue="Volume discount" />
                    </div>
                    <span className="font-medium text-red-600">
                      -${(selectedQuote.subtotal * discountPercent / 100).toFixed(2)}
                    </span>
                  </div>

                  {/* Tax Exemption */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Label>Tax ({(selectedQuote.tax_rate * 100).toFixed(2)}%)</Label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={taxExempt}
                          onChange={(e) => setTaxExempt(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Tax Exempt</span>
                      </label>
                      {taxExempt && (
                        <Input 
                          placeholder="Exemption #" 
                          className="w-32" 
                          defaultValue={selectedQuote.tax_exemption_number}
                        />
                      )}
                    </div>
                    <span className="font-medium">
                      ${taxExempt ? '0.00' : selectedQuote.tax_amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${selectedQuote.shipping_cost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(selectedQuote.subtotal - (selectedQuote.subtotal * discountPercent / 100) + 
                         (taxExempt ? 0 : selectedQuote.tax_amount) + 
                         selectedQuote.shipping_cost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline">
                    Save Draft
                  </Button>
                  <Button variant="outline" onClick={handleStatusChange}>
                    Test Status Change
                  </Button>
                </div>
                <div className="flex gap-2">
                  {selectedQuote.status === 'draft' && (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Quote
                    </Button>
                  )}
                  {selectedQuote.status === 'sent' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Reject Quote
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setShowAcceptModal(true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Quote
                      </Button>
                    </>
                  )}
                  {selectedQuote.status === 'accepted' && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Package className="h-4 w-4 mr-2" />
                      Convert to Order
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Accept Quote Modal (Mockup) */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Accept Quote</CardTitle>
              <CardDescription>Enter PO number to accept this quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>PO Number</Label>
                <Input placeholder="Enter customer PO number" className="mt-1" />
              </div>
              <div>
                <Label>Accepted By</Label>
                <Input placeholder="Name" className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="email@company.com" className="mt-1" />
              </div>
              <div>
                <Label>Notes (Optional)</Label>
                <textarea 
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  placeholder="Any special instructions..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAcceptModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setShowAcceptModal(false)
                  setSelectedQuote({ ...selectedQuote, status: 'accepted' })
                }}
              >
                Accept Quote
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}