export interface PasswordStrength {
  score: number // 0-4 (0: very weak, 4: very strong)
  feedback: string[]
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // Check length
  if (password.length >= 8) {
    score++
  } else {
    feedback.push('Password should be at least 8 characters')
  }

  if (password.length >= 12) {
    score++
  }

  // Check for lowercase
  if (/[a-z]/.test(password)) {
    score++
  } else {
    feedback.push('Add lowercase letters')
  }

  // Check for uppercase
  if (/[A-Z]/.test(password)) {
    score++
  } else {
    feedback.push('Add uppercase letters')
  }

  // Check for numbers
  if (/\d/.test(password)) {
    score++
  } else {
    feedback.push('Add numbers')
  }

  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++
  } else {
    feedback.push('Add special characters (!@#$%^&*)')
  }

  // Determine strength level
  let strength: PasswordStrength['strength'] = 'weak'
  if (score >= 6) {
    strength = 'very-strong'
  } else if (score >= 4) {
    strength = 'strong'
  } else if (score >= 3) {
    strength = 'medium'
  }

  // Normalize score to 0-4 range
  const normalizedScore = Math.min(Math.floor(score / 1.5), 4)

  return {
    score: normalizedScore,
    feedback,
    strength,
  }
}
