import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { Question as fetchQuestions, getAnswersByCampaignId, submitAnswers } from '@/api/campaign'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { Question, QuestionSet, Section } from '@/schema/question-schema'
import { AnswerType, ApiAnswerType } from '@/schema/answer-schema'

// Interfaces

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

interface ReviewStepProps {
  selectedCampaign: Campaign | null
  questionSetId: number
  answers: Record<number, { value: string; description?: string }>
  setCurrentStep: Dispatch<SetStateAction<Step>>
}

interface SubmitAnswerPayload {
  campaignId: number
  answers: AnswerType[]
}

const ReviewStep: React.FC<ReviewStepProps> = ({ selectedCampaign, questionSetId, answers, setCurrentStep }) => {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [apiAnswers, setApiAnswers] = useState<ApiAnswerType[]>([])
  const [hasApiData, setHasApiData] = useState(false)
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!questionSetId || hasFetched.current) return
    hasFetched.current = true

    const fetchData = async () => {
      setLoading(true)

      try {
        // Try to get existing answers first
        if (selectedCampaign) {
          try {
            const response = await getAnswersByCampaignId(selectedCampaign.id)
            const hasAnswers = response.length > 0

            if (hasAnswers) {
              setApiAnswers(response)
              setHasApiData(true)
              setLoading(false)
              return
            }
          } catch (error) {
            console.log('Chưa có đăng ký hoặc lỗi khi lấy dữ liệu:', error)
          }
        }

        // If no existing answers, get questions to display current form answers
        const questionsResponse = await fetchQuestions(questionSetId.toString())
        if (questionsResponse.success && questionsResponse.data) {
          setQuestionSet(questionsResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [questionSetId, selectedCampaign])

  const handleConfirm = async () => {
    if (hasApiData) {
      setCurrentStep(STEPS.SUCCESS)
      return
    }

    try {
      setSubmitting(true)

      // Filter valid answers
      const validAnswers = Object.entries(answers).filter(([_, data]) => data.value.trim() !== '')

      // Format answers for API
      const formattedAnswers: AnswerType[] = validAnswers.map(([questionId, data]) => ({
        questionId: parseInt(questionId),
        answer: data.value === 'Có' ? 'true' : 'false',
        detail: data.description || ''
      }))

      // Create payload
      const payload: SubmitAnswerPayload = {
        campaignId: selectedCampaign?.id || 0,
        answers: formattedAnswers
      }

      // Submit answers
      const result = await submitAnswers(payload)

      if (result.success) {
        toast({
          title: 'Đăng ký thành công',
          description: 'Đăng ký hiến máu của bạn đã được ghi nhận',
          variant: 'default'
        })
        setCurrentStep(STEPS.SUCCESS)
      } else {
        toast({
          title: 'Có lỗi xảy ra',
          description: result.message || 'Không thể đăng ký hiến máu',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể đăng ký hiến máu. Vui lòng thử lại sau.',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderAnswers = () => {
    if (hasApiData) {
      // Group answers by questionId
      const groupedAnswers = apiAnswers.reduce((acc, answer) => {
        const questionId = answer.questionInfo.id
        if (!acc[questionId]) {
          acc[questionId] = {
            questionInfo: answer.questionInfo,
            answers: []
          }
        }
        acc[questionId].answers.push(answer)
        return acc
      }, {} as Record<number, { questionInfo: ApiAnswerType['questionInfo']; answers: ApiAnswerType[] }>)

      return Object.values(groupedAnswers)
        .sort((a, b) => a.questionInfo.order - b.questionInfo.order)
        .map(({ questionInfo, answers }) => (
          <div key={questionInfo.id} className='flex flex-col space-y-2 border-b pb-3 last:border-b-0'>
            <div className='text-sm text-gray-800 font-medium'>
              Câu {questionInfo.order}: {questionInfo.content}
            </div>
            <div className='pl-4 space-y-2'>
              {answers.map((answer) => (
                <div key={answer.questionId} className='text-sm'>
                  <div className='flex items-start'>
                    <div className='mt-0.5 mr-2 h-2 w-2 rounded-full bg-red-500'></div>
                    <span className='font-medium'>{answer.questionInfo.content}</span>
                  </div>
                  {answer.detail && (
                    <div className='text-gray-500 italic ml-4 mt-1'>Mô tả: {answer.detail}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
    }

    if (!questionSet || Object.keys(answers).length === 0) {
      return (
        <div className='bg-yellow-50 p-4 rounded-lg'>
          <p className='text-yellow-800'>Chưa có câu trả lời nào</p>
        </div>
      )
    }

    // Group answers by section
    type GroupedAnswer = {
      question: Question;
      apiAnswer: ApiAnswerType;
    }

    type SectionGroup = {
      section: Section;
      answers: GroupedAnswer[];
    }

    const groupedBySection = questionSet.sections
      .filter(section => !section.hidden)
      .sort((a, b) => a.order - b.order)
      .map(section => {
        const sectionAnswers = section.questions
          .sort((a, b) => a.order - b.order)
          .map(question => {
            const answer = answers[question.id]
            if (!answer || answer.value.trim() === '') return null

            return {
              question,
              apiAnswer: {
                questionId: question.id,
                answer: answer.value === 'Có' ? 'true' : 'false',
                detail: answer.description || ''
              }
            } as GroupedAnswer
          })
          .filter((answer): answer is GroupedAnswer => answer !== null)

        if (sectionAnswers.length === 0) return null

        return {
          section,
          answers: sectionAnswers
        } as SectionGroup
      })
      .filter((group): group is SectionGroup => group !== null)

    return groupedBySection.map(({ section, answers }) => (
      <div key={section.id} className='space-y-4 border-b pb-4 last:border-b-0'>
        <h4 className='font-semibold text-gray-900'>{section.name}</h4>
        <div className='space-y-4'>
          {answers.map(({ question, apiAnswer }) => (
            <div key={question.id} className='pl-4'>
              <div className='text-sm text-gray-800'>
                Câu {question.order}: {question.content}
              </div>
              <div className='mt-2 pl-4'>
                <div className='flex items-start'>
                  <div className='mt-0.5 mr-2 h-2 w-2 rounded-full bg-red-500'></div>
                  <span className='font-medium text-sm'>{apiAnswer.answer === 'true' ? 'Có' : 'Không'}</span>
                </div>
                {apiAnswer.detail && (
                  <div className='text-gray-500 italic ml-4 mt-1 text-sm'>Mô tả: {apiAnswer.detail}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <Loader2 className='w-8 h-8 animate-spin text-red-600' />
        <p className='text-gray-600'>Đang tải thông tin...</p>
      </div>
    )
  }

  return (
    <Card className='border-none shadow-lg'>
      <CardHeader>
        <CardTitle>Xác nhận thông tin</CardTitle>
        <CardDescription>
          {hasApiData
            ? 'Thông tin đăng ký hiến máu của bạn'
            : 'Vui lòng kiểm tra lại thông tin đăng ký hiến máu của bạn'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Campaign info */}
        {selectedCampaign ? (
          <div className='space-y-4'>
            <h3 className='font-medium text-lg'>Thông tin buổi hiến máu</h3>
            <div className='bg-gray-50 rounded-lg p-4'>
              <CampaignDetails campaign={selectedCampaign} />
            </div>
          </div>
        ) : (
          <div className='bg-yellow-50 p-4 rounded-lg'>
            <p className='text-yellow-800'>Không tìm thấy thông tin buổi hiến máu</p>
          </div>
        )}

        {/* Answers display */}
        <div className='space-y-4'>
          <h3 className='font-medium text-lg'>Câu trả lời của bạn</h3>
          <div className='bg-gray-50 rounded-lg p-4 space-y-3'>{renderAnswers()}</div>
        </div>

        {/* Navigation buttons */}
        <div className='flex justify-between'>
          {!hasApiData && (
            <Button variant='outline' onClick={() => setCurrentStep(STEPS.QUESTIONNAIRE)} disabled={submitting}>
              Quay lại
            </Button>
          )}
          <Button
            className='bg-red-600 text-white hover:bg-red-700 ml-auto'
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                Đang xử lý...
              </>
            ) : hasApiData ? (
              'Đóng'
            ) : (
              'Xác nhận đăng ký'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewStep
