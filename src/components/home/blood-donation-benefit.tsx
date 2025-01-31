import React, { useState, useEffect, useRef } from 'react'

interface Slide {
  title: string
  content: string[]
}

const BloodDonationBenefits: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const slides: Slide[] = [
    {
      title: 'Được cấp Giấy chứng nhận hiến máu tình nguyện',
      content: [
        'Giấy chứng nhận được trao cho người hiến máu sau mỗi lần hiến máu tình nguyện.',
        'Có giá trị để được truyền máu miễn phí bằng số lượng máu đã hiến.',
        'Người hiến máu cần xuất trình Giấy chứng nhận để làm cơ sở cho việc truyền máu miễn phí.',
        'Cơ sở y tế có trách nhiệm ký, đóng dấu, xác nhận số lượng máu đã truyền miễn phí.'
      ]
    },
    {
      title: 'Chế độ chăm sóc sức khỏe',
      content: [
        'Người hiến máu được khám và tư vấn sức khỏe miễn phí.',
        'Được cấp phát thuốc bổ sung vi chất cần thiết.',
        'Được tư vấn dinh dưỡng phù hợp sau khi hiến máu.'
      ]
    },
    {
      title: 'Quyền lợi khác (Ví dụ nội dung dài hơn)',
      content: [
        'Được bồi dưỡng bằng hiện vật hoặc tiền mặt theo quy định của pháp luật.',
        'Được ưu tiên khi cần truyền máu trong trường hợp cấp cứu hoặc điều trị.',
        'Được tôn vinh và ghi nhận đóng góp vào hoạt động hiến máu tình nguyện.',
        'Được cung cấp thông tin về sức khỏe và các hoạt động hiến máu.',
        'Được tham gia các hoạt động giao lưu, gặp gỡ với những người hiến máu khác.',
        'Được hưởng các chế độ ưu đãi khác theo quy định của từng địa phương hoặc đơn vị tổ chức hiến máu.'
      ]
    }
  ]

  const contentRefs = useRef<Array<HTMLUListElement | null>>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    if (contentRefs.current) {
      let newMaxHeight = 0
      contentRefs.current.forEach((ref) => {
        if (ref && ref.offsetHeight > newMaxHeight) {
          newMaxHeight = ref.offsetHeight
        }
      })
      setMaxHeight(newMaxHeight)
    }
  }, [slides])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.minHeight = `${maxHeight}px`
    }
  }, [maxHeight])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className='bg-gray-100 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-center text-red-600 mb-8'>Quyền lợi của người hiến máu</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-red-500 text-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center'>
            <img
              src='/images/landing/heart-in-hand.jpg'
              alt='Heart in Hands'
              className='w-48 h-48 rounded-full object-cover mb-4 border-4 border-white shadow-md'
            />
            <p className='text-lg text-center'>Người hiến máu tình nguyện sẽ được những quyền lợi sau:</p>
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6 relative flex flex-col justify-between' ref={containerRef}>
            <h3 className='text-2xl font-semibold text-red-600 mb-4'>{slides[currentSlide].title}</h3>
            <ul
              className='list-disc pl-6 text-gray-700 space-y-2 flex-grow'
              ref={(el) => (contentRefs.current[currentSlide] = el)}
            >
              {slides[currentSlide].content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className='flex justify-between mt-4'>
              <button
                onClick={prevSlide}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105'
              >
                ❮
              </button>
              <button
                onClick={nextSlide}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105'
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BloodDonationBenefits
