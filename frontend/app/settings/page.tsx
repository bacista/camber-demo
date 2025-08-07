'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Building,
  Users,
  Link2,
  Bell,
  Shield,
  ChevronRight,
  ChevronDown,
  Save,
  X,
  Search,
  Plus,
  Mail,
  Check,
  AlertCircle,
  ArrowRight,
  Settings,
  LogOut,
  Key,
  Clock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react'

type SettingsSection = 'company' | 'users' | 'connected-systems' | 'notifications' | 'security'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('company')
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  
  // Company settings state
  const [companyData, setCompanyData] = useState({
    name: 'ACME Construction Supply',
    taxId: '87-1234567',
    phone: '(512) 555-0100',
    website: 'www.acmeconstruction.com',
    billingEmail: 'billing@acme.com',
    billingAddress: '123 Main St, Austin, TX 78701'
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    quoteCreated: true,
    quoteViewed: true,
    quoteAccepted: true,
    quoteExpiring: true,
    quoteRejected: false,
    orderConfirmed: true,
    orderShipped: false,
    deliveryScheduled: true,
    integrationErrors: true,
    lowConfidenceOrders: true,
    dailySummary: true
  })

  // Security state
  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: 8,
    requireMixedCase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    sessionTimeout: 30,
    rememberDevice: 7
  })

  const sidebarItems = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'connected-systems', label: 'Connected Systems', icon: Link2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const handleSave = () => {
    // In real app, would save to backend
    setUnsavedChanges(false)
  }

  const renderCompanySection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Company Profile</h2>
        <p className="text-gray-600">Manage your company information and billing details</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input 
              value={companyData.name}
              onChange={(e) => {
                setCompanyData({...companyData, name: e.target.value})
                setUnsavedChanges(true)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax ID</label>
            <Input 
              value={companyData.taxId}
              onChange={(e) => {
                setCompanyData({...companyData, taxId: e.target.value})
                setUnsavedChanges(true)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input 
              value={companyData.phone}
              onChange={(e) => {
                setCompanyData({...companyData, phone: e.target.value})
                setUnsavedChanges(true)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input 
              value={companyData.website}
              onChange={(e) => {
                setCompanyData({...companyData, website: e.target.value})
                setUnsavedChanges(true)
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Billing & Contact</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Billing Email</label>
            <Input 
              type="email"
              value={companyData.billingEmail}
              onChange={(e) => {
                setCompanyData({...companyData, billingEmail: e.target.value})
                setUnsavedChanges(true)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Billing Address</label>
            <Input 
              value={companyData.billingAddress}
              onChange={(e) => {
                setCompanyData({...companyData, billingAddress: e.target.value})
                setUnsavedChanges(true)
              }}
            />
          </div>
        </div>
      </Card>

      {unsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  )

  const renderUsersSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Team Members</h2>
        <p className="text-gray-600">Manage users and their permissions</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search users..." className="pl-10 w-64" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Active Users</h3>
            <Badge variant="outline">4 of 10 seats used</Badge>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'John Smith', email: 'john@acme.com', role: 'Admin', lastActive: 'Now' },
              { name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Sales', lastActive: '2 min ago' },
              { name: 'Mike Johnson', email: 'mike@acme.com', role: 'Sales', lastActive: '1 hour ago' },
              { name: 'Lisa Wong', email: 'lisa@acme.com', role: 'Operations', lastActive: 'Today' }
            ].map((user) => (
              <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{user.role}</Badge>
                  <span className="text-sm text-gray-500">Active {user.lastActive}</span>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Default Permissions for New Users</h3>
        <div className="space-y-2">
          {[
            { value: 'admin', label: 'Admin', description: 'Full system access' },
            { value: 'sales', label: 'Sales', description: 'Quotes, orders, customers' },
            { value: 'operations', label: 'Operations', description: 'Orders, inventory, shipping' },
            { value: 'view', label: 'View Only', description: 'Read-only access' }
          ].map((role) => (
            <label key={role.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="defaultRole" 
                value={role.value}
                defaultChecked={role.value === 'sales'}
                className="mt-1"
              />
              <div>
                <div className="font-medium">{role.label}</div>
                <div className="text-sm text-gray-500">{role.description}</div>
              </div>
            </label>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderConnectedSystemsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Connected Systems</h2>
        <p className="text-gray-600">Manage your integrations and external connections</p>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Active Connections (2)</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Great Plains ERP</h4>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Connected Jan 15, 2024 by John Smith</p>
                  <p className="text-sm text-gray-600">Sync: Every 15 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage in Integrations
                </Button>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Microsoft 365</h4>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Account: purchasing@acme.com</p>
                  <p className="text-sm text-gray-600">Processing: Quote emails</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage in Integrations
                </Button>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Available Systems</h3>
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { icon: '💼', name: 'QuickBooks' },
              { icon: '📧', name: 'Gmail' },
              { icon: '📦', name: 'Shipping' },
              { icon: '🏦', name: 'Banking API' },
              { icon: '📊', name: 'Salesforce' },
              { icon: '🚚', name: 'TMS' }
            ].map((system) => (
              <div key={system.name} className="flex items-center gap-3 p-3 border rounded-lg">
                <span className="text-2xl">{system.icon}</span>
                <span className="font-medium">{system.name}</span>
              </div>
            ))}
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Connection
          </Button>
        </Card>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Notification Settings</h2>
        <p className="text-gray-600">Configure how and when you receive notifications</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Quote Notifications</h3>
        <div className="space-y-3">
          {[
            { key: 'quoteCreated', label: 'Quote created', recipients: 'Sales team, Customer' },
            { key: 'quoteViewed', label: 'Quote viewed by customer', recipients: 'Sales rep' },
            { key: 'quoteAccepted', label: 'Quote accepted', recipients: 'Sales rep, Operations' },
            { key: 'quoteExpiring', label: 'Quote expiring (3 days)', recipients: 'Sales rep, Customer' },
            { key: 'quoteRejected', label: 'Quote rejected', recipients: 'Sales rep' }
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifications[notif.key as keyof typeof notifications]}
                  onChange={(e) => {
                    setNotifications({...notifications, [notif.key]: e.target.checked})
                    setUnsavedChanges(true)
                  }}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium">{notif.label}</div>
                  <div className="text-sm text-gray-500">→ {notif.recipients}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Order & Delivery</h3>
        <div className="space-y-3">
          {[
            { key: 'orderConfirmed', label: 'Order confirmed', recipients: 'Customer, Operations' },
            { key: 'orderShipped', label: 'Order shipped', recipients: 'Customer' },
            { key: 'deliveryScheduled', label: 'Delivery scheduled', recipients: 'Customer, Driver' }
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifications[notif.key as keyof typeof notifications]}
                  onChange={(e) => {
                    setNotifications({...notifications, [notif.key]: e.target.checked})
                    setUnsavedChanges(true)
                  }}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium">{notif.label}</div>
                  <div className="text-sm text-gray-500">→ {notif.recipients}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">System Alerts</h3>
        <div className="space-y-3">
          {[
            { key: 'integrationErrors', label: 'Integration errors', recipients: 'Admin' },
            { key: 'lowConfidenceOrders', label: 'Low confidence orders', recipients: 'Operations manager' },
            { key: 'dailySummary', label: 'Daily summary (9:00 AM)', recipients: 'Management team' }
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifications[notif.key as keyof typeof notifications]}
                  onChange={(e) => {
                    setNotifications({...notifications, [notif.key]: e.target.checked})
                    setUnsavedChanges(true)
                  }}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium">{notif.label}</div>
                  <div className="text-sm text-gray-500">→ {notif.recipients}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Security Settings</h2>
        <p className="text-gray-600">Manage passwords, sessions, and API access</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Password Policy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum length: {securitySettings.minPasswordLength} characters
            </label>
            <input
              type="range"
              min="6"
              max="20"
              value={securitySettings.minPasswordLength}
              onChange={(e) => {
                setSecuritySettings({...securitySettings, minPasswordLength: parseInt(e.target.value)})
                setUnsavedChanges(true)
              }}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={securitySettings.requireMixedCase}
                onChange={(e) => {
                  setSecuritySettings({...securitySettings, requireMixedCase: e.target.checked})
                  setUnsavedChanges(true)
                }}
              />
              <span className="text-sm">Require uppercase and lowercase</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={securitySettings.requireNumbers}
                onChange={(e) => {
                  setSecuritySettings({...securitySettings, requireNumbers: e.target.checked})
                  setUnsavedChanges(true)
                }}
              />
              <span className="text-sm">Require numbers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={securitySettings.requireSpecialChars}
                onChange={(e) => {
                  setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})
                  setUnsavedChanges(true)
                }}
              />
              <span className="text-sm">Require special characters</span>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Session Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Auto logout after inactivity</label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={securitySettings.sessionTimeout}
                onChange={(e) => {
                  setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})
                  setUnsavedChanges(true)
                }}
                className="w-24"
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Remember device for</label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={securitySettings.rememberDevice}
                onChange={(e) => {
                  setSecuritySettings({...securitySettings, rememberDevice: parseInt(e.target.value)})
                  setUnsavedChanges(true)
                }}
                className="w-24"
              />
              <span className="text-sm text-gray-600">days</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Active Sessions</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Chrome - Windows</div>
                <div className="text-sm text-gray-500">Current session</div>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Mobile - iOS</div>
                <div className="text-sm text-gray-500">Last active 2 hours ago</div>
              </div>
              <Button variant="outline" size="sm">
                End Session
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">API Access</h3>
        <p className="text-sm text-gray-600 mb-4">
          API keys allow external systems to access Camber programmatically.
        </p>
        <Button>
          <Key className="h-4 w-4 mr-2" />
          Generate API Key
        </Button>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'company': return renderCompanySection()
      case 'users': return renderUsersSection()
      case 'connected-systems': return renderConnectedSystemsSection()
      case 'notifications': return renderNotificationsSection()
      case 'security': return renderSecuritySection()
      default: return renderCompanySection()
    }
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </h1>
        </div>
        <nav className="p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeSection === item.id 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          {renderContent()}

          {/* Save Button */}
          {unsavedChanges && (
            <div className="fixed bottom-8 right-8 flex items-center gap-3">
              <Button variant="outline" onClick={() => setUnsavedChanges(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}