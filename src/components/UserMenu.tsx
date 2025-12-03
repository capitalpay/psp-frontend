import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = () => {
    if (!user?.email) return 'U'
    return user.email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">
          {getInitials()}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
        </div>
        <FiChevronDown
          className={cn('h-4 w-4 text-gray-500 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiUser size={16} />
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiSettings size={16} />
              Settings
            </Link>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
