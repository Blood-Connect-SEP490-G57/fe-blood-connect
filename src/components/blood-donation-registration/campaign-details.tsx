import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, Clock, Users, Info } from 'lucide-react'

interface CampaignDetailsProps {
  campaign: {
    id: number
    name: string
    location: string
    startReceiveTime: string
    endReceiveTime: string
    organizeTime: string
    description: string
    targetBloodUnits: number
    officialDocumentUrl: string
  }
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl text-red-600'>{campaign.name}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-gray-600'>
            <MapPin className='h-5 w-5' />
            <span>{campaign.location}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <Calendar className='h-5 w-5' />
            <span>{new Date(campaign.organizeTime).toLocaleDateString()}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock className='h-5 w-5' />
            <span>
              {new Date(campaign.startReceiveTime).toLocaleTimeString()} -{' '}
              {new Date(campaign.endReceiveTime).toLocaleTimeString()}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-600'>
            <Users className='h-5 w-5' />
            <span>{campaign.targetBloodUnits} người đăng ký</span>
          </div>
        </div>

        <div className='space-y-2'>
          <h3 className='font-medium flex items-center gap-2'>
            <Info className='h-5 w-5' />
            Mô tả
          </h3>
          <p className='text-gray-600'>{campaign.description}</p>
        </div>
       
      </CardContent>
    </Card>
  )
}

export default CampaignDetails