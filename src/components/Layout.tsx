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
            <h1 className="text-primary-600 text-2xl font-bold">Capitak PayPSP</h1>
            <nav>
              <ul className="flex gap-6">
                <li>
                  <a
                    href="/dashboard"
                    className="hover:text-primary-600 text-gray-700 transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/transactions"
                    className="hover:text-primary-600 text-gray-700 transition-colors"
                  >
                    Transactions
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="hover:text-primary-600 text-gray-700 transition-colors"
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
            © 2025 Capitak PayPSP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
