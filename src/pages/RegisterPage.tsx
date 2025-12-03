import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    name: z.string().min(2, 'Name must be at least 2 characters'),
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
  const navigate = useNavigate()
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
      await apiClient.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      setIsSuccess(true)
      toast.success('Account created successfully! Check your email to verify.')
      setTimeout(() => {
        navigate('/verify-email')
      }, 2000)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } }
        toast.error(error.response?.data?.message || 'Registration failed')
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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <FiCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Account Created!</h2>
          <p className="mt-2 text-gray-600">Check your email to verify your account.</p>
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
              <span className="text-2xl font-bold">Capitak PayPSP</span>
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
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

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
      <div className="hidden bg-gradient-to-br from-primary-600 to-secondary-600 lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center px-12">
          <div className="max-w-md text-white">
            <h3 className="text-3xl font-bold">Start accepting payments today</h3>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <FiCheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
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
