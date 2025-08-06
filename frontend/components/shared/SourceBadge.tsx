'use client'

import { cn } from '@/lib/utils'
import type { OrderSource } from '@/lib/types'

const sourceConfig = {
  quote: { 
    label: 'From Quote', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '✨',
    description: 'Created from accepted quote'
  },
  email: { 
    label: 'Email', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📧',
    description: 'Extracted from email'
  },
  edi: { 
    label: 'EDI', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '📡',
    description: 'EDI transaction'
  },
  api: { 
    label: 'API', 
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '🔌',
    description: 'API integration'
  },
}

interface SourceBadgeProps {
  source: OrderSource
  showIcon?: boolean
  showDescription?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SourceBadge({ 
  source, 
  showIcon = true,
  showDescription = false,
  size = 'md',
  className 
}: SourceBadgeProps) {
  const config = sourceConfig[source]

  if (!config) return null

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <div className={cn('inline-flex flex-col gap-0.5', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium border',
          config.color,
          sizeClasses[size]
        )}
      >
        {showIcon && <span>{config.icon}</span>}
        <span className="font-semibold">{config.label}</span>
      </span>
      {showDescription && (
        <span className="text-xs text-muted-foreground ml-1">
          {config.description}
        </span>
      )}
    </div>
  )
}