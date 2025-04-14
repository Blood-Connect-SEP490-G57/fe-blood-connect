import React from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Users, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

const HeroSection: React.FC = () => {
  const stats = [
    { value: '1,234+', label: 'Người hiến máu' },
    { value: '98%', label: 'Độ an toàn' },
    { value: '5,670', label: 'Người được cứu' }
  ]

  // Thêm các hàm xử lý cuộn trang
  const scrollToRegister = () => {
    const element = document.getElementById('blood-donation-slider')
    if (element) {
      const offset = 80 // Điều chỉnh offset tùy theo chiều cao của header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToLearnMore = () => {
    const element = document.getElementById('blood-donation-criteria')
    if (element) {
      const offset = 80 // Điều chỉnh offset tùy theo chiều cao của header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className='relative pt-20 pb-4 overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-500'>
      {/* Background Pattern - iOS style subtle pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* iOS style floating circles decoration */}
      <div className='absolute top-20 left-[10%] w-24 h-24 bg-white opacity-10 rounded-full blur-xl'></div>
      <div className='absolute bottom-20 right-[15%] w-32 h-32 bg-red-300 opacity-20 rounded-full blur-xl'></div>
      <div className='absolute top-40 right-[20%] w-16 h-16 bg-red-200 opacity-20 rounded-full blur-md'></div>

      <div className='max-w-7xl mx-auto px-2 relative'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
          {/* Left Content */}
          <motion.div 
            className='lg:w-1/2 text-white z-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-8 border border-white/20 shadow-sm'>
              <motion.span 
                className='mr-2'
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
              >
                🩸
              </motion.span>
              <span>Mỗi giọt máu là một món quà của sự sống</span>
            </div>

            <h1 className='text-4xl lg:text-5xl font-bold mb-6 leading-tight'>
              Giọt Máu Hi Vọng
              <span className='block text-xl lg:text-2xl font-normal mt-3 text-red-50 opacity-90'>
                Kết nối yêu thương - Lan tỏa sự sống
              </span>
            </h1>

            <p className='text-base lg:text-lg mb-8 text-red-50 leading-relaxed max-w-xl opacity-90 text-justify'>
              Mỗi giọt máu hiến tặng là một cơ hội để cứu sống người khác. Hãy chung tay vì một cộng đồng khỏe mạnh và
              nhân ái.
            </p>

            <div className='flex flex-wrap gap-4'>
                <Button
                size='lg'
                className='bg-white text-red-600 hover:bg-red-50 rounded-full shadow-lg group transition-all duration-300 font-medium px-8'
                onClick={scrollToRegister}
                >
                Đăng Ký Ngay
                </Button>
                <Button
                size='lg'
                variant='outline'
                className='bg-transparent border-white text-white hover:bg-white/10 rounded-full shadow-md transition-all duration-300 px-8'
                onClick={scrollToLearnMore}
                >
                Tìm Hiểu Thêm
                </Button>
            </div>

            {/* Stats with iOS styling */}
            <div className='grid grid-cols-3 mt-4 pt-4 border-t border-white/20'>
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.value + stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index + 0.3 }}
                  className='flex flex-col items-center text-center'
                >
                  <div className='text-3xl font-bold'>{stat.value}</div>
                  <div className='text-red-100 mt-1 text-sm'>{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            {/* iOS style scroll indicator */}
            <motion.div 
              className='hidden lg:flex justify-center mt-12'
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className='flex flex-col items-center'>
                <span className='text-xs text-white/70 mb-2'>Cuộn xuống</span>
                <ChevronDown className='h-5 w-5 text-white/70 animate-bounce' />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <HeroImage />
        </div>
      </div>
    </section>
  )
}

const HeroImage: React.FC = () => {
  const floatingCards = [
    {
      position: '-bottom-6 -left-6',
      icon: <Heart className='h-5 w-5 text-red-600' />,
      title: 'Cứu sống',
      subtitle: '3 người/ngày'
    },
    {
      position: '-top-6 -right-4',
      icon: <Users className='h-5 w-5 text-red-600' />,
      title: 'Tình nguyện viên',
      subtitle: '500+ người'
    }
  ]

  return (
    <motion.div 
      className='lg:w-1/2 relative'
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      {/* iOS blur background */}
      <div className='absolute -inset-4 bg-gradient-to-br from-red-400/30 to-red-600/30 rounded-full blur-3xl'></div>
      
      {/* iOS card style with shadow and rounded corners */}
      <div className='relative bg-gradient-to-br from-white to-gray-50 p-5 rounded-3xl shadow-2xl overflow-hidden'>
        <img
          src='/images/landing/landing.png'
          alt='Blood Donation'
          className='relative rounded-2xl shadow-md transform hover:scale-[1.02] transition-transform duration-500'
        />
        
        {/* iOS style drop shadow behind the image */}
        <div className='absolute inset-0 rounded-2xl opacity-30 blur-md -z-10'
          style={{
            background: 'linear-gradient(45deg, rgba(239,68,68,0.4) 0%, rgba(239,68,68,0.1) 100%)'
          }}
        ></div>
      </div>

      {/* iOS style floating cards with subtle shadows */}
      {floatingCards.map((card, index) => (
        <motion.div
          key={index}
          className={`absolute ${card.position} bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/80 ${
            index > 0 ? 'delay-150' : ''
          }`}
          initial={{ opacity: 0, y: index === 0 ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.5 + index * 0.2,
          }}
        >
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-50 rounded-full shadow-sm'>{card.icon}</div>
            <div>
              <div className='text-sm font-semibold text-gray-800'>{card.title}</div>
              <div className='text-xs text-gray-500'>{card.subtitle}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default HeroSection
