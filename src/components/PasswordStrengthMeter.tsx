import { useMemo } from 'react'
import { calculatePasswordStrength } from '@/utils/password'
import { cn } from '@/utils/cn'

interface PasswordStrengthMeterProps {
  password: string
  showFeedback?: boolean
}

export default function PasswordStrengthMeter({
  password,
  showFeedback = true,
}: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, feedback: [], strength: 'weak' as const }
    return calculatePasswordStrength(password)
  }, [password])

  if (!password) return null

  const getColor = () => {
    switch (strength.strength) {
      case 'very-strong':
        return 'bg-green-600'
      case 'strong':
        return 'bg-green-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-red-500'
    }
  }

  const getWidth = () => {
    return `${(strength.score / 4) * 100}%`
  }

  const getLabel = () => {
    switch (strength.strength) {
      case 'very-strong':
        return 'Very Strong'
      case 'strong':
        return 'Strong'
      case 'medium':
        return 'Medium'
      default:
        return 'Weak'
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Password Strength:</span>
        <span
          className={cn('text-sm font-medium', {
            'text-green-600': strength.strength === 'very-strong' || strength.strength === 'strong',
            'text-yellow-600': strength.strength === 'medium',
            'text-red-600': strength.strength === 'weak',
          })}
        >
          {getLabel()}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn('h-full transition-all duration-300', getColor())}
          style={{ width: getWidth() }}
        />
      </div>

      {showFeedback && strength.feedback.length > 0 && (
        <ul className="space-y-1">
          {strength.feedback.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
