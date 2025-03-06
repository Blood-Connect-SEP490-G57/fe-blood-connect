import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'

interface QuestionnaireStepProps {
  questionSetId: number 
  answers: Record<number, string> 
  handleAnswerChange: (questionId: number, answer: string) => void 
  setCurrentStep: (step: number) => void
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  questionSetId,
  answers,
  handleAnswerChange,
  setCurrentStep
}) => {
  return (
    <div className='space-y-6'> {/* Bỏ flex flex-col min-h-screen */}
      <Card className='border-none shadow-lg mb-6'> {/* Thêm margin bottom */}
        <CardHeader>
          <CardTitle>Bảng câu hỏi sức khỏe</CardTitle>
          <CardDescription>Vui lòng trả lời các câu hỏi sau để đảm bảo bạn đủ điều kiện hiến máu</CardDescription>
        </CardHeader>
        <CardContent>
          <Questionnaire 
            questionSetId={questionSetId} 
            onAnswerChange={handleAnswerChange} // Chuyển handleAnswerChange thành onAnswerChange 
            answers={answers} 
          />
        </CardContent>
      </Card>

      <div className='flex justify-between py-4 border-t'> {/* Sửa lại classes */}
        <Button variant='outline' onClick={() => setCurrentStep(STEPS.SELECT_CAMPAIGN)}>
          Quay lại
        </Button>
        <Button
          className='bg-red-600 text-white hover:bg-red-700'
          onClick={() => setCurrentStep(STEPS.REVIEW)}
          disabled={Object.keys(answers).length < 3} 
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}

export default QuestionnaireStep