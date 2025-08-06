'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SourceBadge } from '@/components/shared/SourceBadge'
import { sampleOrders } from '@/lib/mock-data'
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Package,
  FileText,
  Mail,
  Radio,
  Zap,
  Building,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Edit2,
  Eye,
  Check,
  X,
  Keyboard,
  MoreVertical,
  Printer,
  Send,
  Trash2,
  Users,
  Calendar,
  CreditCard,
  AlertCircle
} from 'lucide-react'

export default function OrdersB2BPage() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSelectAll = () => {
    if (selectedOrders.size === sampleOrders.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(sampleOrders.map(order => order.id)))
    }
  }

  const handleOrderSelect = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Order Queue</h1>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Keyboard className="h-3 w-3" />
              <span>Space: Select</span>
              <span className="mx-1">|</span>
              <span>A: Approve</span>
              <span className="mx-1">|</span>
              <span>E: Export</span>
              <span className="mx-1">|</span>
              <span>R: Refresh</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Input placeholder="PO Number" className="h-7 w-32 text-xs" />
          <Input placeholder="Customer" className="h-7 w-32 text-xs" />
          <select className="h-7 px-2 text-xs border rounded">
            <option>All Sources</option>
            <option>From Quote</option>
            <option>Email</option>
            <option>EDI</option>
            <option>API</option>
          </select>
          <select className="h-7 px-2 text-xs border rounded">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <Input placeholder="Confidence >" type="number" className="h-7 w-24 text-xs" />
          <Input type="date" className="h-7 w-32 text-xs" />
          <Input type="date" className="h-7 w-32 text-xs" />
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Apply
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Clear
          </Button>
          <select className="h-7 px-2 text-xs border rounded ml-auto">
            <option>Saved Filters</option>
            <option>High Confidence (>90%)</option>
            <option>Review Required</option>
            <option>Today's Orders</option>
            <option>Quote Conversions</option>
          </select>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                <span className="font-semibold">{sampleOrders.length}</span> Orders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                <span className="font-semibold">$45,892</span> Total Value
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">
                <span className="font-semibold">3</span> Auto-Processing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm">
                <span className="font-semibold">2</span> Need Review
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Avg Confidence: <span className="font-semibold">91%</span></span>
            <span>Avg Process Time: <span className="font-semibold">2.3 min</span></span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (shows when items selected) */}
      {selectedOrders.size > 0 && (
        <div className="bg-yellow-50 border-b px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedOrders.size} orders selected • ${
                sampleOrders
                  .filter(o => selectedOrders.has(o.id))
                  .reduce((sum, o) => sum + o.total, 0)
                  .toFixed(2)
              } total
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve All
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Send className="h-3 w-3 mr-1" />
                Process to ERP
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Printer className="h-3 w-3 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Users className="h-3 w-3 mr-1" />
                Assign To
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedOrders(new Set())}>
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Data Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b">
              <th className="p-2 text-left w-10">
                <input 
                  type="checkbox"
                  checked={selectedOrders.size === sampleOrders.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-2 text-left w-10"></th>
              <th className="p-2 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={() => handleSort('po_number')}
                >
                  PO Number
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-2 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={() => handleSort('customer')}
                >
                  Customer
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-2 text-center">Source</th>
              <th className="p-2 text-center">Items</th>
              <th className="p-2 text-right">
                <button 
                  className="flex items-center gap-1 hover:text-blue-600 ml-auto"
                  onClick={() => handleSort('total')}
                >
                  Total
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-2 text-center">
                <button 
                  className="flex items-center gap-1 hover:text-blue-600 justify-center"
                  onClick={() => handleSort('confidence')}
                >
                  Confidence
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={() => handleSort('created_at')}
                >
                  Created
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleOrders.map((order) => (
              <>
                <tr 
                  key={order.id} 
                  className={`border-b hover:bg-gray-50 ${
                    selectedOrders.has(order.id) ? 'bg-blue-50' : ''
                  } ${
                    order.source === 'quote' ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                >
                  <td className="p-2">
                    <input 
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleOrderSelect(order.id)}
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedOrder === order.id ? 
                        <ChevronDown className="h-3 w-3" /> : 
                        <ChevronRight className="h-3 w-3" />
                      }
                    </button>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.po_number}</span>
                      {order.source === 'quote' && (
                        <Badge variant="outline" className="text-xs bg-emerald-50">
                          NEW
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.type}</div>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <SourceBadge source={order.source} size="sm" showIcon />
                  </td>
                  <td className="p-2 text-center">
                    {order.line_items.length}
                  </td>
                  <td className="p-2 text-right font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            order.confidence_score >= 90 ? 'bg-green-500' :
                            order.confidence_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${order.confidence_score}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{order.confidence_score}%</span>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <StatusBadge status={order.status} type="order" size="sm" showIcon={false} />
                  </td>
                  <td className="p-2">
                    <span className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <div className="relative group">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible z-20">
                          <button className="w-full text-left px-3 py-1 text-xs hover:bg-gray-50">Process to ERP</button>
                          <button className="w-full text-left px-3 py-1 text-xs hover:bg-gray-50">Duplicate</button>
                          <button className="w-full text-left px-3 py-1 text-xs hover:bg-gray-50">Print</button>
                          <button className="w-full text-left px-3 py-1 text-xs hover:bg-gray-50">Export PDF</button>
                          <button className="w-full text-left px-3 py-1 text-xs hover:bg-gray-50 text-red-600">Cancel Order</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedOrder === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={11} className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Quote Metadata (if from quote) */}
                        {order.source === 'quote' && order.source_metadata && (
                          <div className="col-span-1">
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Quote Intelligence
                            </h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Original Quote:</span>
                                <span className="font-medium">{order.source_metadata.quote_number}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Conversion Time:</span>
                                <span className="font-medium">2.3 hours</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sales Rep:</span>
                                <span className="font-medium">Sarah Chen</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Line Items */}
                        <div className={order.source === 'quote' ? 'col-span-1' : 'col-span-2'}>
                          <h4 className="text-xs font-semibold mb-2">Line Items</h4>
                          <div className="space-y-1">
                            {order.line_items.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex justify-between text-xs">
                                <span>{item.product.sku} - {item.product.name}</span>
                                <span>{item.quantity} × ${item.unit_price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Customer Info */}
                        <div className="col-span-1">
                          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            Customer Details
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Credit Available:</span>
                              <span className="font-medium text-green-600">$35,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Terms:</span>
                              <span className="font-medium">Net 30</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">YTD Volume:</span>
                              <span className="font-medium">$1.2M</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        {order.confidence_score === 100 ? (
                          <>
                            <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto-Process to ERP
                            </Button>
                            <span className="text-xs text-green-600 ml-2">
                              ✓ Ready for automatic processing (100% confidence)
                            </span>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Review Items
                            </Button>
                            <Button size="sm" className="h-7 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve & Process
                            </Button>
                            <span className="text-xs text-yellow-600 ml-2">
                              ⚠ Manual review recommended ({order.confidence_score}% confidence)
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Showing {sampleOrders.length} of {sampleOrders.length} orders</span>
            <span>|</span>
            <span>Selected: {selectedOrders.size}</span>
            <span>|</span>
            <span>Last refresh: Just now</span>
            <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh (R)
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export All
            </Button>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}