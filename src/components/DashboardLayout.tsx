import { type ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { Toaster } from 'react-hot-toast'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
