import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignDetails from '@/components/blood-donation-registration/campaign-details';
import { questions } from './questionnaire';
import { STEPS } from '@/pages/BloodDonationRegistration';

type Campaign = {
  id: string;
  name: string;
  location: string;
  date: string;
  timeSlot: string;
  description: string;
  currentDonors: number;
  maxDonors: number;
  requirements: string[];
};

type Step = typeof STEPS[keyof typeof STEPS];

const ReviewStep = ({ selectedCampaign, answers, setCurrentStep }: { selectedCampaign: Campaign | null, answers: Record<string, string>, setCurrentStep: Dispatch<SetStateAction<Step>> }) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>Xác nhận thông tin</CardTitle>
        <CardDescription>
          Vui lòng kiểm tra lại thông tin đăng ký hiến máu của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedCampaign && (
          <div className="bg-gray-50 rounded-lg p-4">
            <CampaignDetails campaign={selectedCampaign} />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Câu trả lời của bạn</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {Object.entries(answers).map(([questionId, answer]) => (
              <div key={questionId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {questions.find(q => q.id === questionId)?.question}
                </span>
                <span className="font-medium">{answer}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(2)}
          >
            Quay lại
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => setCurrentStep(4)}
          >
            Xác nhận đăng ký
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStep; 