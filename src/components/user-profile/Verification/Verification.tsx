import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import ScrollToTop from '@/components/scrollToTop'
import Step1ConfirmTerms from './Step1ConfirmTerms'
import Step2Upload from './Step2Upload'
import Step3ExtractedInfo from './Step3ExtractedInfo'
import Step4Complete from './Step4Complete'

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
    <div className='min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <ScrollToTop />
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          {[1, 2, 3, 4].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary text-accent'
                }`}
              >
                {stepNumber}
              </div>
              {index < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-500 ease-in-out ${
                    step > stepNumber ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderCurrentStep()}
    </div>
  )
}

export default Verification
