import UserMenu from '@/components/UserMenu'
import { FiBell } from 'react-icons/fi'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="lg:hidden">{/* Mobile menu button is in Sidebar component */}</div>

        <div className="hidden lg:block">{/* Breadcrumb or page title can go here */}</div>

        <div className="ml-auto flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100">
            <FiBell size={20} className="text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
