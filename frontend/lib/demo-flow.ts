'use client'

import { create } from 'zustand'
import { apiClient } from './api-client'
import type { Quote, Order } from './types'

export interface DemoNotification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  description?: string
  timestamp: Date
  duration?: number // ms, undefined = persistent
}

interface DemoFlowState {
  // Current state
  currentQuote: Quote | null
  currentOrder: Order | null
  quotes: Quote[]
  orders: Order[]
  
  // UI state
  isExtracting: boolean
  extractionProgress: number
  isConverting: boolean
  conversionProgress: number
  notifications: DemoNotification[]
  
  // Demo control
  demoSpeed: number // 1 = normal, 2 = 2x speed, etc.
  isPaused: boolean
  
  // Actions
  setCurrentQuote: (quote: Quote | null) => void
  setCurrentOrder: (order: Order | null) => void
  addNotification: (notification: Omit<DemoNotification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  setExtracting: (extracting: boolean, progress?: number) => void
  setConverting: (converting: boolean, progress?: number) => void
  loadQuotes: () => Promise<void>
  loadOrders: () => Promise<void>
  resetDemo: () => Promise<void>
  setDemoSpeed: (speed: number) => void
  togglePause: () => void
}

export const useDemoFlow = create<DemoFlowState>((set, get) => ({
  // Initial state
  currentQuote: null,
  currentOrder: null,
  quotes: [],
  orders: [],
  isExtracting: false,
  extractionProgress: 0,
  isConverting: false,
  conversionProgress: 0,
  notifications: [],
  demoSpeed: 1,
  isPaused: false,

  // Actions
  setCurrentQuote: (quote) => set({ currentQuote: quote }),
  setCurrentOrder: (order) => set({ currentOrder: order }),

  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random()}`
    const newNotification: DemoNotification = {
      ...notification,
      id,
      timestamp: new Date(),
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(id)
      }, notification.duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  setExtracting: (extracting, progress = 0) => {
    set({ isExtracting: extracting, extractionProgress: progress })
  },

  setConverting: (converting, progress = 0) => {
    set({ isConverting: converting, conversionProgress: progress })
  },

  loadQuotes: async () => {
    try {
      const quotes = await apiClient.getQuotes()
      set({ quotes })
    } catch (error) {
      console.error('Failed to load quotes:', error)
      get().addNotification({
        type: 'error',
        title: 'Failed to load quotes',
        description: 'Please try again',
        duration: 5000,
      })
    }
  },

  loadOrders: async () => {
    try {
      const orders = await apiClient.getOrders()
      set({ orders })
    } catch (error) {
      console.error('Failed to load orders:', error)
      get().addNotification({
        type: 'error',
        title: 'Failed to load orders',
        description: 'Please try again',
        duration: 5000,
      })
    }
  },

  resetDemo: async () => {
    try {
      await apiClient.resetDemo()
      set({
        currentQuote: null,
        currentOrder: null,
        quotes: [],
        orders: [],
        isExtracting: false,
        extractionProgress: 0,
        isConverting: false,
        conversionProgress: 0,
        notifications: [],
      })
      
      // Reload data
      await Promise.all([get().loadQuotes(), get().loadOrders()])
      
      get().addNotification({
        type: 'success',
        title: 'Demo reset',
        description: 'Ready for a fresh start',
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to reset demo:', error)
      get().addNotification({
        type: 'error',
        title: 'Failed to reset demo',
        duration: 5000,
      })
    }
  },

  setDemoSpeed: (speed) => set({ demoSpeed: speed }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}))

// Initialize event subscriptions
if (typeof window !== 'undefined') {
  apiClient.subscribe((event) => {
    const store = useDemoFlow.getState()
    
    switch (event.type) {
      case 'quote.created':
      case 'quote.updated':
      case 'quote.sent':
      case 'quote.accepted':
      case 'quote.rejected':
      case 'quote.converted':
        // Reload quotes to get latest
        store.loadQuotes()
        
        // Show notification
        const quoteAction = event.type.split('.')[1]
        store.addNotification({
          type: 'success',
          title: `Quote ${quoteAction}`,
          description: `Quote ${event.data.quote?.quote_number || ''} has been ${quoteAction}`,
          duration: 5000,
        })
        break
        
      case 'order.created':
        // Reload orders
        store.loadOrders()
        
        // Special notification for quote-originated orders
        if (event.data.source === 'quote') {
          store.addNotification({
            type: 'success',
            title: '🎉 Order Created from Quote!',
            description: `${event.data.po_number} created with 100% confidence`,
            duration: 8000,
          })
        }
        break
        
      case 'order.processing':
      case 'order.approved':
        store.loadOrders()
        break
    }
  })
}

// Helper functions for demo scenarios
export const startExtractionAnimation = (onComplete?: () => void) => {
  const store = useDemoFlow.getState()
  const speed = store.demoSpeed
  
  store.setExtracting(true, 0)
  
  const interval = setInterval(() => {
    const current = store.extractionProgress
    if (current >= 100) {
      clearInterval(interval)
      store.setExtracting(false, 100)
      if (onComplete) onComplete()
    } else {
      store.setExtracting(true, Math.min(100, current + 5 * speed))
    }
  }, 100 / speed)
}

export const startConversionAnimation = (onComplete?: () => void) => {
  const store = useDemoFlow.getState()
  const speed = store.demoSpeed
  
  store.setConverting(true, 0)
  
  const interval = setInterval(() => {
    const current = store.conversionProgress
    if (current >= 100) {
      clearInterval(interval)
      store.setConverting(false, 100)
      if (onComplete) onComplete()
    } else {
      store.setConverting(true, Math.min(100, current + 10 * speed))
    }
  }, 150 / speed)
}