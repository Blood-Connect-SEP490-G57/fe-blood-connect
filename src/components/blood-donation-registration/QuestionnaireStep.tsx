import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Questionnaire from '@/components/blood-donation-registration/questionnaire'

interface QuestionnaireStepProps {
  questionSetId: number 
  answers: Record<number, string> 
  handleAnswerChange: (questionId: number, answer: string) => void 
  setCurrentStep: (step: number) => void
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  questionSetId,
  answers,
  handleAnswerChange,
  setCurrentStep
}) => {
  // Log để debug
  console.log(`Rendering QuestionnaireStep with ${Object.keys(answers).length} answers`);
  
  return (
    <>
      <Card className='border-none shadow-lg mb-20'> {/* Thêm margin-bottom lớn */}
        <CardHeader>
          <CardTitle>Bảng câu hỏi sức khỏe</CardTitle>
          <CardDescription>Vui lòng trả lời các câu hỏi sau để đảm bảo bạn đủ điều kiện hiến máu</CardDescription>
        </CardHeader>
        <CardContent>
          <Questionnaire questionSetId={questionSetId} onAnswerChange={handleAnswerChange} answers={answers} />
        </CardContent>
      </Card>
      
      {/* Debugging section */}
      <div className='border border-red-200 p-4 mb-4 rounded'>
        <p>Debug info: {Object.keys(answers).length} answers</p>
        <div className='flex space-x-2 mt-2'>
          <Button size="sm" variant="outline">Debug Button</Button>
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className='w-full bg-white p-4 border-t border-gray-200 flex justify-between mt-4'>
        <Button variant='outline' onClick={() => setCurrentStep(0)}>
          Quay lại
        </Button>
        <Button
          className='bg-red-600 text-white hover:bg-red-700'
          onClick={() => setCurrentStep(2)}
          disabled={Object.keys(answers).length < 3}
        >
          Tiếp tục ({Object.keys(answers).length}/3)
        </Button>
      </div>
    </>
  )
}

export default QuestionnaireStep