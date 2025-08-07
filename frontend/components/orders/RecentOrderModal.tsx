'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Package,
  FileText,
  Truck,
  Calendar,
  Building,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Copy,
  Send,
  Eye,
  X,
  DollarSign,
  Hash,
  BarChart3,
  History
} from 'lucide-react'
import type { Order } from '@/lib/types'

interface RecentOrderModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onCopyToQuote?: (order: Order) => void
}

export function RecentOrderModal({ order, isOpen, onClose, onCopyToQuote }: RecentOrderModalProps) {
  const [activeTab, setActiveTab] = useState('details')
  
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">
                Purchase Order {order.po_number}
              </DialogTitle>
              <StatusBadge status={order.status} />
              {order.is_urgent && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onCopyToQuote && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onCopyToQuote(order)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy to Quote
                </Button>
              )}
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="items">Line Items ({order.line_items.length})</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-6 p-4">
              {/* Order Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PO Number:</span>
                    <span className="font-medium">{order.po_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium">{order.reference_number || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium">{order.project_name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <Badge variant="outline" className="text-xs">{order.source}</Badge>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{order.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{order.customer.contact_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-blue-600">{order.customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{order.customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <Badge variant="outline" className="text-xs">{order.customer.type}</Badge>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">{order.shipping_method || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requested Date:</span>
                    <span className="font-medium">
                      {order.requested_delivery_date 
                        ? new Date(order.requested_delivery_date).toLocaleDateString()
                        : 'ASAP'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right">
                      {order.shipping_address ? (
                        <>
                          {order.shipping_address.street}<br />
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                        </>
                      ) : (
                        'Same as billing'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${order.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">${order.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-green-600">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Terms:</span>
                    <span className="font-medium">{order.payment_terms || 'Net 30'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Line Items Tab */}
          <TabsContent value="items" className="flex-1 overflow-auto">
            <div className="p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">SKU</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-center">UOM</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Extended</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.line_items.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 font-medium">{item.product.sku}</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          {item.product.description && (
                            <div className="text-xs text-gray-500">{item.product.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-center text-xs">{item.product.unit_of_measure}</td>
                      <td className="p-2 text-right">${item.unit_price.toFixed(2)}</td>
                      <td className="p-2 text-right font-medium">${item.subtotal.toFixed(2)}</td>
                      <td className="p-2 text-center">
                        {item.product.inventory_status === 'in_stock' && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            In Stock
                          </Badge>
                        )}
                        {item.product.inventory_status === 'low_stock' && (
                          <Badge variant="outline" className="text-xs text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low
                          </Badge>
                        )}
                        {item.product.inventory_status === 'out_of_stock' && (
                          <Badge variant="outline" className="text-xs text-red-600">
                            <X className="h-3 w-3 mr-1" />
                            Out
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="flex-1 overflow-auto">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Order Confirmed</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Processing Started</div>
                    <div className="text-xs text-gray-500">
                      {new Date(Date.parse(order.created_at) + 3600000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Order sent to warehouse for fulfillment
                    </div>
                  </div>
                </div>

                {order.status === 'shipped' && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Shipped</div>
                      <div className="text-xs text-gray-500">
                        {new Date(Date.parse(order.created_at) + 86400000).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Tracking: <span className="text-blue-600">1Z999AA10123456784</span>
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Delivered</div>
                      <div className="text-xs text-gray-500">
                        {new Date(Date.parse(order.created_at) + 172800000).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Signed by: J. Smith
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="flex-1 overflow-auto">
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">Purchase Order PDF</div>
                      <div className="text-xs text-gray-500">Generated on {new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">Order Confirmation</div>
                      <div className="text-xs text-gray-500">Sent to customer</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>

                {order.status === 'shipped' && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-sm">Shipping Label</div>
                        <div className="text-xs text-gray-500">UPS Ground</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-sm">Proof of Delivery</div>
                        <div className="text-xs text-gray-500">Signed receipt</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}