import Layout from '@/components/Layout'
import Card from '@/components/Card'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name || 'User'}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Total Transactions"
            description="This month"
            className="border-l-primary-500 border-l-4"
          >
            <p className="text-3xl font-bold text-gray-900">1,234</p>
            <p className="mt-2 text-sm text-green-600">+12% from last month</p>
          </Card>

          <Card
            title="Revenue"
            description="This month"
            className="border-l-secondary-500 border-l-4"
          >
            <p className="text-3xl font-bold text-gray-900">$45,678</p>
            <p className="mt-2 text-sm text-green-600">+8% from last month</p>
          </Card>

          <Card
            title="Active Merchants"
            description="Total count"
            className="border-l-4 border-l-blue-500"
          >
            <p className="text-3xl font-bold text-gray-900">89</p>
            <p className="mt-2 text-sm text-green-600">+3 new this month</p>
          </Card>
        </div>

        <Card title="Recent Transactions" description="Last 5 transactions">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">#TX123</td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">$250.00</td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">Dec 3, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
