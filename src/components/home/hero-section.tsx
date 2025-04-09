import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Users } from 'lucide-react'

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
    <section className='relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-red-400'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 relative'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
          {/* Left Content */}
          <div className='lg:w-1/2 text-white z-10'>
            <div className='inline-flex items-center px-4 py-2 bg-red-700/30 rounded-full text-sm mb-8'>
              <span className='animate-pulse mr-2'>🩸</span>
              <span>Mỗi giọt máu là một món quà của sự sống</span>
            </div>

            <h1 className='text-4xl lg:text-6xl font-bold mb-6 leading-tight'>
              Giọt Máu Hy Vọng
              <span className='block text-2xl lg:text-3xl font-normal mt-4 text-red-100'>
                Kết nối yêu thương - Lan tỏa sự sống
              </span>
            </h1>

            <p className='text-lg mb-8 text-red-50 leading-relaxed max-w-xl'>
              Mỗi giọt máu hiến tặng là một cơ hội để cứu sống người khác. Hãy chung tay vì một cộng đồng khỏe mạnh và
              nhân ái.
            </p>

            <div className='flex flex-wrap gap-4'>
              <Button
                size='lg'
                variant='secondary'
                className='group font-semibold'
                onClick={scrollToRegister} // Thêm sự kiện click
              >
                Đăng Ký Ngay
                <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='bg-transparent border-white text-white hover:bg-white/10'
                onClick={scrollToLearnMore} // Thêm sự kiện click
              >
                Tìm Hiểu Thêm
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-red-400/30'>
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className='text-3xl font-bold'>{stat.value}</div>
                  <div className='text-red-100 mt-1'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

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
      icon: <Heart className='h-6 w-6 text-red-600' />,
      title: 'Cứu sống',
      subtitle: '3 người/ngày'
    },
    {
      position: '-top-6 -right-6',
      icon: <Users className='h-6 w-6 text-red-600' />,
      title: 'Tình nguyện viên',
      subtitle: '500+ người'
    }
  ]

  return (
    <div className='lg:w-1/2 relative'>
      <div className='absolute -inset-4 bg-red-600/20 rounded-full blur-3xl animate-pulse' />
      <img
        src='/images/landing/landing.png'
        alt='Blood Donation'
        className='relative rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500 hover:shadow-red-500/50'
      />

      {floatingCards.map((card, index) => (
        <div
          key={index}
          className={`absolute ${card.position} bg-white p-4 rounded-lg shadow-xl animate-bounce-slow ${
            index > 0 ? 'delay-150' : ''
          }`}
        >
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-100 rounded-full'>{card.icon}</div>
            <div>
              <div className='text-sm font-semibold'>{card.title}</div>
              <div className='text-xs text-gray-500'>{card.subtitle}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HeroSection
