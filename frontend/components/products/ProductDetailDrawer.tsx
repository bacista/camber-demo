'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { Product } from '@/lib/types'
import { sampleProducts } from '@/lib/mock-data'
import {
  X,
  Package,
  MapPin,
  Clock,
  FileText,
  Copy,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle,
  Truck,
  Info
} from 'lucide-react'

interface ProductDetailDrawerProps {
  product: Product | null
  onClose: () => void
  onAddToQuote?: (products: { product: Product; quantity: number }[]) => void
}

export function ProductDetailDrawer({ product, onClose, onAddToQuote }: ProductDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'docs' | 'alternatives'>('overview')
  const [quantity, setQuantity] = useState(1)
  const [addedToQuote, setAddedToQuote] = useState(false)

  if (!product) return null

  const handleAddToQuote = () => {
    if (onAddToQuote) {
      onAddToQuote([{ product, quantity }])
    }
    setAddedToQuote(true)
    setTimeout(() => setAddedToQuote(false), 2000)
  }

  const getAlternativeProducts = () => {
    if (!product.alternatives) return []
    return product.alternatives
      .map(id => sampleProducts.find(p => p.id === id))
      .filter(Boolean) as Product[]
  }

  const getStockStatusColor = (status?: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-50'
      case 'low_stock': return 'text-yellow-600 bg-yellow-50'
      case 'special_order': return 'text-blue-600 bg-blue-50'
      case 'out_of_stock': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStockStatusText = (status?: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock'
      case 'low_stock': return 'Low Stock'
      case 'special_order': return 'Special Order'
      case 'out_of_stock': return 'Out of Stock'
      default: return 'Unknown'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                {product.manufacturer_sku && (
                  <span className="text-sm text-gray-600">MFG: {product.manufacturer_sku}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'docs', label: 'Documents' },
              { id: 'alternatives', label: 'Alternatives' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-3 border-b-2 text-sm font-medium transition-colors",
                  activeTab === tab.id 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div>
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                  getStockStatusColor(product.inventory_status)
                )}>
                  {product.inventory_status === 'in_stock' && <CheckCircle className="h-4 w-4" />}
                  {product.inventory_status === 'low_stock' && <AlertCircle className="h-4 w-4" />}
                  {product.inventory_status === 'special_order' && <Clock className="h-4 w-4" />}
                  {product.inventory_status === 'out_of_stock' && <X className="h-4 w-4" />}
                  {getStockStatusText(product.inventory_status)}
                  {product.available_quantity && product.available_quantity > 0 && (
                    <span>({product.available_quantity} available)</span>
                  )}
                </div>

                {product.lead_time_days && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    Lead time: {product.lead_time_days} business days
                  </div>
                )}
              </div>

              {/* Stock by Location */}
              {product.stock_locations && product.stock_locations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Stock by Location</h3>
                  <div className="space-y-2">
                    {product.stock_locations.map(location => (
                      <div 
                        key={location.location}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{location.location}</span>
                        </div>
                        <Badge variant="outline">{location.quantity} units</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Information */}
              <div>
                <h3 className="font-semibold mb-3">Key Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Unit:</span>
                    <span className="font-medium">{product.unit_of_measure}</span>
                  </div>
                  {product.category && (
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category.join(' > ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <h3 className="font-semibold mb-4">Technical Specifications</h3>
              {product.specifications ? (
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div 
                      key={key}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No specifications available</p>
              )}
            </div>
          )}

          {activeTab === 'docs' && (
            <div>
              <h3 className="font-semibold mb-4">Documents & Resources</h3>
              <div className="space-y-2">
                <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">Product Specification Sheet</div>
                        <div className="text-xs text-gray-500">PDF, 245 KB</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">Installation Guide</div>
                        <div className="text-xs text-gray-500">PDF, 1.2 MB</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">Safety Data Sheet (SDS)</div>
                        <div className="text-xs text-gray-500">PDF, 180 KB</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'alternatives' && (
            <div>
              <h3 className="font-semibold mb-4">Alternative Products</h3>
              {getAlternativeProducts().length > 0 ? (
                <div className="space-y-3">
                  {getAlternativeProducts().map(alt => (
                    <Card key={alt.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alt.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{alt.description}</div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">SKU: {alt.sku}</span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                alt.inventory_status === 'in_stock' && "border-green-500 text-green-700",
                                alt.inventory_status === 'low_stock' && "border-yellow-500 text-yellow-700",
                                alt.inventory_status === 'special_order' && "border-blue-500 text-blue-700",
                                alt.inventory_status === 'out_of_stock' && "border-gray-500 text-gray-700"
                              )}
                            >
                              {getStockStatusText(alt.inventory_status)}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // In real app, would switch to viewing this product
                            console.log('View alternative:', alt.id)
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No alternative products available</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Quantity:</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600">{product.unit_of_measure}</span>
            </div>
            <div className="flex-1" />
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={handleAddToQuote}
              disabled={product.inventory_status === 'out_of_stock' && !product.lead_time_days}
            >
              {addedToQuote ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Added!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Quote
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}