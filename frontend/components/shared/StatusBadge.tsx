'use client'

import { cn } from '@/lib/utils'
import type { QuoteStatus, OrderStatus } from '@/lib/types'

const quoteStatusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: '📝' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800', icon: '📧' },
  viewed: { label: 'Viewed', color: 'bg-purple-100 text-purple-800', icon: '👁️' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: '❌' },
  expired: { label: 'Expired', color: 'bg-orange-100 text-orange-800', icon: '⏰' },
  converted: { label: 'Converted', color: 'bg-emerald-100 text-emerald-800', icon: '🎉' },
}

const orderStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: '⚙️' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: '❌' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800', icon: '🎉' },
}

interface StatusBadgeProps {
  status: QuoteStatus | OrderStatus
  type?: 'quote' | 'order'
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatusBadge({ 
  status, 
  type = 'quote',
  showIcon = true,
  size = 'md',
  className 
}: StatusBadgeProps) {
  const config = type === 'quote' 
    ? quoteStatusConfig[status as QuoteStatus] 
    : orderStatusConfig[status as OrderStatus]

  if (!config) return null

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span className="text-xs">{config.icon}</span>}
      {config.label}
    </span>
  )
}