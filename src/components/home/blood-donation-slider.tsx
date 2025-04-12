import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Calendar, Users, ChevronLeft, ChevronRight, Info, Clock } from 'lucide-react'
import { Campaign as fetchCampaigns } from '@/api/campaign'
import { CampaignResponse } from '@/schema/campaign-schema'
import { useNavigate } from 'react-router-dom'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'
import ShareLink from '../sharelink'
import { motion } from 'framer-motion'

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
      }, 10000)

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
    navigate('/dang-ky-hien-mau')
  }

  return (
    <div className='py-16 bg-gradient-to-b from-gray-50 to-white' id='blood-donation-slider'>
      {campaigns.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-700'>Không có sự kiện nào</h2>
        </div>
      ) : (
        <div className='max-w-7xl px-2 mx-auto relative'>
          <div className='absolute top-0 left-[20%] w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-30 -z-10'></div>
          <div className='absolute bottom-0 right-[10%] w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-40 -z-10'></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-10'
          >
            <h2 className='text-2xl sm:text-3xl font-bold text-red-600 mb-3'>SỰ KIỆN HIẾN MÁU</h2>
            <div className='w-24 h-1 bg-red-100 mx-auto rounded-full'></div>
          </motion.div>

          <motion.div
            className='relative overflow-hidden rounded-3xl shadow-2xl border border-gray-100 bg-white'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='overflow-hidden'>
              <div
                className='flex transition-transform duration-700 ease-in-out w-full'
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {campaigns.map((campaign, idx) => (
                  <motion.div
                    key={campaign.id}
                    className='w-full flex-shrink-0 flex-grow-0 basis-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 h-full'>
                      {/* Hình ảnh */}
                      <div className='relative overflow-hidden'>
                        <img
                          src={'https://images.unsplash.com/photo-1615461066841-6116e61058f4'}
                          alt={campaign.name}
                          className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
                      </div>

                      {/* Nội dung */}
                      <div className='p-6 sm:p-8 flex flex-col justify-center'>
                        <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-5'>{campaign.name}</h3>

                        <div className='space-y-4 text-sm sm:text-base'>
                          <motion.div
                            className='flex items-start text-gray-700'
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            <div className='p-2 bg-red-50 rounded-full mr-3 flex-shrink-0'>
                              <MapPin className='text-red-500 h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-900 mb-1'>Địa điểm</p>
                              <p className='text-gray-600'>{campaign.location}</p>
                            </div>
                          </motion.div>

                          <motion.div
                            className='flex items-start text-gray-700'
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <div className='p-2 bg-red-50 rounded-full mr-3 flex-shrink-0'>
                              <Calendar className='text-red-500 h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-900 mb-1'>Thời gian tổ chức</p>
                              <p className='text-gray-600'>{formatDateTime(campaign.organizeTime)}</p>
                            </div>
                          </motion.div>

                          <motion.div
                            className='flex items-start text-gray-700'
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                          >
                            <div className='p-2 bg-red-50 rounded-full mr-3 flex-shrink-0'>
                              <Clock className='text-red-500 h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-900 mb-1'>Thời gian đăng ký</p>
                              <p className='text-gray-600'>
                                Từ {formatDateTime(campaign.startReceiveTime)}
                                <br />
                                Đến {formatDateTime(campaign.endReceiveTime)}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className='flex items-start text-gray-700'
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                          >
                            <div className='p-2 bg-red-50 rounded-full mr-3 flex-shrink-0'>
                              <Info className='text-red-500 h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-900 mb-1'>Mô tả</p>
                              <p className='text-gray-600'>{campaign.description}</p>
                            </div>
                          </motion.div>

                          <motion.div
                            className='flex items-start text-gray-700'
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                          >
                            <div className='p-2 bg-red-50 rounded-full mr-3 flex-shrink-0'>
                              <Users className='text-red-500 h-4 w-4' />
                            </div>
                            <div>
                              <p className='font-medium text-gray-900 mb-1'>Số người tham gia</p>
                              <div className='flex items-center gap-2'>
                                <span className='text-gray-600'>
                                  {campaign.appointmentCount} / {campaign.targetBloodUnits}
                                </span>
                                <span className='inline-block h-2 w-2 rounded-full bg-red-500'></span>
                                <span className='text-sm text-gray-500'>
                                  {Math.round((campaign.appointmentCount / campaign.targetBloodUnits) * 100)}%
                                </span>
                              </div>

                              {/* Thanh Progress Bar */}
                              <div className='w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden'>
                                <motion.div
                                  className='h-full bg-gradient-to-r from-red-600 to-red-500'
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min(
                                      (campaign.appointmentCount / campaign.targetBloodUnits) * 100,
                                      100
                                    )}%`
                                  }}
                                  transition={{ duration: 1, delay: 0.6 }}
                                />
                              </div>
                            </div>
                          </motion.div>

                          <motion.div
                            className='flex justify-end pt-5 gap-3'
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                          >
                            <ShareLink selectedCampaign={campaign} />
                            <motion.button
                              className='px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium'
                              onClick={() => handleRegistedonate(campaign)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Đăng ký ngay
                            </motion.button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {campaigns.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevious}
                  className='absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white shadow-lg border border-gray-100 transition-all duration-200'
                >
                  <ChevronLeft className='w-5 h-5' />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className='absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white shadow-lg border border-gray-100 transition-all duration-200'
                >
                  <ChevronRight className='w-5 h-5' />
                </motion.button>
              </>
            )}

            {/* iOS style indicators */}
            {campaigns.length > 1 && (
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {campaigns.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide ? 'bg-red-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default BloodDonationSlider
