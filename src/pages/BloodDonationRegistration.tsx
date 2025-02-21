import QuestionnaireStep from '@/components/blood-donation-registration/QuestionnaireStep'
import ReviewStep from '@/components/blood-donation-registration/ReviewStep'
import SelectCampaignStep from '@/components/blood-donation-registration/SelectCampaignStep'
import SuccessStep from '@/components/blood-donation-registration/SuccessStep'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export enum STEPS {
  SELECT_CAMPAIGN = 0,
  QUESTIONNAIRE = 1,
  REVIEW = 2,
  SUCCESS = 3
}

export type Step = (typeof STEPS)[keyof typeof STEPS]

// const stepTitles: Record<Step, string> = {
//   [STEPS.SELECT_CAMPAIGN]: 'Chọn buổi hiến máu',
//   [STEPS.QUESTIONNAIRE]: 'Khảo sát',
//   [STEPS.REVIEW]: 'Xác nhận',
//   [STEPS.SUCCESS]: 'Hoàn thành'
// }

const BloodDonationRegistration = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.SELECT_CAMPAIGN)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }))
  }
  const renderStepIndicator = () => {
    return (
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          {Object.values(STEPS)
            .filter((step) => typeof step === 'number')
            .map((step, index) => (
              <React.Fragment key={step}>
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step + 1}
                  </div>
                </div>
                {index < Object.values(STEPS).length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all duration-500 ease-in-out ${
                      currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    )
  }
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.SELECT_CAMPAIGN:
        return (
          <SelectCampaignStep
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            setCurrentStep={setCurrentStep}
          />
        )
      case STEPS.QUESTIONNAIRE:
        return (
          <QuestionnaireStep
            answers={answers}
            handleAnswerChange={handleAnswerChange}
            setCurrentStep={(step: number) => setCurrentStep(step as Step)}
          />
        )
      case STEPS.REVIEW:
        return <ReviewStep selectedCampaign={selectedCampaign} answers={answers} setCurrentStep={setCurrentStep} />
      case STEPS.SUCCESS:
        return <SuccessStep navigate={navigate} />
      default:
        return null // Ensure nothing is rendered beyond the defined steps
    }
  }

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>Đăng ký hiến máu</h1>
          {renderStepIndicator()}
          {renderStep()}
        </div>
      </div>
    </div>
  )
}

export default BloodDonationRegistration
