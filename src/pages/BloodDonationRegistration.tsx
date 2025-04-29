import React, { useState, useEffect } from 'react'
import SelectCampaignStep from '@/components/blood-donation-registration/SelectCampaignStep'
import ReviewStep from '@/components/blood-donation-registration/ReviewStep'
import SuccessStep from '@/components/blood-donation-registration/SuccessStep'
import { useNavigate } from 'react-router-dom'
import QuestionnaireStep from '@/components/blood-donation-registration/QuestionnaireStep'
import { Droplet } from 'lucide-react'

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
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [questionSetId, setQuestionSetId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, { value: string; description?: string }>>({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const campaignId = urlParams.get('campaignId')
    const questionSet = urlParams.get('questionset')

    if (campaignId && questionSet) {
      // Nếu có dữ liệu từ URL, sử dụng nó
      try {
        setSelectedCampaign(JSON.parse(campaignId))
        setQuestionSetId(parseInt(questionSet))
        setCurrentStep(STEPS.QUESTIONNAIRE)
      } catch (error) {
        console.error('Lỗi khi đọc thông tin chiến dịch từ URL:', error)
      }
    } else {
      // Nếu không có dữ liệu từ URL, kiểm tra localStorage
      const savedCampaign = localStorage.getItem('selectedCampaign')
      if (savedCampaign) {
        try {
          const campaignData = JSON.parse(savedCampaign)
          setSelectedCampaign(campaignData)
          setQuestionSetId(campaignData.questionSetId)
          setCurrentStep(STEPS.QUESTIONNAIRE)
          localStorage.removeItem('selectedCampaign')
        } catch (error) {
          console.error('Lỗi khi đọc thông tin chiến dịch từ localStorage:', error)
        }
      }
    }
  }, [])

  const handleAnswerChange = (questionId: number, value: string, description?: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { value, description }
    }))
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.SELECT_CAMPAIGN:
        return 'Chọn chiến dịch hiến máu'
      case STEPS.QUESTIONNAIRE:
        return 'Phiếu câu hỏi sức khỏe'
      case STEPS.REVIEW:
        return 'Xác nhận thông tin'
      case STEPS.SUCCESS:
        return 'Đăng ký thành công'
      default:
        return 'Đăng ký hiến máu'
    }
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
    <div className='min-h-screen bg-gray-100 rounded-lg'>
      {/* Banner section */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-6 relative rounded-lg'>
          <div className='container mx-auto'>
            <div className='flex flex-col items-center'>
              <div className='h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
                <Droplet className='h-12 w-12 text-red-500' />
              </div>
              <h1 className='text-xl font-bold mb-1'>{getStepTitle()}</h1>
              <p className='text-center text-white/80 max-w-2xl text-sm'>
                Mỗi giọt máu hiến tặng có thể cứu sống một người. Hãy đăng ký hiến máu để cùng chia sẻ yêu thương.
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className='absolute -bottom-0 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
          <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
          <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto py-6 px-4'>
          {renderStepIndicator()}
          {renderStep()}
      </div>
    </div>
  )
}

export default BloodDonationRegistration
