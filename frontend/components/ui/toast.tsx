'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  action
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <X className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  const styles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200'
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-2",
      styles[type]
    )}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Hook to manage toasts
export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (props: ToastProps) => {
    setToast(props)
  }

  const hideToast = () => {
    setToast(null)
  }

  return {
    toast,
    showToast,
    hideToast
  }
}