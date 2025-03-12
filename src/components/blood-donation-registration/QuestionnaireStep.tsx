import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'

interface QuestionnaireStepProps {
  questionSetId: number
  campaignId: number
  answers: Record<number, { value: string; description?: string }>
  handleAnswerChange: (questionId: number, value: string, description?: string) => void
  setCurrentStep: (step: number) => void
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  questionSetId,
  answers,
  handleAnswerChange,
  setCurrentStep
}) => {
  // Kiểm tra xem có ít nhất một câu trả lời không rỗng
  const hasValidAnswers = Object.values(answers).some((answer) => answer.value.trim() !== '')

  const handleContinue = () => {
    // Chuyển đến bước xem lại mà không gọi API
    setCurrentStep(STEPS.REVIEW)
  }

  return (
    <div className='space-y-6'>
      <Card className='border-none shadow-lg mb-6'>
        <CardHeader>
          <CardTitle>Bảng câu hỏi sức khỏe</CardTitle>
          <CardDescription>Vui lòng trả lời các câu hỏi sau để đảm bảo bạn đủ điều kiện hiến máu</CardDescription>
        </CardHeader>
        <CardContent>
          <Questionnaire questionSetId={questionSetId} onAnswerChange={handleAnswerChange} answers={answers} />
        </CardContent>
      </Card>

      <div className='flex justify-between py-4 border-t'>
        <Button variant='outline' onClick={() => setCurrentStep(STEPS.SELECT_CAMPAIGN)}>
          Quay lại
        </Button>
        <Button className='bg-red-600 text-white hover:bg-red-700' onClick={handleContinue} disabled={!hasValidAnswers}>
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}

export default QuestionnaireStep
