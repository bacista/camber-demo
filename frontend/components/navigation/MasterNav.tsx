'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  FileText,
  Package,
  Warehouse,
  Truck,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Building,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  CreditCard,
  Mail,
  Clock,
  AlertCircle
} from 'lucide-react'

interface NavModule {
  id: string
  label: string
  icon: React.ElementType
  href: string
  shortcut: string
  badge?: string
  badgeColor?: string
}

const modules: NavModule[] = [
  { 
    id: 'quotes', 
    label: 'Quotes', 
    icon: FileText, 
    href: '/quote-b2b',
    shortcut: '1',
    badge: '12',
    badgeColor: 'bg-blue-500'
  },
  { 
    id: 'orders', 
    label: 'Orders', 
    icon: Package, 
    href: '/orders-b2b',
    shortcut: '2',
    badge: '8',
    badgeColor: 'bg-emerald-500'
  },
  { 
    id: 'inventory', 
    label: 'Inventory', 
    icon: Warehouse, 
    href: '/inventory',
    shortcut: '3'
  },
  { 
    id: 'shipping', 
    label: 'Shipping', 
    icon: Truck, 
    href: '/shipping',
    shortcut: '4',
    badge: '3',
    badgeColor: 'bg-yellow-500'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    href: '/analytics',
    shortcut: '5'
  },
  { 
    id: 'customers', 
    label: 'Customers', 
    icon: Users, 
    href: '/customers',
    shortcut: '6'
  },
  { 
    id: 'integrations', 
    label: 'Integrations', 
    icon: Sparkles, 
    href: '/integrations',
    shortcut: '7'
  },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: CreditCard, 
    href: '/billing',
    shortcut: '8'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    href: '/settings',
    shortcut: '9'
  },
]

interface MasterNavProps {
  children: React.ReactNode
}

export function MasterNav({ children }: MasterNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Number for module switching
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const moduleIndex = parseInt(e.key) - 1
        if (modules[moduleIndex]) {
          window.location.href = modules[moduleIndex].href
        }
      }
      
      // Alt + M to toggle menu
      if (e.altKey && e.key === 'm') {
        e.preventDefault()
        setIsCollapsed(!isCollapsed)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCollapsed])

  const getActiveModule = () => {
    return modules.find(m => pathname.startsWith(m.href)) || modules[0]
  }

  const activeModule = getActiveModule()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-56"
      )}>
        {/* Logo/Brand Section */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-sm">Camber</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 py-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = pathname.startsWith(module.href)
            
            return (
              <Link
                key={module.id}
                href={module.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 mx-2 rounded transition-colors",
                  "hover:bg-gray-100",
                  isActive && "bg-blue-50 text-blue-600 font-medium",
                  !isActive && "text-gray-700"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {module.badge && !isCollapsed && (
                    <span className={cn(
                      "absolute -top-1 -right-1 h-3 w-3 rounded-full",
                      module.badgeColor || "bg-red-500"
                    )} />
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm">{module.label}</span>
                    <span className="text-xs text-gray-400">Alt+{module.shortcut}</span>
                    {module.badge && (
                      <span className={cn(
                        "px-1.5 py-0.5 text-xs rounded-full text-white",
                        module.badgeColor || "bg-red-500"
                      )}>
                        {module.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Status Section */}
        {!isCollapsed && (
          <div className="border-t p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Last sync: 2 min ago</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-600">All systems operational</span>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className={cn(
          "border-t p-3",
          isCollapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">Sarah Chen</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
            {!isCollapsed && (
              <button className="p-1 hover:bg-gray-100 rounded">
                <LogOut className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Building className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Camber</span>
          </div>
          <span className="text-sm text-gray-600">{activeModule.label}</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-14 bottom-0 w-64 bg-white z-50 flex flex-col">
            <nav className="flex-1 py-2">
              {modules.map((module) => {
                const Icon = module.icon
                const isActive = pathname.startsWith(module.href)
                
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      isActive && "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600",
                      !isActive && "text-gray-700"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{module.label}</span>
                    {module.badge && (
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full text-white",
                        module.badgeColor || "bg-red-500"
                      )}>
                        {module.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden",
        "md:ml-0", // Desktop doesn't need margin since sidebar is in flow
        isMobileOpen ? "md:ml-0" : "mt-14 md:mt-0" // Mobile needs top margin for fixed header
      )}>
        {children}
      </main>
    </div>
  )
}