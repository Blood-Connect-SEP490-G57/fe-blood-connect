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
  const slideDelay = 5000 // 5 seconds

  const slides: Slide[] = [
    {
      icon: <Gift className='h-8 w-8' />,
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
          subItems: ['100.000đ khi hiến máu 250ml', '150.000đ khi hiến máu 350ml', '180.000đ khi hiến máu 450ml']
        }
      ]
    },
    {
      icon: <Award className='h-8 w-8' />,
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
      icon: <Heart className='h-8 w-8' />,
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
    <div className='py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden relative'>
      {/* iOS style decorative elements */}
      <div className='absolute top-40 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-40 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <div className='max-w-7xl mx-auto px-2  lg:px-8 relative'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl font-bold text-red-600 mb-4'>Quyền lợi của người hiến máu</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Hiến máu không chỉ giúp cứu sống người khác mà còn mang lại nhiều lợi ích cho chính người hiến
          </p>
          <div className='w-24 h-1 bg-red-100 mx-auto mt-4 rounded-full'></div>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10'>
          <motion.div
            className='bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center h-auto sm:h-[500px] overflow-hidden relative'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* iOS style decorative pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.1%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")] opacity-10'></div>
            
            <motion.div 
              className='relative w-48 h-48 mb-8'
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className='absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20'></div>
              <div className='absolute inset-0 bg-red-300 rounded-full animate-pulse opacity-30'></div>
              <img
                src='/images/landing/heart-in-hand.jpg'
                alt='Heart in Hands'
                className='w-full h-full rounded-full object-cover border-4 border-white/80 shadow-lg z-10 relative'
              />
            </motion.div>
            
            <motion.p 
              className='text-xl sm:text-2xl text-center font-medium mb-8'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Người hiến máu tình nguyện sẽ được những quyền lợi sau:
            </motion.p>
            
            <motion.div 
              className='flex space-x-3 mt-2'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='mt-8 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300'
            >
              Tìm hiểu thêm
            </motion.button>
          </motion.div>

          <motion.div
            className='bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 relative flex flex-col justify-between h-auto sm:h-[500px]'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className='h-full flex flex-col'
              >
                <div className='flex items-center mb-6'>
                  <div className={`p-3 rounded-xl ${slides[currentSlide].color} text-white mr-4 shadow-md`}>
                    {slides[currentSlide].icon}
                  </div>
                  <h3 className='text-xl sm:text-2xl font-semibold text-red-600'>{slides[currentSlide].title}</h3>
                </div>

                <div className='overflow-auto flex-grow pr-2 custom-scrollbar'>
                  <ul className='list-none pl-1 text-gray-700 space-y-4'>
                    {slides[currentSlide].content.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <div className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-red-100 before:rounded-full before:border before:border-red-300">
                          <span className='ml-2'>{item.text}</span>
                        </div>

                        {/* Render sub-items if they exist */}
                        {item.subItems && (
                          <ul className='mt-3 ml-8 space-y-2'>
                            {item.subItems.map((subItem, subIndex) => (
                              <motion.li
                                key={subIndex}
                                className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-red-50 before:rounded-full before:border before:border-red-200"
                                initial={{ opacity: 0, x: 5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 + subIndex * 0.1, duration: 0.3 }}
                              >
                                <span className='ml-2 text-gray-600'>{subItem}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className='flex justify-between items-center mt-6 pt-4 border-t border-gray-100'>
              <div className='flex space-x-2'>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-red-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className='flex space-x-3'>
                <motion.button
                  onClick={prevSlide}
                  className='bg-white border border-gray-200 hover:border-red-500 text-red-500 rounded-full p-2 transition-all duration-300 shadow-sm hover:shadow'
                  aria-label='Previous slide'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className='h-5 w-5' />
                </motion.button>
                <motion.button
                  onClick={nextSlide}
                  className='bg-red-500 text-white rounded-full p-2 transition-all duration-300 shadow-sm hover:shadow hover:bg-red-600'
                  aria-label='Next slide'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className='h-5 w-5' />
                </motion.button>
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
