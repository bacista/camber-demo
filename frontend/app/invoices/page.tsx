'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { sampleInvoices } from '@/lib/mock-data'
import type { CustomerInvoice, InvoiceStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Send,
  FileText,
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Plus,
  Printer,
  Mail,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Building,
  Calendar,
  MoreVertical,
  ArrowUpDown,
  Receipt
} from 'lucide-react'

export default function InvoicesPage() {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('last30')
  const [customerType, setCustomerType] = useState('all')

  // Calculate summary statistics
  const totalOutstanding = sampleInvoices
    .filter(inv => ['sent', 'overdue', 'partial'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.balance_due, 0)
  
  const totalOverdue = sampleInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.balance_due, 0)
  
  const dueToday = sampleInvoices
    .filter(inv => {
      const today = new Date()
      const dueDate = new Date(inv.due_date)
      return dueDate.toDateString() === today.toDateString() && inv.status === 'sent'
    })
    .reduce((sum, inv) => sum + inv.balance_due, 0)

  // Calculate DSO (Days Sales Outstanding) - simplified
  const averageDSO = 42 // Would be calculated from actual payment history

  // Calculate aging buckets
  const agingBuckets = {
    current: 456780,
    days1_30: 234120,
    days31_60: 89450,
    days61_90: 45230,
    over90: 21655,
  }
  const totalAging = Object.values(agingBuckets).reduce((a, b) => a + b, 0)

  // Filter invoices
  const filteredInvoices = sampleInvoices.filter(invoice => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false
    if (searchQuery && !invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleSelectAll = () => {
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set())
    } else {
      setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.id)))
    }
  }

  const handleSelectInvoice = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoices)
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId)
    } else {
      newSelected.add(invoiceId)
    }
    setSelectedInvoices(newSelected)
  }

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'sent': return 'bg-blue-100 text-blue-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      case 'disputed': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'overdue': return <AlertCircle className="h-3 w-3" />
      case 'paid': return <CheckCircle className="h-3 w-3" />
      case 'partial': return <Clock className="h-3 w-3" />
      case 'sent': return <Send className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Invoices</h1>
            <p className="text-sm text-gray-600 mt-1">Manage customer invoices and track payments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Due Today</p>
                  <p className="text-2xl font-bold text-yellow-600">${dueToday.toLocaleString()}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">DSO</p>
                  <p className="text-2xl font-bold">{averageDSO} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 flex gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-64 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Filter */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Status</p>
                <div className="space-y-1">
                  {['all', 'draft', 'sent', 'overdue', 'partial', 'paid'].map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="status"
                        checked={statusFilter === status}
                        onChange={() => setStatusFilter(status as InvoiceStatus | 'all')}
                        className="text-blue-600"
                      />
                      <span className="capitalize">{status}</span>
                      <span className="text-gray-500 text-xs ml-auto">
                        ({sampleInvoices.filter(inv => status === 'all' || inv.status === status).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Date Range</p>
                <select 
                  className="w-full text-sm border rounded px-2 py-1"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last60">Last 60 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="h-3 w-3 mr-2" />
                  Send Reminders
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-3 w-3 mr-2" />
                  Generate Statements
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Receipt className="h-3 w-3 mr-2" />
                  Lien Waivers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Aging Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Aging Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Current', amount: agingBuckets.current, color: 'bg-green-500' },
                { label: '1-30 days', amount: agingBuckets.days1_30, color: 'bg-yellow-500' },
                { label: '31-60 days', amount: agingBuckets.days31_60, color: 'bg-orange-500' },
                { label: '61-90 days', amount: agingBuckets.days61_90, color: 'bg-red-500' },
                { label: 'Over 90', amount: agingBuckets.over90, color: 'bg-red-700' },
              ].map((bucket) => (
                <div key={bucket.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{bucket.label}</span>
                    <span className="font-medium">${bucket.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div 
                      className={cn("h-full rounded", bucket.color)}
                      style={{ width: `${(bucket.amount / totalAging) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 text-right">
                <Button variant="link" size="sm" className="text-xs">
                  View Full AR Report →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search invoices, customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                    prefix={<Search className="h-4 w-4 text-gray-400" />}
                  />
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">All</Badge>
                    <Badge variant="outline">Draft (3)</Badge>
                    <Badge variant="outline">Sent (45)</Badge>
                    <Badge variant="outline">Overdue (12)</Badge>
                    <Badge variant="outline">Paid</Badge>
                  </div>
                </div>
                {selectedInvoices.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedInvoices.size} selected
                    </span>
                    <Button variant="outline" size="sm">Bulk Actions</Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y">
                    <tr>
                      <th className="p-3 text-left">
                        <input 
                          type="checkbox"
                          checked={selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-700">
                        <div className="flex items-center gap-1">
                          Invoice # <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-700">Customer</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-700">Project</th>
                      <th className="p-3 text-right text-xs font-medium text-gray-700">Amount</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-700">Status</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.has(invoice.id)}
                            onChange={() => handleSelectInvoice(invoice.id)}
                          />
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-sm">{invoice.invoice_number}</p>
                            <p className="text-xs text-gray-500">{invoice.po_number}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-sm font-medium">{invoice.customer.name}</p>
                            <p className="text-xs text-gray-500">{invoice.payment_terms}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-sm">{invoice.project_name}</p>
                            {invoice.progress_billing && (
                              <p className="text-xs text-gray-500">
                                {invoice.progress_billing.percent_complete}% complete
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div>
                            <p className="font-medium">${invoice.total_amount.toLocaleString()}</p>
                            {invoice.status === 'partial' && (
                              <p className="text-xs text-gray-500">
                                Paid: ${invoice.amount_paid.toLocaleString()}
                              </p>
                            )}
                            {invoice.retention_withheld > 0 && (
                              <p className="text-xs text-orange-600">
                                Retention: ${invoice.retention_withheld.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge className={cn("text-xs", getStatusColor(invoice.status))}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(invoice.status)}
                                {invoice.status.toUpperCase()}
                              </span>
                            </Badge>
                            {invoice.status === 'sent' && (
                              <p className="text-xs text-gray-500">
                                Due: {new Date(invoice.due_date).toLocaleDateString()}
                              </p>
                            )}
                            {invoice.status === 'overdue' && invoice.days_overdue && (
                              <p className="text-xs text-red-600">
                                {invoice.days_overdue} days late
                              </p>
                            )}
                            {invoice.lien_waiver_status && invoice.lien_waiver_status !== 'not_required' && (
                              <Badge variant="outline" className="text-xs">
                                Lien {invoice.lien_waiver_status.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}