import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { CheckExtractStatus } from '@/api/extract'

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
        const response = await CheckExtractStatus()
        
        if (response.success && response.data) {
          if (response.data.status === 0) {
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

  const handleRedirectToVerification = () => {
    navigate('/verification/user-profile-page#verification')
  }

  return (
    <>
      {/* Dialog xác thực danh tính */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-3 mb-2 text-amber-500">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Yêu cầu xác thực danh tính</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Để đăng ký hiến máu, bạn cần xác thực danh tính bằng CCCD/CMND. Vui lòng hoàn thành bước xác thực trước khi tiếp tục.
          </DialogDescription>
          
          <div className="bg-amber-50 border border-amber-100 rounded p-3 my-4">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Lưu ý:</span> Quá trình xác thực chỉ diễn ra một lần và cần hình ảnh chụp mặt trước và sau của CCCD/CMND.
            </p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setShowVerificationDialog(false)
                navigate('/')
              }}
            >
              Để sau
            </Button>
            <Button 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleRedirectToVerification}
            >
              Đến trang xác thực
            </Button>
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
