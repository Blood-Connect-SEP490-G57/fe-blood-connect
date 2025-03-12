import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, User, Heart, Scale, Calendar, TestTube, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// Sử dụng framer-motion để tạo hiệu ứng
const MotionCard = motion(Card)

const BloodDonationCriteria = () => {
  const criteria = [
    {
      icon: <CreditCard className='text-red-600 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />,
      text: 'Mang theo chứng minh nhân dân/hộ chiếu hoặc giấy tờ tùy thân có ảnh',
      span: 1
    },
    {
      icon: <User className='text-red-600 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />,
      text: 'Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV và các bệnh lây qua đường máu',
      span: 1
    },
    {
      icon: <Heart className='text-red-600 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />,
      text: 'Không nghiện ma túy, rượu bia và các chất kích thích khác',
      span: 1
    },
    {
      icon: <Scale className='text-red-600 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />,
      text: 'Cân nặng: Nam ≥ 45 kg, Nữ ≥ 45 kg',
      span: 1
    },
    {
      icon: <Calendar className='text-red-600 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />,
      text: 'Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với hiến máu toàn phần',
      span: 1
    },
    {
      icon: <TestTube className='text-red-600 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8' />,
      text: 'Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B',
      span: 1
    }
  ]

  return (
    <section className='py-16 sm:py-24 md:py-32 bg-gradient-to-br from-red-600 via-red-500 to-red-400'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12 sm:mb-16 md:mb-20'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4'>
            Tiêu chuẩn tham gia hiến máu
          </h2>
          <p className='text-white/90 max-w-3xl mx-auto text-base sm:text-lg'>
            Để đảm bảo an toàn cho cả người hiến máu và người nhận máu, vui lòng kiểm tra các tiêu chí sau trước khi
            đăng ký hiến máu.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto'>
          {/* Card hình ảnh - KÍCH THƯỚC LỚN HƠN với responsive */}
          <MotionCard
            className='col-span-1 sm:col-span-2 lg:col-span-3 bg-white overflow-hidden border-none shadow-lg sm:shadow-xl md:shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl mb-6 sm:mb-8 md:mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.01 }}
          >
            <CardContent className='p-0'>
              <div className='relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden'>
                <img
                  src='/images/img1.jpg'
                  alt='Blood Donation'
                  className='w-full h-full object-cover transition-transform duration-700 hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16'>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className='mb-4 sm:mb-6 md:mb-8'
                  >
                    <h3 className='text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 md:mb-6 text-white leading-tight'>
                      Cứu người thật <span className='text-red-400'>dễ dàng</span>
                    </h3>
                    {/* Phiên bản rút gọn cho mobile */}
                    <p className='text-white/90 mb-4 text-xs leading-tight block sm:hidden'>
                      Mỗi đơn vị máu hiến tặng có thể cứu sống tới 3 người.
                    </p>

                    {/* Phiên bản đầy đủ cho tablet trở lên */}
                    <p className='text-white/90 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-lg md:text-xl max-w-4xl leading-normal sm:leading-relaxed hidden sm:block'>
                      Mỗi đơn vị máu hiến tặng có thể cứu sống tới 3 người. Hành động nhỏ của bạn hôm nay có thể tạo nên
                      sự khác biệt lớn cho cuộc sống của người khác.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Link to='/blood-donation-registration'>
                      <Button className='bg-red-600 hover:bg-red-700 hover:scale-105 transform transition-all text-white flex items-center text-xs sm:text-base md:text-lg py-1.5 sm:py-2.5 md:py-4 px-3 sm:px-5 md:px-8 rounded-md sm:rounded-lg md:rounded-xl touch-manipulation'>
                        <span className='mr-1 sm:mr-2'>Đăng ký ngay</span>
                        <ArrowRight className='h-3 w-3 sm:h-5 sm:w-5 md:h-6 md:w-6' />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </MotionCard>

          {/* Các tiêu chí với responsive */}
          {criteria.map((criterion, index) => (
            <MotionCard
              key={index}
              className={`bg-white col-span-1 ${criterion.span > 1 ? 'sm:col-span-2' : ''} 
                border-none shadow-md rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <CardContent className='flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6'>
                <div className='p-2 sm:p-3 bg-red-50 rounded-full shrink-0'>{criterion.icon}</div>
                <p className='text-gray-700 leading-relaxed text-sm sm:text-base'>{criterion.text}</p>
              </CardContent>
            </MotionCard>
          ))}
        </div>

        <div className='text-center mt-10 sm:mt-12 md:mt-16'>
          <Link to='/blood-donation-registration'>
            <Button className='bg-white hover:bg-gray-100 text-red-600 font-medium px-4 sm:px-8 md:px-10 py-2 sm:py-5 md:py-6 text-sm sm:text-lg md:text-xl rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 touch-manipulation'>
              Đăng ký hiến máu ngay
              <ChevronRight className='ml-1 sm:ml-2 h-3 w-3 sm:h-5 sm:w-5 md:h-6 md:w-6' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BloodDonationCriteria
