import { useState, useEffect, useRef, type KeyboardEvent, type ClipboardEvent } from 'react'
import { cn } from '@/utils/cn'

interface TwoFactorInputProps {
  length?: number
  onComplete: (code: string) => void
  isLoading?: boolean
}

export default function TwoFactorInput({
  length = 6,
  onComplete,
  isLoading = false,
}: TwoFactorInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all filled
    if (newValues.every((v) => v !== '') && newValues.join('').length === length) {
      onComplete(newValues.join(''))
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()

    // Only process if it's all digits and matches length
    if (/^\d+$/.test(pastedData) && pastedData.length === length) {
      const newValues = pastedData.split('')
      setValues(newValues)
      inputRefs.current[length - 1]?.focus()
      onComplete(pastedData)
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={isLoading}
          className={cn(
            'h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50',
            values[index] ? 'border-primary-500' : 'border-gray-300',
            isLoading && 'cursor-not-allowed opacity-50'
          )}
        />
      ))}
    </div>
  )
}
