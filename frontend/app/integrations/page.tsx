'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { 
  Search,
  Plus,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Activity,
  ExternalLink,
  ChevronRight,
  Package,
  Mail,
  Truck,
  CreditCard,
  Database,
  ShoppingCart,
  FileText,
  Users,
  BarChart3,
  Zap,
  Info,
  PlayCircle,
  XCircle,
  Keyboard
} from 'lucide-react'

// Mock data for integrations
const connectedIntegrations = [
  {
    id: 'gp-erp',
    name: 'Great Plains ERP',
    provider: 'Microsoft Dynamics',
    category: 'ERP',
    status: 'connected',
    icon: Database,
    logoUrl: '/logos/dynamics.png',
    lastSyncAt: '2 minutes ago',
    metrics: {
      label: 'Orders synced',
      value: '12,453',
      trend: '+142 today'
    },
    health: 'healthy'
  },
  {
    id: 'office365',
    name: 'Microsoft 365',
    provider: 'Microsoft',
    category: 'Email',
    status: 'needs_auth',
    icon: Mail,
    logoUrl: '/logos/office365.png',
    lastSyncAt: '3 days ago',
    metrics: {
      label: 'Emails processed',
      value: '8,921',
      trend: 'Paused'
    },
    health: 'warning'
  },
  {
    id: 'ups-freight',
    name: 'UPS Freight API',
    provider: 'UPS',
    category: 'Shipping',
    status: 'syncing',
    icon: Truck,
    logoUrl: '/logos/ups.png',
    lastSyncAt: 'Syncing now...',
    metrics: {
      label: 'Shipments tracked',
      value: '2,841',
      trend: '+23 today'
    },
    health: 'healthy'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    provider: 'Stripe Inc.',
    category: 'Payments',
    status: 'connected',
    icon: CreditCard,
    logoUrl: '/logos/stripe.png',
    lastSyncAt: '1 hour ago',
    metrics: {
      label: 'Processed',
      value: '$1.2M',
      trend: '+$45K today'
    },
    health: 'healthy'
  }
]

const availableIntegrations = [
  {
    id: 'manhattan-wms',
    name: 'Manhattan WMS',
    provider: 'Manhattan Associates',
    category: 'WMS',
    icon: Package,
    description: 'Warehouse management and fulfillment optimization',
    popular: true
  },
  {
    id: 'sap-s4hana',
    name: 'SAP S/4HANA',
    provider: 'SAP',
    category: 'ERP',
    icon: Database,
    description: 'Next-generation enterprise resource planning',
    popular: true
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    provider: 'Oracle',
    category: 'ERP',
    icon: Database,
    description: 'Cloud-based business management suite',
    popular: true
  },
  {
    id: 'epicor',
    name: 'Epicor',
    provider: 'Epicor Software',
    category: 'ERP',
    icon: Database,
    description: 'Industry-specific ERP for manufacturing and distribution',
    popular: false
  },
  {
    id: 'profit21',
    name: 'Prophet 21',
    provider: 'Epicor',
    category: 'ERP',
    icon: Database,
    description: 'Distribution ERP for wholesale and distribution',
    popular: false
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    provider: 'Salesforce',
    category: 'CRM',
    icon: Users,
    description: 'Sync customers, opportunities, and quotes',
    popular: true
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    provider: 'Intuit',
    category: 'Accounting',
    icon: FileText,
    description: 'Export invoices and sync payment status',
    popular: true
  },
  {
    id: 'dynamics365',
    name: 'Microsoft Dynamics 365',
    provider: 'Microsoft',
    category: 'ERP',
    icon: Database,
    description: 'Unified business applications and ERP',
    popular: true
  },
  {
    id: 'shopify',
    name: 'Shopify',
    provider: 'Shopify Inc.',
    category: 'E-commerce',
    icon: ShoppingCart,
    description: 'Import orders from your online store',
    popular: false
  },
  {
    id: 'fedex',
    name: 'FedEx',
    provider: 'FedEx',
    category: 'Shipping',
    icon: Package,
    description: 'Real-time shipping rates and tracking',
    popular: false
  },
  {
    id: 'gmail',
    name: 'Gmail',
    provider: 'Google',
    category: 'Email',
    icon: Mail,
    description: 'Process orders from Gmail inbox',
    popular: false
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    provider: 'HubSpot',
    category: 'CRM',
    icon: BarChart3,
    description: 'Marketing automation and CRM sync',
    popular: false
  },
  {
    id: 'epicor-eclipse',
    name: 'Epicor Eclipse',
    provider: 'Epicor',
    category: 'ERP',
    icon: Database,
    description: 'Distribution ERP for electrical, plumbing, and HVAC',
    popular: true
  },
  {
    id: 'infor-csd',
    name: 'Infor CSD',
    provider: 'Infor',
    category: 'ERP',
    icon: Database,
    description: 'Distribution software for contractors and distributors',
    popular: false
  },
  {
    id: 'infor-sxe',
    name: 'Infor SXE',
    provider: 'Infor',
    category: 'ERP',
    icon: Database,
    description: 'Enterprise distribution ERP platform',
    popular: true
  },
  {
    id: 'infor-facts',
    name: 'Infor FACTS',
    provider: 'Infor',
    category: 'ERP',
    icon: Database,
    description: 'Distribution ERP for wholesale distributors',
    popular: false
  },
  {
    id: 'acumatica',
    name: 'Acumatica',
    provider: 'Acumatica',
    category: 'ERP',
    icon: Database,
    description: 'Cloud-based ERP with flexible deployment',
    popular: true
  },
  {
    id: 'custom-erp',
    name: 'Custom ERP',
    provider: 'Various',
    category: 'Custom',
    icon: Settings,
    description: 'Connect your proprietary or custom-built ERP system',
    popular: false
  }
]

const activityLogs = [
  {
    id: 1,
    integration: 'Great Plains ERP',
    action: 'Order sync completed',
    status: 'success',
    details: '142 orders synchronized',
    timestamp: '10:32 AM'
  },
  {
    id: 2,
    integration: 'Microsoft 365',
    action: 'Authentication failed',
    status: 'error',
    details: 'OAuth token expired - reauthorization required',
    timestamp: '10:28 AM'
  },
  {
    id: 3,
    integration: 'UPS Freight API',
    action: 'Tracking update',
    status: 'success',
    details: '23 shipments updated with latest tracking',
    timestamp: '10:15 AM'
  },
  {
    id: 4,
    integration: 'Stripe',
    action: 'Payment webhook received',
    status: 'success',
    details: 'Payment confirmed for Order #RB-2024-2389',
    timestamp: '9:45 AM'
  },
  {
    id: 5,
    integration: 'Great Plains ERP',
    action: 'Inventory sync',
    status: 'warning',
    details: 'Partial sync - 12 SKUs failed validation',
    timestamp: '9:30 AM'
  }
]

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('connected')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const needsAttentionCount = connectedIntegrations.filter(i => i.health === 'warning').length
  
  // Filter integrations based on selected category
  const filteredIntegrations = selectedCategory === 'All' 
    ? availableIntegrations 
    : availableIntegrations.filter(i => i.category === selectedCategory)

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Compact Header Bar - Consistent with quote-b2b */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Integrations</h1>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Keyboard className="h-3 w-3" />
              <span>Ctrl+K Search</span>
              <span className="mx-1">|</span>
              <span>Ctrl+N New</span>
              <span className="mx-1">|</span>
              <span>F5 Refresh</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Connect Integration
            </Button>
          </div>
        </div>
      </div>

      {/* Alert Banner for Issues */}
      {needsAttentionCount > 0 && (
        <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{needsAttentionCount} integration{needsAttentionCount > 1 ? 's' : ''} need{needsAttentionCount === 1 ? 's' : ''} attention</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              View Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs and Search Bar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-9">
              <TabsTrigger value="connected" className="text-xs">
                Connected
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {connectedIntegrations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="available" className="text-xs">
                Available
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {availableIntegrations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">
                Activity
                <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search integrations..." 
                className="pl-9 h-8 w-64 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Connected Tab */}
        {activeTab === 'connected' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {connectedIntegrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">{integration.name}</h3>
                            {integration.status === 'connected' && (
                              <Badge className="h-5 px-1.5 text-xs bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                            {integration.status === 'needs_auth' && (
                              <Badge className="h-5 px-1.5 text-xs bg-yellow-100 text-yellow-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Needs Auth
                              </Badge>
                            )}
                            {integration.status === 'syncing' && (
                              <Badge className="h-5 px-1.5 text-xs bg-blue-100 text-blue-800">
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Syncing
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {integration.provider} · {integration.category}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-600">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {integration.lastSyncAt}
                            </span>
                            {integration.metrics && (
                              <span className="text-xs text-gray-600">
                                {integration.metrics.label}: <span className="font-medium">{integration.metrics.value}</span>
                                {integration.metrics.trend && (
                                  <span className="text-green-600 ml-1">({integration.metrics.trend})</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      {integration.status === 'needs_auth' ? (
                        <Button size="sm" className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reauthorize
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Activity className="h-3 w-3 mr-1" />
                        Logs
                      </Button>
                      {integration.status === 'connected' && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto">
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Available Tab */}
        {activeTab === 'available' && (
          <div>
            {/* Categories Filter */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-gray-600">Category:</span>
              {['All', 'ERP', 'WMS', 'CRM', 'Accounting', 'Email', 'Shipping', 'Payments', 'E-commerce', 'Custom'].map((category) => (
                <Badge 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"} 
                  className={`cursor-pointer ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="ml-1 text-xs opacity-70">
                      ({availableIntegrations.filter(i => i.category === category).length})
                    </span>
                  )}
                </Badge>
              ))}
            </div>

            {/* Available Integrations Grid */}
            {filteredIntegrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredIntegrations.map((integration) => {
                  const Icon = integration.icon
                  return (
                  <Card key={integration.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">{integration.name}</h3>
                            {integration.popular && (
                              <Badge className="h-4 px-1 text-xs" variant="secondary">
                                <Zap className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{integration.category}</p>
                          <p className="text-xs text-gray-600 mt-2">{integration.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No integrations found in this category</p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg border">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {log.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {log.status === 'error' && (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {log.status === 'warning' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{log.integration}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{log.action}</p>
                      <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                View All Activity
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar - Consistent with quote-b2b */}
      <div className="bg-gray-100 border-t px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>System Status: All Operational</span>
            <span>|</span>
            <span>Last refresh: 30 seconds ago</span>
            <span>|</span>
            <span>Auto-refresh: On</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Connected: {connectedIntegrations.length}</span>
            <span>|</span>
            <span>Available: {availableIntegrations.length}</span>
            <span>|</span>
            <span>Total API calls today: 48,291</span>
          </div>
        </div>
      </div>
    </div>
  )
}