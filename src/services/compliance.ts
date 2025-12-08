import apiClient from './api'

export type IdType = 'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE'
export type MerchantType = 'INDIVIDUAL' | 'BUSINESS'

export interface KYCInitiationResponse {
  message: string
  job_id: string
  smile_job_id: string
  merchant_type: MerchantType
  id_type: IdType
  id_country: string
  documents_uploaded: string[]
}

export interface KYCCancelResponse {
  message: string
  job_id: string
  previous_status: string
}

export interface KYCDocuments {
  selfie?: File
  id_front?: File
  id_back?: File
  id_type: IdType
  id_country: string
  merchant_type?: MerchantType
  business_registration?: File
  tax_certificate?: File
  proof_of_address?: File
}

export const complianceService = {
  initiateKYC: async (documents: KYCDocuments): Promise<KYCInitiationResponse> => {
    const formData = new FormData()

    // Add required files
    if (documents.selfie) {
      formData.append('selfie', documents.selfie)
    }

    if (documents.id_front) {
      formData.append('id_front', documents.id_front)
    }

    // Add required data
    formData.append('id_type', documents.id_type)
    formData.append('id_country', documents.id_country)

    // Add optional files
    if (documents.id_back) {
      formData.append('id_back', documents.id_back)
    }

    if (documents.merchant_type) {
      formData.append('merchant_type', documents.merchant_type)
    }

    if (documents.business_registration) {
      formData.append('business_registration', documents.business_registration)
    }

    if (documents.tax_certificate) {
      formData.append('tax_certificate', documents.tax_certificate)
    }

    if (documents.proof_of_address) {
      formData.append('proof_of_address', documents.proof_of_address)
    }

    const response = await apiClient.post('/compliance/kyc/initiate/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  cancelKYC: async (): Promise<KYCCancelResponse> => {
    const response = await apiClient.post('/compliance/kyc/cancel/')
    return response.data
  },
}
