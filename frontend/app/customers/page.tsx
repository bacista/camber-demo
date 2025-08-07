'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { 
  sampleCustomers, 
  sampleQuotes, 
  sampleOrders, 
  sampleInvoices 
} from '@/lib/mock-data'
import {
  Search,
  Plus,
  Phone,
  Mail,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Package,
  CreditCard,
  Clock,
  AlertCircle,
  ChevronRight,
  Download,
  Upload,
  Eye,
  Filter,
  MoreVertical,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Activity,
  MessageSquare,
  PhoneCall,
  ArrowUpRight,
  ArrowDownRight,
  Copy
} from 'lucide-react'

type CustomerTab = 'overview' | 'orders-quotes' | 'financial' | 'activity' | 'documents'

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(sampleCustomers[0])
  const [activeTab, setActiveTab] = useState<CustomerTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [recentlyViewed, setRecentlyViewed] = useState<typeof sampleCustomers>([sampleCustomers[0]])

  // Update recently viewed when customer changes
  useEffect(() => {
    setRecentlyViewed(prev => {
      // Remove if already in list
      const filtered = prev.filter(c => c.id !== selectedCustomer.id)
      // Add to front, keep max 5
      return [selectedCustomer, ...filtered].slice(0, 5)
    })
  }, [selectedCustomer])

  // Filter customers based on search
  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate customer metrics
  const customerQuotes = sampleQuotes.filter(q => q.customer.id === selectedCustomer.id)
  const customerOrders = sampleOrders.filter(o => o.customer.id === selectedCustomer.id)
  const customerInvoices = sampleInvoices.filter(i => 
    customerOrders.some(o => o.po_number === i.order_number)
  )

  const ytdSales = customerOrders.reduce((sum, order) => sum + order.total, 0)
  const outstandingBalance = customerInvoices
    .filter(inv => ['sent', 'overdue', 'partial'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.balance_due, 0)
  const creditAvailable = (selectedCustomer.credit_limit || 0) - outstandingBalance

  // Activity timeline (mock data)
  const activities = [
    { id: 1, type: 'quote', action: 'Quote Q-2024-1001 sent', time: '2 hours ago', user: 'Sarah Chen' },
    { id: 2, type: 'order', action: 'Order PO-2024-5678 created', time: '1 day ago', user: 'System' },
    { id: 3, type: 'payment', action: 'Payment received $12,500', time: '3 days ago', user: 'System' },
    { id: 4, type: 'note', action: 'Called about upcoming project', time: '5 days ago', user: 'Mike Johnson' },
    { id: 5, type: 'email', action: 'Sent quote follow-up', time: '1 week ago', user: 'Sarah Chen' }
  ]

  // Documents (mock data)
  const documents = [
    { id: 1, name: 'Tax Exemption Certificate', type: 'certificate', expires: '2024-12-31', size: '245 KB' },
    { id: 2, name: 'Credit Application', type: 'application', date: '2024-01-15', size: '1.2 MB' },
    { id: 3, name: 'Vendor Agreement 2024', type: 'contract', date: '2024-01-01', size: '890 KB' },
    { id: 4, name: 'W9 Form', type: 'tax', date: '2023-11-20', size: '156 KB' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'orders-quotes', label: 'Orders & Quotes', icon: Package },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText }
  ]

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">YTD Sales</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold">${ytdSales.toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-1">+12% vs last year</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Outstanding</span>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold">${outstandingBalance.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">3 invoices</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Credit Available</span>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">${creditAvailable.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">
            of ${selectedCustomer.credit_limit?.toLocaleString() || '0'} limit
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Order</span>
            <span className="text-sm font-medium">3 days ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Order Value</span>
            <span className="text-sm font-medium">$8,500</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Top Products</span>
            <span className="text-sm font-medium">Rebar, Concrete Mix, 2x4 Lumber</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment Terms</span>
            <span className="text-sm font-medium">NET 30</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Days to Pay</span>
            <span className="text-sm font-medium">28 days</span>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 5).map(activity => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                activity.type === 'quote' && "bg-blue-100",
                activity.type === 'order' && "bg-green-100",
                activity.type === 'payment' && "bg-emerald-100",
                activity.type === 'note' && "bg-gray-100",
                activity.type === 'email' && "bg-purple-100"
              )}>
                {activity.type === 'quote' && <FileText className="h-4 w-4 text-blue-600" />}
                {activity.type === 'order' && <Package className="h-4 w-4 text-green-600" />}
                {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-emerald-600" />}
                {activity.type === 'note' && <MessageSquare className="h-4 w-4 text-gray-600" />}
                {activity.type === 'email' && <Mail className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{activity.action}</div>
                <div className="text-xs text-gray-500">{activity.time} • {activity.user}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Primary Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{selectedCustomer.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <a href={`mailto:${selectedCustomer.email}`} className="text-sm text-blue-600 hover:underline">
              {selectedCustomer.email}
            </a>
          </div>
          {selectedCustomer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${selectedCustomer.phone}`} className="text-sm text-blue-600 hover:underline">
                {selectedCustomer.phone}
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  )

  const renderOrdersQuotesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Search quotes and orders..." 
            className="w-64"
            prefix={<Search className="h-4 w-4" />}
          />
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>All Types</option>
            <option>Quotes Only</option>
            <option>Orders Only</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Quote
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium">Type</th>
                <th className="text-left p-4 text-sm font-medium">Number</th>
                <th className="text-left p-4 text-sm font-medium">Date</th>
                <th className="text-left p-4 text-sm font-medium">Items</th>
                <th className="text-right p-4 text-sm font-medium">Total</th>
                <th className="text-center p-4 text-sm font-medium">Status</th>
                <th className="text-center p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Quotes */}
              {customerQuotes.map(quote => (
                <tr key={quote.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Badge variant="outline" className="bg-blue-50">Quote</Badge>
                  </td>
                  <td className="p-4 font-medium">{quote.quote_number}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">{quote.line_items.length} items</td>
                  <td className="p-4 text-right font-medium">${quote.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <StatusBadge status={quote.status} type="quote" size="sm" />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {quote.status === 'sent' && (
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Orders */}
              {customerOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Badge variant="outline" className="bg-green-50">Order</Badge>
                  </td>
                  <td className="p-4 font-medium">{order.po_number}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm">{order.line_items.length} items</td>
                  <td className="p-4 text-right font-medium">${order.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <StatusBadge status={order.status} type="order" size="sm" />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Package className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  const renderFinancialTab = () => (
    <div className="space-y-6">
      {/* Credit Status */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Credit Status</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Credit Utilization</span>
              <span className="text-sm font-medium">
                ${outstandingBalance.toLocaleString()} of ${selectedCustomer.credit_limit?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ 
                  width: `${Math.min(100, (outstandingBalance / (selectedCustomer.credit_limit || 1)) * 100)}%` 
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Payment Terms</span>
              <p className="font-medium">NET 30</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Average Days to Pay</span>
              <p className="font-medium">28 days</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Outstanding Invoices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Outstanding Invoices</h3>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send Statement
          </Button>
        </div>
        <div className="space-y-2">
          {customerInvoices
            .filter(inv => ['sent', 'overdue', 'partial'].includes(inv.status))
            .map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{invoice.invoice_number}</div>
                  <div className="text-sm text-gray-500">
                    Due {new Date(invoice.due_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${invoice.balance_due.toFixed(2)}</div>
                  <StatusBadge status={invoice.status} type="invoice" size="sm" />
                </div>
              </div>
            ))}
          {customerInvoices.filter(inv => ['sent', 'overdue', 'partial'].includes(inv.status)).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No outstanding invoices</p>
          )}
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment History</h3>
        <div className="space-y-2">
          {customerInvoices
            .filter(inv => inv.status === 'paid')
            .slice(0, 5)
            .map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{invoice.invoice_number}</div>
                  <div className="text-sm text-gray-500">
                    Paid {invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">${invoice.total_amount.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">On time</div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Financial Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Financial Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">YTD Sales</span>
            <p className="text-xl font-bold">${ytdSales.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">QTD Sales</span>
            <p className="text-xl font-bold">$142,500</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">MTD Sales</span>
            <p className="text-xl font-bold">$45,800</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Avg Order Value</span>
            <p className="text-xl font-bold">$8,500</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderActivityTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="ghost" size="sm">Quotes</Button>
          <Button variant="ghost" size="sm">Orders</Button>
          <Button variant="ghost" size="sm">Communications</Button>
          <Button variant="ghost" size="sm">Notes</Button>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-4">
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute ml-4 mt-8 h-full w-0.5 bg-gray-200" />
              )}
              
              {/* Activity icon */}
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                activity.type === 'quote' && "bg-blue-100",
                activity.type === 'order' && "bg-green-100",
                activity.type === 'payment' && "bg-emerald-100",
                activity.type === 'note' && "bg-gray-100",
                activity.type === 'email' && "bg-purple-100"
              )}>
                {activity.type === 'quote' && <FileText className="h-4 w-4 text-blue-600" />}
                {activity.type === 'order' && <Package className="h-4 w-4 text-green-600" />}
                {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-emerald-600" />}
                {activity.type === 'note' && <MessageSquare className="h-4 w-4 text-gray-600" />}
                {activity.type === 'email' && <Mail className="h-4 w-4 text-purple-600" />}
              </div>

              {/* Activity content */}
              <div className="flex-1 pb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{activity.action}</h4>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">By {activity.user}</p>
                  {activity.type === 'note' && (
                    <p className="text-sm mt-2">
                      Discussed upcoming renovation project. Customer interested in bulk pricing for drywall and insulation. 
                      Follow up next week with formal quote.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Search documents..." 
            className="w-64"
            prefix={<Search className="h-4 w-4" />}
          />
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>All Types</option>
            <option>Certificates</option>
            <option>Contracts</option>
            <option>Tax Documents</option>
          </select>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-500">
                      {doc.expires ? `Expires ${doc.expires}` : `Uploaded ${doc.date}`} • {doc.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.expires && new Date(doc.expires) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <Badge variant="outline" className="bg-yellow-50">
                      Expiring Soon
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab()
      case 'orders-quotes': return renderOrdersQuotesTab()
      case 'financial': return renderFinancialTab()
      case 'activity': return renderActivityTab()
      case 'documents': return renderDocumentsTab()
      default: return renderOverviewTab()
    }
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Customer List Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Customers</h1>
            <Button size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search customers..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Recently Viewed Section */}
          {!searchQuery && recentlyViewed.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Recently Viewed
                  </span>
                </div>
              </div>
              {recentlyViewed.map(customer => {
                const customerYtd = sampleOrders
                  .filter(o => o.customer.id === customer.id)
                  .reduce((sum, o) => sum + o.total, 0)
                
                return (
                  <div
                    key={`recent-${customer.id}`}
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setActiveTab('overview')
                    }}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedCustomer.id === customer.id && "bg-blue-50 border-l-4 border-l-blue-600"
                    )}
                  >
                    <div className="mb-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-gray-500">{customer.type}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">YTD: ${customerYtd.toLocaleString()}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* All Customers Section */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                {searchQuery ? 'Search Results' : 'All Customers'} ({filteredCustomers.length})
              </span>
            </div>
          </div>
          {filteredCustomers.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No customers found matching "{searchQuery}"
            </div>
          ) : (
            filteredCustomers.map(customer => {
              const customerYtd = sampleOrders
                .filter(o => o.customer.id === customer.id)
                .reduce((sum, o) => sum + o.total, 0)
              
              return (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setActiveTab('overview')
                  }}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedCustomer.id === customer.id && "bg-blue-50 border-l-4 border-l-blue-600"
                  )}
                >
                  <div className="mb-2">
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.type}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">YTD: ${customerYtd.toLocaleString()}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{selectedCustomer.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="outline">{selectedCustomer.type}</Badge>
                {selectedCustomer.tax_exempt && (
                  <Badge variant="outline" className="bg-green-50">Tax Exempt</Badge>
                )}
                <span className="text-sm text-gray-500">
                  Customer since {new Date('2020-01-15').getFullYear()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <PhoneCall className="h-4 w-4 mr-2" />
                Log Call
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="flex items-center gap-1 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CustomerTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors",
                    activeTab === tab.id 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}