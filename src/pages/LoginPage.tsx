import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi'
import Input from '@/components/Input'
import Button from '@/components/Button'
import TwoFactorInput from '@/components/TwoFactorInput'
import { useAuthStore } from '@/store/authStore'
import apiClient from '@/services/api'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [useBackupCode, setUseBackupCode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/auth/login', data)
      const responseData = response.data

      login(responseData.user, responseData.access, responseData.refresh)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as {
          response?: { data?: { mfa_code?: string; non_field_errors?: string; message?: string } }
        }
        const errorData = error.response?.data

        // Check if MFA code is required
        if (
          errorData?.mfa_code === 'MFA code required' ||
          errorData?.message === 'MFA code required'
        ) {
          setRequires2FA(true)
          toast('Enter your 2FA code')
        } else {
          const errorMessage = errorData?.non_field_errors || errorData?.message || 'Login failed'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      } else {
        setError('Login failed. Please try again.')
        toast.error('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAComplete = async (code: string) => {
    setIsLoading(true)
    setError('')

    try {
      // Resubmit login with MFA code
      const formData = watch()
      const response = await apiClient.post('/auth/login', {
        ...formData,
        mfa_code: code,
      })

      const responseData = response.data
      login(responseData.user, responseData.access, responseData.refresh)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as {
          response?: { data?: { message?: string; mfa_code?: string; non_field_errors?: string } }
        }
        const errorData = error.response?.data
        const errorMessage =
          errorData?.mfa_code ||
          errorData?.non_field_errors ||
          errorData?.message ||
          '2FA verification failed'
        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        setError('2FA verification failed. Please try again.')
        toast.error('2FA verification failed.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderBrandingPanel = () => (
    <div className="relative hidden w-0 flex-1 lg:block">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600">
        {/* Background Pattern/Watermark */}
        <div className="absolute -right-20 -top-20 opacity-10">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="white">
            <rect x="20" y="20" width="60" height="60" rx="15" />
          </svg>
        </div>
      </div>

      <div className="relative flex h-full items-center justify-center px-12">
        <div className="relative max-w-lg rounded-2xl bg-white/5 p-12 backdrop-blur-lg">
          {/* Logo Icon */}
          <div className="mb-8 h-12 w-12 rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <div className="h-full w-full rounded-lg bg-white" />
          </div>

          <h3 className="text-3xl font-bold leading-tight text-white">
            Welcome back to Capital Pay
          </h3>

          <div className="mt-12 space-y-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-4">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400/20">
                  <FiCheckCircle className="h-4 w-4 text-green-300" />
                </div>
                <span className="text-lg font-medium text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (requires2FA) {
    return (
      <div className="flex min-h-screen">
        {/* Left Side - 2FA Form */}
        <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <div className="mx-auto mb-6 h-12 w-12 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
              <p className="mt-2 text-gray-600">
                {useBackupCode
                  ? 'Enter one of your backup codes'
                  : 'Enter the 6-digit code from your authenticator app'}
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="mt-8">
              {useBackupCode ? (
                <Input
                  label="Backup Code"
                  placeholder="Enter backup code"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value
                      if (value) handle2FAComplete(value)
                    }
                  }}
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Authentication Code
                  </label>
                  <TwoFactorInput onComplete={handle2FAComplete} isLoading={isLoading} />
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setUseBackupCode(!useBackupCode)}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                {useBackupCode ? 'Use authenticator app' : 'Use backup code'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setRequires2FA(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to login
              </button>
            </div>
          </div>
        </div>
        {renderBrandingPanel()}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
              <span className="text-2xl font-bold">Capital Pay PSP</span>
            </Link>
            <h2 className="mt-8 text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
      {renderBrandingPanel()}
    </div>
  )
}

const benefits = [
  'Secure enterprise payments',
  'Real-time analytics dashboard',
  'Multi-currency support',
  '24/7 dedicated support',
]
