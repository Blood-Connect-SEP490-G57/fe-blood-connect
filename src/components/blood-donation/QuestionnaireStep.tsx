import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Questionnaire from '@/components/blood-donation/questionnaire';

const QuestionnaireStep = ({ answers, handleAnswerChange, setCurrentStep }) => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Bảng câu hỏi sức khỏe</CardTitle>
          <CardDescription>
            Vui lòng trả lời các câu hỏi sau để đảm bảo bạn đủ điều kiện hiến máu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Questionnaire
            onAnswerChange={handleAnswerChange}
            answers={answers}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          Quay lại
        </Button>
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={() => setCurrentStep(3)}
          disabled={Object.keys(answers).length < 3}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireStep; 