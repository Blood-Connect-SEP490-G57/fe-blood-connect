import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Gift, Award, Heart } from 'lucide-react'

interface Slide {
  title: string
  content: Array<{
    text: string
    subItems?: string[]
  }>
  icon: React.ReactNode
  color: string
}

const BloodDonationBenefits: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const slideDelay = 3000 // 3 seconds

  const slides: Slide[] = [
    {
      icon: <Gift className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      title: 'Được bồi dưỡng trực tiếp',
      content: [
        {
          text: 'Ăn nhẹ, nước uống tại chỗ: tương đương 30.000 đồng (1 chai trà xanh không độ, 01 hộp chocopie 66gram, 01 hộp bánh Goute 35,5gram).'
        },
        {
          text: 'Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000 đồng.'
        },
        {
          text: 'Nhận phần quà tặng giá trị tương đương:',
          subItems: [
            '100.000đ khi hiến máu 250ml',
            '150.000đ khi hiến máu 350ml',
            '180.000đ khi hiến máu 450ml'
          ]
        }
      ]
    },
    {
      icon: <Award className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      title: 'Được cấp Giấy chứng nhận hiến máu tình nguyện',
      content: [
        {
          text: 'Giấy chứng nhận được trao cho người hiến máu sau mỗi lần hiến máu tình nguyện.'
        },
        {
          text: 'Có giá trị để được truyền máu miễn phí bằng số lượng máu đã hiến, khi bản thân người hiến có nhu cầu sử dụng máu tại tất cả các cơ sở y tế công lập trên toàn quốc.'
        },
        {
          text: 'Người hiến máu cần xuất trình Giấy chứng nhận để làm cơ sở cho các cơ sở y tế thực hiện việc truyền máu miễn phí.'
        },
        {
          text: 'Cơ sở y tế có trách nhiệm ký, đóng dấu, xác nhận số lượng máu đã truyền miễn phí cho người hiến máu vào giấy chứng nhận.'
        }
      ]
    },
    {
      icon: <Heart className="h-8 w-8" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      title: 'Được tư vấn về sức khoẻ',
      content: [
        {
          text: 'Được giải thích về quy trình hiến máu và các tai biến có thể xảy ra trong và sau khi hiến máu.'
        },
        {
          text: 'Được cung cấp thông tin về dấu hiệu, triệu chứng do nhiễm vi rút viêm gan, HIV và một số bệnh lây qua đường truyền máu, tình dục khác.'
        },
        {
          text: 'Được xét nghiệm sàng lọc một số vi rút lây qua đường truyền máu, tình dục (HIV, Giang mai, viêm gan,…) sau khi hiến máu.'
        },
        {
          text: 'Được tư vấn hướng dẫn cách chăm sóc sức khỏe, tư vấn về kết quả bất thường sau hiến máu.'
        },
        {
          text: 'Được bảo mật về kết quả khám lâm sàng, kết quả xét nghiệm.'
        }
      ]
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    resetInterval()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    resetInterval()
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    resetInterval()
  }

  // Set up auto slideshow
  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, slideDelay)
  }

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      startInterval()
    }
  }

  useEffect(() => {
    startInterval()
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className='bg-gradient-to-b from-white to-gray-100 py-16 sm:py-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <motion.h2 
          className='text-3xl sm:text-4xl md:text-5xl font-bold text-center text-red-600 mb-8 sm:mb-12'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Quyền lợi của người hiến máu
        </motion.h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <motion.div 
            className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center h-auto sm:h-[500px]'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
              <img
                src='/images/landing/heart-in-hand.jpg'
                alt='Heart in Hands'
                className='w-full h-full rounded-full object-cover border-4 border-white shadow-md z-10 relative'
              />
            </div>
            <p className='text-xl sm:text-2xl text-center font-medium'>Người hiến máu tình nguyện sẽ được những quyền lợi sau:</p>
            <div className="flex space-x-2 mt-8">
              {slides.map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div 
            className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative flex flex-col justify-between h-auto sm:h-[500px]'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-xl ${slides[currentSlide].color} text-white mr-4`}>
                    {slides[currentSlide].icon}
                  </div>
                  <h3 className='text-2xl font-semibold text-red-600'>
                    {slides[currentSlide].title}
                  </h3>
                </div>

                <div className="overflow-auto flex-grow pr-2 custom-scrollbar">
                  <ul className='list-none pl-1 text-gray-700 space-y-3'>
                    {slides[currentSlide].content.map((item, index) => (
                      <li key={index}>
                        <div className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-red-100 before:rounded-full before:border before:border-red-300">
                          <span className="ml-2">{item.text}</span>
                        </div>
                        
                        {/* Render sub-items if they exist */}
                        {item.subItems && (
                          <ul className="mt-2 ml-8 space-y-2">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-red-50 before:rounded-full before:border before:border-red-200">
                                <span className="ml-2 text-gray-600">{subItem}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className='flex justify-between items-center mt-6'>
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-red-500 scale-125' : 'bg-gray-300'
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={prevSlide}
                  className='group bg-white border border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-2 transition-all duration-300 ease-in-out'
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={nextSlide}
                  className='group bg-white border border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-2 transition-all duration-300 ease-in-out'
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e2e2;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d1d1;
        }
      `}</style>
    </div>
  )
}

export default BloodDonationBenefits
