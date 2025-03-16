import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Step } from '@/pages/BloodDonationRegistration'
import { Campaign as fetchCampaigns } from '@/api/campaign'
import { CampaignResponse } from '@/schema/campaign-schema'

const SelectCampaignStep = ({
  // searchQuery,
  selectedCampaign,
  setSelectedCampaign,
  setCurrentStep,
  setQuestionSetId
}: {
  // searchQuery: string
  selectedCampaign: any
  setSelectedCampaign: (campaign: any) => void
  setCurrentStep: Dispatch<SetStateAction<Step>>
  setQuestionSetId: (id: number) => void
}) => {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return // Nếu đã fetch thì không gọi lại
    hasFetched.current = true

    const fetchCampaignData = async () => {
      try {
        const response = await fetchCampaigns()
        if (Array.isArray(response)) {
          setCampaigns(response)
        } else {
          setError('Dữ liệu trả về không hợp lệ')
        }
      } catch (err) {
        console.error('Error fetching campaign data:', err)
        setError('Không thể tải thông tin chiến dịch')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [])

  const filteredCampaigns = campaigns.filter(
    (campaign) => campaign.location.includes(selectedDistrict) && campaign.name.toLowerCase()
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='space-y-6'>
      <Card className='border-none shadow-lg'>
        <CardHeader>
          <CardTitle>Chọn buổi hiến máu</CardTitle>
          <CardDescription>Chọn buổi hiến máu phù hợp với lịch của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className='relative mb-6'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Tìm kiếm buổi hiến máu...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
          <div className='relative mb-6'>
            <label htmlFor='district' className='block text-sm font-medium text-gray-700'>
              Chọn Huyện
            </label>
            <select
              id='district'
              name='district'
              className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md'
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value=''>Tất cả</option>
              <option value='Hoàn Kiếm'>Hoàn Kiếm</option>
              <option value='Đống Đa'>Đống Đa</option>
              <option value='Ba Đình'>Ba Đình</option>
              {/* Thêm các huyện khác nếu cần */}
            </select>
          </div>
          <div className='space-y-4'>
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                role='button'
                tabIndex={0}
                className={cn(
                  'cursor-pointer transition-all duration-200 rounded-lg border-2',
                  selectedCampaign?.id === campaign.id
                    ? 'border-red-600 shadow-md'
                    : 'border-transparent hover:border-red-200'
                )}
                onClick={() => setSelectedCampaign(campaign)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedCampaign(campaign)
                  }
                }}
              >
                <CampaignDetails campaign={campaign} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-between'>
        <Button variant='outline' onClick={() => setCurrentStep(0)}>
          Quay lại
        </Button>
        <Button
          className='bg-red-600 text-white hover:bg-red-700'
          disabled={!selectedCampaign}
          onClick={() => {
            setSelectedCampaign(selectedCampaign)
            setQuestionSetId(selectedCampaign.questionSetId)
            setCurrentStep(1)
          }}
        >
          Tiếp tục
          <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default SelectCampaignStep
