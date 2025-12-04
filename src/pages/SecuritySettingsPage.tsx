import { useState, useEffect } from 'react'
import {
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiDownload,
  FiCopy,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import TwoFactorInput from '@/components/TwoFactorInput'
import type { MFAStatus, MFASetupResponse } from '@/services/auth'
import { authService } from '@/services/auth'

export default function SecuritySettingsPage() {
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Wizard State
  const [wizardStep, setWizardStep] = useState<0 | 1 | 2 | 3>(0) // 0=Idle, 1=QR, 2=Verify, 3=Backup
  const [setupData, setSetupData] = useState<MFASetupResponse | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [resetKey, setResetKey] = useState(0) // Key to force reset of TwoFactorInput

  // Modals State
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false)
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const status = await authService.getMFAStatus()
      setMfaStatus(status)
    } catch {
      toast.error('Failed to load security settings')
    } finally {
      setIsLoading(false)
    }
  }

  const startSetup = async () => {
    try {
      setIsLoading(true)
      const data = await authService.setupMFA()
      setSetupData(data)
      setWizardStep(1)
    } catch {
      toast.error('Failed to start MFA setup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySetup = async () => {
    if (verifyCode.length !== 6) return

    try {
      setIsVerifying(true)
      await authService.enableMFA(verifyCode)
      setWizardStep(3) // Go to backup codes
      fetchStatus() // Update status in background
    } catch {
      toast.error('Invalid verification code')
    } finally {
      setIsVerifying(false)
    }
  }

  const finishSetup = () => {
    setWizardStep(0)
    setSetupData(null)
    setVerifyCode('')
    setResetKey((prev) => prev + 1)
    toast.success('Two-factor authentication enabled!')
  }

  const handleDisableMFA = async () => {
    try {
      setIsProcessing(true)
      await authService.disableMFA(mfaCode, password)
      toast.success('Two-factor authentication disabled')
      setIsDisableModalOpen(false)
      setPassword('')
      setMfaCode('')
      setResetKey((prev) => prev + 1)
      fetchStatus()
    } catch {
      toast.error('Failed to disable MFA. Check your credentials.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRegenerateCodes = async () => {
    try {
      setIsProcessing(true)
      const response = await authService.regenerateBackupCodes(mfaCode, password)
      setNewBackupCodes(response.backup_codes)
      toast.success('Backup codes regenerated')
      setPassword('')
      setMfaCode('')
      setResetKey((prev) => prev + 1)
      fetchStatus()
    } catch {
      toast.error('Failed to regenerate codes. Check your credentials.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadBackupCodes = (codes: string[]) => {
    const element = document.createElement('a')
    const file = new Blob([codes.join('\n')], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'capital-pay-backup-codes.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const copyBackupCodes = (codes: string[]) => {
    navigator.clipboard.writeText(codes.join('\n'))
    toast.success('Backup codes copied to clipboard')
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and two-factor authentication.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication (2FA)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add an extra layer of security to your account by requiring a verification code in
            addition to your password.
          </p>
        </div>

        <div className="p-6">
          {isLoading && !wizardStep ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-1/4 rounded bg-gray-100" />
              <div className="h-10 w-full rounded bg-gray-100" />
            </div>
          ) : wizardStep > 0 ? (
            // Wizard
            <div className="mx-auto max-w-xl">
              {/* Stepper */}
              <div className="mb-8 flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        wizardStep >= step
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                    <span className="mt-2 text-xs text-gray-500">
                      {step === 1 ? 'Scan QR' : step === 2 ? 'Verify' : 'Backup'}
                    </span>
                  </div>
                ))}
                <div className="absolute left-0 right-0 top-4 -z-10 h-0.5 bg-gray-200" />
              </div>

              {wizardStep === 1 && setupData && (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Open your authenticator app (like Google Authenticator) and scan this QR code.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <img
                      src={setupData.qr_code}
                      alt="2FA QR Code"
                      className="h-64 w-64 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">Can't scan the code?</p>
                    <p className="mt-1 font-mono text-sm font-medium text-gray-900">
                      {setupData.secret}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button onClick={() => setWizardStep(2)}>Next Step</Button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">Verify Code</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the 6-digit code from your authenticator app to verify setup.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <TwoFactorInput key={`verify-${resetKey}`} onComplete={setVerifyCode} />
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifySetup}
                      isLoading={isVerifying}
                      disabled={verifyCode.length !== 6}
                    >
                      Verify & Enable
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && setupData && (
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <FiCheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">2FA Enabled Successfully!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Please save these backup codes in a secure place. You can use them to access
                    your account if you lose your phone.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800">
                    {setupData.backup_codes.map((code, index) => (
                      <div key={index} className="text-center">
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => downloadBackupCodes(setupData.backup_codes)}
                    >
                      <FiDownload className="mr-2" /> Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyBackupCodes(setupData.backup_codes)}
                    >
                      <FiCopy className="mr-2" /> Copy All
                    </Button>
                  </div>

                  <div className="mt-8">
                    <Button onClick={finishSetup} className="w-full">
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Status View
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${mfaStatus?.mfa_enabled ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  {mfaStatus?.mfa_enabled ? (
                    <FiShield className="h-6 w-6 text-green-600" />
                  ) : (
                    <FiLock className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {mfaStatus?.mfa_enabled
                      ? 'Two-factor authentication is enabled'
                      : 'Two-factor authentication is disabled'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mfaStatus?.mfa_enabled
                      ? 'Your account is secured with 2FA.'
                      : 'Protect your account with an extra layer of security.'}
                  </p>
                  {mfaStatus?.mfa_enabled && (
                    <p className="mt-1 text-xs text-gray-500">
                      {mfaStatus.backup_codes_remaining} backup codes remaining
                    </p>
                  )}
                </div>
              </div>

              <div>
                {mfaStatus?.mfa_enabled ? (
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsRegenerateModalOpen(true)}>
                      Regenerate Codes
                    </Button>
                    <Button variant="danger" onClick={() => setIsDisableModalOpen(true)}>
                      Disable 2FA
                    </Button>
                  </div>
                ) : (
                  <Button onClick={startSetup}>Enable 2FA</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disable 2FA Modal */}
      <Modal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
        title="Disable Two-Factor Authentication"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDisableModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDisableMFA}
              isLoading={isProcessing}
              disabled={!password || !mfaCode}
            >
              Disable 2FA
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Disabling 2FA will make your account less secure. Are you sure you want to
                    proceed?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Please enter your password and a current 2FA code (or backup code) to confirm.
          </p>

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">2FA Code</label>
            <TwoFactorInput key={`disable-${resetKey}`} onComplete={setMfaCode} />
          </div>
        </div>
      </Modal>

      {/* Regenerate Codes Modal */}
      <Modal
        isOpen={isRegenerateModalOpen}
        onClose={() => {
          setIsRegenerateModalOpen(false)
          setNewBackupCodes(null)
        }}
        title="Regenerate Backup Codes"
        footer={
          newBackupCodes ? (
            <Button
              onClick={() => {
                setIsRegenerateModalOpen(false)
                setNewBackupCodes(null)
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsRegenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRegenerateCodes}
                isLoading={isProcessing}
                disabled={!password || !mfaCode}
              >
                Regenerate
              </Button>
            </>
          )
        }
      >
        {newBackupCodes ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Codes Regenerated</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your old backup codes are now invalid. Please save these new ones.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800">
              {newBackupCodes.map((code, index) => (
                <div key={index} className="text-center">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => downloadBackupCodes(newBackupCodes)}>
                <FiDownload className="mr-2" /> Download
              </Button>
              <Button variant="outline" onClick={() => copyBackupCodes(newBackupCodes)}>
                <FiCopy className="mr-2" /> Copy All
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Regenerating backup codes will invalidate all existing codes. You will need to enter
              your password and a current 2FA code to proceed.
            </p>

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">2FA Code</label>
              <TwoFactorInput key={`regenerate-${resetKey}`} onComplete={setMfaCode} />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
