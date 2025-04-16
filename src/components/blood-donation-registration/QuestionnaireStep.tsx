import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ChevronLeft, ChevronRight, Clipboard, CheckCircle2 } from 'lucide-react'
import { ValidRegisterDonate } from '@/api/campaign'
import { useToast } from '@/components/ui/use-toast'
import ScrollToTop from '../scrollToTop'
import { Progress } from '@/components/ui/progress'

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
  const progress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0

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
        navigate('/trang-ca-nhan#lich-su-hien-mau')
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
      <ScrollToTop />
      <Dialog open={showVerificationDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className='sm:max-w-md rounded-xl' aria-describedby="dialog-questionnaire-verification">
          <div id="dialog-questionnaire-verification" className="sr-only">Thông báo xác minh tài khoản hiến máu của bạn</div>
          <div className='flex items-center gap-3 mb-2 text-red-600'>
            <AlertTriangle className='h-6 w-6' />
            <DialogTitle>Thông báo đăng ký</DialogTitle>
          </div>
          <DialogDescription className='text-gray-600'>{dialogMessage}</DialogDescription>

          <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0'>
            <Button
              variant='outline'
              className='w-full sm:w-auto rounded-lg'
              onClick={() => {
                handleCloseDialog()
                navigate('/')
              }}
            >
              Đóng
            </Button>
            {(statusType === 'NOT_VERIFIED' || statusType === 'ALREADY_REGISTERED') && (
              <Button 
                className='w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg' 
                onClick={handleRedirect}
              >
                {statusType === 'NOT_VERIFIED' ? 'Xác thực ngay' : 'Xem lịch sử'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='space-y-6'>
        <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
          <CardHeader className='pb-4 border-b'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='bg-red-100 rounded-lg p-2'>
                <Clipboard className='h-5 w-5 text-red-600' />
              </div>
              <div>
                <CardTitle>Bảng câu hỏi sức khỏe</CardTitle>
                <CardDescription className='mt-1'>
                  Vui lòng trả lời tất cả các câu hỏi sau để đảm bảo bạn đủ điều kiện hiến máu
                </CardDescription>
              </div>
            </div>
            
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Tiến độ hoàn thành</span>
                <span className='font-medium text-gray-700'>{progress}%</span>
              </div>
              <div className='relative'>
                <Progress value={progress} className='h-2' />
                {progress === 100 && (
                  <CheckCircle2 className='absolute -right-1 -top-1 h-4 w-4 text-green-500' />
                )}
              </div>
              <div className='text-xs text-gray-500 text-right'>
                Đã trả lời: <span className='font-medium'>{answeredQuestions}/{totalQuestions}</span> câu hỏi
              </div>
            </div>
          </CardHeader>
          
          <CardContent className='p-6'>
            <Questionnaire
              questionSetId={questionSetId}
              onAnswerChange={handleAnswerChange}
              answers={answers}
              onQuestionsLoaded={setTotalQuestions}
            />
          </CardContent>
        </Card>

        <div className='flex justify-between py-4'>
          <Button 
            variant='outline' 
            onClick={() => setCurrentStep(STEPS.SELECT_CAMPAIGN)}
            className='rounded-xl'
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Quay lại
          </Button>
          <Button
            className='rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 transition'
            onClick={handleContinue}
            disabled={isCheckingStatus || !hasAllAnswers}
          >
            Tiếp tục
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </>
  )
}

export default QuestionnaireStep
