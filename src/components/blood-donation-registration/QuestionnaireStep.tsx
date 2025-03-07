import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { submitAnswers } from '@/api/campaign'
import { toast } from '@/components/ui/use-toast' // Thêm toast nếu có

interface QuestionnaireStepProps {
  questionSetId: number
  campaignId: number // Thêm campaignId
  answers: Record<number, string>
  handleAnswerChange: (questionId: number, answer: string) => void
  setCurrentStep: (step: number) => void
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  questionSetId,
  campaignId,
  answers,
  handleAnswerChange,
  setCurrentStep
}) => {
  const [submitting, setSubmitting] = useState(false)

  const handleContinue = async () => {
    try {
      setSubmitting(true)
      // Log để debug
      console.log('Sending answers:', {
        campaign_id: campaignId,
        question_set_id: questionSetId,
        answer: answers
      })
      const result = await submitAnswers({
        campaign_id: campaignId,
        question_set_id: questionSetId,
        answer: answers
      })
      console.log('API response:', result)
      
      // Nếu thành công, chuyển sang bước Review
      if (result.success) {
        toast?.({
          title: 'Thành công',
          description: 'Câu trả lời của bạn đã được ghi nhận',
          variant: 'default',
        })
        setCurrentStep(STEPS.REVIEW)
      } else {
        // Hiển thị lỗi nếu server trả về
        toast?.({
          title: 'Có lỗi xảy ra',
          description: result.message || 'Không thể gửi câu trả lời',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting answers:', error)
      toast?.({
        title: 'Có lỗi xảy ra',
        description: 'Không thể gửi câu trả lời. Vui lòng thử lại sau.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
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
        <Button variant='outline' onClick={() => setCurrentStep(STEPS.SELECT_CAMPAIGN)} disabled={submitting}>
          Quay lại
        </Button>
        <Button
          className='bg-red-600 text-white hover:bg-red-700'
          onClick={handleContinue}
          disabled={Object.keys(answers).length < 3 || submitting}
        >
          {submitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Đang gửi...
            </>
          ) : (
            'Tiếp tục'
          )}
        </Button>
      </div>
    </div>
  )
}

export default QuestionnaireStep