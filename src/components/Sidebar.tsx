import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { FiHome, FiUser, FiKey, FiSettings, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Profile', href: '/profile', icon: FiUser },
    { name: 'API Keys', href: '/api-keys', icon: FiKey },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
            <span className="text-xl font-bold text-gray-900">Capital Pay PSP</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="rounded-lg bg-primary-50 p-3">
              <p className="text-xs font-medium text-primary-900">Need help?</p>
              <p className="mt-1 text-xs text-primary-700">
                Check our documentation or contact support.
              </p>
              <a
                href="#"
                className="mt-2 inline-block text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                View Docs →
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
