import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { type MerchantProfile, merchantService } from '../services/merchant'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { toast } from 'react-hot-toast'

interface ProfileFormProps {
  profile: MerchantProfile | null
  onUpdate: () => void
}

export default function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MerchantProfile>()

  useEffect(() => {
    if (profile) {
      reset(profile)
    }
  }, [profile, reset])

  const onSubmit = async (data: MerchantProfile) => {
    try {
      await merchantService.updateProfile(data)
      toast.success('Profile updated successfully')
      onUpdate()
    } catch {
      toast.error('Failed to update profile')
    }
  }

  return (
    <Card title="Business Details" className="h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Business Name"
          {...register('business_name', { required: 'Business name is required' })}
          error={errors.business_name?.message}
        />

        <Input label="Registration Number" {...register('registration_number')} />

        <Input
          label="Tax ID"
          {...register('tax_id')}
          placeholder="***-**-****"
          helperText="Will be masked for security"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Street Address" {...register('address.street')} />
          <Input label="City" {...register('address.city')} />
          <Input label="State/Province" {...register('address.state')} />
          <Input label="Postal Code" {...register('address.postal_code')} />
          <Input
            label="Country (ISO Code)"
            {...register('address.country', {
              minLength: { value: 2, message: 'Must be 2 characters' },
              maxLength: { value: 2, message: 'Must be 2 characters' },
            })}
            placeholder="US, KE, etc."
            error={errors.address?.country?.message}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  )
}
