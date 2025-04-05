import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Question as fetchQuestions } from '@/api/campaign'
import { Loader2 } from 'lucide-react'
import { QuestionSet, Section, Question } from '@/schema/question-schema'
import { Input } from '@/components/ui/input'

interface QuestionnaireProps {
  questionSetId: number
  onAnswerChange: (id: number, value: string, description?: string) => void
  answers: Record<number, { value: string; description?: string }>
  onQuestionsLoaded?: (count: number) => void
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questionSetId, onAnswerChange, answers, onQuestionsLoaded }) => {
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!questionSetId || hasFetched.current) return
    hasFetched.current = true

    const fetchQuestionsData = async () => {
      try {
        const response = await fetchQuestions(questionSetId.toString())

        if (response.success && response.data) {
          setQuestionSet(response.data)
          const totalQuestions = response.data.sections
            .reduce((total, section) => total + section.questions.length, 0)
          onQuestionsLoaded?.(totalQuestions)
        } else {
          setError('Cấu trúc dữ liệu không hợp lệ')
        }
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Không thể tải danh sách câu hỏi')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionsData()
  }, [questionSetId, onQuestionsLoaded])

  const handleAnswerChange = (questionId: number, value: string, description?: string) => {
    onAnswerChange(questionId, value, description)
  }

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id]
    const isAnswered = currentAnswer?.value.trim() !== ''

    return (
      <Card key={question.id} className={`overflow-hidden ${!isAnswered ? 'border-red-200' : ''}`}>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            <Label className='text-base font-medium'>
              Câu {question.order}: {question.content}
              <span className='text-red-500 ml-1'>*</span>
            </Label>

            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id={`question-${question.id}-co`}
                  checked={currentAnswer?.value === 'Có'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAnswerChange(question.id, 'Có')
                    } else if (currentAnswer?.value === 'Có') {
                      handleAnswerChange(question.id, '')
                    }
                  }}
                  className='text-red-600 border-black data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-red-600'
                />
                <Label htmlFor={`question-${question.id}-co`} className='cursor-pointer'>
                  Có
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id={`question-${question.id}-khong`}
                  checked={currentAnswer?.value === 'Không'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAnswerChange(question.id, 'Không')
                    } else if (currentAnswer?.value === 'Không') {
                      handleAnswerChange(question.id, '')
                    }
                  }}
                  className='text-red-600 border-black data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-red-600'
                />
                <Label htmlFor={`question-${question.id}-khong`} className='cursor-pointer'>
                  Không
                </Label>
              </div>
            </div>

            {question.hasDetail && currentAnswer?.value === 'Có' && (
              <div className='mt-2 ml-6'>
                <Input
                  type='text'
                  className='border border-gray-300 rounded-md p-2 w-full'
                  placeholder='Nhập thông tin chi tiết...'
                  value={currentAnswer?.description || ''}
                  onChange={(e) => handleAnswerChange(question.id, 'Có', e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSection = (section: Section) => (
    <div key={section.id} className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900'>{section.name}</h3>
      <div className='space-y-4'>{section.questions.sort((a, b) => a.order - b.order).map(renderQuestion)}</div>
    </div>
  )

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-8'>
        <Loader2 className='w-8 h-8 animate-spin text-red-600 mb-2' />
        <p className='text-gray-600'>Đang tải câu hỏi...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-4 bg-red-50 rounded-lg'>
        <p className='text-red-500'>{error}</p>
      </div>
    )
  }

  if (!questionSet) {
    return null
  }

  return (
    <div className='space-y-8'>
      {questionSet.sections
        .sort((a, b) => a.order - b.order)
        .map(renderSection)}
    </div>
  )
}

export default Questionnaire
