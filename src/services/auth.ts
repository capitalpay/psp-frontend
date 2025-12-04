import apiClient from './api'

export interface MFAStatus {
  mfa_enabled: boolean
  backup_codes_remaining: number | null
}

export interface MFASetupResponse {
  secret: string
  qr_code: string
  provisioning_uri: string
  backup_codes: string[]
}

export const authService = {
  // MFA Endpoints
  getMFAStatus: async () => {
    const response = await apiClient.get<MFAStatus>('/auth/mfa/status')
    return response.data
  },

  setupMFA: async () => {
    const response = await apiClient.post<MFASetupResponse>('/auth/mfa/setup')
    return response.data
  },

  enableMFA: async (code: string) => {
    const response = await apiClient.post('/auth/mfa/enable', { code })
    return response.data
  },

  disableMFA: async (code: string, password: string) => {
    const response = await apiClient.post('/auth/mfa/disable', { code, password })
    return response.data
  },

  regenerateBackupCodes: async (code: string, password: string) => {
    const response = await apiClient.post<{ backup_codes: string[] }>(
      '/auth/mfa/regenerate-backup-codes',
      { code, password }
    )
    return response.data
  },
}
