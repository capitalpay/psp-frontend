import { type KYCStatus } from '@/types/merchant'
import { cn } from '@/utils/cn'

interface KYCStatusBadgeProps {
  status: KYCStatus
  className?: string
}

export default function KYCStatusBadge({ status, className }: KYCStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          label: 'Verified',
          className: 'bg-green-100 text-green-800 border-green-200',
        }
      case 'PENDING':
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        }
      case 'REJECTED':
        return {
          label: 'Rejected',
          className: 'bg-red-100 text-red-800 border-red-200',
        }
      case 'MANUAL_REVIEW':
        return {
          label: 'Under Review',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        }
      case 'NOT_STARTED':
      case 'CANCELLED':
        return {
          label: 'Not Started',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
