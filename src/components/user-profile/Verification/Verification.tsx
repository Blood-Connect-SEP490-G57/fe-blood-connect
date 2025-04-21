import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import ScrollToTop from '@/components/scrollToTop'
import Step1ConfirmTerms from './Step1ConfirmTerms'
import Step2Upload from './Step2Upload'
import Step3ExtractedInfo from './Step3ExtractedInfo'
import Step4Complete from './Step4Complete'
import { FileScan, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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
  const stepTitles = ['Xác nhận điều khoản', 'Tải lên CCCD', 'Xác thực thông tin', 'Hoàn thành']

  const renderStepIndicator = () => {
    const stepsArray = [1, 2, 3, 4] // Các bước cố định
    return (
      <div className='mb-8'>
        <div className='flex items-center'>
          {stepsArray.map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
              <div className='flex flex-col items-center'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === stepNumber
                    ? 'bg-red-600 text-white font-bold' // Màu đậm hơn cho step hiện tại
                    : step > stepNumber && !(stepNumber === 4 && isLoading)
                    ? 'bg-red-600 text-white' // Màu đỏ cho step đã đi qua
                    : 'bg-gray-200 text-gray-600' // Màu xám cho step chưa đi đến
                  }`}
                >
                  {stepNumber < step ? (
                  <CheckCircle className='h-5 w-5' />
                  ) : (
                  <span className='font-medium'>{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`text-xs text-center font-medium mt-2 ${
                    step >= stepNumber ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  {stepTitles[stepNumber - 1]}
                </span>
              </div>
              {index < stepsArray.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-500 ease-in-out ${
                    step > stepNumber ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Step1ConfirmTerms onNext={nextStep} />
      case 2:
        return (
          <Step2Upload
            formData={formData}
            setFormData={setFormData}
            error={storeError}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
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
        return <Step4Complete onRegisterClick={() => navigate('/dang-ky-hien-mau')} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden'>
      <ScrollToTop />

      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>

      {/* Banner section */}
      <motion.div
        className='bg-gradient-to-r from-red-600 to-red-400 text-white py-10 px-6 relative overflow-hidden border-b-2 border-red-700 rounded-3xl'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='mx-auto relative z-10'>
          <div className='flex flex-col items-center'>
            <motion.div
              className='h-24 w-24 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg mb-5'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <FileScan className='h-12 w-12 text-red-500' />
            </motion.div>
            <h1 className='text-2xl font-bold mb-2'>TẠO HỒ SƠ HIẾN MÁU</h1>
            <p className='text-center text-white/90'>
              Bước {step}/4: {stepTitles[step - 1]}
            </p>
          </div>
        </div>

        {/* Decorative circles for banner */}
        <div className='absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-md'></div>
        <div className='absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-md'></div>
      </motion.div>

      <div className='bg-gray-50 mx-auto mt-4 mb-4'>
        {/* Step indicator */}
        <motion.div
          className='mb-8 px-4 pt-2'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {renderStepIndicator()}
        </motion.div>

        {/* Current step content */}
        <motion.div
          className='backdrop-blur-sm max-w-4xl mx-auto'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          key={step}
        >
          {renderCurrentStep()}
        </motion.div>
      </div>
    </div>
  )
}

export default Verification
