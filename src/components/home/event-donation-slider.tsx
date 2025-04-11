import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BloodEvent {
  id: number
  title: string
  date: string
  images: string[]
}

export default function EventDonationSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const events: BloodEvent[] = [
    {
      id: 1,
      title: 'Ngày Hội Hiến Máu Tình Nguyện Đợt 2 năm 2024',
      date: '23/10/2024',
      images: [
        '/images/landing/event/Event1/1.jpg',
        '/images/landing/event/Event1/2.jpg',
        '/images/landing/event/Event1/3.jpg',
        '/images/landing/event/Event1/4.jpg',
        '/images/landing/event/Event1/5.jpg',
        '/images/landing/event/Event1/6.jpg'
      ]
    },
    {
      id: 2,
      title: 'Ngày Hội Hiến Máu Tình Nguyện Đợt 1 năm 2024',
      date: '02/06/2024',
      images: [
        '/images/landing/event/Event2/1.jpg',
        '/images/landing/event/Event2/2.jpg',
        '/images/landing/event/Event2/3.jpg',
        '/images/landing/event/Event2/4.jpg',
        '/images/landing/event/Event2/5.jpg',
        '/images/landing/event/Event2/6.jpg'
      ]
    },
    {
      id: 3,
      title: 'Ngày Hội Hiến Máu Tình Nguyện Đợt 2 năm 2023',
      date: '25/03/2024',
      images: [
        '/images/landing/event/Event3/1.jpg',
        '/images/landing/event/Event3/2.jpg',
        '/images/landing/event/Event3/3.jpg',
        '/images/landing/event/Event3/4.jpg',
        '/images/landing/event/Event3/5.jpg',
        '/images/landing/event/Event3/6.jpg'
      ]
    }
  ]

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setDirection('left')
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setDirection('right')
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden'>
      <motion.div 
        className='max-w-7xl mx-auto px-2 relative'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* iOS style header */}
        <motion.div 
          className='relative w-full mb-12 text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-4'>Các hoạt động hiến máu nhân đạo</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Cùng nhìn lại các hoạt động hiến máu nhân đạo đã tổ chức nhằm cứu giúp những người cần máu.
          </p>
          <div className='w-24 h-1 bg-red-100 mx-auto mt-6 rounded-full'></div>
        </motion.div>
      
        {/* Slider Container */}
        <motion.div 
          className='relative min-h-[500px] py-8 mb-8 rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Background decoration elements */}
          <div className='absolute -bottom-16 right-1/4 w-32 h-32 bg-red-50 rounded-full opacity-40 blur-2xl'></div>
          <div className='absolute -top-16 left-1/4 w-40 h-40 bg-red-100 rounded-full opacity-30 blur-3xl'></div>
          
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === activeIndex
                  ? 'translate-x-0 z-20 opacity-100'
                  : direction === 'right'
                  ? 'translate-x-full opacity-0 z-10'
                  : '-translate-x-full opacity-0 z-10'
              }`}
            >
              <div className={`h-full ${index === activeIndex ? 'bg-gradient-to-br from-red-600 to-red-500' : 'bg-white'} p-6 lg:p-8 relative rounded-3xl overflow-hidden`}>
                {/* Pattern overlay */}
                <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.2%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")] opacity-5'></div>
                
                <div className='flex lg:flex-row flex-col h-full gap-6 relative z-10'>
                  {/* Event Info */}
                  <div
                    className={`lg:w-[25%] flex flex-col justify-center ${
                      index === activeIndex ? 'text-white' : 'text-red-600'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <h3 className='text-xl lg:text-2xl font-bold mb-4'>{event.title}</h3>
                      <div className='flex items-center gap-2 mb-6'>
                        <CalendarIcon className='w-5 h-5' />
                        <span className='font-medium'>{event.date}</span>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full ${index === activeIndex ? 'bg-white/20' : 'bg-red-50'} inline-flex items-center`}>
                        <span className={`${index === activeIndex ? 'text-white' : 'text-red-600'} text-sm font-medium`}>
                          {events.length} sự kiện
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Images with iOS style */}
                  <div className='flex-1 h-auto lg:h-[400px] grid grid-cols-3 grid-rows-2 gap-3 lg:gap-4'>
                    {event.images.map((image, imgIndex) => (
                      <motion.div
                        key={imgIndex}
                        className='row-span-1 col-span-1 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden'
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * imgIndex + 0.3 }}
                      >
                        <img
                          src={image}
                          alt={`Event ${event.id} ${imgIndex + 1}`}
                          className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* iOS style navigation buttons */}
          <motion.button
            onClick={goToPrev}
            className='absolute left-4 bottom-4 p-3 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white shadow-lg border border-white/50 z-30'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeftIcon className='w-5 h-5' />
          </motion.button>
          
          <motion.button
            onClick={goToNext}
            className='absolute right-4 bottom-4 p-3 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-white shadow-lg border border-white/50 z-30'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRightIcon className='w-5 h-5' />
          </motion.button>

          {/* iOS style indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30'>
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 'right' : 'left')
                  setActiveIndex(index)
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex 
                    ? 'bg-white w-8 h-2' 
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Icons with improved styling for iOS
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      />
    </svg>
  )
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
    </svg>
  )
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
    </svg>
  )
}
