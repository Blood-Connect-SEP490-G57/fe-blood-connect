import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, Clock, Users, Info, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }

  return (
    <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
      <CardHeader className='pb-3 bg-gradient-to-r from-red-50 to-white border-b'>
        <Badge className='w-fit mb-1 bg-red-500 hover:bg-red-600'>Chiến dịch</Badge>
        <CardTitle className='text-xl text-red-600'>{campaign.name}</CardTitle>
      </CardHeader>
      <CardContent className='p-5 space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-3'>
            <div className='flex items-start gap-3 text-gray-700'>
              <MapPin className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <div className='font-medium text-gray-900 mb-0.5'>Địa điểm</div>
                <div>{campaign.location}</div>
              </div>
            </div>
            
            <div className='flex items-start gap-3 text-gray-700'>
              <Calendar className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <div className='font-medium text-gray-900 mb-0.5'>Ngày tổ chức</div>
                <div>{formatDate(campaign.organizeTime)}</div>
              </div>
            </div>
          </div>
          
          <div className='space-y-3'>
            <div className='flex items-start gap-3 text-gray-700'>
              <Clock className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <div className='font-medium text-gray-900 mb-0.5'>Thời gian</div>
                <div>
                  {new Date(campaign.startReceiveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {' '}
                  {new Date(campaign.endReceiveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
            
            <div className='flex items-start gap-3 text-gray-700'>
              <Users className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <div className='font-medium text-gray-900 mb-0.5'>Số lượng đăng ký</div>
                <div className='flex items-center'>
                  <span>{campaign.targetBloodUnits}</span>
                  <span className='inline-block h-1.5 w-1.5 rounded-full bg-red-500 mx-2'></span>
                  <span className='text-sm text-gray-500'>Mục tiêu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-2 border-t border-gray-100'>
          <div className='flex items-start gap-3 text-gray-700'>
            <Info className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
            <div>
              <div className='font-medium text-gray-900 mb-1'>Mô tả</div>
              <div className='text-gray-600'>{campaign.description}</div>
            </div>
          </div>
        </div>

        {campaign.officialDocumentUrl && (
          <div className='pt-2 border-t border-gray-100'>
            <div className='flex items-start gap-3 text-gray-700'>
              <FileText className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
              <div>
                <div className='font-medium text-gray-900 mb-1'>Tài liệu chính thức</div>
                <a 
                  href={campaign.officialDocumentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='text-blue-600 hover:underline flex items-center'
                >
                  Xem tài liệu
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CampaignDetails
