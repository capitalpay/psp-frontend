import apiClient from './api'

export interface MerchantProfile {
  id: string
  user_id: string
  business_name: string
  registration_number: string
  tax_id: string
  address: {
    street?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  kyc_status: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW' | 'CANCELLED'
  kyc_reference?: string
  created_at: string
  updated_at: string
}

export const merchantService = {
  getProfile: async (): Promise<MerchantProfile> => {
    const response = await apiClient.get('/merchant/profile/')
    return response.data
  },

  updateProfile: async (data: Partial<MerchantProfile>): Promise<MerchantProfile> => {
    const response = await apiClient.patch('/merchant/profile/', data)
    return response.data
  },
}
