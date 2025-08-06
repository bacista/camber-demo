'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Quote } from '@/lib/types'
import { 
  Copy,
  ChevronDown,
  Clock,
  Building,
  DollarSign,
  Package,
  CheckCircle,
  FileText
} from 'lucide-react'

interface PreviousQuoteSelectProps {
  recentQuotes: Quote[]
  onSelectQuote: (quote: Quote) => void
  currentCustomerId?: string
  className?: string
}

export function PreviousQuoteSelect({ 
  recentQuotes,
  onSelectQuote,
  currentCustomerId,
  className 
}: PreviousQuoteSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null)

  // Filter to show most relevant quotes (same customer first, then recent)
  const relevantQuotes = [...recentQuotes]
    .sort((a, b) => {
      // Same customer first
      if (currentCustomerId) {
        const aMatch = a.customer.id === currentCustomerId
        const bMatch = b.customer.id === currentCustomerId
        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1
      }
      // Then by date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    .slice(0, 5)

  const handleSelectQuote = (quote: Quote) => {
    onSelectQuote(quote)
    setCopiedQuoteId(quote.id)
    setIsOpen(false)
    
    // Reset copied state after animation
    setTimeout(() => {
      setCopiedQuoteId(null)
    }, 2000)
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Copy className="h-3 w-3 mr-1" />
        Copy from Previous
        <ChevronDown className={cn(
          "h-3 w-3 ml-1 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-8 left-0 w-80 bg-white rounded-lg shadow-lg border z-40">
            <div className="p-2 border-b">
              <p className="text-xs font-medium text-gray-600">Recent Quotes</p>
            </div>
            
            <div className="max-h-80 overflow-auto">
              {relevantQuotes.map((quote) => {
                const daysAgo = Math.floor(
                  (Date.now() - new Date(quote.created_at).getTime()) / (1000 * 60 * 60 * 24)
                )
                
                return (
                  <div
                    key={quote.id}
                    className={cn(
                      "p-3 hover:bg-gray-50 cursor-pointer border-b transition-colors",
                      copiedQuoteId === quote.id && "bg-green-50"
                    )}
                    onClick={() => handleSelectQuote(quote)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{quote.quote_number}</span>
                          <StatusBadge status={quote.status} size="sm" showIcon={false} />
                          {currentCustomerId === quote.customer.id && (
                            <Badge variant="outline" className="text-xs bg-blue-50">
                              Same Customer
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {quote.customer.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {quote.line_items.length} items
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <DollarSign className="h-3 w-3" />
                              ${quote.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {copiedQuoteId === quote.id ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Copied!</span>
                        </div>
                      ) : (
                        <FileText className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="p-2 bg-gray-50 text-xs text-gray-500">
              Select a quote to copy all line items
            </div>
          </div>
        </>
      )}
    </div>
  )
}