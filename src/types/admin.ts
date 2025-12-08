export interface KYCJob {
  id: string
  merchant_type: string
  status: string
  created_at: string
}

export interface AdminMerchant {
  id: string
  business_name?: string
  kyc_status: string
  tax_id?: string
}

export interface AdminUser {
  id: string
  email: string
  is_active: boolean
  created_at: string
}
