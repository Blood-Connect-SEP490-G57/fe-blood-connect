import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut, Menu, Bell } from 'lucide-react'
import UserAvatar from '@/components/ui/user-avatar'
import Notifications from '@/components/notification/Notifications'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const navigation = [
    { name: 'TIN TỨC', href: '/news' },
    { name: 'HỎI ĐÁP', href: '/faq' },
    { name: 'LIÊN HỆ', href: '/contact' },
    { name: 'ĐĂNG KÝ HIẾN MÁU', href: '/blood-donation-registration' }
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button')
      ) {
        setIsNotificationOpen(false)
      }
    }

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen])
  const handleNotificationClick = () => {
    navigate('/notifications')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleRegisterClick = () => {
    navigate('/register')
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
            <div className='relative'>
              <Button
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  setIsNotificationOpen((prev) => !prev)
                }}
                className='p-inherit text-red-600 hover:text-white hover:bg-red-600'
              >
                <Bell className='w-full h-full' />
              </Button>
              {isNotificationOpen && (
                <div
                  ref={notificationRef}
                  className='absolute right-0 mt-2 z-50 w-80'
                  onClick={() => handleNotificationClick()}
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                    }
                  }}
                >
                  <Notifications onClose={() => setIsNotificationOpen(false)} />
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                  <UserAvatar
                    size='sm'
                    user={{
                      name: 'Bế Minh',
                      image: undefined
                    }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>Bế Minh</p>
                    <p className='text-xs leading-none text-muted-foreground'>be.minh@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/user-profile-page')}>
                  <User className='mr-2 h-4 w-4' />
                  <span>Hồ sơ cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-red-600'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                className='border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors'
                onClick={handleLoginClick}
              >
                Đăng nhập
              </Button>
              <Button
                variant='default'
                className='bg-red-600 text-white hover:bg-red-700 transition-colors'
                onClick={handleRegisterClick}
              >
                Đăng ký
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button variant='ghost' size='sm' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className='w-6 h-6' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden'>
            <div className='flex flex-col space-y-4 mt-4'>
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className='text-gray-700 hover:text-primary transition-colors'>
                  {item.name}
                </a>
              ))}
              <div className='flex flex-col space-y-2'>
                <Button
                  variant='outline'
                  className='border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors'
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant='default'
                  className='bg-red-600 text-white hover:bg-red-700 transition-colors'
                  onClick={handleRegisterClick}
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
