import { useCallback, useMemo, useState } from 'react'

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

  const goToPrev = () => {
    setDirection('left')
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setDirection('right')
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='relative mt-8 mx-auto w-full '>
      <div
        className='relative w-full text-white text-center py-4 mb-4 rounded-lg shadow-lg'
        style={{
          backgroundImage:
            "url('https://d147a5vd7kzml6.cloudfront.net/img/e_nursing_nl/4341/760x428/resize:fixed/picc_lijn_verzorging.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='absolute inset-0 bg-red-600 opacity-40'></div>
        <div className='relative'>
          <h2 className='text-3xl font-bold'>Các hoạt động hiến máu nhân đạo</h2>
          <p className='mt-4'>Tham gia các hoạt động hiến máu để cứu giúp những người cần máu.</p>
        </div>
      </div>
      {/* Slider Container */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='relative min-h-96 py-8 mb-4 rounded-xl overflow-hidden shadow-lg'>
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-transform duration-500 ${
                index === activeIndex
                  ? 'translate-x-0'
                  : direction === 'right'
                  ? 'translate-x-full'
                  : '-translate-x-full'
              }`}
            >
              <div className={`h-full ${index === activeIndex ? 'bg-red-600' : 'bg-white'} p-6 lg:p-8`}>
                <div className='flex lg:flex-row flex-col h-full gap-4'>
                  {/* Event Info */}
                  <div
                    className={`lg:w-[20%] flex flex-col justify-center ${
                      index === activeIndex ? 'text-white' : 'text-red-600'
                    }`}
                  >
                    <h2 className='text-xl lg:text-2xl font-bold mb-4'>{event.title}</h2>
                    <p className='flex items-center gap-2'>
                      <CalendarIcon className='w-5 h-5' />
                      {event.date}
                    </p>
                  </div>

                  {/* Images */}
                  <div className="flex-1 h-[70%] lg:h-full grid grid-cols-3 grid-rows-2 gap-4">
                    {event.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className='row-span-1 col-span-1 bg-white/20 rounded-lg shadow-md p-2 lg:p-4 flex items-center justify-center'
                      >
                        <img
                          src={image}
                          alt={`Event ${event.id} ${imgIndex + 1}`}
                          className='w-full h-full object-cover rounded-lg'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className='absolute left-4 bottom-4 p-2 rounded-full bg-white/30 hover:bg-white/50 text-red-600'
          >
            <ArrowLeftIcon className='w-6 h-6' />
          </button>
          <button
            onClick={goToNext}
            className='absolute right-4 bottom-4 p-2 rounded-full bg-white/30 hover:bg-white/50 text-red-600'
          >
            <ArrowRightIcon className='w-6 h-6' />
          </button>

          {/* Indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 'right' : 'left')
                  setActiveIndex(index)
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
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
