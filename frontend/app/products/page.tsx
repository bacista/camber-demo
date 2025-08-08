'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { sampleProducts, productCategories } from '@/lib/mock-data'
import { ProductDetailDrawer } from '@/components/products/ProductDetailDrawer'
import type { Product } from '@/lib/types'
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  ChevronDown,
  Package,
  Clock,
  MapPin,
  Grid3x3,
  List,
  Download,
  ArrowUpDown,
  CheckSquare,
  Square,
  AlertCircle,
  X
} from 'lucide-react'

type ViewMode = 'list' | 'grid'
type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'special_order'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['steel', 'concrete', 'lumber', 'plumbing']))
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return sampleProducts.filter(product => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery || 
        product.sku.toLowerCase().includes(searchLower) ||
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.manufacturer_sku?.toLowerCase().includes(searchLower) ||
        Object.values(product.specifications || {}).some(spec => 
          String(spec).toLowerCase().includes(searchLower)
        )

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        product.category?.[0]?.toLowerCase() === selectedCategory.toLowerCase()
      const matchesSubcategory = selectedSubcategory === 'all' || 
        product.category?.[1]?.toLowerCase() === selectedSubcategory.toLowerCase()

      // Stock filter
      const matchesStock = stockFilter === 'all' || product.inventory_status === stockFilter

      return matchesSearch && matchesCategory && matchesSubcategory && matchesStock
    })
  }, [searchQuery, selectedCategory, selectedSubcategory, stockFilter])

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)])
    }
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const updated = new Set(prev)
      if (updated.has(categoryId)) {
        updated.delete(categoryId)
      } else {
        updated.add(categoryId)
      }
      return updated
    })
  }

  // Handle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const updated = new Set(prev)
      if (updated.has(productId)) {
        updated.delete(productId)
      } else {
        updated.add(productId)
      }
      return updated
    })
  }

  // Select/deselect all visible products
  const toggleAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  // Add selected products to quote
  const addToQuote = () => {
    // In real app, would integrate with quote builder
    console.log('Adding to quote:', Array.from(selectedProducts))
    alert(`Added ${selectedProducts.size} products to quote`)
    setSelectedProducts(new Set())
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with /
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        document.getElementById('product-search')?.focus()
      }
      // Add to quote with A
      if (e.key === 'a' && !e.ctrlKey && !e.metaKey && selectedProducts.size > 0) {
        e.preventDefault()
        addToQuote()
      }
      // Toggle view with V
      if (e.key === 'v' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setViewMode(prev => prev === 'list' ? 'grid' : 'list')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProducts])

  const getStockBadge = (product: Product) => {
    switch (product.inventory_status) {
      case 'in_stock':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            ✓ In Stock ({product.available_quantity})
          </Badge>
        )
      case 'low_stock':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            ⚠ Low Stock ({product.available_quantity})
          </Badge>
        )
      case 'special_order':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            ⏱ Special Order ({product.lead_time_days}d)
          </Badge>
        )
      case 'out_of_stock':
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            ✗ Out of Stock
          </Badge>
        )
      default:
        return null
    }
  }

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left">
              <input
                type="checkbox"
                checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                onChange={toggleAllProducts}
                className="rounded"
              />
            </th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">SKU</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Product</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Specifications</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Stock</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Locations</th>
            <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredProducts.map(product => (
            <tr 
              key={product.id} 
              className={cn(
                "hover:bg-gray-50 transition-colors",
                selectedProducts.has(product.id) && "bg-blue-50"
              )}
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  className="rounded"
                />
              </td>
              <td className="p-3">
                <div className="font-medium text-sm">{product.sku}</div>
                {product.manufacturer_sku && (
                  <div className="text-xs text-gray-500">MFG: {product.manufacturer_sku}</div>
                )}
              </td>
              <td className="p-3">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-gray-600">{product.description}</div>
              </td>
              <td className="p-3">
                <div className="text-sm space-y-0.5">
                  {product.specifications && Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-gray-500">{key}:</span> <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="p-3">
                {getStockBadge(product)}
              </td>
              <td className="p-3">
                <div className="text-xs space-y-0.5">
                  {product.stock_locations?.slice(0, 2).map(location => (
                    <div key={location.location} className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span>{location.location}: {location.quantity}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedProducts(new Set([product.id]))
                      addToQuote()
                    }}
                  >
                    Add to Quote
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProducts.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No products found matching your filters
        </div>
      )}
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <Card 
          key={product.id}
          className={cn(
            "p-4 hover:shadow-lg transition-shadow cursor-pointer",
            selectedProducts.has(product.id) && "ring-2 ring-blue-500"
          )}
          onClick={() => setSelectedProduct(product)}
        >
          <div className="flex items-start justify-between mb-2">
            <input
              type="checkbox"
              checked={selectedProducts.has(product.id)}
              onChange={(e) => {
                e.stopPropagation()
                toggleProductSelection(product.id)
              }}
              onClick={(e) => e.stopPropagation()}
              className="rounded mt-1"
            />
            {getStockBadge(product)}
          </div>
          
          <div className="mb-3">
            <div className="font-semibold text-sm">{product.sku}</div>
            <div className="text-sm text-gray-900 mt-1">{product.name}</div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</div>
          </div>

          <div className="text-xs space-y-1 mb-3">
            {product.specifications && Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-500">{key}:</span> <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {product.unit_of_measure}
            </div>
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedProducts(new Set([product.id]))
                addToQuote()
              }}
            >
              Add to Quote
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="product-search"
                placeholder="Search by SKU, name, or specification... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={stockFilter === 'in_stock' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter(stockFilter === 'in_stock' ? 'all' : 'in_stock')}
              >
                In Stock
              </Button>
              <Button
                variant={stockFilter === 'special_order' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter(stockFilter === 'special_order' ? 'all' : 'special_order')}
              >
                Special Order
              </Button>
            </div>

            <div className="flex items-center gap-1 border rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded",
                  viewMode === 'list' && "bg-gray-100"
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded",
                  viewMode === 'grid' && "bg-gray-100"
                )}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>

            {selectedProducts.size > 0 && (
              <Button onClick={addToQuote}>
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedProducts.size} to Quote
              </Button>
            )}
          </div>
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Recent:</span>
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(search)}
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                {search}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category sidebar */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedSubcategory('all')
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100",
                  selectedCategory === 'all' && "bg-blue-50 text-blue-600 font-medium"
                )}
              >
                All Products ({sampleProducts.length})
              </button>
              
              {productCategories.map(category => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded text-sm hover:bg-gray-100",
                      selectedCategory === category.id && "bg-blue-50 text-blue-600 font-medium"
                    )}
                  >
                    <span onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCategory(category.id)
                      setSelectedSubcategory('all')
                    }}>
                      {category.name}
                    </span>
                    {expandedCategories.has(category.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </button>
                  
                  {expandedCategories.has(category.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.subcategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setSelectedSubcategory(sub.id)
                          }}
                          className={cn(
                            "w-full text-left px-3 py-1.5 rounded text-sm hover:bg-gray-100",
                            selectedCategory === category.id && selectedSubcategory === sub.id && 
                            "bg-blue-50 text-blue-600"
                          )}
                        >
                          {sub.name} ({sub.count})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product list/grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} products
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {selectedSubcategory !== 'all' && ` > ${selectedSubcategory}`}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? renderListView() : renderGridView()}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedProducts.size > 0 && (
        <div className="bg-white border-t px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedProducts.size} products selected
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedProducts(new Set())}>
                Clear Selection
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button onClick={addToQuote}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Quote
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={(items) => {
          // In real app, would integrate with quote builder
          console.log('Adding to quote:', items)
          alert(`Added ${items[0].product.name} (${items[0].quantity}) to quote`)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}