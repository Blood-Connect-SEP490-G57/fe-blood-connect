import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { Question as fetchQuestions, getAnswersByCampaignId, submitAnswers } from '@/api/campaign'
import { toast } from '@/components/ui/use-toast'
import { ChevronLeft, CheckCircle, ClipboardList, AlertTriangle } from 'lucide-react'
import { Question, QuestionSet, Section } from '@/schema/question-schema'
import { AnswerType, ApiAnswerType } from '@/schema/answer-schema'
import ScrollToTop from '../scrollToTop'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Loading from '../warnings/loading'
import { getUnreadCount } from '@/api/notification'
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications'

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
  const { invalidateUnreadCount } = useUnreadNotifications()

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
        // Hiển thị đồng thời 2 toast
        toast({
          title: 'Đăng ký thành công',
          description: 'Đăng ký hiến máu của bạn đã được ghi nhận',
          variant: 'default'
        })

        const unreadCount = await getUnreadCount()
        // Invalidate the unread count query to trigger a refetch
        await invalidateUnreadCount()
        
        if (unreadCount > 0) {
          setTimeout(() => {
            toast({
              title: 'Thông báo mới',
              description: `Bạn có ${unreadCount} thông báo mới.`,
              variant: 'default',
            })
          }, 3000) // Delay for 3 giây before showing the next toast
        }
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
          <div
            key={questionInfo.id}
            className='flex flex-col space-y-2 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0'
          >
            <div className='flex items-start gap-3'>
              <Badge variant='outline' className='bg-red-50 text-red-600 border-red-100 font-medium'>
                {questionInfo.order}
              </Badge>
              <div className='flex-1'>
                <div className='text-gray-800 font-medium'>{questionInfo.content}</div>
                <div className='pl-0 mt-2 space-y-2'>
                  {answers.map((answer) => (
                    <div key={answer.questionId} className='text-sm'>
                      <div className='flex items-start'>
                        <div className='mt-1.5 mr-2 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0'></div>
                        <div>
                          <span
                            className={`font-medium ${answer.answer === 'true' ? 'text-green-600' : 'text-gray-700'}`}
                          >
                            {answer.answer === 'true' ? 'Có' : 'Không'}
                          </span>
                          {answer.detail && <div className='text-gray-600 italic mt-1 ml-0'>{answer.detail}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
    }

    if (!questionSet || Object.keys(answers).length === 0) {
      return (
        <div className='bg-yellow-50 p-4 rounded-xl'>
          <div className='flex items-center gap-2 text-yellow-700'>
            <AlertTriangle className='h-5 w-5 text-yellow-600' />
            <p className='font-medium'>Chưa có câu trả lời nào</p>
          </div>
          <p className='text-yellow-600 mt-2 text-sm'>Vui lòng quay lại bước trước để hoàn thành bảng câu hỏi.</p>
        </div>
      )
    }

    // Group answers by section
    type GroupedAnswer = {
      question: Question
      apiAnswer: ApiAnswerType
    }

    type SectionGroup = {
      section: Section
      answers: GroupedAnswer[]
    }

    const groupedBySection = questionSet.sections
      .sort((a, b) => a.order - b.order)
      .map((section) => {
        const sectionAnswers = section.questions
          .sort((a, b) => a.order - b.order)
          .map((question) => {
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

    return groupedBySection.map(({ section, answers: sectionAnswers }, sectionIndex) => (
      <motion.div
        key={section.id}
        className='space-y-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 mb-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: sectionIndex * 0.1 }}
      >
        <div className='flex flex-row items-center'>
          <Badge className='bg-red-100 text-red-600 border-none whitespace-nowrap'>Phần {section.order}</Badge>
          <span className='text-sm font-bold text-gray-800 ml-2'>{section.name}</span>
        </div>

        <div className='space-y-4 pl-2 mt-2'>
          {sectionAnswers.map(({ question, apiAnswer }, questionIndex) => (
            <motion.div
              key={question.id}
              className='pl-4 border-l-2 border-red-100'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sectionIndex * 0.1 + questionIndex * 0.05 }}
            >
              <div className='flex items-start gap-2'>
                <Badge variant='outline' className='bg-red-50 text-red-600 border-red-100 font-medium'>
                  {question.order}
                </Badge>
                <div className='flex-1'>
                  <div className='text-sm text-gray-800'>{question.content}</div>
                  <div className='mt-2 pl-0 flex items-start gap-2'>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `}>
                      {apiAnswer.answer === 'true' ? 'Có' : 'Không'}
                    </span>

                    {apiAnswer.detail && (
                      <span className='text-gray-600 italic text-xs flex-1'>
                        <span className='font-medium text-gray-700'>Chi tiết:</span> {apiAnswer.detail}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ))
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <ScrollToTop />
      <div className='overflow-hidden'>
        <div className='p-4'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='bg-red-100 rounded-full p-2'>
              <ClipboardList className='h-5 w-5 text-red-600' />
            </div>
            <div>
              <h2 className='font-semibold text-gray-900'>Xác nhận thông tin</h2>
              <p className='text-sm text-gray-500 mt-0.5'>
                {hasApiData
                  ? 'Thông tin đăng ký hiến máu của bạn'
                  : 'Vui lòng kiểm tra lại thông tin đăng ký hiến máu của bạn'}
              </p>
            </div>
          </div>

          {hasApiData && (
            <Badge className='bg-green-100 text-green-700 border-green-200 mt-2'>
              <CheckCircle className='mr-1 h-3 w-3' />
              Đã đăng ký
            </Badge>
          )}
        </div>

        <div>
          {/* Campaign info */}
          {selectedCampaign ? (
            <CampaignDetails campaign={selectedCampaign} />
          ) : (
            <div className='bg-yellow-50 rounded-xl'>
              <div className='flex items-center gap-2 text-yellow-700'>
                <AlertTriangle className='h-5 w-5 text-yellow-600' />
                <p className='font-medium'>Không tìm thấy thông tin buổi hiến máu</p>
              </div>
            </div>
          )}

          {/* Answers display */}
          <div className='space-y-4 mt-6 bg-white p-4 rounded-xl'>
            <div className='flex items-center gap-2'>
              <ClipboardList className='h-5 w-5 text-red-500' />
              <h3 className='font-medium text-gray-900'>Câu trả lời của bạn</h3>
            </div>
            <div>
              <div className='p-4 divide-y divide-gray-100'>{renderAnswers()}</div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className='flex justify-between pt-4'>
            {!hasApiData && (
              <Button
                variant='outline'
                onClick={() => setCurrentStep(STEPS.QUESTIONNAIRE)}
                disabled={submitting}
                className='rounded-xl'
              >
                <ChevronLeft className='mr-2 h-4 w-4' />
                Quay lại
              </Button>
            )}
            <Button
              className='rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 transition ml-auto'
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
        </div>
      </div>
    </div>
  )
}

export default ReviewStep
