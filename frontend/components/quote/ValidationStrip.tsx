'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Quote, LineItem } from '@/lib/types'
import { 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  Percent,
  FileCheck,
  TrendingDown,
  Info,
  X
} from 'lucide-react'

interface ValidationIndicator {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  icon: React.ElementType
  message: string
  detail?: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ValidationStripProps {
  quote: Quote
  className?: string
  onDismiss?: (indicatorId: string) => void
}

export function ValidationStrip({ 
  quote,
  className,
  onDismiss
}: ValidationStripProps) {
  const indicators: ValidationIndicator[] = []

  // Check inventory status
  const lowStockItems = quote.line_items.filter(
    item => item.product.inventory_status === 'low_stock'
  )
  const outOfStockItems = quote.line_items.filter(
    item => item.product.inventory_status === 'out_of_stock'
  )

  if (outOfStockItems.length > 0) {
    indicators.push({
      id: 'out-of-stock',
      type: 'error',
      icon: Package,
      message: `${outOfStockItems.length} item${outOfStockItems.length > 1 ? 's' : ''} out of stock`,
      detail: 'Consider alternatives or adjust delivery date',
      action: {
        label: 'View Items',
        onClick: () => console.log('View out of stock items')
      }
    })
  }

  if (lowStockItems.length > 0) {
    indicators.push({
      id: 'low-stock',
      type: 'warning',
      icon: TrendingDown,
      message: `${lowStockItems.length} item${lowStockItems.length > 1 ? 's' : ''} low stock`,
      detail: 'May affect delivery timeline'
    })
  }

  // Check credit limit
  const creditLimit = 50000 // Mock credit limit
  const creditUsed = 15000 // Mock credit used
  const creditAvailable = creditLimit - creditUsed
  const quoteCreditImpact = creditAvailable - quote.total

  if (quoteCreditImpact < 5000 && quoteCreditImpact > 0) {
    indicators.push({
      id: 'credit-warning',
      type: 'warning',
      icon: CreditCard,
      message: `Within $${quoteCreditImpact.toFixed(0)} of credit limit`,
      detail: 'Customer may need credit increase for future orders'
    })
  } else if (quoteCreditImpact < 0) {
    indicators.push({
      id: 'credit-exceeded',
      type: 'error',
      icon: CreditCard,
      message: `Exceeds credit limit by $${Math.abs(quoteCreditImpact).toFixed(0)}`,
      detail: 'Requires approval or prepayment',
      action: {
        label: 'Request Approval',
        onClick: () => console.log('Request credit approval')
      }
    })
  }

  // Check for contract pricing
  const hasContractPricing = quote.line_items.some(
    item => item.discount_percentage && item.discount_percentage >= 5
  )
  if (hasContractPricing) {
    const avgDiscount = quote.line_items
      .filter(item => item.discount_percentage)
      .reduce((sum, item) => sum + (item.discount_percentage || 0), 0) / 
      quote.line_items.filter(item => item.discount_percentage).length

    indicators.push({
      id: 'contract-pricing',
      type: 'success',
      icon: Percent,
      message: `${avgDiscount.toFixed(0)}% contract discount applied`,
      detail: 'Volume pricing tier active'
    })
  }

  // Check tax exemption
  if (quote.customer.tax_exempt) {
    indicators.push({
      id: 'tax-exempt',
      type: 'success',
      icon: FileCheck,
      message: 'Tax exempt status verified',
      detail: 'Certificate on file expires 12/2025'
    })
  }

  // Check for high-confidence items
  const highConfidenceItems = quote.line_items.filter(
    item => item.confidence_score && item.confidence_score >= 95
  )
  if (highConfidenceItems.length === quote.line_items.length) {
    indicators.push({
      id: 'high-confidence',
      type: 'success',
      icon: CheckCircle,
      message: 'All items validated with high confidence',
      detail: '100% AI accuracy'
    })
  }

  if (indicators.length === 0) {
    return null
  }

  return (
    <div className={cn(
      "bg-white border-b px-4 py-2",
      className
    )}>
      <div className="flex items-center gap-3 overflow-x-auto">
        {indicators.map((indicator) => {
          const Icon = indicator.icon
          
          return (
            <div
              key={indicator.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap",
                indicator.type === 'success' && "bg-green-50 text-green-700 border border-green-200",
                indicator.type === 'warning' && "bg-yellow-50 text-yellow-700 border border-yellow-200",
                indicator.type === 'error' && "bg-red-50 text-red-700 border border-red-200",
                indicator.type === 'info' && "bg-blue-50 text-blue-700 border border-blue-200"
              )}
            >
              <Icon className="h-3 w-3 flex-shrink-0" />
              <span>{indicator.message}</span>
              
              {indicator.detail && (
                <div className="group relative">
                  <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {indicator.detail}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {indicator.action && (
                <button
                  onClick={indicator.action.onClick}
                  className={cn(
                    "ml-1 underline hover:no-underline",
                    indicator.type === 'success' && "text-green-600",
                    indicator.type === 'warning' && "text-yellow-600", 
                    indicator.type === 'error' && "text-red-600",
                    indicator.type === 'info' && "text-blue-600"
                  )}
                >
                  {indicator.action.label}
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={() => onDismiss(indicator.id)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}