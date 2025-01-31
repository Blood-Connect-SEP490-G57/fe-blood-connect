import { useState } from 'react'

interface BloodEvent {
  id: number
  title: string
  date: string
  images: string[]
}

export default function EventDonationSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  const events: BloodEvent[] = [
    {
      id: 1,
      title: 'Ngày Hội Hiến Máu Tình Nguyện 2024',
      date: '15/03/2024',
      images: [
        '/path/to/image1.jpg',
        '/path/to/image2.jpg',
        '/path/to/image3.jpg',
        '/path/to/image4.jpg',
        '/path/to/image5.jpg',
        '/path/to/image6.jpg'
      ]
    },
    {
      id: 2,
      title: 'Giọt Hồng Cứu Người - Xuân Yêu Thương',
      date: '20/03/2024',
      images: [
        '/path/to/image1.jpg',
        '/path/to/image2.jpg',
        '/path/to/image3.jpg',
        '/path/to/image4.jpg',
        '/path/to/image5.jpg',
        '/path/to/image6.jpg'
      ]
    },
    {
      id: 3,
      title: 'Hiến Máu Khẩn Cấp Cứu Bệnh Nhân',
      date: '25/03/2024',
      images: [
        '/path/to/image1.jpg',
        '/path/to/image2.jpg',
        '/path/to/image3.jpg',
        '/path/to/image4.jpg',
        '/path/to/image5.jpg',
        '/path/to/image6.jpg'
      ]
    }
  ]

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='relative  mx-auto p-4 w-full'>
      <div className='relative w-full text-white text-center py-8 mb-8 rounded-lg shadow-lg' style={{ backgroundImage: "url('https://d147a5vd7kzml6.cloudfront.net/img/e_nursing_nl/4341/760x428/resize:fixed/picc_lijn_verzorging.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className='absolute inset-0 bg-red-600 opacity-40'></div>
        <div className='relative'>
          <h2 className='text-3xl font-bold'>Các hoạt động hiến máu nhân đạo</h2>
          <p className='mt-4'>Tham gia các hoạt động hiến máu để cứu giúp những người cần máu.</p>
        </div>
      </div>
      {/* Slider Container */}
      <div className='relative h-96 rounded-xl overflow-hidden shadow-lg max-w-7xl mx-auto center'>
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`h-full ${index === activeIndex ? 'bg-red-600' : 'bg-white'} p-8`}>
              <div className='grid grid-cols-4 grid-rows-2 h-full gap-4'>
                {/* Event Info */}
                <div
                  className={`row-span-2 flex flex-col justify-center ${
                    index === activeIndex ? 'text-white' : 'text-red-600'
                  }`}
                >
                  <h2 className='text-2xl font-bold mb-4'>{event.title}</h2>
                  <p className='flex items-center gap-2'>
                    <CalendarIcon className='w-5 h-5' />
                    {event.date}
                  </p>
                </div>

                {/* Images */}
                {event.images.map((image, imgIndex) => (
                  <div key={imgIndex} className='bg-white/20 rounded-lg shadow-md p-4 flex items-center justify-center'>
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
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
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
