import apiClient from './api'

export interface ApiKey {
  id: string
  prefix: string
  name: string
  key?: string // Only present when created
  is_active: boolean
  environment: 'live' | 'test'
  created_at: string
  last_used_at: string | null
}

export interface CreateApiKeyData {
  name: string
  environment: 'live' | 'test'
}

export const apiKeysService = {
  getAll: async () => {
    const response = await apiClient.get<ApiKey[]>('/api-keys')
    return response.data
  },

  create: async (data: CreateApiKeyData) => {
    const response = await apiClient.post<ApiKey>('/api-keys', data)
    return response.data
  },

  revoke: async (id: string) => {
    await apiClient.delete(`/api-keys/${id}`)
  },
}
