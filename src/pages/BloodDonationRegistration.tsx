import React, { useState, useEffect } from 'react'
import SelectCampaignStep from '@/components/blood-donation-registration/SelectCampaignStep'
import ReviewStep from '@/components/blood-donation-registration/ReviewStep'
import SuccessStep from '@/components/blood-donation-registration/SuccessStep'
import { useNavigate } from 'react-router-dom'
import QuestionnaireStep from '@/components/blood-donation-registration/QuestionnaireStep'

export enum STEPS {
  SELECT_CAMPAIGN,
  QUESTIONNAIRE,
  REVIEW,
  SUCCESS
}

export type Step = (typeof STEPS)[keyof typeof STEPS]

const BloodDonationRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.SELECT_CAMPAIGN)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [questionSetId, setQuestionSetId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, { value: string; description?: string }>>({})

  // Kiểm tra localStorage khi component được mount
  useEffect(() => {
    const savedCampaign = localStorage.getItem('selectedCampaign')
    if (savedCampaign) {
      try {
        const campaignData = JSON.parse(savedCampaign)
        setSelectedCampaign(campaignData)
        setQuestionSetId(campaignData.questionSetId)

        // Chuyển đến bước tiếp theo
        setCurrentStep(STEPS.QUESTIONNAIRE)

        // Xóa dữ liệu từ localStorage sau khi đã sử dụng
        localStorage.removeItem('selectedCampaign')
      } catch (error) {
        console.error('Lỗi khi đọc thông tin chiến dịch:', error)
      }
    }
  }, [])

  const handleAnswerChange = (questionId: number, value: string, description?: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { value, description }
    }))
  }

  const renderStepIndicator = () => {
    const stepsArray = Object.values(STEPS).filter((step) => typeof step === 'number') as number[]

    return (
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          {stepsArray.map((step, index) => (
            <React.Fragment key={step}>
              <div className='flex flex-col items-center'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-red-600 text-white font-bold' // Màu đậm hơn cho step hiện tại
                      : currentStep > step
                      ? 'bg-red-600 text-white' // Màu đỏ cho step đã đi qua
                      : 'bg-gray-200 text-gray-600' // Màu xám cho step chưa đi đến
                  }`}
                >
                  {step + 1}
                </div>
              </div>
              {index < stepsArray.length - 1 && (
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
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            setCurrentStep={setCurrentStep}
            setQuestionSetId={setQuestionSetId}
          />
        )
      case STEPS.QUESTIONNAIRE:
        return (
          <QuestionnaireStep
            questionSetId={questionSetId ?? 0}
            campaignId={selectedCampaign?.id ?? 0}
            answers={answers}
            handleAnswerChange={handleAnswerChange}
            setCurrentStep={setCurrentStep}
          />
        )
      case STEPS.REVIEW:
        return (
          <ReviewStep
            selectedCampaign={selectedCampaign}
            answers={answers}
            questionSetId={questionSetId ?? 0}
            setCurrentStep={setCurrentStep}
          />
        )
      case STEPS.SUCCESS:
        return <SuccessStep navigate={navigate} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
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
