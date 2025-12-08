import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { type MerchantProfile, merchantService } from '@/services/merchant'
import { complianceService, type IdType, type MerchantType } from '@/services/compliance'
import { toast } from 'react-hot-toast'
import {
  FiFileText,
  FiMapPin,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import KYCWizard from '@/components/KYCWizard'

export default function ProfilePage() {
  const [profile, setProfile] = useState<MerchantProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // KYC state
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false)
  const [isSubmittingKYC, setIsSubmittingKYC] = useState(false)
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const data = await merchantService.getProfile()
      setProfile(data)
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitKYC = async (data: {
    business_info: {
      business_name: string
      registration_number: string
      tax_id: string
      address: {
        street: string
        city: string
        state: string
        postal_code: string
        country: string
      }
    }
    kyc_data: {
      selfie?: File
      id_front?: File
      id_back?: File
      id_type: IdType
      id_country: string
      merchant_type: MerchantType
      business_registration?: File
    }
  }) => {
    try {
      setIsSubmittingKYC(true)

      // 1. Update Profile with Business Info
      await merchantService.updateProfile(data.business_info)

      // 2. Initiate KYC
      await complianceService.initiateKYC(data.kyc_data)

      toast.success('Verification submitted successfully!')
      await fetchProfile()
      setIsKYCModalOpen(false)
    } catch (error) {
      console.error('Failed to submit KYC:', error)
      toast.error('Failed to submit verification')
    } finally {
      setIsSubmittingKYC(false)
    }
  }

  const handleCancelKYC = async () => {
    try {
      setIsCancelling(true)
      await complianceService.cancelKYC()
      toast.success('Verification cancelled. You can now start a new verification.')
      await fetchProfile()
      setIsCancelConfirmOpen(false)
    } catch (error) {
      console.error('Failed to cancel KYC:', error)
      toast.error('Failed to cancel verification')
    } finally {
      setIsCancelling(false)
    }
  }

  const getKYCStatusConfig = () => {
    switch (profile?.kyc_status) {
      case 'VERIFIED':
        return {
          icon: FiCheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Verified',
          message: 'Your identity has been verified. You have full access to live features.',
        }
      case 'PENDING':
        return {
          icon: FiClock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Pending Review',
          message: 'Your verification is being processed. This usually takes a few minutes.',
        }
      case 'MANUAL_REVIEW':
        return {
          icon: FiClock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Manual Review',
          message: 'Your verification requires manual review by our compliance team.',
        }
      case 'REJECTED':
        return {
          icon: FiAlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Verification Failed',
          message: 'Your verification was rejected. Please try again or contact support.',
        }
      case 'NOT_STARTED':
      case 'CANCELLED':
      default:
        return {
          icon: FiShield,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Not Verified',
          message: 'Complete identity verification to access live features.',
        }
    }
  }

  const kycStatus = getKYCStatusConfig()
  const StatusIcon = kycStatus.icon
  const showKYCButton =
    !['PENDING', 'MANUAL_REVIEW', 'VERIFIED'].includes(profile?.kyc_status || '') ||
    ['NOT_STARTED', 'CANCELLED'].includes(profile?.kyc_status || '')

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your business information and identity verification
          </p>
        </div>

        <Card className={'border-l-4 ' + kycStatus.borderColor + ' ' + kycStatus.bgColor}>
          <div className="flex items-start gap-4">
            <div className={kycStatus.color + ' mt-0.5'}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className={'text-sm font-semibold ' + kycStatus.color}>{kycStatus.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{kycStatus.message}</p>
              <div className="mt-3 flex gap-3">
                {showKYCButton && (
                  <Button onClick={() => setIsKYCModalOpen(true)} size="sm">
                    <FiShield className="mr-2" />
                    Start Verification
                  </Button>
                )}
                {['PENDING', 'MANUAL_REVIEW'].includes(profile?.kyc_status || '') && (
                  <Button variant="outline" size="sm" onClick={() => setIsCancelConfirmOpen(true)}>
                    Cancel and Restart
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Business Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile?.business_name || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Registration Number
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile?.registration_number || '—'}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Tax ID
              </label>
              <p className="mt-1 text-sm text-gray-900">{profile?.tax_id || '—'}</p>
            </div>

            <div className="border-t pt-4">
              <div className="mb-4 flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-gray-400" />
                <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Business Address
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Street
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.address?.street || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    City
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.address?.city || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    State/Province
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.address?.state || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Postal Code
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profile?.address?.postal_code || '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Country
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{profile?.address?.country || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* KYC Verification Modal */}
        <Modal
          isOpen={isKYCModalOpen}
          onClose={() => !isSubmittingKYC && setIsKYCModalOpen(false)}
          title="Complete Identity Verification"
          size="large"
        >
          <KYCWizard
            initialData={profile || undefined}
            onSubmit={handleSubmitKYC}
            onCancel={() => setIsKYCModalOpen(false)}
            isSubmitting={isSubmittingKYC}
          />
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={isCancelConfirmOpen}
          onClose={() => !isCancelling && setIsCancelConfirmOpen(false)}
          title="Cancel Verification?"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsCancelConfirmOpen(false)}
                disabled={isCancelling}
              >
                Keep Current Verification
              </Button>
              <Button variant="danger" onClick={handleCancelKYC} isLoading={isCancelling}>
                Cancel and Restart
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                <FiAlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Are you sure you want to cancel your current verification? This will mark your
                  current submission as cancelled and allow you to start a new verification process.
                </p>
                <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
