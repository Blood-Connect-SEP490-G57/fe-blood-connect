import { Button } from '@/components/ui/button'
import { ChevronRight, MapPin, Calendar, Clock, Users, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import CampaignDetails from '@/components/blood-donation-registration/campaign-details'
import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Step } from '@/pages/BloodDonationRegistration'
import { Campaign as fetchCampaigns } from '@/api/campaign'
import { CampaignResponse } from '@/schema/campaign-schema'
import ScrollToTop from '../scrollToTop'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

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
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
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
          setFilteredCampaigns(response)
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

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCampaigns(campaigns)
    } else {
      const filtered = campaigns.filter(
        campaign => 
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCampaigns(filtered)
    }
  }, [searchTerm, campaigns])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách chiến dịch...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-none shadow-md bg-red-50">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-red-700 mb-2">Đã xảy ra lỗi</h3>
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <ScrollToTop />
      <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
        <CardHeader className='pb-3'>
          <CardTitle>Chọn buổi hiến máu</CardTitle>
          <CardDescription>Chọn buổi hiến máu phù hợp với lịch của bạn</CardDescription>
          
          <div className='relative mt-4'>
            <Input
              type='text'
              placeholder='Tìm kiếm theo tên của buổi hiến máu ...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-full focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50'
            />
            <SearchIcon className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            {searchTerm && (
              <button 
                className='absolute right-3 top-2.5 text-gray-400 hover:text-gray-600'
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className='pt-2'>
          {filteredCampaigns.length > 0 ? (
            <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-1 pb-2'>
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card
                    className={cn(
                      'overflow-hidden border transition-all duration-200 hover:shadow-md',
                      selectedCampaign?.id === campaign.id
                        ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50'
                        : 'border-gray-100'
                    )}
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <CardContent className='p-0'>
                      <div className='p-4'>
                        <h3 className='text-lg font-medium text-red-600 mb-3'>{campaign.name}</h3>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                          <div className='flex items-center gap-2 text-gray-600'>
                            <MapPin className='h-4 w-4 text-red-400 flex-shrink-0' />
                            <span className='truncate'>{campaign.location}</span>
                          </div>
                          
                          <div className='flex items-center gap-2 text-gray-600'>
                            <Calendar className='h-4 w-4 text-red-400 flex-shrink-0' />
                            <span>{formatDate(campaign.organizeTime)}</span>
                          </div>
                          
                          <div className='flex items-center gap-2 text-gray-600'>
                            <Clock className='h-4 w-4 text-red-400 flex-shrink-0' />
                            <span>
                              {new Date(campaign.startReceiveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {' '}
                              {new Date(campaign.endReceiveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          
                          <div className='flex items-center gap-2 text-gray-600'>
                            <Users className='h-4 w-4 text-red-400 flex-shrink-0' />
                            <span>{campaign.targetBloodUnits} người đăng ký</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedCampaign?.id === campaign.id && (
                        <div className='bg-red-50 p-2 border-t border-red-100 flex justify-end'>
                          <span className='text-sm text-red-600 flex items-center'>
                            Đã chọn
                            <ChevronRight className='h-4 w-4 ml-1' />
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='py-12 text-center'>
              <SearchIcon className='mx-auto h-12 w-12 text-gray-300' />
              <h3 className='mt-4 text-lg font-medium text-gray-900'>Không tìm thấy chiến dịch</h3>
              <p className='mt-2 text-gray-500'>Không tìm thấy chiến dịch nào phù hợp với tìm kiếm của bạn.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button
          className='rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 transition shadow-sm'
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
