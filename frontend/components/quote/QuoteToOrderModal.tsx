'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Quote } from '@/lib/types'
import {
  CalendarIcon,
  Truck,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface QuoteToOrderModalProps {
  quote: Quote
  isOpen: boolean
  onClose: () => void
  onConvert: (orderData: ConversionData) => void
}

interface ConversionData {
  po_number: string
  expected_delivery: Date
  payment_terms: string
  shipping_method: string
  special_instructions?: string
}

export function QuoteToOrderModal({
  quote,
  isOpen,
  onClose,
  onConvert
}: QuoteToOrderModalProps) {
  const [poNumber, setPoNumber] = useState('')
  const [expectedDelivery, setExpectedDelivery] = useState<Date>()
  const [paymentTerms, setPaymentTerms] = useState('net30')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!poNumber.trim()) {
      newErrors.po_number = 'PO number is required'
    }
    
    if (!expectedDelivery) {
      newErrors.delivery = 'Expected delivery date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConvert = async () => {
    if (!validateForm()) return
    
    setIsConverting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onConvert({
      po_number: poNumber,
      expected_delivery: expectedDelivery!,
      payment_terms: paymentTerms,
      shipping_method: shippingMethod,
      special_instructions: specialInstructions
    })
    
    setIsConverting(false)
    onClose()
  }

  const handleClose = () => {
    if (!isConverting) {
      setPoNumber('')
      setExpectedDelivery(undefined)
      setPaymentTerms('net30')
      setShippingMethod('standard')
      setSpecialInstructions('')
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Convert Quote to Order</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <span>Quote: {quote.quote_number}</span>
            <span>•</span>
            <span>Customer: {quote.customer.name}</span>
            <span>•</span>
            <span className="font-semibold">Total: ${quote.total.toFixed(2)}</span>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* PO Number */}
          <div className="space-y-2">
            <Label htmlFor="po-number" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Customer PO Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="po-number"
              placeholder="Enter customer's purchase order number"
              value={poNumber}
              onChange={(e) => {
                setPoNumber(e.target.value)
                if (errors.po_number) {
                  setErrors(prev => ({ ...prev, po_number: '' }))
                }
              }}
              className={errors.po_number ? 'border-red-500' : ''}
            />
            {errors.po_number && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.po_number}
              </p>
            )}
          </div>

          {/* Expected Delivery Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              Expected Delivery Date <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expectedDelivery && "text-muted-foreground",
                    errors.delivery && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expectedDelivery ? format(expectedDelivery, "PPP") : "Select delivery date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expectedDelivery}
                  onSelect={(date) => {
                    setExpectedDelivery(date)
                    if (errors.delivery) {
                      setErrors(prev => ({ ...prev, delivery: '' }))
                    }
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.delivery && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.delivery}
              </p>
            )}
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Payment Terms
            </Label>
            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="net15">Net 15</SelectItem>
                <SelectItem value="net30">Net 30</SelectItem>
                <SelectItem value="net45">Net 45</SelectItem>
                <SelectItem value="net60">Net 60</SelectItem>
                <SelectItem value="net90">Net 90</SelectItem>
              </SelectContent>
            </Select>
            {quote.customer.payment_terms && 
             quote.customer.payment_terms !== paymentTerms && (
              <p className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Customer's standard terms: {quote.customer.payment_terms}
              </p>
            )}
          </div>

          {/* Shipping Method */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Shipping Method
            </Label>
            <Select value={shippingMethod} onValueChange={setShippingMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Customer Pickup</SelectItem>
                <SelectItem value="standard">Standard Delivery (3-5 days)</SelectItem>
                <SelectItem value="express">Express Delivery (1-2 days)</SelectItem>
                <SelectItem value="freight">Freight Carrier</SelectItem>
                <SelectItem value="white_glove">White Glove Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label>Special Instructions (Optional)</Label>
            <Textarea
              placeholder="Enter any special delivery instructions, job site requirements, etc."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Order will be created with:</p>
                <ul className="mt-1 space-y-0.5 text-blue-700">
                  <li>• {quote.line_items.length} line items totaling ${quote.total.toFixed(2)}</li>
                  <li>• Billing to: {quote.billing_address.street}, {quote.billing_address.city}</li>
                  <li>• Shipping to: {quote.shipping_address?.street || quote.billing_address.street}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isConverting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConvert}
            disabled={isConverting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Convert to Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}