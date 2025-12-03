import { type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">Capital Pay PSP</span>
            <nav>
              <ul className="flex gap-6">
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-700 transition-colors hover:text-primary-600"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/transactions"
                    className="text-gray-700 transition-colors hover:text-primary-600"
                  >
                    Transactions
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="text-gray-700 transition-colors hover:text-primary-600"
                  >
                    Profile
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © 2025 Capital Pay PSP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
