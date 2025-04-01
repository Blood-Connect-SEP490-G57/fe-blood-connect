import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Step } from '@/pages/BloodDonationRegistration'
import { Campaign as fetchCampaigns } from '@/api/campaign'
import { CampaignResponse } from '@/schema/campaign-schema'
import ScrollToTop from '../scrollToTop'

const SelectCampaignStep = ({
  selectedCampaign,
  setSelectedCampaign,
  setCurrentStep,
  setQuestionSetId
}: {
  selectedCampaign: any
  setSelectedCampaign: (campaign: any) => void
  setCurrentStep: Dispatch<SetStateAction<Step>>
  setQuestionSetId: (id: number) => void
}) => {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='space-y-6'>
      <ScrollToTop />
      <Card className='border-none shadow-lg'>
        <CardHeader>
          <CardTitle>Chọn buổi hiến máu</CardTitle>
          <CardDescription>Chọn buổi hiến máu phù hợp với lịch của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {campaigns.map((campaign) => (
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
