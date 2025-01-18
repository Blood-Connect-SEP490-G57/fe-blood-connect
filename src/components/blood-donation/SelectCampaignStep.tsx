import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CampaignDetails from '@/components/blood-donation/campaign-details';

const SelectCampaignStep = ({ searchQuery, setSearchQuery, selectedCampaign, setSelectedCampaign, setCurrentStep }) => {
  const campaigns = [
    {
      id: '1',
      name: 'Hiến máu nhân đạo tại Bệnh viện Bạch Mai',
      location: 'Bệnh viện Bạch Mai, Hà Nội',
      date: '2024-03-20',
      timeSlot: '08:00 - 11:00',
      description: 'Chương trình hiến máu nhân đạo tổ chức định kỳ tại Bệnh viện Bạch Mai. Chúng tôi mong muốn thu thập được nguồn máu dự trữ để phục vụ công tác cấp cứu và điều trị.',
      currentDonors: 15,
      maxDonors: 50,
      requirements: [
        'Độ tuổi từ 18-60',
        'Cân nặng trên 45kg',
        'Không mắc các bệnh truyền nhiễm',
        'Không sử dụng thuốc kháng sinh trong 7 ngày gần đây'
      ]
    },
    {
      id: '2',
      name: 'Ngày hội hiến máu tình nguyện',
      location: 'Trung tâm Y tế Quận Hoàn Kiếm',
      date: '2024-03-25',
      timeSlot: '09:00 - 12:00',
      description: 'Ngày hội hiến máu tình nguyện với chủ đề "Một giọt máu - Một tấm lòng". Tham gia cùng chúng tôi để mang lại sự sống cho những người cần máu.',
      currentDonors: 20,
      maxDonors: 60,
      requirements: [
        'Độ tuổi từ 18-60',
        'Cân nặng trên 45kg',
        'Không mắc các bệnh truyền nhiễm',
        'Không sử dụng thuốc kháng sinh trong 7 ngày gần đây'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Chọn buổi hiến máu</CardTitle>
          <CardDescription>
            Chọn buổi hiến máu phù hợp với lịch của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm buổi hiến máu..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 rounded-lg border-2",
                  selectedCampaign?.id === campaign.id 
                    ? "border-red-600 shadow-md" 
                    : "border-transparent hover:border-red-200"
                )}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CampaignDetails campaign={campaign} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(0)}
        >
          Quay lại
        </Button>
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          disabled={!selectedCampaign}
          onClick={() => setCurrentStep(2)}
        >
          Tiếp tục
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectCampaignStep; 