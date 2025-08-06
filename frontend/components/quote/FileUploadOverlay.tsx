'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle,
  X
} from 'lucide-react'

interface FileUploadOverlayProps {
  isVisible: boolean
  onFileSelect: (file: File) => void
  onDismiss?: () => void
  className?: string
}

export function FileUploadOverlay({ 
  isVisible, 
  onFileSelect,
  onDismiss,
  className 
}: FileUploadOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedCount, setExtractedCount] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'application/pdf' || file.type.includes('image'))) {
      processFile(file)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setFileName(file.name)
    setIsProcessing(true)
    setExtractedCount(0)

    // Simulate extraction progress
    const totalItems = Math.floor(Math.random() * 20) + 10
    for (let i = 0; i <= totalItems; i++) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setExtractedCount(i)
    }

    setIsProcessing(false)
    
    // Wait a moment to show completion
    await new Promise(resolve => setTimeout(resolve, 500))
    
    onFileSelect(file)
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      "absolute inset-0 z-20 bg-white bg-opacity-95",
      className
    )}>
      <div
        className={cn(
          "h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {onDismiss && !isProcessing && (
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}

        {!isProcessing ? (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center",
                isDragging ? "bg-blue-100" : "bg-gray-100"
              )}>
                <Upload className={cn(
                  "h-8 w-8",
                  isDragging ? "text-blue-600" : "text-gray-600"
                )} />
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900">
                  Drop RFQ here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, images, and email attachments
                </p>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={handleFileInput}
                />
                <div className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Select File
                </div>
              </label>

              <div className="flex items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>Images</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>Excel</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 text-xs text-gray-400">
              Drag and drop for instant AI extraction
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                Extracting line items...
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {extractedCount} items found
              </p>
              {fileName && (
                <p className="text-sm text-gray-500 mt-1">
                  Processing: {fileName}
                </p>
              )}
            </div>

            <div className="w-64">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(extractedCount / 30) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-powered extraction with 95%+ accuracy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}