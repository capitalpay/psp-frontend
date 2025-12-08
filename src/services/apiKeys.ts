import apiClient from './api'

export interface ApiKey {
  id: string
  prefix: string
  label: string | null
  key?: string // Only present when created
  is_active: boolean
  environment: 'TEST' | 'LIVE'
  created_at: string
}

export interface CreateApiKeyData {
  label?: string
  environment: 'TEST' | 'LIVE'
}

export const apiKeysService = {
  getAll: async () => {
    const response = await apiClient.get<ApiKey[]>('/merchant/api-keys')
    return response.data
  },

  create: async (data: CreateApiKeyData) => {
    const response = await apiClient.post<ApiKey>('/merchant/api-keys', data)
    return response.data
  },

  revoke: async (id: string) => {
    await apiClient.delete(`/merchant/api-keys/${id}`)
  },
}
