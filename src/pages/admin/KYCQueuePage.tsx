import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import type { KYCJob } from '../../types/admin'

const KYCQueuePage: React.FC = () => {
  const [jobs, setJobs] = useState<KYCJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Filter for PENDING or MANUAL_REVIEW by default
        const response = await api.get('/compliance/admin/kyc/?status=PENDING')
        // Handle paginated response (DRF returns {count, next, previous, results})
        const data = response.data.results || response.data
        setJobs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch KYC jobs', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/compliance/admin/kyc/${id}/approve/`)
      // Refresh list
      setJobs(jobs.filter((job) => job.id !== id))
      alert('Application Approved')
    } catch {
      alert('Failed to approve')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">KYC Review Queue</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(job.created_at).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{job.merchant_type}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                    {job.status}
                  </span>
                </td>
                <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Approve
                  </button>
                  <button className="text-red-600 hover:text-red-900">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="p-4 text-center text-gray-500">No pending applications</div>
        )}
      </div>
    </div>
  )
}

export default KYCQueuePage
