import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { STEPS } from '@/pages/BloodDonationRegistration'
import { Question as fetchQuestions, getAnswersByCampaignId, submitAnswers } from '@/api/campaign'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { AnswerType } from '@/schema/answer-schema'

// Các interfaces
interface Question {
  id: number
  content: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE'
  subs: { sub_question_id: number; content: string; has_description: boolean }[]
  order: number
}

interface ApiAnswer {
  id: number
  questionText: string
  subQuestionContent: string
  answerText: string
  questionOrder: number
  description?: string
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

interface ReviewStepProps {
  selectedCampaign: Campaign | null
  questionSetId: number
  answers: Record<number, { value: string; description?: string }>
  setCurrentStep: Dispatch<SetStateAction<Step>>
}

const ReviewStep: React.FC<ReviewStepProps> = ({ selectedCampaign, questionSetId, answers, setCurrentStep }) => {
  // State hooks
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [apiAnswers, setApiAnswers] = useState<ApiAnswer[]>([])
  const [hasApiData, setHasApiData] = useState(false)
  const hasFetched = useRef(false)

  // Fetch data effect
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
            const hasAnswers = response.success && Array.isArray(response.data) && response.data.length > 0

            if (hasAnswers) {
              const formattedAnswers: ApiAnswer[] = response.data.answers.map((answer: any) => ({
                id: answer.id,
                questionText: answer.questionText,
                subQuestionContent: answer.subQuestionContent,
                answerText: answer.answerText,
                questionOrder: answer.questionOrder,
                description: answer.description
              }))
              setApiAnswers(formattedAnswers)
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
        if (questionsResponse.success && questionsResponse.data?.questions) {
          setQuestions(
            questionsResponse.data.questions.map((q: any) => ({
              id: q.id,
              content: q.content,
              type: q.type,
              subs: q.subs || [],
              order: q.order
            }))
          )
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

  // Xử lý nút xác nhận đăng ký - Gửi API ở đây
  const handleConfirm = async () => {
    if (hasApiData) {
      // Nếu đã có dữ liệu từ API, chỉ cần chuyển sang trang Success
      setCurrentStep(STEPS.SUCCESS)
      return
    }

    try {
      setSubmitting(true)

      // Lọc ra những câu trả lời có giá trị (không rỗng)
      const validAnswers = Object.entries(answers).filter(([_, data]) => data.value.trim() !== '')

      // Chuyển đổi câu trả lời thành định dạng API yêu cầu
      const formattedAnswers: AnswerType[] = validAnswers.map(([sub_question_id, data]) => ({
        subQuestionId: parseInt(sub_question_id),
        answerText: data.value,
        description: data.description || ''
      }))

      // Tạo payload
      const payload = {
        answers: formattedAnswers,
        campaignId: selectedCampaign?.id || 0
      }

      // Gọi API để lưu câu trả lời
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

  // Loading state
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <Loader2 className='w-8 h-8 animate-spin text-red-600' />
        <p className='text-gray-600'>Đang tải thông tin...</p>
      </div>
    )
  }

  // Render function for answer list
  const renderAnswers = () => {
    if (hasApiData) {
      // Nhóm câu trả lời theo questionText (câu hỏi)
      const groupedAnswers = apiAnswers.reduce((acc, answer) => {
        if (!acc[answer.questionText]) {
          acc[answer.questionText] = {
            questionText: answer.questionText,
            questionOrder: answer.questionOrder,
            answers: []
          }
        }
        acc[answer.questionText].answers.push(answer)
        return acc
      }, {} as Record<string, { questionText: string; questionOrder: number; answers: ApiAnswer[] }>)

      // Chuyển đổi từ object sang array và sắp xếp theo questionOrder
      return Object.values(groupedAnswers)
        .sort((a, b) => a.questionOrder - b.questionOrder)
        .map((group) => (
          <div key={group.questionText} className='flex flex-col space-y-2 border-b pb-3 last:border-b-0'>
            <div className='text-sm text-gray-800 font-medium'>
              Câu {group.questionOrder}: {group.questionText}
            </div>
            <div className='pl-4 space-y-2'>
              {group.answers.map((answer, idx) => (
                <div key={`${answer.id}-${idx}`} className='text-sm'>
                  <div className='flex items-start'>
                    <div className='mt-0.5 mr-2 h-2 w-2 rounded-full bg-red-500'></div>
                    <span className='font-medium'>{answer.subQuestionContent}</span>
                  </div>
                  {answer.description && (
                    <div className='text-gray-500 italic ml-4 mt-1'>Mô tả: {answer.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
    }

    if (Object.keys(answers).length === 0) {
      return (
        <div className='bg-yellow-50 p-4 rounded-lg'>
          <p className='text-yellow-800'>Chưa có câu trả lời nào</p>
        </div>
      )
    }

    // Nhóm các câu trả lời theo câu hỏi chính
    const groupedAnswers = Object.entries(answers)
      .filter(([_, data]) => data.value.trim() !== '')
      .reduce(
        (groups, [subQuestionId, answer]) => {
          // Tìm câu hỏi chứa subQuestionId này
          const questionWithSub = questions.find((q) =>
            q.subs.some((s) => s.sub_question_id === parseInt(subQuestionId))
          )

          if (!questionWithSub) return groups

          const questionId = questionWithSub.id

          // Khởi tạo nhóm nếu chưa có
          if (!groups[questionId]) {
            groups[questionId] = {
              question: questionWithSub,
              subAnswers: []
            }
          }

          // Tìm sub question cụ thể
          const subQuestion = questionWithSub.subs.find((s) => s.sub_question_id === parseInt(subQuestionId))

          if (subQuestion) {
            groups[questionId].subAnswers.push({
              subQuestionId: parseInt(subQuestionId),
              subContent: subQuestion.content,
              value: answer.value,
              description: answer.description
            })
          }

          return groups
        },
        {} as Record<
          number,
          {
            question: Question
            subAnswers: Array<{
              subQuestionId: number
              subContent: string
              value: string
              description?: string
            }>
          }
        >
      )

    // Chuyển đổi từ object sang array và sắp xếp theo order
    return Object.values(groupedAnswers)
      .sort((a, b) => a.question.order - b.question.order)
      .map((group) => (
        <div key={group.question.id} className='flex flex-col space-y-2 border-b pb-3 last:border-b-0'>
          <div className='text-md text-gray-800 font-bold'>
            Câu {group.question.order}: {group.question.content}
          </div>
          <div className='pl-4 space-y-2'>
            {group.subAnswers.map((subAnswer) => (
              <div key={subAnswer.subQuestionId} className='text-sm'>
                <div className='flex items-start'>
                  <div className='mt-0.5 mr-2 h-2 w-2 rounded-full bg-red-500'></div>
                  <span className='font-medium'>{subAnswer.subContent}</span>
                </div>
                {subAnswer.description && (
                  <div className='text-gray-500 italic ml-4 mt-1'>Mô tả: {subAnswer.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))
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
