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

  // Tìm tất cả sub_question_id thuộc về một câu hỏi
  const getSubQuestionIds = (question: Question): number[] => {
    return question.subs.map(sub => sub.sub_question_id);
  }

  // Xử lý khi chọn câu trả lời cho SINGLE_CHOICE
  const handleSingleChoiceChange = (question: Question, selectedOption: QuestionOption) => {
    // Lấy tất cả sub_question_ids của câu hỏi này
    const allSubIds = getSubQuestionIds(question);
    
    // Xóa tất cả các câu trả lời hiện có của câu hỏi này
    allSubIds.forEach(subId => {
      if (answers[subId]) {
        // Xóa câu trả lời cũ bằng cách gán giá trị rỗng
        onAnswerChange(subId, '', undefined);
      }
    });
    
    // Thêm câu trả lời mới
    onAnswerChange(selectedOption.sub_question_id, selectedOption.content);
  }

  // Xử lý khi thay đổi mô tả
  const handleDescriptionChange = (subQuestionId: number, content: string, description: string) => {
    onAnswerChange(subQuestionId, content, description);
  }

  // Lấy sub_question_id đã được chọn cho câu hỏi SINGLE_CHOICE
  const getSelectedSubIdForQuestion = (question: Question): number | undefined => {
    const subIds = getSubQuestionIds(question);
    return subIds.find(subId => answers[subId] !== undefined);
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
                  value={getSelectedSubIdForQuestion(q)?.toString() || ""}
                  onValueChange={(value) => {
                    // Tìm option tương ứng với value đã chọn
                    const selectedOption = q.subs.find(
                      sub => sub.sub_question_id.toString() === value
                    );
                    if (selectedOption) {
                      handleSingleChoiceChange(q, selectedOption);
                    }
                  }}
                >
                  {(q.subs || []).map((option, i) => (
                    <div key={i} className='flex flex-wrap items-center space-x-2'>
                      <RadioGroupItem 
                        value={option.sub_question_id.toString()} 
                        id={`${q.id}-${i}`}
                      />
                      <Label htmlFor={`${q.id}-${i}`}>{option.content}</Label>
                      
                      {option.has_description && 
                       answers[option.sub_question_id] !== undefined && (
                        <div className="w-full mt-2 ml-6">
                          <input
                            type='text'
                            className='border border-gray-300 rounded-md p-2 w-full'
                            placeholder='Nhập thông tin khác...'
                            value={answers[option.sub_question_id]?.description || ''}
                            onChange={(e) => handleDescriptionChange(
                              option.sub_question_id, 
                              option.content, 
                              e.target.value
                            )}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className='space-y-2'>
                  {(q.subs || []).map((option, i) => {
                    const isChecked = answers[option.sub_question_id] !== undefined;
                    
                    return (
                      <div key={i} className='flex flex-wrap items-center space-x-2'>
                        <Checkbox
                          id={`${q.id}-${i}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onAnswerChange(option.sub_question_id, option.content)
                            } else {
                              // Xóa đáp án này
                              onAnswerChange(option.sub_question_id, '')
                            }
                          }}
                        />
                        <Label htmlFor={`${q.id}-${i}`}>{option.content}</Label>
                        
                        {option.has_description && isChecked && (
                          <div className="w-full mt-2 ml-6">
                            <input
                              type='text'
                              className='border border-gray-300 rounded-md p-2 w-full'
                              placeholder='Nhập thông tin khác...'
                              value={answers[option.sub_question_id]?.description || ''}
                              onChange={(e) => handleDescriptionChange(
                                option.sub_question_id,
                                option.content,
                                e.target.value
                              )}
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
