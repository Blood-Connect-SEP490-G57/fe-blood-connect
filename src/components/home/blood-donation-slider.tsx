import React, { useState, useEffect } from 'react'
import { MapPin, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react'

interface Campaign {
  id: number
  photo: string
  name: string
  location: string
  startDate: string
  endDate: string
  target: number
  registrants: number
}

interface campaignsProps {
  campaigns: Campaign[]
}

const BloodDonationSlider: React.FC<campaignsProps> = ({ campaigns }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campaigns.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [campaigns.length])

  const handlePrevious = (): void => {
    setCurrentSlide((prev) => (prev - 1 + campaigns.length) % campaigns.length)
  }

  const handleNext = (): void => {
    setCurrentSlide((prev) => (prev + 1) % campaigns.length)
  }

  const formatDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} (${hours}:${minutes} - ${hours}:${minutes})`
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {campaigns.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-700'>Không có sự kiện nào</h2>
        </div>
      ) : (
        <div className='relative overflow-hidden rounded-lg shadow-lg bg-card p-4 md:p-8'>
          <h2 className='text-3xl font-bold mb-12 text-center'>Sự Kiện Sắp Diễn Ra</h2>
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {campaigns.map((campaign) => (
              <div key={campaign.id} className='w-full flex-shrink-0 relative'>
                <div className='flex flex-col md:flex-row'>
                  <div className='md:w-1/2 h-64 md:h-96 relative overflow-hidden'>
                    <img
                      src={campaign.photo}
                      alt={campaign.name}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1615461066841-6116e61058f4'
                      }}
                    />
                  </div>
                  <div className='md:w-1/2 p-6 md:p-8 flex flex-col justify-center'>
                    <h2 className='text-2xl font-heading text-foreground mb-4'>{campaign.name}</h2>
                    <div className='space-y-4'>
                      <div className='flex items-center text-accent'>
                        <MapPin className='mr-2 text-gray-600' />
                        <span className='text-gray-600'>{campaign.location}</span>
                      </div>
                      <div className='flex items-center text-accent'>
                        <Calendar className='mr-2 text-gray-600' />
                        <span className='text-gray-600'>
                          {formatDateTime(campaign.startDate)} - {formatDateTime(campaign.endDate)}
                        </span>
                      </div>
                      <div className='flex items-center text-accent'>
                        <Users className='mr-2 text-gray-600' />
                        <span className='text-gray-600'>
                          {campaign.registrants}/{campaign.target} Đã đăng ký
                        </span>
                      </div>
                      <button
                        className='mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                        onClick={() => console.log(`Registered for ${campaign.name}`)}
                      >
                        Đăng ký Ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrevious}
            className='absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-foreground hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
            aria-label='Previous slide'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <button
            onClick={handleNext}
            className='absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-foreground hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
            aria-label='Next slide'
          >
            <ChevronRight className='w-6 h-6' />
          </button>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2'>
            {campaigns.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  currentSlide === index ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BloodDonationSlider
