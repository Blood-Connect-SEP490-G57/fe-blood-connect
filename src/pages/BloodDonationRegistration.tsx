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
        return "Chọn chiến dịch hiến máu"
      case STEPS.QUESTIONNAIRE:
        return "Phiếu câu hỏi sức khỏe"
      case STEPS.REVIEW:
        return "Xác nhận thông tin"
      case STEPS.SUCCESS:
        return "Đăng ký thành công"
      default:
        return "Đăng ký hiến máu"
    }
  }

  const renderStepIndicator = () => {
    // const stepsArray = Object.values(STEPS).filter((step) => typeof step === 'number') as number[]
    const stepTitles = ['Chọn chiến dịch', 'Khảo sát', 'Xác nhận', 'Hoàn tất']

    return (
      <div className='mb-10 px-1'>
        <div className='flex justify-between items-center relative'>
          {/* Thanh nối liền */}
          <div className='absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-1 z-0 flex'>
            {/* Đoạn 1 - luôn màu đỏ */}
            <div className='flex-1 bg-red-600'></div>
            {/* Đoạn 2 */}
            <div className={`flex-1 ${currentStep >= STEPS.QUESTIONNAIRE ? 'bg-red-600' : 'bg-gray-200'}`}></div>
            {/* Đoạn 3 */}
            <div className={`flex-1 ${currentStep >= STEPS.REVIEW ? 'bg-red-600' : 'bg-gray-200'}`}></div>
            {/* Đoạn 4 */}
            <div className={`flex-1 ${currentStep >= STEPS.SUCCESS ? 'bg-red-600' : 'bg-gray-200'}`}></div>
          </div>
          
          {/* Các bước */}
          <div className='flex flex-col items-center z-10'>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-red-600 text-white`}>
              1
            </div>
            <span className={`mt-2 text-xs text-center w-24 ${currentStep === STEPS.SELECT_CAMPAIGN ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {stepTitles[0]}
            </span>
          </div>

          <div className='flex flex-col items-center z-10'>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${currentStep >= STEPS.QUESTIONNAIRE ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              2
            </div>
            <span className={`mt-2 text-xs text-center w-24 ${currentStep === STEPS.QUESTIONNAIRE ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {stepTitles[1]}
            </span>
          </div>

          <div className='flex flex-col items-center z-10'>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${currentStep >= STEPS.REVIEW ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              3
            </div>
            <span className={`mt-2 text-xs text-center w-24 ${currentStep === STEPS.REVIEW ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {stepTitles[2]}
            </span>
          </div>

          <div className='flex flex-col items-center z-10'>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${currentStep >= STEPS.SUCCESS ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              4
            </div>
            <span className={`mt-2 text-xs text-center w-24 ${currentStep === STEPS.SUCCESS ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {stepTitles[3]}
            </span>
          </div>
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
    <div className='min-h-screen bg-gray-100'>
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <Droplet className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold mb-1'>{getStepTitle()}</h1>
            <p className='text-center text-white/80 max-w-2xl'>
              Mỗi giọt máu hiến tặng có thể cứu sống một người. Hãy đăng ký hiến máu để cùng chia sẻ yêu thương.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className='absolute -bottom-4 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
        <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
        <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-3xl mx-auto'>
          {renderStepIndicator()}
          {renderStep()}
        </div>
      </div>
    </div>
  )
}

export default BloodDonationRegistration
