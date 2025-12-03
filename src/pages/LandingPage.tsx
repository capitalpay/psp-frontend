import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import { FiCheckCircle, FiCreditCard, FiShield, FiZap, FiGlobe, FiTrendingUp } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
              <span className="text-xl font-bold">Capitak PayPSP</span>
            </div>
            <nav className="hidden gap-6 md:flex">
              <a href="#features" className="text-gray-700 hover:text-primary-600">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600">
                Pricing
              </a>
            </nav>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Accept Payments{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Anywhere in Africa
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              Enterprise-grade payment infrastructure built for African merchants. Get started in
              minutes, scale to millions.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Start Free Trial
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 14-day free trial
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to accept payments
            </h2>
            <p className="mt-4 text-lg text-gray-600">Built for developers, loved by businesses</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <feature.icon size={24} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Get started in 4 simple steps</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-gray-200 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pay as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border-2 p-8 ${
                  tier.featured ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-white'
                }`}
              >
                {tier.featured && (
                  <span className="inline-block rounded-full bg-primary-600 px-3 py-1 text-sm font-medium text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="mt-4 text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-gray-600">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-5xl font-bold text-gray-900">{tier.price}%</span>
                </p>
                <p className="mt-2 text-gray-600">per successful transaction</p>
                <ul className="mt- space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <FiCheckCircle className="mt-0.5 h-5 w-5 text-primary-600" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block">
                  <Button variant={tier.featured ? 'primary' : 'outline'} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to start accepting payments?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of merchants already using Capitak PayPSP
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600" />
                <span className="text-lg font-bold">Capitak PayPSP</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Enterprise payment infrastructure for African merchants.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Product</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-sm text-gray-600 hover:text-primary-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-gray-600 hover:text-primary-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">© 2025 Capitak PayPSP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: FiZap,
    title: 'Fast Integration',
    description:
      'Get started in minutes with our simple API. Full documentation and SDKs available.',
  },
  {
    icon: FiShield,
    title: 'Secure & Compliant',
    description: 'Bank-level security with PCI DSS compliance. Your data is always protected.',
  },
  {
    icon: FiCreditCard,
    title: 'Multiple Payment Methods',
    description: 'Accept cards, mobile money, bank transfers, and more across Africa.',
  },
  {
    icon: FiGlobe,
    title: 'Pan-African Coverage',
    description: 'Process payments in multiple African countries with local payment methods.',
  },
  {
    icon: FiTrendingUp,
    title: 'Real-time Analytics',
    description: 'Track your transactions, revenue, and customer insights in real-time.',
  },
  {
    icon: FiCheckCircle,
    title: '99.9% Uptime',
    description: 'Enterprise-grade infrastructure ensures your payments never stop.',
  },
]

const steps = [
  {
    title: 'Create Account',
    description: 'Sign up in seconds and verify your email.',
  },
  {
    title: 'Complete KYC',
    description: 'Submit your business documents for verification.',
  },
  {
    title: 'Get API Keys',
    description: 'Generate your API keys and start integrating.',
  },
  {
    title: 'Start Accepting',
    description: 'Go live and start processing payments.',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses and side projects',
    price: '2.9',
    featured: false,
    features: [
      'Up to 1,000 transactions/month',
      'Basic payment methods',
      'Email support',
      'Test environment',
      'Basic analytics',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing businesses with higher volume',
    price: '2.5',
    featured: true,
    features: [
      'Unlimited transactions',
      'All payment methods',
      'Priority support',
      'Advanced analytics',
      'Custom webhooks',
      'Multi-currency support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    featured: false,
    features: [
      'Volume-based pricing',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantees',
      'Advanced security features',
    ],
  },
]
