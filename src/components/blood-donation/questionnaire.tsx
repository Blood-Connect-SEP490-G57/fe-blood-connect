import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Question {
  id: string
  question: string
  options: string[]
}

export const questions: Question[] = [
  {
    id: 'q1',
    question: 'Bạn đã từng hiến máu chưa?',
    options: ['Chưa từng', 'Đã từng']
  },
  {
    id: 'q2',
    question: 'Bạn có đang mắc bệnh mãn tính nào không?',
    options: ['Không', 'Có']
  },
  {
    id: 'q3',
    question: 'Bạn có đang sử dụng thuốc kháng sinh không?',
    options: ['Không', 'Có']
  },
  // Thêm các câu hỏi khác...
]

interface QuestionnaireProps {
  onAnswerChange: (questionId: string, answer: string) => void
  answers: Record<string, string>
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onAnswerChange, answers }) => {
  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <Card key={q.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label className="text-base">{q.question}</Label>
              <RadioGroup
                value={answers[q.id]}
                onValueChange={(value) => onAnswerChange(q.id, value)}
              >
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
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