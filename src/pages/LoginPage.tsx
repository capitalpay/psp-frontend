import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Card from '@/components/Card'
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
  const [sessionToken, setSessionToken] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/auth/login', data)
      const responseData = response.data

      if (responseData.requires2FA) {
        setRequires2FA(true)
        setSessionToken(responseData.sessionToken)
        toast('Enter your 2FA code')
      } else {
        login(responseData.user, responseData.access_token, responseData.refresh_token)
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } }
        const errorMessage = error.response?.data?.message || 'Login failed'
        setError(errorMessage)
        toast.error(errorMessage)
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
      const response = await apiClient.post('/auth/verify-2fa', {
        sessionToken,
        code,
        useBackupCode,
      })

      const { user, access_token, refresh_token } = response.data
      login(user, access_token, refresh_token)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } }
        const errorMessage = error.response?.data?.message || '2FA verification failed'
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

  if (requires2FA) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <div className="text-center">
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
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
            <span className="text-3xl font-bold text-gray-900">Capitak PayPSP</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        </Card>
      </div>
    </div>
  )
}
