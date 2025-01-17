import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const navigate = useNavigate()

  const navigation = [
    { name: 'TRANG CHỦ', href: '/' },
    { name: 'TIN TỨC', href: '/news' },
    { name: 'HỎI ĐÁP', href: '/faq' },
    { name: 'LIÊN HỆ', href: '/contact' }
  ]

  const handleLoginClick = () => {
    console.log('User clicked login button')

    navigate('/login')
  }

  return (
    <header className='bg-white shadow-sm'>
      <nav className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <a href='/' className='text-primary font-bold text-xl'>
              Giọt Máu Hi Vọng
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className='text-gray-700 hover:text-primary transition-colors'>
                {item.name}
              </a>
            ))}
            <Button
              variant='default'
              className='bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              onClick={handleLoginClick}
            >
              Đăng nhập
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button variant='ghost' size='sm'>
              <span className='sr-only'>Open menu</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
