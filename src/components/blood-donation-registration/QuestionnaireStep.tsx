import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { ValidRegisterDonate } from '@/api/campaign'

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
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState<string>('')
  const [statusType, setStatusType] = useState<string>('')
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const navigate = useNavigate()
  const hasFetched = useRef(false)
  const hasValidAnswers = Object.values(answers).some((answer) => answer.value.trim() !== '')

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
            setStatusType(status)
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

  return (
    <>
      {/* Dialog thông báo trạng thái đăng ký */}
      <Dialog
        open={showVerificationDialog}
        onOpenChange={(open) => {
          setShowVerificationDialog(open)
          if (!open) {
            setCurrentStep(STEPS.SELECT_CAMPAIGN)
          }
        }}
      >
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
                setShowVerificationDialog(false)
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
          <Button
            className='bg-blue-600 text-white hover:bg-blue-700'
            onClick={handleContinue}
            disabled={!hasValidAnswers || isCheckingStatus}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </>
  )
}

export default QuestionnaireStep
