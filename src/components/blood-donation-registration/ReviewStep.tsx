import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { Question as fetchQuestions } from '@/api/campaign'
import { STEPS } from '@/pages/BloodDonationRegistration'

interface Question {
  id: number
  content: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE'
  subs: { content: string, has_description: boolean }[]
  order: number
}

type Campaign = {
  id: number
  name: string
  location: string
  startReceiveTime: string
  endReceiveTime: string
  organizeTime: string
  description: string
  targetBloodUnits: number
  officialDocumentUrl: string
  currentDonors?: number
  maxDonors?: number
  requirements?: string[]
}

type Step = (typeof STEPS)[keyof typeof STEPS]

const ReviewStep = ({
  selectedCampaign,
  questionSetId,
  answers,
  setCurrentStep
}: {
  selectedCampaign: Campaign | null
  questionSetId: number
  answers: Record<number, string>
  setCurrentStep: Dispatch<SetStateAction<Step>>
}) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (!questionSetId) return

  //   const fetchQuestionData = async () => {
  //     try {
  //       const data = await fetchQuestions(questionSetId.toString())
  //       setQuestions(data.data.questions)
  //     } catch (err) {
  //       console.error("Không thể lấy danh sách câu hỏi", err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchQuestionData()
  // }, [questionSetId])

  if (loading) {
    return <p>Đang tải...</p>
  }

  return (
    <Card className='border-none shadow-lg'>
      <CardHeader>
        <CardTitle>Xác nhận thông tin</CardTitle>
        <CardDescription>Vui lòng kiểm tra lại thông tin đăng ký hiến máu của bạn</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {selectedCampaign && (
          <div className='bg-gray-50 rounded-lg p-4'>
            <CampaignDetails campaign={selectedCampaign} />
          </div>
        )}

        <div className='space-y-4'>
          <h3 className='font-medium text-lg'>Câu trả lời của bạn</h3>
          <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
            {Object.entries(answers).map(([questionId, answer]) => {
              const questionObj = questions.find(q => q.id === parseInt(questionId));
              return (
                <div key={questionId} className='flex justify-between text-sm'>
                  <span className='text-gray-600'>{questionObj?.content || `Câu hỏi ${questionId}`}</span>
                  <span className='font-medium'>{answer}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex justify-between'>
          <Button variant='outline' onClick={() => setCurrentStep(1)}>
            Quay lại
          </Button>
          <Button className='bg-red-600 text-white hover:bg-red-700' onClick={() => setCurrentStep(3)}>
            Xác nhận đăng ký
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewStep