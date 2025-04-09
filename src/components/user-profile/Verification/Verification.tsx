import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import ScrollToTop from '@/components/scrollToTop'
import Step1ConfirmTerms from './Step1ConfirmTerms'
import Step2Upload from './Step2Upload'
import Step3ExtractedInfo from './Step3ExtractedInfo'
import Step4Complete from './Step4Complete'
import { FileScan, UserCheck } from 'lucide-react'

interface FormData {
  frontImage: File | null
  backImage: File | null
  extractId?: string
  fullName: string
  dateOfBirth: string
  email: string
  mobile: string
  jobName: string
  studentId: string
  militaryId: string
  addressContact: string
  timeDonation: number
  bloodGroup: string
  organizationId: number | ''
}

const Verification = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    frontImage: null,
    backImage: null,
    fullName: '',
    dateOfBirth: '',
    email: '',
    mobile: '',
    jobName: '',
    studentId: '',
    militaryId: '',
    addressContact: '',
    timeDonation: 0,
    bloodGroup: '',
    organizationId: ''
  })

  const { isLoading, error: storeError } = useExtractStore()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = (): void => setStep((prev) => prev + 1)
  const prevStep = (): void => setStep((prev) => prev - 1)

  // Step titles for display
  const stepTitles = [
    'Xác nhận điều khoản',
    'Tải lên CCCD',
    'Xác thực thông tin',
    'Hoàn thành'
  ]

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Step1ConfirmTerms onNext={nextStep} />
      case 2:
        return <Step2Upload formData={formData} setFormData={setFormData} error={storeError} onNext={nextStep} />
      case 3:
        return (
          <Step3ExtractedInfo
            formData={formData}
            setFormData={setFormData}
            onInputChange={handleInputChange}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      case 4:
        return <Step4Complete onHomeClick={() => navigate('/')} onRegisterClick={() => navigate('/dang-ky-hien-mau')} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <ScrollToTop />
      
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <FileScan className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold mb-1'>Xác thực tài khoản</h1>
            <p className='text-center text-white/80'>
              Bước {step}/4: {stepTitles[step-1]}
            </p>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        {/* Step indicator */}
        <div className='mb-8 px-2'>
          <div className='flex items-center justify-between'>
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className='flex flex-col items-center'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  } ${step === stepNumber ? 'ring-4 ring-red-100' : ''}`}
                >
                  {stepNumber < step ? (
                    <UserCheck className='h-4 w-4' />
                  ) : (
                    stepNumber
                  )}
                </div>
                {step === stepNumber && (
                  <span className='text-xs font-medium text-red-600 mt-1'>
                    {stepTitles[stepNumber-1]}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className='relative mt-2'>
            <div className='absolute h-1 bg-gray-200 top-0 left-0 right-0'></div>
            <div 
              className='absolute h-1 bg-red-600 top-0 left-0 transition-all duration-300 ease-in-out'
              style={{ width: `${(step - 1) * 33.3333}%` }}
            ></div>
          </div>
        </div>

        {/* Current step content */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}

export default Verification
