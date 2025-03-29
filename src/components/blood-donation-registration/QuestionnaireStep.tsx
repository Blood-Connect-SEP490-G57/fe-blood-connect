import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { ValidRegisterDonate } from '@/api/campaign'
import { useToast } from '@/components/ui/use-toast'

type VerificationStatus = 'NOT_VERIFIED' | 'ALREADY_REGISTERED' | 'SUCCESS' | ''

interface QuestionnaireStepProps {
  questionSetId: number
  campaignId: number
  answers: Record<number, { value: string; description?: string }>
  handleAnswerChange: (questionId: number, value: string, description?: string) => void
  setCurrentStep: (step: (typeof STEPS)[keyof typeof STEPS]) => void
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  questionSetId,
  answers,
  handleAnswerChange,
  setCurrentStep
}) => {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [statusType, setStatusType] = useState<VerificationStatus>('')
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const navigate = useNavigate()
  const hasFetched = useRef(false)
  const { toast } = useToast()

  const answeredQuestions = Object.values(answers).filter((answer) => answer.value.trim() !== '').length
  const hasAllAnswers = answeredQuestions === totalQuestions && totalQuestions > 0

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const checkVerificationStatus = async () => {
      try {
        setIsCheckingStatus(true)
        const response = await ValidRegisterDonate()

        if (response.success && response.data) {
          const { status, message } = response.data

          if (status !== 'SUCCESS') {
            setStatusType(status as VerificationStatus)
            setDialogMessage(message)
            setShowVerificationDialog(true)
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkVerificationStatus()
  }, [])

  const handleContinue = () => {
    if (!hasAllAnswers) {
      toast({
        variant: 'destructive',
        title: 'Thông báo',
        description: `Vui lòng trả lời tất cả ${totalQuestions} câu hỏi. Hiện tại bạn đã trả lời ${answeredQuestions}/${totalQuestions} câu.`
      })

      // Tìm câu hỏi đầu tiên chưa trả lời và cuộn đến
      const unansweredQuestion = document.querySelector('.border-red-200')
      if (unansweredQuestion) {
        unansweredQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setCurrentStep(STEPS.REVIEW)
  }

  const handleRedirect = () => {
    switch (statusType) {
      case 'NOT_VERIFIED':
        navigate('/trang-ca-nhan#xac-thuc-tai-khoan')
        break
      case 'ALREADY_REGISTERED':
        navigate('/lich-su-hien-mau')
        break
      default:
        setShowVerificationDialog(false)
    }
  }

  const handleCloseDialog = () => {
    setShowVerificationDialog(false)
    setCurrentStep(STEPS.SELECT_CAMPAIGN)
  }

  return (
    <>
      <Dialog open={showVerificationDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className='sm:max-w-md'>
          <div className='flex items-center gap-3 mb-2 text-red-600'>
            <AlertTriangle className='h-6 w-6' />
            <DialogTitle>Thông báo đăng ký</DialogTitle>
          </div>
          <DialogDescription className='text-gray-600'>{dialogMessage}</DialogDescription>

          <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0'>
            <Button
              variant='outline'
              className='w-full sm:w-auto'
              onClick={() => {
                handleCloseDialog()
                navigate('/')
              }}
            >
              Đóng
            </Button>
            {(statusType === 'NOT_VERIFIED' || statusType === 'ALREADY_REGISTERED') && (
              <Button className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white' onClick={handleRedirect}>
                {statusType === 'NOT_VERIFIED' ? 'Xác thực ngay' : 'Xem lịch sử'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='space-y-6'>
        <Card className='border-none shadow-lg mb-6'>
          <CardHeader>
            <CardTitle>Bảng câu hỏi sức khỏe</CardTitle>
            <CardDescription>
              Vui lòng trả lời tất cả các câu hỏi sau để đảm bảo bạn đủ điều kiện hiến máu
              {totalQuestions > 0 && (
                <span className='block mt-1 text-sm text-gray-500'>
                  Đã trả lời: {answeredQuestions}/{totalQuestions} câu hỏi
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Questionnaire
              questionSetId={questionSetId}
              onAnswerChange={handleAnswerChange}
              answers={answers}
              onQuestionsLoaded={setTotalQuestions}
            />
          </CardContent>
        </Card>

        <div className='flex justify-between py-4 border-t'>
          <Button variant='outline' onClick={() => setCurrentStep(STEPS.SELECT_CAMPAIGN)}>
            Quay lại
          </Button>
          <Button
            className='bg-blue-600 text-white hover:bg-blue-700'
            onClick={handleContinue}
            disabled={isCheckingStatus || !hasAllAnswers}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </>
  )
}

export default QuestionnaireStep
