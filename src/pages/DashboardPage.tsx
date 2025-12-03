import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'
import KYCStatusBadge from '@/components/KYCStatusBadge'
import { useAuthStore } from '@/store/authStore'
import { FiKey, FiFileText, FiUpload, FiDollarSign } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  // Mock data - in real implementation, fetch from API
  const kycStatus = 'PENDING'
  const apiKeyCount = { test: 2, live: 0 }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.email || 'User'}!
              </h1>
              <p className="mt-1 text-gray-600">Here's what's happening with your account today.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Account Status:</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Active
              </span>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
                <p className="mt-2 text-sm text-gray-500">This month</p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <FiDollarSign className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">$0</p>
                <p className="mt-2 text-sm text-gray-500">This month</p>
              </div>
              <div className="rounded-full bg-secondary-100 p-3">
                <FiDollarSign className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Keys</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {apiKeyCount.test + apiKeyCount.live}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {apiKeyCount.test} test, {apiKeyCount.live} live
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <FiKey className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KYC Status</p>
                <div className="mt-2">
                  <KYCStatusBadge
                    status={kycStatus as 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW'}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Verification pending</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <FiFileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* KYC Alert */}
        {kycStatus === 'PENDING' && (
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="flex items-start">
              <FiUpload className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Complete KYC Verification</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  To generate LIVE API keys and start accepting real payments, please complete your
                  KYC verification.
                </p>
                <div className="mt-3">
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
                  >
                    <FiUpload size={16} />
                    Start Verification
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/api-keys"
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="rounded-lg bg-primary-100 p-3">
                <FiKey className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate API Key</p>
                <p className="text-sm text-gray-600">Create test or live keys</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="rounded-lg bg-secondary-100 p-3">
                <FiFileText className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-600">Business information</p>
              </div>
            </Link>

            <a
              href="#"
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="rounded-lg bg-blue-100 p-3">
                <FiFileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">API Documentation</p>
                <p className="text-sm text-gray-600">View integration guides</p>
              </div>
            </a>

            <Link
              to="/settings"
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="rounded-lg bg-green-100 p-3">
                <FiKey className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security Settings</p>
                <p className="text-sm text-gray-600">Enable 2FA</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
