import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  User,
  Settings,
  LogOut,
  Bell,
  LogInIcon,
  UserPlusIcon,
  Home,
  Newspaper,
  HelpCircle,
  Phone,
  Calendar,
  Lock,
  X
} from 'lucide-react'
import UserAvatar from '@/components/ui/user-avatar'
import Notifications from '@/components/notification/Notifications'
import { useAuth } from '@/components/authContext/AuthContext'
import { useVerification } from '../verificationContext/VerificationContext'
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications'
import { AnimatePresence } from 'framer-motion'
import { useMenuStore } from '@/hooks/stores/menuStore'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileNotiOpen, setIsMobileNotiOpen] = useState(false)
  const { isHeaderMenuOpen, setHeaderMenuOpen } = useMenuStore()
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const { isVerified } = useVerification()
  const { unreadCount } = useUnreadNotifications()

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    setIsMobileNotiOpen(false)
    navigate('/dang-nhap')
  }

  // Base navigation items excluding verification
  const baseNavigation = [
    { name: 'TRANG CHỦ', href: '/', icon: <Home className='w-4 h-4 mr-2' /> },
    { name: 'TIN TỨC', href: '/tin-tuc', icon: <Newspaper className='w-4 h-4 mr-2' /> },
    { name: 'HỎI ĐÁP', href: '/cau-hoi-thuong-gap', icon: <HelpCircle className='w-4 h-4 mr-2' /> },
    { name: 'LIÊN HỆ', href: '/lien-he', icon: <Phone className='w-4 h-4 mr-2' /> },
    { name: 'ĐĂNG KÝ HIẾN MÁU', href: '/dang-ky-hien-mau', icon: <Calendar className='w-4 h-4 mr-2' /> }
  ]

  // User-specific navigation items
  const userNavigation = isLoggedIn
    ? [
        {
          name: 'LỊCH SỬ ĐẶT HẸN',
          href: '/trang-ca-nhan#lich-su-hien-mau',
          icon: <Calendar className='w-4 h-4 mr-2' />
        },
        {
          name: 'THÔNG TIN CÁ NHÂN',
          href: '/trang-ca-nhan#thong-tin-ca-nhan',
          icon: <User className='w-4 h-4 mr-2' />
        },
        { name: 'ĐỔI MẬT KHẨU', href: '/doi-mat-khau', icon: <Lock className='w-4 h-4 mr-2' /> }
      ]
    : []

  // Add verification link if needed
  const getFilteredNavigation = () => {
    let navigation = [...baseNavigation]

    if (isLoggedIn) {
      if (isVerified === 'NONE') {
        navigation.push({
          name: 'TẠO HỒ SƠ HIẾN MÁU',
          href: '/trang-ca-nhan#tao-ho-so-hien-mau',
          icon: <User className='w-4 h-4 mr-2' />
        })
      }
      navigation = [...navigation, ...userNavigation]
    }

    return navigation
  }

  const handleLoginClick = () => {
    navigate('/dang-nhap')
  }

  const handleRegisterClick = () => {
    navigate('/dang-ky')
  }

  const handleNotificationClose = () => {
    setIsMobileNotiOpen(false)
  }

  // Get current page for active status
  const isActive = (path: string) => {
    const [basePath, hash] = path.split('#')
    const isPathMatch = location.pathname === basePath
    const isHashMatch = !hash || location.hash === `#${hash}`
    return isPathMatch && isHashMatch
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className='max-w-7xl mx-auto px-2'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <a href='/' className='flex items-center'>
              <img src='./images/icon/logo.png' alt='Giọt Máu Hy Vọng' className='h-12 w-30 ml-2' />
            </a>
          </div>

          {/* Desktop and Tablet Navigation */}
          <div className='hidden lg:flex items-center space-x-6'>
            {getFilteredNavigation()
              .filter((item) => {
                if (!isLoggedIn && (item.name === 'LỊCH HẸN CỦA TÔI' || item.name === 'LỊCH SỬ ĐẶT HẸN')) {
                  return false
                }
                return (
                  item.name !== 'TẠO HỒ SƠ HIẾN MÁU' &&
                  item.name !== 'THÔNG TIN CÁ NHÂN' &&
                  item.name !== 'ĐỔI MẬT KHẨU'
                )
              })
              .map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium px-3 py-2 rounded-full ${
                    isActive(item.href)
                      ? 'text-gray-700 underline underline-offset-4 decoration-2 decoration-red-500'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
          </div>

          <div className='hidden lg:flex items-center space-x-3'>
            {isLoggedIn ? (
              <>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setIsMobileNotiOpen((prev) => !prev)
                    setHeaderMenuOpen(false)
                  }}
                  className='group relative rounded-full p-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100'
                >
                  <div className='relative w-full h-full'>
                    <Bell className='group-hover:text-white w-5 h-5' />
                    {unreadCount > 0 && (
                      <span className='absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center shadow-sm'>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='relative rounded-full overflow-hidden p-0 h-10 w-10 border-2 border-red-100 hover:border-red-200'
                    >
                      <UserAvatar size='sm' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-64 mt-2 rounded-2xl bg-white shadow-xl border border-gray-100 p-1.5'
                    align='end'
                  >
                    <DropdownMenuItem
                      onClick={() => navigate('/trang-ca-nhan#thong-tin-ca-nhan')}
                      className='rounded-xl hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 gap-3 cursor-pointer p-3 mb-1'
                    >
                      <div className='p-2 bg-red-100 rounded-full text-red-600'>
                        <User className='h-4 w-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-medium'>Hồ sơ cá nhân</span>
                        <span className='text-xs text-gray-500'>Xem thông tin tài khoản</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/doi-mat-khau')}
                      className='rounded-xl hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 gap-3 cursor-pointer p-3 mb-1'
                    >
                      <div className='p-2 bg-red-100 rounded-full text-red-600'>
                        <Settings className='h-4 w-4' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-medium'>Đổi mật khẩu</span>
                        <span className='text-xs text-gray-500'>Đổi mật khẩu tài khoản</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className='my-1.5 bg-gray-100' />
                    <DropdownMenuItem
                      className='rounded-xl bg-red-50 hover:bg-red-100 focus:bg-red-100 text-red-600 gap-3 cursor-pointer p-3'
                      onClick={handleLogout}
                    >
                      <div className='p-2 bg-white rounded-full text-red-600'>
                        <LogOut className='h-4 w-4' />
                      </div>
                      <span className='font-medium'>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className='flex items-center gap-3'>
                <Button
                  variant='outline'
                  className='rounded-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700'
                  onClick={handleRegisterClick}
                >
                  <UserPlusIcon className='w-4 h-4 mr-1.5' />
                  Đăng ký
                </Button>

                <Button
                  variant='default'
                  className='rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600'
                  onClick={handleLoginClick}
                >
                  <LogInIcon className='w-4 h-4 mr-1.5' />
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden flex items-center space-x-2 mr-2'>
            {isLoggedIn && location.pathname !== '/dang-nhap' && location.pathname !== '/dang-ky' && (
              <Button
                variant='ghost'
                data-notifications-trigger
                onClick={() => {
                  setIsMobileNotiOpen((prev) => !prev)
                  setHeaderMenuOpen(false)
                }}
                className='group relative rounded-full p-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100'
              >
                <div className='relative w-full h-full'>
                  <Bell className='w-6 h-6' />
                  {unreadCount > 0 && (
                    <span className='absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center md:min-w-[20px] md:px-2 md:py-1 md:text-sm'>
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isHeaderMenuOpen && (
            <>
              <div
                className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                onClick={() => setHeaderMenuOpen(false)}
              />
              <div className='fixed inset-y-0 right-0 w-full sm:w-[320px] h-full z-50 overflow-y-auto bg-white shadow-xl'>
                <div className='p-4 flex flex-col gap-2'>
                  <div className='flex justify-end mb-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setHeaderMenuOpen(false)}
                      className='rounded-full p-2 text-gray-500 hover:text-red-600 hover:bg-red-50'
                    >
                      <X className='w-5 h-5' />
                    </Button>
                  </div>
                  {getFilteredNavigation()
                    .filter((item) => {
                      if (
                        !isLoggedIn &&
                        (item.name === 'LỊCH SỬ ĐẶT HẸN' ||
                          item.name === 'THÔNG TIN CÁ NHÂN' ||
                          item.name === 'ĐỔI MẬT KHẨU' ||
                          item.name === 'TẠO HỒ SƠ HIẾN MÁU')
                      ) {
                        return false
                      }
                      return true
                    })
                    .map((item) => (
                      <div
                        key={item.name}
                        className='flex items-center p-3 rounded-xl hover:bg-red-50 active:bg-red-100 cursor-pointer'
                        onClick={() => {
                          setHeaderMenuOpen(false)
                          const [pathname, hash] = item.href.split('#')
                          if (location.pathname === pathname) {
                            window.location.hash = hash || ''
                            if (hash) {
                              const element = document.getElementById(hash)
                              element?.scrollIntoView({ behavior: 'smooth' })
                            }
                          } else {
                            navigate(item.href)
                          }
                        }}
                      >
                        <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-3'>
                          {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                        </div>
                        <div className='font-medium text-gray-800'>{item.name}</div>
                      </div>
                    ))}

                  {/* Phần tài khoản */}
                  <hr className='my-2' />
                  <div className='pt-2 border-t border-gray-100'>
                    {isLoggedIn ? (
                      <div
                        className='flex items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 cursor-pointer'
                        onClick={() => {
                          setHeaderMenuOpen(false)
                          handleLogout()
                        }}
                      >
                        <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-3'>
                          <LogOut className='h-5 w-5 text-red-600' />
                        </div>
                        <div className='font-medium text-gray-800'>Đăng xuất</div>
                      </div>
                    ) : (
                      <>
                        <div
                          className='flex items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 mb-2 cursor-pointer'
                          onClick={() => {
                            setHeaderMenuOpen(false)
                            handleLoginClick()
                          }}
                        >
                          <div className='w-12 h-12 rounded-full bg-red-200 flex items-center justify-center mr-3'>
                            <LogInIcon className='h-5 w-5 text-red-600' />
                          </div>
                          <div className='font-medium text-gray-800'>Đăng nhập</div>
                        </div>
                        <div
                          className='flex items-center p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 cursor-pointer'
                          onClick={() => {
                            setHeaderMenuOpen(false)
                            handleRegisterClick()
                          }}
                        >
                          <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-3'>
                            <UserPlusIcon className='h-5 w-5 text-white' />
                          </div>
                          <div className='font-medium text-white'>Đăng ký</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Notification */}
        <AnimatePresence>
          {isMobileNotiOpen && (
            <>
              <div
                className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                onClick={() => setIsMobileNotiOpen(false)}
              />
              <div className='fixed top-[70px] right-0 max-h-[80vh] w-full max-w-sm z-50 overflow-auto rounded-tl-2xl rounded-bl-2xl bg-white shadow-xl'>
                <div className='p-2'>
                  <Notifications onClose={handleNotificationClose} />
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
