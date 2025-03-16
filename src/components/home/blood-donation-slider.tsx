import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Calendar, Users, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { Campaign as fetchCampaigns } from '@/api/campaign'
import { CampaignResponse } from '@/schema/campaign-schema'
import { useNavigate } from 'react-router-dom'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'

const BloodDonationSlider: React.FC = () => {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([])
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchCampaignsData = async () => {
      try {
        const response = await fetchCampaigns()
        if (Array.isArray(response)) {
          setCampaigns(response)
        } else {
          console.error('Invalid API response:', response)
          setError('Không tìm thấy sự kiện nào')
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err)
        setError('Không thể tải danh sách sự kiện')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignsData()
  }, [])

  useEffect(() => {
    if (campaigns.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % campaigns.length)
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [campaigns.length])

  const handlePrevious = (): void => {
    setCurrentSlide((prev) => (prev - 1 + campaigns.length) % campaigns.length)
  }

  const handleNext = (): void => {
    setCurrentSlide((prev) => (prev + 1) % campaigns.length)
  }

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString)

    const dayStr = String(date.getDate()).padStart(2, '0')
    const monthStr = String(date.getMonth() + 1).padStart(2, '0')
    const yearStr = date.getFullYear()

    const hoursStr = String(date.getHours()).padStart(2, '0')
    const minutesStr = String(date.getMinutes()).padStart(2, '0')

    return `${dayStr}/${monthStr}/${yearStr} - ${hoursStr}:${minutesStr}`
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Empty />
  }

  const handleRegistedonate = (campaign: CampaignResponse): void => {
    localStorage.setItem('selectedCampaign', JSON.stringify(campaign))
    navigate('/blood-donation-registration')
  }

  return (
    <div className='py-16 sm:py-24' id='blood-donation-slider'>
      {campaigns.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-700'>Không có sự kiện nào</h2>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='relative overflow-hidden rounded-lg shadow-lg max-w-7xl mx-auto px-4 sm:px-6 bg-white border'>
            <h2 className='text-3xl mt-6 font-bold text-red-600 mb-12 text-center'>SỰ KIỆN HIẾN MÁU</h2>
            <div
              className='flex transition-transform duration-700 ease-in-out mb-6'
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {campaigns.map((campaign) => (
                <div key={campaign.id} className='w-full flex-shrink-0 relative'>
                  <div className='flex flex-col md:flex-row p-4'>
                    <div className='md:w-1/2 h-64 md:h-96 relative overflow-hidden'>
                      <img
                        src={'https://images.unsplash.com/photo-1615461066841-6116e61058f4'}
                        alt={campaign.name}
                        className='w-full h-full object-cover rounded-lg'
                      />
                    </div>
                    <div className='md:w-1/2 p-6 md:p-8 flex flex-col justify-center'>
                      <h2 className='text-2xl font-bold text-black mb-4'>{campaign.name}</h2>

                      <div className='space-y-4'>
                        <div className='flex items-start text-black'>
                          <MapPin className='mr-2 text-red-600 flex-shrink-0' />
                          <span className='whitespace-normal'>Địa điểm: {campaign.location}</span>
                        </div>
                        <div className='flex items-center text-black'>
                          <Calendar className='mr-2 text-red-600' />
                          <span>Mở đăng ký: {formatDateTime(campaign.startReceiveTime)}</span>
                        </div>
                        <div className='flex items-center text-black'>
                          <Calendar className='mr-2 text-red-600' />
                          <span>Kết thúc đăng ký: {formatDateTime(campaign.endReceiveTime)}</span>
                        </div>
                        <div className='flex items-center text-black'>
                          <Calendar className='mr-2 text-red-600' />
                          <span>Thời gian tổ chức: {formatDateTime(campaign.organizeTime)}</span>
                        </div>
                        <div className='flex items-center text-black'>
                          <Info className='mr-2 text-red-600 flex-shrink-0' />
                          <span>Mô tả sự kiện: {campaign.description}</span>
                        </div>

                        <div className='flex items-center text-black'>
                          <Users className='mr-2 text-red-600' />
                          <span>
                            Số người: {campaign.appointmentCount} / {campaign.targetBloodUnits} Đã đăng ký
                          </span>
                        </div>
                        {/* Thanh Progress Bar Thu Nhỏ */}
                        <div className='w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden'>
                          <div
                            className='h-full bg-red-600 transition-all duration-500'
                            style={{
                              width: `${Math.min((campaign.appointmentCount / campaign.targetBloodUnits) * 100, 100)}%`
                            }}
                          />
                        </div>

                        <div className='flex justify-end mt-6'>
                          <button
                            className='px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300'
                            onClick={() => handleRegistedonate(campaign)}
                          >
                            Đăng ký ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {campaigns.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className='absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200'
                >
                  <ChevronLeft className='w-6 h-6' />
                </button>

                <button
                  onClick={handleNext}
                  className='absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200'
                >
                  <ChevronRight className='w-6 h-6' />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BloodDonationSlider
