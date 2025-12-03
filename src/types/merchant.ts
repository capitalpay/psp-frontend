export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW'

export interface MerchantProfile {
  id: string
  userId: string
  businessName: string
  registrationNumber?: string
  taxId?: string
  kycStatus: KYCStatus
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country: string
  }
  createdAt: string
  updatedAt: string
}
