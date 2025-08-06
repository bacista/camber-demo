'use client'

import { cn } from '@/lib/utils'

interface ConfidenceMeterProps {
  confidence: number // 0-100
  showLabel?: boolean
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ConfidenceMeter({
  confidence,
  showLabel = true,
  showPercentage = true,
  size = 'md',
  className,
}: ConfidenceMeterProps) {
  const getColor = (value: number) => {
    if (value >= 90) return 'bg-green-500'
    if (value >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTextColor = (value: number) => {
    if (value >= 90) return 'text-green-700'
    if (value >= 70) return 'text-yellow-700'
    return 'text-red-700'
  }

  const getEmoji = (value: number) => {
    if (value >= 95) return '💯'
    if (value >= 90) return '🟢'
    if (value >= 70) return '🟡'
    return '🔴'
  }

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className={cn('flex items-center justify-between', textSizes[size])}>
          <span className="text-muted-foreground">Confidence</span>
          {showPercentage && (
            <span className={cn('font-semibold flex items-center gap-1', getTextColor(confidence))}>
              <span>{getEmoji(confidence)}</span>
              <span>{confidence}%</span>
            </span>
          )}
        </div>
      )}
      <div className="relative w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'transition-all duration-500 ease-out rounded-full',
            getColor(confidence),
            sizeClasses[size]
          )}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  )
}