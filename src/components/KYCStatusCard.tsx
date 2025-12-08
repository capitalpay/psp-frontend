import { type MerchantProfile } from '../services/merchant'
import Card from './Card'
import Button from './Button'
import KYCStatusBadge from './KYCStatusBadge'
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react'

interface KYCStatusCardProps {
  profile: MerchantProfile | null
  onVerifyClick: () => void
}

export default function KYCStatusCard({ profile, onVerifyClick }: KYCStatusCardProps) {
  if (!profile) return null

  const getStatusIcon = () => {
    switch (profile.kyc_status) {
      case 'VERIFIED':
        return <ShieldCheck className="h-12 w-12 text-green-500" />
      case 'REJECTED':
        return <AlertTriangle className="h-12 w-12 text-red-500" />
      case 'PENDING':
      case 'MANUAL_REVIEW':
        return <Clock className="h-12 w-12 text-yellow-500" />
      default:
        return <AlertTriangle className="h-12 w-12 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (profile.kyc_status) {
      case 'VERIFIED':
        return 'Your identity has been verified. You have full access to live features.'
      case 'PENDING':
        return 'Your verification is currently being processed. This usually takes a few minutes.'
      case 'MANUAL_REVIEW':
        return 'Your verification requires manual review by our compliance team.'
      case 'REJECTED':
        return 'Your verification was rejected. Please try again or contact support.'
      default:
        return 'Please verify your identity to activate your account for live transactions.'
    }
  }

  return (
    <Card title="Identity Verification" className="h-full">
      <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
        {getStatusIcon()}

        <div className="space-y-2">
          <KYCStatusBadge status={profile.kyc_status} className="px-4 py-1.5 text-lg" />
          <p className="max-w-sm text-gray-600">{getStatusMessage()}</p>
        </div>

        {['PENDING', 'MANUAL_REVIEW', 'VERIFIED'].includes(profile.kyc_status) ? null : (
          <Button onClick={onVerifyClick} className="mt-4">
            Verify Identity
          </Button>
        )}
      </div>
    </Card>
  )
}
