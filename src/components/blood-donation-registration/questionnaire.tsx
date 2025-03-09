import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Question as fetchQuestions } from '@/api/campaign'

interface QuestionnaireProps {
  questionSetId: number
  onAnswerChange: (id: number, value: string, description?: string) => void
  answers: Record<number, { value: string; description?: string }>
}

interface QuestionOption {
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
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})

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
            subs: item.subs,
            order: item.order
          }))

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

  const handleDescriptionChange = (questionId: number, optionContent: string, description: string) => {
    // Lưu mô tả theo format "questionId-optionContent"
    const key = `${questionId}-${optionContent}`
    setDescriptions(prev => ({
      ...prev,
      [key]: description
    }))
    
    // Tìm giá trị hiện tại của câu trả lời
    const currentAnswer = answers[questionId]?.value || ''
    
    // Cập nhật câu trả lời với mô tả mới
    onAnswerChange(questionId, currentAnswer, description)
  }

  if (loading) return <p>Đang tải câu hỏi...</p>
  if (error) return <p className='text-red-500'>{error}</p>

  return (
    <div className='space-y-6'>
      {questions.map((q) => (
        <Card key={q.id}>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              <Label className='text-base font-medium'>{q.content}</Label>
              {q.type === 'SINGLE_CHOICE' ? (
                <RadioGroup 
                  value={answers[q.id]?.value || ''} 
                  onValueChange={(value) => onAnswerChange(q.id, value)}
                >
                  {(q.subs || []).map((option, i) => (
                    <div key={i} className='flex flex-wrap items-center space-x-2'>
                      <RadioGroupItem value={option.content} id={`${q.id}-${i}`} />
                      <Label htmlFor={`${q.id}-${i}`}>{option.content}</Label>
                      
                      {option.has_description === true && answers[q.id]?.value === option.content && (
                        <div className="w-full mt-2 ml-6">
                          <input
                            type='text'
                            className='border border-gray-300 rounded-md p-2 w-full'
                            placeholder='Nhập thông tin khác...'
                            value={descriptions[`${q.id}-${option.content}`] || ''}
                            onChange={(e) => handleDescriptionChange(q.id, option.content, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className='space-y-2'>
                  {(q.subs || []).map((option, i) => {
                    const isChecked = answers[q.id]?.value?.includes(option.content) || false
                    
                    return (
                      <div key={i} className='flex flex-wrap items-center space-x-2'>
                        <Checkbox
                          id={`${q.id}-${i}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const currentValues = answers[q.id]?.value ? answers[q.id].value.split(',') : []
                            let newValues
                            if (checked) {
                              newValues = [...currentValues, option.content]
                            } else {
                              newValues = currentValues.filter((v) => v !== option.content)
                            }
                            onAnswerChange(q.id, newValues.join(','))
                          }}
                        />
                        <Label htmlFor={`${q.id}-${i}`}>{option.content}</Label>
                        
                        {option.has_description === true && isChecked && (
                          <div className="w-full mt-2 ml-6">
                            <input
                              type='text'
                              className='border border-gray-300 rounded-md p-2 w-full'
                              placeholder='Nhập thông tin khác...'
                              value={descriptions[`${q.id}-${option.content}`] || ''}
                              onChange={(e) => handleDescriptionChange(q.id, option.content, e.target.value)}
                            />
                          </div>
                        )}
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
