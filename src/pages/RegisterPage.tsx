import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'
import Input from '@/components/Input'
import Button from '@/components/Button'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import apiClient from '@/services/api'
import toast from 'react-hot-toast'

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      await apiClient.post('/auth/register/', {
        email: data.email,
        password: data.password,
        password_confirm: data.confirmPassword,
      })

      setIsSuccess(true)
      toast.success('Account created successfully! Check your email to verify.')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as {
          response?: {
            data?: {
              message?: string
              non_field_errors?: string[]
              email?: string[]
              password?: string[]
              password_confirm?: string[]
            }
          }
        }
        const errorData = error.response?.data

        // Extract error message with priority: specific field errors, then non_field_errors, then generic message
        let errorMessage = 'Registration failed'

        if (errorData?.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors[0]
        } else if (errorData?.email && errorData.email.length > 0) {
          errorMessage = errorData.email[0]
        } else if (errorData?.password && errorData.password.length > 0) {
          errorMessage = errorData.password[0]
        } else if (errorData?.password_confirm && errorData.password_confirm.length > 0) {
          errorMessage = errorData.password_confirm[0]
        } else if (errorData?.message) {
          errorMessage = errorData.message
        }

        toast.error(errorMessage)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
        >
          <div className="text-center">
            {/* Email Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <svg
                className="h-10 w-10 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
            <p className="mt-3 text-gray-600">
              We've sent a verification link to your email address. Please click the link to
              activate your account.
            </p>

            {/* Email Badge */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Didn't receive the email?</p>
              <p className="mt-1 text-sm text-gray-700">
                Check your spam folder or contact support if you need help.
              </p>
            </div>

            {/* Action Button */}
            <Link
              to="/login"
              className="mt-6 inline-block w-full rounded-lg bg-primary-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-primary-700"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
              <span className="text-2xl font-bold">Capital Pay PSP</span>
            </Link>
            <h2 className="mt-8 text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <PasswordStrengthMeter password={watchedPassword} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>

            <p className="text-center text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600">
          {/* Background Pattern/Watermark */}
          <div className="absolute -right-20 -top-20 opacity-10">
            <svg width="400" height="400" viewBox="0 0 100 100" fill="white">
              <rect x="20" y="20" width="60" height="60" rx="15" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 opacity-10">
            <svg width="300" height="300" viewBox="0 0 100 100" fill="white">
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
              Join the future of payments with Capital Pay PSP
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
    </div>
  )
}

const benefits = [
  'Get started in minutes with our simple API',
  'Accept payments across Africa',
  'Enterprise-grade security and compliance',
  'Real-time analytics and reporting',
  'Dedicated support team',
]
