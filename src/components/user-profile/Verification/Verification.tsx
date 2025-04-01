import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import { getOrganizationsByType, Organization } from '@/api/organization'
import Step1Upload from './Step1Upload'
import Step2ConfirmInfo from './Step2ExtractedInfo'
import Step3Complete from './Step3ConfirmInfo'
import ScrollToTop from '@/components/scrollToTop'

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

  const { isLoading, error: storeError, setError } = useExtractStore()
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState<Organization[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = (): void => setStep(step + 1)
  const prevStep = (): void => setStep(step - 1)

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrganizationsByType()
        setOrganizations(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error('Error fetching organizations:', err)
        setError('Không thể tải danh sách tổ chức')
        setOrganizations([])
      }
    }

    fetchOrganizations()
  }, [])

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Upload
            formData={formData}
            setFormData={setFormData}
            error={storeError}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <Step2ConfirmInfo
            formData={formData}
            setFormData={setFormData}
            organizations={organizations}
            onInputChange={handleInputChange}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      case 3:
        return <Step3Complete 
          onHomeClick={() => navigate('/')} 
          onRegisterClick={() => navigate('/dang-ky-hien-mau')} 
        />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <ScrollToTop />
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          {[1, 2, 3].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary text-accent'
                }`}
              >
                {stepNumber}
              </div>
              {index < 2 && (
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