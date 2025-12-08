import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import type { AdminMerchant } from '../../types/admin'

const MerchantsPage: React.FC = () => {
  const [merchants, setMerchants] = useState<AdminMerchant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await api.get('/merchant/admin/merchants/')
        // Handle paginated response (DRF returns {count, next, previous, results})
        const data = response.data.results || response.data
        setMerchants(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch merchants', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMerchants()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Merchant Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Business Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                KYC Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tax ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {merchants.map((merchant) => (
              <tr key={merchant.id}>
                <td className="whitespace-nowrap px-6 py-4">{merchant.business_name || 'N/A'}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      merchant.kyc_status === 'VERIFIED'
                        ? 'bg-green-100 text-green-800'
                        : merchant.kyc_status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {merchant.kyc_status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {merchant.tax_id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MerchantsPage
