import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, User, Heart, Scale, Calendar, TestTube } from 'lucide-react'
import { motion } from 'framer-motion'

// Sử dụng framer-motion để tạo hiệu ứng
const MotionCard = motion(Card)

const BloodDonationCriteria = () => {
  const criteria = [
    {
      icon: <CreditCard className='text-red-600 h-6 w-6' />,
      text: 'Mang theo chứng minh nhân dân/hộ chiếu hoặc giấy tờ tùy thân có ảnh',
      span: 1
    },
    {
      icon: <User className='text-red-600 h-6 w-6' />,
      text: 'Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV và các bệnh lây qua đường máu',
      span: 1
    },
    {
      icon: <Heart className='text-red-600 h-6 w-6' />,
      text: 'Không nghiện ma túy, rượu bia và các chất kích thích khác',
      span: 1
    },
    {
      icon: <Scale className='text-red-600 h-6 w-6' />,
      text: 'Cân nặng: Nam ≥ 45 kg, Nữ ≥ 45 kg',
      span: 1
    },
    {
      icon: <Calendar className='text-red-600 h-6 w-6' />,
      text: 'Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với hiến máu toàn phần',
      span: 1
    },
    {
      icon: <TestTube className='text-red-600 h-6 w-6' />,
      text: 'Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B',
      span: 1
    }
  ]

  return (
    <div className='py-8 bg-gradient-to-br from-red-500 via-red-600 to-red-500 relative overflow-hidden' id='blood-donation-criteria'>
      {/* iOS style blur circles */}
      <div className='absolute top-0 left-[10%] w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
      <div className='absolute bottom-0 right-[10%] w-40 h-40 bg-red-400/20 rounded-full blur-2xl'></div>
      
      <div className='max-w-7xl mx-auto px-2 relative z-10'>
        <motion.div 
          className='text-center mb-12 lg:mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight'>
            Tiêu chuẩn tham gia hiến máu
          </h2>
          <p className='text-white/90 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed'>
            Để đảm bảo an toàn cho cả người hiến máu và người nhận máu, vui lòng kiểm tra các tiêu chí sau trước khi
            đăng ký hiến máu.
          </p>
          
          {/* iOS style separator */}
          <div className='w-24 h-1 bg-white/20 mx-auto mt-6 rounded-full'></div>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {/* Card hình ảnh - iOS style */}
          <MotionCard
            className='col-span-1 sm:col-span-2 lg:col-span-3 bg-white/95 backdrop-blur-sm overflow-hidden border-none shadow-2xl rounded-3xl mb-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <CardContent className='p-0'>
              <div className='relative h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden'>
                <img
                  src='/images/landing/hm4.jpg'
                  alt='Blood Donation'
                  className='w-full h-full object-cover transition-transform duration-700 hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8 sm:p-10'>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className='mb-6'
                  >
                    <h3 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white leading-tight'>
                      Cứu người thật <span className='text-red-400'>dễ dàng</span>
                    </h3>
                    <p className='text-white/90 mb-6 text-sm sm:text-base md:text-lg max-w-3xl'>
                      Mỗi đơn vị máu hiến tặng có thể cứu sống tới 3 người. Hành động nhỏ của bạn hôm nay có thể tạo nên
                      sự khác biệt lớn cho cuộc sống của người khác.
                    </p>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </MotionCard>

          {/* Các tiêu chí - iOS style cards */}
          {criteria.map((criterion, index) => (
            <MotionCard
              key={index}
              className={`bg-white/95 backdrop-blur-sm col-span-1 ${criterion.span > 1 ? 'sm:col-span-2' : ''} 
                border-none shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <CardContent className='flex items-start gap-4 p-5'>
                <div className='p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm'>
                  {criterion.icon}
                </div>
                <p className='text-gray-700 leading-relaxed text-sm'>{criterion.text}</p>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BloodDonationCriteria
