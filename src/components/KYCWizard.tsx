import { useState } from 'react'
import { FiUpload, FiX, FiChevronRight, FiChevronLeft, FiCheckCircle } from 'react-icons/fi'
import Button from './Button'
import Input from './Input'
import type { IdType, MerchantType } from '@/services/compliance'

interface KYCWizardProps {
  initialData?: {
    business_name?: string
    registration_number?: string
    tax_id?: string
    address?: {
      street?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
  onSubmit: (data: {
    business_info: {
      business_name: string
      registration_number: string
      tax_id: string
      address: {
        street: string
        city: string
        state: string
        postal_code: string
        country: string
      }
    }
    kyc_data: {
      selfie?: File
      id_front?: File
      id_back?: File
      id_type: IdType
      id_country: string
      merchant_type: MerchantType
      business_registration?: File
    }
  }) => void
  onCancel: () => void
  isSubmitting: boolean
}

type WizardStep = 'business-info' | 'type' | 'id-upload' | 'selfie' | 'review'

export default function KYCWizard({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: KYCWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('business-info')

  // Business Info State
  const [businessName, setBusinessName] = useState(initialData?.business_name || '')
  const [registrationNumber, setRegistrationNumber] = useState(
    initialData?.registration_number || ''
  )
  const [taxId, setTaxId] = useState(initialData?.tax_id || '')
  const [street, setStreet] = useState(initialData?.address?.street || '')
  const [city, setCity] = useState(initialData?.address?.city || '')
  const [state, setState] = useState(initialData?.address?.state || '')
  const [postalCode, setPostalCode] = useState(initialData?.address?.postal_code || '')
  const [country, setCountry] = useState(initialData?.address?.country || '')

  // KYC State
  const [merchantType, setMerchantType] = useState<MerchantType>('INDIVIDUAL')
  const [idType, setIdType] = useState<IdType>('NATIONAL_ID')
  const [idCountry, setIdCountry] = useState('KE')
  const [idFront, setIdFront] = useState<File | null>(null)
  const [idBack, setIdBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [businessRegistration, setBusinessRegistration] = useState<File | null>(null)
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null)
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [businessRegistrationPreview, setBusinessRegistrationPreview] = useState<string | null>(
    null
  )

  const handleFileChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFile(null)
      setPreview(null)
    }
  }

  const handleNext = () => {
    if (currentStep === 'business-info') setCurrentStep('type')
    else if (currentStep === 'type') setCurrentStep('id-upload')
    else if (currentStep === 'id-upload') {
      if (merchantType === 'BUSINESS') {
        setCurrentStep('review')
      } else {
        setCurrentStep('selfie')
      }
    } else if (currentStep === 'selfie') setCurrentStep('review')
  }

  const handleBack = () => {
    if (currentStep === 'review') {
      if (merchantType === 'BUSINESS') {
        setCurrentStep('id-upload')
      } else {
        setCurrentStep('selfie')
      }
    } else if (currentStep === 'selfie') setCurrentStep('id-upload')
    else if (currentStep === 'id-upload') setCurrentStep('type')
    else if (currentStep === 'type') setCurrentStep('business-info')
  }

  const handleSubmit = () => {
    if (merchantType === 'BUSINESS' ? businessRegistration : selfie && idFront) {
      onSubmit({
        business_info: {
          business_name: businessName,
          registration_number: registrationNumber,
          tax_id: taxId,
          address: {
            street,
            city,
            state,
            postal_code: postalCode,
            country: country.toUpperCase(),
          },
        },
        kyc_data: {
          selfie: selfie || undefined,
          id_front: idFront || undefined,
          id_back: idBack || undefined,
          id_type: idType,
          id_country: idCountry,
          merchant_type: merchantType,
          business_registration: businessRegistration || undefined,
        },
      })
    }
  }

  const canProceedFromBusinessInfo = businessName.trim() !== '' && country.trim().length === 2
  const canProceedFromType = merchantType !== null
  const canProceedFromIdUpload =
    merchantType === 'BUSINESS'
      ? businessRegistration !== null
      : idFront !== null && idCountry.length === 2
  const canProceedFromSelfie = selfie !== null
  const canSubmit =
    (merchantType === 'BUSINESS' ? businessRegistration : selfie && idFront && idCountry) &&
    canProceedFromBusinessInfo

  const requiresIdBack = idType === 'NATIONAL_ID' || idType === 'DRIVERS_LICENSE'

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {(merchantType === 'BUSINESS'
          ? ['Business Info', 'Type', 'Docs', 'Review']
          : ['Business Info', 'Type', 'ID Upload', 'Selfie', 'Review']
        ).map((label, index) => {
          const steps: WizardStep[] =
            merchantType === 'BUSINESS'
              ? ['business-info', 'type', 'id-upload', 'review']
              : ['business-info', 'type', 'id-upload', 'selfie', 'review']
          const stepIndex = steps.indexOf(currentStep)
          const isActive = stepIndex === index
          const isComplete = stepIndex > index

          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={
                    isComplete
                      ? 'flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white'
                      : isActive
                        ? 'flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white'
                        : 'flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600'
                  }
                >
                  {isComplete ? <FiCheckCircle /> : index + 1}
                </div>
                <span
                  className={
                    'mt-2 text-xs font-medium ' + (isActive ? 'text-blue-600' : 'text-gray-500')
                  }
                >
                  {label}
                </span>
              </div>
              {index < (merchantType === 'BUSINESS' ? 3 : 4) && (
                <div className={'h-0.5 flex-1 ' + (isComplete ? 'bg-green-500' : 'bg-gray-200')} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-96">
        {/* Step 1: Business Info */}
        {currentStep === 'business-info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              <p className="mt-1 text-sm text-gray-500">Please provide your business details</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Business Name"
                  placeholder="Your Company Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
                <Input
                  label="Registration Number"
                  placeholder="BR-12345678"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>

              <Input
                label="Tax ID"
                placeholder="***-**-****"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                helperText="Your tax identification number"
              />

              <div className="border-t pt-4">
                <h4 className="mb-4 text-sm font-medium text-gray-900">Business Address</h4>
                <div className="space-y-4">
                  <Input
                    label="Street Address"
                    placeholder="123 Main Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="City"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      label="State/Province"
                      placeholder="NY"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Postal Code"
                      placeholder="10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <Input
                      label="Country Code"
                      placeholder="US"
                      value={country}
                      onChange={(e) => setCountry(e.target.value.toUpperCase())}
                      helperText="2-letter ISO code (e.g., US, KE, GB)"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Merchant Type */}
        {currentStep === 'type' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Select Merchant Type</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose the type that best describes your business
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                onClick={() => setMerchantType('INDIVIDUAL')}
                className={
                  merchantType === 'INDIVIDUAL'
                    ? 'rounded-lg border-2 border-blue-600 bg-blue-50 p-6 text-left transition-all'
                    : 'rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-gray-300'
                }
              >
                <h4 className="font-semibold text-gray-900">Individual / Sole Proprietor</h4>
                <p className="mt-2 text-sm text-gray-600">
                  For individuals or sole proprietorships operating under their own name
                </p>
              </button>

              <button
                onClick={() => setMerchantType('BUSINESS')}
                className={
                  merchantType === 'BUSINESS'
                    ? 'rounded-lg border-2 border-blue-600 bg-blue-50 p-6 text-left transition-all'
                    : 'rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-gray-300'
                }
              >
                <h4 className="font-semibold text-gray-900">Registered Business</h4>
                <p className="mt-2 text-sm text-gray-600">
                  For registered companies, partnerships, or corporations
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: ID/Doc Upload */}
        {currentStep === 'id-upload' && (
          <div className="space-y-6">
            {merchantType === 'BUSINESS' ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Business Registration
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a clear copy of your business registration certificate
                  </p>
                </div>

                <FileUploadBox
                  label="Business Registration Certificate"
                  preview={businessRegistrationPreview}
                  onFileChange={(file) =>
                    handleFileChange(file, setBusinessRegistration, setBusinessRegistrationPreview)
                  }
                  required
                />
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload ID Document</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a clear photo of your government-issued ID
                  </p>
                </div>

                {/* ID Type Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">ID Type</label>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {[
                      { value: 'NATIONAL_ID', label: 'National ID' },
                      { value: 'PASSPORT', label: 'Passport' },
                      { value: 'DRIVERS_LICENSE', label: "Driver's License" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setIdType(option.value as IdType)}
                        className={
                          idType === option.value
                            ? 'rounded-lg border-2 border-blue-600 bg-blue-50 p-3 text-sm font-medium transition-all'
                            : 'rounded-lg border-2 border-gray-200 p-3 text-sm font-medium transition-all hover:border-gray-300'
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Country of Issue
                  </label>
                  <input
                    type="text"
                    value={idCountry}
                    onChange={(e) => setIdCountry(e.target.value.toUpperCase())}
                    maxLength={2}
                    placeholder="KE"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 uppercase focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    2-letter ISO country code (e.g., KE, US, GB)
                  </p>
                </div>

                {/* ID Front Upload */}
                <FileUploadBox
                  label="ID Front"
                  preview={idFrontPreview}
                  onFileChange={(file) => handleFileChange(file, setIdFront, setIdFrontPreview)}
                  required
                />

                {/* ID Back Upload - Only show for ID cards and Driver's License */}
                {requiresIdBack && (
                  <FileUploadBox
                    label="ID Back"
                    preview={idBackPreview}
                    onFileChange={(file) => handleFileChange(file, setIdBack, setIdBackPreview)}
                    required={false}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4: Selfie */}
        {currentStep === 'selfie' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Take a Selfie</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a clear selfie to verify your identity
              </p>
            </div>

            <FileUploadBox
              label="Selfie"
              preview={selfiePreview}
              onFileChange={(file) => handleFileChange(file, setSelfie, setSelfiePreview)}
              required
            />

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="text-sm font-medium text-blue-900">Tips for a good selfie:</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800">
                <li>Ensure your face is clearly visible</li>
                <li>Use good lighting</li>
                <li>Remove sunglasses or hats</li>
                <li>Face the camera directly</li>
                <li>Match the photo on your ID</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please verify all information is correct before submitting
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="border-b pb-2 text-sm font-medium text-gray-900">
                  Business Details
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Business Name
                    </label>
                    <p className="text-sm text-gray-900">{businessName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Registration
                    </label>
                    <p className="text-sm text-gray-900">{registrationNumber || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Tax ID
                    </label>
                    <p className="text-sm text-gray-900">{taxId || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Address
                    </label>
                    <p className="text-sm text-gray-900">
                      {[street, city, state, postalCode, country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="border-b pb-2 text-sm font-medium text-gray-900">
                  Verification Details
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Merchant Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {merchantType === 'INDIVIDUAL'
                        ? 'Individual / Sole Proprietor'
                        : 'Registered Business'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      ID Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {idType === 'NATIONAL_ID'
                        ? 'National ID'
                        : idType === 'PASSPORT'
                          ? 'Passport'
                          : "Driver's License"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      ID Country
                    </label>
                    <p className="text-sm text-gray-900">{idCountry}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700">Uploaded Documents</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {businessRegistrationPreview && (
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Business Registration</p>
                    <img
                      src={businessRegistrationPreview}
                      alt="Business Registration"
                      className="h-32 w-full rounded-lg border object-cover"
                    />
                  </div>
                )}
                {idFrontPreview && (
                  <div>
                    <p className="mb-1 text-xs text-gray-500">ID Front</p>
                    <img
                      src={idFrontPreview}
                      alt="ID Front"
                      className="h-32 w-full rounded-lg border object-cover"
                    />
                  </div>
                )}
                {idBackPreview && (
                  <div>
                    <p className="mb-1 text-xs text-gray-500">ID Back</p>
                    <img
                      src={idBackPreview}
                      alt="ID Back"
                      className="h-32 w-full rounded-lg border object-cover"
                    />
                  </div>
                )}
                {selfiePreview && (
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Selfie</p>
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="h-32 w-full rounded-lg border object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={currentStep === 'business-info' ? onCancel : handleBack}>
          <FiChevronLeft className="mr-2" />
          {currentStep === 'business-info' ? 'Cancel' : 'Back'}
        </Button>

        {currentStep !== 'review' ? (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 'business-info' && !canProceedFromBusinessInfo) ||
              (currentStep === 'type' && !canProceedFromType) ||
              (currentStep === 'id-upload' && !canProceedFromIdUpload) ||
              (currentStep === 'selfie' && !canProceedFromSelfie)
            }
          >
            Next
            <FiChevronRight className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
            Submit for Verification
          </Button>
        )}
      </div>
    </div>
  )
}

// Helper Component for File Upload
interface FileUploadBoxProps {
  label: string
  preview: string | null
  onFileChange: (file: File | null) => void
  required?: boolean
}

function FileUploadBox({ label, preview, onFileChange, required = false }: FileUploadBoxProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-500">
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt={label} className="max-h-48 max-w-xs rounded-lg" />
            <button
              onClick={() => onFileChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={`upload-${label}`}
            className="flex cursor-pointer flex-col items-center space-y-3"
          >
            <FiUpload className="h-10 w-10 text-gray-400" />
            <div>
              <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Click to upload {label.toLowerCase()}
              </span>
              <span className="text-sm text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </label>
        )}
        <input
          id={`upload-${label}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  )
}
