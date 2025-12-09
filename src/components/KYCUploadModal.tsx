import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from './Modal'
import Button from './Button'
import { complianceService } from '../services/compliance'
import { toast } from 'react-hot-toast'
import { Upload } from 'lucide-react'

interface KYCUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface KYCFormData {
  selfie: FileList
  // id_front and id_back can be added later as per backend requirements
}

export default function KYCUploadModal({ isOpen, onClose, onSuccess }: KYCUploadModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<KYCFormData>()
  const [fileName, setFileName] = useState<string>('')

  const onSubmit = async (data: KYCFormData) => {
    try {
      await complianceService.initiateKYC({
        selfie: data.selfie[0],
      })
      toast.success('Verification initiated successfully')
      reset()
      setFileName('')
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to initiate verification')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Identity">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please upload a clear selfie to verify your identity. This will be matched against your
            ID documents.
          </p>

          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500">
            <input
              type="file"
              id="selfie"
              accept="image/*"
              className="hidden"
              {...register('selfie', {
                required: 'Selfie is required',
                onChange: (e) => setFileName(e.target.files?.[0]?.name || ''),
              })}
            />
            <label htmlFor="selfie" className="flex cursor-pointer flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {fileName || 'Click to upload selfie'}
              </span>
              <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
            </label>
          </div>
          {errors.selfie && <p className="text-sm text-red-500">{errors.selfie.message}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Submit for Verification
          </Button>
        </div>
      </form>
    </Modal>
  )
}
