import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, Clock, Users, Info } from 'lucide-react'

interface CampaignDetailsProps {
  campaign: {
    id: string
    name: string
    location: string
    date: string
    timeSlot: string
    description: string
    currentDonors: number
    maxDonors: number
    requirements: string[]
  }
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-red-600">{campaign.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{campaign.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{campaign.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>{campaign.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>{campaign.currentDonors}/{campaign.maxDonors} người đăng ký</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Info className="h-5 w-5" />
            Mô tả
          </h3>
          <p className="text-gray-600">{campaign.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Yêu cầu</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {campaign.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignDetails 