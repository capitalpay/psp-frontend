import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import Button from '@/components/Button'
import apiClient from '@/services/api'
import toast from 'react-hot-toast'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        await apiClient.post('/auth/verify-email', { token })
        setStatus('success')
        setMessage('Your email has been verified successfully!')
        toast.success('Email verified! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (err: unknown) {
        setStatus('error')
        if (err && typeof err === 'object' && 'response' in err) {
          const error = err as { response?: { data?: { message?: string } } }
          setMessage(
            error.response?.data?.message || 'Verification failed. The link may be expired.'
          )
        } else {
          setMessage('Verification failed. Please try again.')
        }
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('No verification token provided')
    }
  }, [token, verifyEmail])

  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleResend = async () => {
    setIsResending(true)
    try {
      await apiClient.post('/auth/resend-verification')
      toast.success('Verification email sent! Check your inbox.')
      setCountdown(60)
      setCanResend(false)
    } catch {
      toast.error('Failed to resend email. Please try again later.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {status === 'verifying' && (
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mx-auto h-16 w-16 rounded-full border-4 border-primary-600 border-t-transparent"
              />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Verifying your email...</h2>
              <p className="mt-2 text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <FiCheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6">
                <Button onClick={() => navigate('/ login')} className="w-full">
                  Go to Login
                </Button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <FiXCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleResend}
                  disabled={!canResend}
                  isLoading={isResending}
                  className="w-full"
                  variant="primary"
                >
                  {canResend ? (
                    <>
                      <FiRefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  ) : (
                    `Resend in ${countdown}s`
                  )}
                </Button>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                  Back to Login
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
