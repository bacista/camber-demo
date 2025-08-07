'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  FileText,
  Package,
  Warehouse,
  BarChart3,
  Users,
  Settings,
  Building,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Clock,
  TrendingUp,
  LayoutDashboard
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
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/',
    shortcut: '1'
  },
  { 
    id: 'quotes', 
    label: 'Quotes', 
    icon: FileText, 
    href: '/quote-b2b',
    shortcut: '2',
    badge: '12',
    badgeColor: 'bg-blue-500'
  },
  { 
    id: 'orders', 
    label: 'Orders', 
    icon: Package, 
    href: '/orders-b2b',
    shortcut: '3',
    badge: '8',
    badgeColor: 'bg-emerald-500'
  },
  { 
    id: 'customers', 
    label: 'Customers', 
    icon: Users, 
    href: '/customers',
    shortcut: '4'
  },
  { 
    id: 'products', 
    label: 'Products', 
    icon: Warehouse, 
    href: '/products',
    shortcut: '5'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: TrendingUp, 
    href: '/analytics',
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
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    href: '/settings',
    shortcut: '8'
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
      if (e.altKey && e.key >= '1' && e.key <= '8') {
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
    if (pathname === '/') return modules[0]
    return modules.find(m => m.href !== '/' && pathname.startsWith(m.href)) || modules[0]
  }

  const activeModule = getActiveModule()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 flex-shrink-0",
        isCollapsed ? "w-16" : "w-[200px]"
      )}>
        {/* Logo/Brand Section */}
        <div className="h-14 border-b border-slate-800 flex items-center px-3">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-400" />
                <span className="font-semibold text-sm text-white">Camber</span>
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white mx-auto"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 py-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = module.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(module.href)
            
            return (
              <Link
                key={module.id}
                href={module.href}
                className={cn(
                  "relative flex items-center gap-3 py-2 transition-colors",
                  isCollapsed ? "px-3 justify-center" : "px-3",
                  "hover:bg-slate-800",
                  isActive && "bg-slate-800 border-l-4 border-blue-500",
                  !isActive && "text-slate-400 hover:text-white border-l-4 border-transparent",
                  isActive && "text-white"
                )}
              >
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5" />
                  {module.badge && isCollapsed && (
                    <span className={cn(
                      "absolute -top-1 -right-1 h-2 w-2 rounded-full",
                      module.badgeColor || "bg-red-500"
                    )} />
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm">{module.label}</span>
                    <span className="text-xs text-slate-500">Alt+{module.shortcut}</span>
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
          <div className="border-t border-slate-800 p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Last sync: 2 min ago</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-500">All systems operational</span>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className={cn(
          "border-t border-slate-800 p-3",
          isCollapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Sarah Chen</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
                <button className="p-1 hover:bg-slate-800 rounded">
                  <LogOut className="h-4 w-4 text-slate-500 hover:text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Building className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white">Camber</span>
          </div>
          <span className="text-sm text-slate-400">{activeModule.label}</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-14 bottom-0 w-64 bg-slate-900 z-50 flex flex-col">
            <nav className="flex-1 py-2">
              {modules.map((module) => {
                const Icon = module.icon
                const isActive = module.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(module.href)
                
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      isActive && "bg-slate-800 text-white font-medium border-l-4 border-blue-500",
                      !isActive && "text-slate-400"
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