import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Question as fetchQuestions } from '@/api/campaign'
import { Loader2 } from 'lucide-react'

interface QuestionnaireProps {
  questionSetId: number
  onAnswerChange: (id: number, value: string, description?: string) => void
  answers: Record<number, { value: string; description?: string }>
}

interface QuestionOption {
  sub_question_id: number
  content: string
  has_description: boolean
}

interface Question {
  id: number
  content: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE'
  subs: QuestionOption[]
  order: number
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questionSetId, onAnswerChange, answers }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!questionSetId) return

    if (hasFetched.current) return // Nếu đã fetch thì không gọi lại
    hasFetched.current = true

    const fetchQuestionsData = async () => {
      try {
        const response = await fetchQuestions(questionSetId.toString())

        if (response.success && response.data && Array.isArray(response.data.questions)) {
          const formattedQuestions = response.data.questions.map((item: any) => ({
            id: item.id,
            content: item.content,
            type: item.type,
            subs: item.subs || [],
            order: item.order
          }))

          // Sắp xếp câu hỏi theo thứ tự
          formattedQuestions.sort((a, b) => a.order - b.order)
          setQuestions(formattedQuestions)
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
  }, [questionSetId])

  // Tìm sub question ID đã chọn cho một câu hỏi
  const getSelectedSubIdForQuestion = (question: Question): number | undefined => {
    for (const sub of question.subs) {
      if (answers[sub.sub_question_id]?.value === sub.content) {
        return sub.sub_question_id
      }
    }
    return undefined
  }

  // Xử lý khi chọn câu trả lời cho SINGLE_CHOICE
  const handleSingleChoiceChange = (question: Question, selectedOption: QuestionOption) => {
    // Xóa câu trả lời cũ
    for (const sub of question.subs) {
      if (sub.sub_question_id !== selectedOption.sub_question_id && answers[sub.sub_question_id]) {
        onAnswerChange(sub.sub_question_id, '')
      }
    }

    // Thêm câu trả lời mới
    onAnswerChange(
      selectedOption.sub_question_id,
      selectedOption.content,
      selectedOption.has_description ? '' : undefined
    )
  }

  // Xử lý khi thay đổi mô tả
  const handleDescriptionChange = (subQuestionId: number, content: string, description: string) => {
    onAnswerChange(subQuestionId, content, description)
  }

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

  return (
    <div className='space-y-6'>
      {questions.map((q) => (
        <Card key={q.id} className='overflow-hidden'>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              <Label className='text-base font-medium'>
                Câu {q.order}: {q.content}
              </Label>

              {q.type === 'SINGLE_CHOICE' ? (
                <div className='space-y-2'>
                  {q.subs.map((option, i) => {
                    // Dùng selectedId để kiểm tra active
                    const selectedId = getSelectedSubIdForQuestion(q)
                    const isSelected = selectedId === option.sub_question_id

                    return (
                      <div key={i} className='flex flex-col'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='radio'
                            id={`${q.id}-${i}`}
                            name={`question-${q.id}`}
                            checked={isSelected}
                            className='h-4 w-4 text-red-600 focus:ring-red-600'
                            onChange={() => handleSingleChoiceChange(q, option)}
                          />
                          <Label htmlFor={`${q.id}-${i}`} className='cursor-pointer'>
                            {option.content}
                          </Label>
                        </div>

                        {/* Luôn dành chỗ cho input description để tránh nhảy layout */}
                        <div
                          className={`w-full mt-2 ml-6 ${
                            isSelected && option.has_description ? 'block' : 'hidden'
                          } h-[44px]`}
                        >
                          <input
                            type='text'
                            className='border border-gray-300 rounded-md p-2 w-full'
                            placeholder='Nhập thông tin khác...'
                            value={answers[option.sub_question_id]?.description || ''}
                            onChange={(e) =>
                              handleDescriptionChange(option.sub_question_id, option.content, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='space-y-2'>
                  {(q.subs || []).map((option, i) => {
                    const isChecked =
                      answers[option.sub_question_id] !== undefined &&
                      answers[option.sub_question_id].value.trim() !== ''

                    return (
                      <div key={i} className='flex flex-col'>
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            id={`${q.id}-${i}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onAnswerChange(option.sub_question_id, option.content)
                              } else {
                                onAnswerChange(option.sub_question_id, '')
                              }
                            }}
                            className='text-blue-600 border-black data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus:ring-blue-600'
                          />
                          <Label htmlFor={`${q.id}-${i}`} className='cursor-pointer'>
                            {option.content}
                          </Label>
                        </div>

                        <div
                          className={`w-full mt-2 ml-6 ${
                            isChecked && option.has_description ? 'block' : 'hidden'
                          } h-[44px]`}
                        >
                          <input
                            type='text'
                            className='border border-gray-300 rounded-md p-2 w-full'
                            placeholder='Nhập thông tin khác...'
                            value={answers[option.sub_question_id]?.description || ''}
                            onChange={(e) =>
                              handleDescriptionChange(option.sub_question_id, option.content, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Questionnaire
