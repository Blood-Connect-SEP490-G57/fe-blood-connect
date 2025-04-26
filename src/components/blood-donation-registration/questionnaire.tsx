import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Question as fetchQuestions } from '@/api/campaign'
import { HelpCircle, Star } from 'lucide-react'
import { QuestionSet, Section, Question } from '@/schema/question-schema'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { motion } from 'framer-motion'
import Loading from '../warnings/loading'

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

  const renderQuestion = (question: Question, index: number) => {
    const currentAnswer = answers[question.id]
    const isAnswered = currentAnswer?.value.trim() !== ''

    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <Card 
          className={`overflow-hidden border transition-all duration-200 ${!isAnswered ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
        >
          <CardContent className='p-5'>
            <div className='space-y-4'>
              <div className='flex items-start'>
                <div className='flex-1'>
                  <Label className='text-base font-medium flex items-start gap-2'>
                    <span className='bg-red-100 text-red-600 px-2 rounded-md text-sm font-medium mr-1 shrink-0'>
                      {question.order}
                    </span>
                    <span>{question.content}</span>
                    <div className='bg-red-800 text-white px-2 rounded-md text-sm font-medium ml-1 shrink-0'>
                      <Star className='w-4 h-4' />
                    </div>
                  </Label>
                  
                  {question.hasDetail && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex items-center ml-2 text-gray-400 hover:text-gray-600 cursor-help'>
                            <HelpCircle className='h-4 w-4' />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className='bg-white p-3 text-gray-700 shadow-lg rounded-lg max-w-xs'>
                          <p>Câu hỏi này yêu cầu thông tin chi tiết nếu bạn trả lời "Có"</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className='flex items-center justify-start space-x-6'>
                <div className='flex items-center space-x-2'>
                  <div className='relative'>
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
                      className='h-5 w-5 text-red-600 border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-red-600 rounded-md'
                    />
                    {currentAnswer?.value === 'Có' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='absolute -right-1 -top-1 h-3 w-3 bg-green-500 rounded-full border border-white'
                      />
                    )}
                  </div>
                  <Label htmlFor={`question-${question.id}-co`} className='cursor-pointer font-medium text-gray-700'>
                    Có
                  </Label>
                </div>

                <div className='flex items-center space-x-2'>
                  <div className='relative'>
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
                      className='h-5 w-5 text-red-600 border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-red-600 rounded-md'
                    />
                    {currentAnswer?.value === 'Không' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='absolute -right-1 -top-1 h-3 w-3 bg-green-500 rounded-full border border-white'
                      />
                    )}
                  </div>
                  <Label htmlFor={`question-${question.id}-khong`} className='cursor-pointer font-medium text-gray-700'>
                    Không
                  </Label>
                </div>
              </div>

              {question.hasDetail && currentAnswer?.value === 'Có' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className='ml-2 pl-4 border-l-2 border-red-200'
                >
                  <Label htmlFor={`detail-${question.id}`} className='text-sm text-gray-600 mb-1 block'>
                    Vui lòng cung cấp thêm chi tiết:
                  </Label>
                  <Input
                    id={`detail-${question.id}`}
                    type='text'
                    className='border border-gray-200 rounded-lg p-2 w-full focus:border-red-500 focus:ring-1 focus:ring-red-200'
                    placeholder='Nhập thông tin chi tiết...'
                    value={currentAnswer?.description || ''}
                    onChange={(e) => handleAnswerChange(question.id, 'Có', e.target.value)}
                  />
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderSection = (section: Section, sectionIndex: number) => (
    <div key={section.id} className='space-y-5'>
      <div className='flex items-center py-2'>
        <div className='h-px flex-1 bg-gray-200'></div>
        <h3 className='mx-4 text-lg font-semibold text-gray-700 flex items-center gap-2 whitespace-nowrap'>
          <span className='bg-red-100 text-red-600 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold'>
            {sectionIndex + 1}
          </span>
          {section.name}
        </h3>
        <div className='h-px flex-1 bg-gray-200'></div>
      </div>
      <div className='space-y-4'>{section.questions.sort((a, b) => a.order - b.order).map((q, i) => renderQuestion(q, i))}</div>
    </div>
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className='p-6 bg-red-50 rounded-xl text-center'>
        <div className='text-red-500 text-4xl mb-2'>⚠️</div>
        <h3 className='text-lg font-medium text-red-700 mb-2'>Đã xảy ra lỗi</h3>
        <p className='text-red-600 mb-4'>{error}</p>
        <button 
          className='bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors'
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
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
        .map((section, index) => renderSection(section, index))}
    </div>
  )
}

export default Questionnaire
