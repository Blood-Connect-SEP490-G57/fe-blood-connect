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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden'>
      <ScrollToTop />
      
      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      {/* Banner section */}
      <motion.div 
        className='bg-gradient-to-r from-red-500 to-red-600 text-white py-10 px-6 relative overflow-hidden'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container mx-auto relative z-10'>
          <div className='flex flex-col items-center'>
            <motion.div 
              className='h-24 w-24 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg mb-5'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <FileScan className='h-12 w-12 text-red-500' />
            </motion.div>
            <h1 className='text-2xl font-bold mb-2'>Xác thực tài khoản</h1>
            <p className='text-center text-white/90'>
              Bước {step}/4: {stepTitles[step-1]}
            </p>
          </div>
        </div>
        
        {/* Decorative circles for banner */}
        <div className='absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-md'></div>
        <div className='absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-md'></div>
      </motion.div>

      <div className='container mx-auto px-4 py-8'>
        {/* Step indicator */}
        <motion.div 
          className='mb-8 px-4 pt-2'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className='flex items-center justify-between max-w-2xl mx-auto'>
            {[1, 2, 3, 4].map((stepNumber) => (
              <motion.div 
                key={stepNumber} 
                className='flex flex-col items-center'
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (stepNumber * 0.1), duration: 0.3 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' 
                      : 'bg-white text-gray-400 border border-gray-200'
                  } ${step === stepNumber ? 'ring-4 ring-red-100' : ''}`}
                >
                  {stepNumber < step ? (
                    <CheckCircle className='h-5 w-5' />
                  ) : (
                    <span className="font-medium">{stepNumber}</span>
                  )}
                </div>
                <span className={`text-xs font-medium mt-2 ${step >= stepNumber ? 'text-red-600' : 'text-gray-400'}`}>
                  {stepTitles[stepNumber-1]}
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className='relative mt-6 max-w-2xl mx-auto'>
            <div className='absolute h-1.5 bg-gray-100 rounded-full top-0 left-0 right-0'></div>
            <motion.div 
              className='absolute h-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full top-0 left-0 shadow-sm'
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Current step content */}
        <motion.div 
          className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-gray-100'
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
