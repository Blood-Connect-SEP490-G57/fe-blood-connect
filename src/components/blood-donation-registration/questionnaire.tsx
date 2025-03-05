import React, { useEffect, useState, useRef} from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Question as fetchQuestions } from '@/api/campaign'

interface QuestionnaireProps {
  questionSetId: number
  onAnswerChange: (id: number, value: string) => void
  answers: Record<number, string>
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questionSetId, onAnswerChange, answers }) => {
  const [questions, setQuestions] = useState<{ id: number; question: string; options: string[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!questionSetId) return

    if (hasFetched.current) return // Nếu đã fetch thì không gọi lại
    hasFetched.current = true

    const fetchQuestionsData = async () => {
      try {
        const data = await fetchQuestions(questionSetId.toString())
        // Chuyển đổi dữ liệu trả về từ API thành định dạng mong đợi
        const formattedQuestions = data.data.questions.map((q: any, index: number) => ({
          id: index + 1,
          question: q.content,
          options: q.options || [] // Đảm bảo rằng `options` là một mảng
        }))
        setQuestions(formattedQuestions)
      } catch (err) {
        setError('Không thể tải danh sách câu hỏi')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionsData()
  }, [questionSetId])

  if (loading) return <p>Đang tải câu hỏi...</p>
  if (error) return <p className='text-red-500'>{error}</p>

  return (
    <div className='space-y-6'>
      {questions.map((q) => (
        <Card key={q.id}>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              <Label className='text-base'>{q.question}</Label>
              <RadioGroup value={answers[q.id]} onValueChange={(value) => onAnswerChange(q.id, value)}>
                {q.options.map((option, i) => (
                  <div key={i} className='flex items-center space-x-2'>
                    <RadioGroupItem value={option} id={`${q.id}-${i}`} />
                    <Label htmlFor={`${q.id}-${i}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Questionnaire
