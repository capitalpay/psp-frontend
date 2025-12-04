import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiCopy, FiCheck, FiAlertTriangle, FiKey } from 'react-icons/fi'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Table, { type Column } from '@/components/Table'
import Input from '@/components/Input'
import { apiKeysService, type ApiKey } from '@/services/apiKeys'
import { useAuthStore } from '@/store/authStore'

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'test'>('all')

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createEnv, setCreateEnv] = useState<'live' | 'test'>('test')
  const [isCreating, setIsCreating] = useState(false)
  const [newKey, setNewKey] = useState<ApiKey | null>(null)
  const [isKeySaved, setIsKeySaved] = useState(false)

  // Revoke Modal State
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null)
  const [isRevoking, setIsRevoking] = useState(false)

  const user = useAuthStore((state) => state.user)
  const isKycVerified = user?.email_verified // Assuming email verified is enough for now, or check specific KYC field if exists

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      setIsLoading(true)
      const data = await apiKeysService.getAll()
      setKeys(data)
    } catch {
      toast.error('Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      setIsCreating(true)
      const key = await apiKeysService.create({
        name: createName,
        environment: createEnv,
      })
      setNewKey(key)
      toast.success('API Key created successfully')
      fetchKeys()
    } catch {
      toast.error('Failed to create API key')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
    setNewKey(null)
    setCreateName('')
    setCreateEnv('test')
    setIsKeySaved(false)
  }

  const handleRevoke = async () => {
    if (!keyToRevoke) return

    try {
      setIsRevoking(true)
      await apiKeysService.revoke(keyToRevoke.id)
      toast.success('API Key revoked successfully')
      fetchKeys()
      setKeyToRevoke(null)
    } catch {
      toast.error('Failed to revoke API key')
    } finally {
      setIsRevoking(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const filteredKeys = keys.filter((key) => {
    if (filter === 'all') return true
    return key.environment === filter
  })

  const columns: Column<ApiKey>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (key) => (
        <div className="flex items-center gap-2">
          <div
            className={`rounded-lg p-2 ${key.environment === 'live' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
          >
            <FiKey />
          </div>
          <div>
            <p className="font-medium text-gray-900">{key.name}</p>
            <p className="text-xs text-gray-500">{key.prefix}••••••••••••••••</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Environment',
      accessorKey: 'environment',
      cell: (key) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            key.environment === 'live' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}
        >
          {key.environment.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: (key) => new Date(key.created_at).toLocaleDateString(),
    },
    {
      header: 'Last Used',
      accessorKey: 'last_used_at',
      cell: (key) => (key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'),
    },
    {
      header: 'Actions',
      cell: (key) => (
        <button
          onClick={() => setKeyToRevoke(key)}
          className="text-gray-400 transition-colors hover:text-red-600"
          title="Revoke Key"
        >
          <FiTrash2 size={18} />
        </button>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your API keys for accessing the Capital Pay platform.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <FiPlus className="mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'test', 'live'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium capitalize ${
                filter === type
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } `}
            >
              {type} Keys
            </button>
          ))}
        </nav>
      </div>

      <Table
        data={filteredKeys}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No API keys found."
      />

      {/* Create Key Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !newKey && handleCloseCreateModal()}
        title={newKey ? 'API Key Created' : 'Create New API Key'}
        footer={
          newKey ? (
            <Button onClick={handleCloseCreateModal} disabled={!isKeySaved}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCloseCreateModal}>
                Cancel
              </Button>
              <Button onClick={handleCreate} isLoading={isCreating} disabled={!createName}>
                Create Key
              </Button>
            </>
          )
        }
      >
        {newKey ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Key generated successfully</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Please copy your API key now. For security reasons, it will never be shown
                      again.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-md bg-gray-50 p-4">
              <pre className="break-all font-mono text-sm text-gray-800">{newKey.key}</pre>
              <button
                onClick={() => copyToClipboard(newKey.key!)}
                className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <FiCopy />
              </button>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isKeySaved}
                onChange={(e) => setIsKeySaved(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                I have saved this key in a secure location
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Environment</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="env"
                    value="test"
                    checked={createEnv === 'test'}
                    onChange={() => setCreateEnv('test')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Test Mode</span>
                </label>
                <label
                  className={`flex items-center gap-2 ${!isKycVerified ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="env"
                    value="live"
                    checked={createEnv === 'live'}
                    onChange={() => isKycVerified && setCreateEnv('live')}
                    disabled={!isKycVerified}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Live Mode</span>
                  {!isKycVerified && (
                    <span className="ml-1 text-xs text-red-500">(KYC Required)</span>
                  )}
                </label>
              </div>
            </div>

            <Input
              label="Key Label"
              placeholder="e.g. Website Payment Gateway"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            />
          </div>
        )}
      </Modal>

      {/* Revoke Confirmation Modal */}
      <Modal
        isOpen={!!keyToRevoke}
        onClose={() => setKeyToRevoke(null)}
        title="Revoke API Key"
        footer={
          <>
            <Button variant="outline" onClick={() => setKeyToRevoke(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRevoke} isLoading={isRevoking}>
              Revoke Key
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Are you sure you want to revoke the key <strong>{keyToRevoke?.name}</strong>? This
              action cannot be undone and any applications using this key will stop working
              immediately.
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
