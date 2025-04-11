import React, { useState, useEffect } from 'react'
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
  Menu,
  Bell,
  LogInIcon,
  UserPlusIcon,
  Home,
  Newspaper,
  HelpCircle,
  Phone,
  Calendar
} from 'lucide-react'
import UserAvatar from '@/components/ui/user-avatar'
import Notifications from '@/components/notification/Notifications'
import { useAuth } from '@/components/authContext/AuthContext'
import { useVerification } from '../verificationContext/VerificationContext'
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications'
import { motion, AnimatePresence } from 'framer-motion'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileNotiOpen, setIsMobileNotiOpen] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const { isVerified } = useVerification()
  const { unreadCount } = useUnreadNotifications()
  const [scrolled, setScrolled] = useState(false)

  // Monitor scrolling for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (
      location.pathname === '/trang-ca-nhan' &&
      (location.hash === '#lich-hen' ||
        location.hash === '#thong-tin-ca-nhan' ||
        location.hash === '#lich-su-hien-mau' ||
        location.hash === '#xac-thuc-tai-khoan')
    ) {
      setIsMobileMenuOpen(false)
      setIsMobileNotiOpen(false)
    }
  }, [location])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsMobileNotiOpen(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('.mobile-menu') && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [setIsLoggedIn])

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    setIsMobileNotiOpen(false)
    navigate('/dang-nhap')
  }

  const navigation = [
    { name: 'TRANG CHỦ', href: '/', icon: <Home className='w-4 h-4 mr-2' /> },
    { name: 'TIN TỨC', href: '/tin-tuc', icon: <Newspaper className='w-4 h-4 mr-2' /> },
    { name: 'HỎI ĐÁP', href: '/cau-hoi-thuong-gap', icon: <HelpCircle className='w-4 h-4 mr-2' /> },
    { name: 'LIÊN HỆ', href: '/lien-he', icon: <Phone className='w-4 h-4 mr-2' /> },
    { name: 'ĐĂNG KÝ HIẾN MÁU', href: '/dang-ky-hien-mau', icon: <Calendar className='w-4 h-4 mr-2' /> },
    { name: 'LỊCH HẸN CỦA TÔI', href: '/trang-ca-nhan#lich-hen', icon: <Calendar className='w-4 h-4 mr-2' /> },
    { name: 'LỊCH SỬ ĐẶT HẸN', href: '/trang-ca-nhan#lich-su-hien-mau', icon: <Calendar className='w-4 h-4 mr-2' /> },
    { name: 'THÔNG TIN CÁ NHÂN', href: '/trang-ca-nhan#thong-tin-ca-nhan', icon: <User className='w-4 h-4 mr-2' /> },
    { name: 'CÀI ĐẶT', href: '/cai-dat', icon: <Settings className='w-4 h-4 mr-2' /> }
  ]

  // Add verification link dynamically if not verified
  const getFilteredNavigation = () => {
    const filteredNav = [...navigation]
    if (isVerified === 'NONE' && isLoggedIn) {
      filteredNav.splice(8, 0, {
        name: 'XÁC THỰC TÀI KHOẢN',
        href: '/trang-ca-nhan#xac-thuc-tai-khoan',
        icon: <User className='w-4 h-4 mr-2' />
      })
    }
    return filteredNav
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
    const [basePath, hash] = path.split('#') // Tách pathname và hash
    const isPathMatch = location.pathname === basePath // Kiểm tra pathname
    const isHashMatch = !hash || location.hash === `#${hash}` // Kiểm tra hash (nếu có)
    return isPathMatch && isHashMatch
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white shadow-sm'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <motion.div
            className='flex items-center'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href='/' className='flex items-center'>
              <img src='./images/icon/icon.png' alt='Giọt Máu Hy Vọng' className='h-12 w-12 ml-2' />
            </a>
          </motion.div>

          {/* Desktop and Tablet Navigation */}
          <div className='hidden xl:flex items-center space-x-6'>
            {getFilteredNavigation()
              .filter((item) => {
                if (!isLoggedIn && (item.name === 'LỊCH HẸN CỦA TÔI' || item.name === 'LỊCH SỬ ĐẶT HẸN')) {
                  return false
                }
                return (
                  item.name !== 'XÁC THỰC TÀI KHOẢN' && item.name !== 'THÔNG TIN CÁ NHÂN' && item.name !== 'CÀI ĐẶT'
                )
              })
              .map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-full ${
                    isActive(item.href)
                      ? 'text-gray-700 underline underline-offset-4 decoration-2 decoration-red-500'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
          </div>

          <div className='hidden xl:flex items-center space-x-3'>
            {isLoggedIn ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant='ghost'
                    onClick={() => {
                      setIsMobileNotiOpen((prev) => !prev)
                      setIsMobileMenuOpen(false)
                    }}
                    className='group relative rounded-full p-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100'
                  >
                    <div className='relative w-full h-full'>
                      <Bell className='group-hover:text-white w-5 h-5' />
                      {unreadCount > 0 && (
                        <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center shadow-sm'>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </Button>
                </motion.div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant='ghost'
                        className='relative rounded-full overflow-hidden p-0 h-10 w-10 border-2 border-red-100 hover:border-red-200 transition-colors shadow-sm'
                      >
                        <UserAvatar size='sm' />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-64 mt-2 rounded-2xl backdrop-blur-sm bg-white/95 shadow-xl border border-gray-100 p-1.5 overflow-hidden'
                    align='end'
                    forceMount
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownMenuItem
                        onClick={() => navigate('/trang-ca-nhan#thong-tin-ca-nhan')}
                        className='rounded-xl hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 gap-3 cursor-pointer p-3 mb-1 transition-all duration-200'
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
                        onClick={() => navigate('/cai-dat')}
                        className='rounded-xl hover:bg-red-50 focus:bg-red-50 hover:text-red-600 focus:text-red-600 gap-3 cursor-pointer p-3 mb-1 transition-all duration-200'
                      >
                        <div className='p-2 bg-red-100 rounded-full text-red-600'>
                          <Settings className='h-4 w-4' />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-medium'>Cài đặt</span>
                          <span className='text-xs text-gray-500'>Tùy chỉnh tài khoản</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className='my-1.5 bg-gray-100' />
                      <DropdownMenuItem
                        className='rounded-xl bg-red-50 hover:bg-red-100 focus:bg-red-100 text-red-600 gap-3 cursor-pointer p-3 transition-all duration-200'
                        onClick={handleLogout}
                      >
                        <div className='p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-600 shadow-sm'>
                          <LogOut className='h-4 w-4' />
                        </div>
                        <span className='font-medium'>Đăng xuất</span>
                      </DropdownMenuItem>
                    </motion.div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className='flex items-center gap-3'>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant='outline'
                    className='rounded-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all'
                    onClick={handleLoginClick}
                  >
                    <LogInIcon className='w-4 h-4 mr-1.5' />
                    Đăng nhập
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant='default'
                    className='rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all shadow-sm'
                    onClick={handleRegisterClick}
                  >
                    <UserPlusIcon className='w-4 h-4 mr-1.5' />
                    Đăng ký
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='xl:hidden flex items-center space-x-2'>
            {isLoggedIn && location.pathname !== '/dang-nhap' && location.pathname !== '/dang-ky' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant='ghost'
                  data-notifications-trigger
                  onClick={() => {
                    setIsMobileNotiOpen((prev) => !prev)
                    setIsMobileMenuOpen(false)
                  }}
                  className='group relative rounded-full p-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100'
                >
                  <div className='relative w-full h-full'>
                    <Bell className='w-5 h-5' />
                    {unreadCount > 0 && (
                      <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center'>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                  setIsMobileNotiOpen(false)
                }}
                className='rounded-full p-2 text-red-600 hover:bg-red-50'
              >
                <Menu className='w-6 h-6' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                className='fixed top-[70px] right-0 max-h-[80vh] w-full max-w-sm z-50 overflow-auto rounded-tl-2xl rounded-bl-2xl bg-white/95 backdrop-blur-md shadow-xl'
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className='p-4 flex flex-col gap-2'>
                  {getFilteredNavigation()
                    .filter((item) => {
                      if (
                        !isLoggedIn &&
                        (item.name === 'LỊCH HẸN CỦA TÔI' ||
                          item.name === 'LỊCH SỬ ĐẶT HẸN' ||
                          item.name === 'THÔNG TIN CÁ NHÂN' ||
                          item.name === 'CÀI ĐẶT' ||
                          item.name === 'XÁC THỰC TÀI KHOẢN')
                      ) {
                        return false
                      }
                      return true
                    })
                    .map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className='flex items-center p-3 rounded-xl hover:bg-red-50 transition-all'
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          navigate(item.href)
                        }}
                      >
                        <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3'>
                          <span className='h-4 w-4'> {item.icon} </span>
                        </div>
                        <div>
                          <div className='font-medium'>{item.name}</div>
                        </div>
                      </motion.div>
                    ))}

                  {isLoggedIn ? (
                    <>
                      <hr className='my-2' />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: getFilteredNavigation().length * 0.05 }}
                        className='flex items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-all'
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleLogout()
                        }}
                      >
                        <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3'>
                          <LogOut className='h-5 w-5 text-red-500' />
                        </div>
                        <div className='font-medium'>Đăng xuất</div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <hr className='my-2' />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='flex items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-all'
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleLoginClick()
                        }}
                      >
                        <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3'>
                          <LogInIcon className='h-5 w-5 text-red-500' />
                        </div>
                        <div className='font-medium'>Đăng nhập</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className='flex items-center p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all'
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleRegisterClick()
                        }}
                      >
                        <div className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3'>
                          <UserPlusIcon className='h-5 w-5 text-white' />
                        </div>
                        <div className='font-medium text-white'>Đăng ký</div>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Notification */}
        <AnimatePresence>
          {isMobileNotiOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                onClick={() => setIsMobileNotiOpen(false)}
              />
              <motion.div
                className='fixed top-[70px] right-0 max-h-[80vh] w-full max-w-sm z-50 overflow-auto rounded-tl-2xl rounded-bl-2xl bg-white/95 backdrop-blur-md shadow-xl'
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className='p-2'>
                  <Notifications onClose={handleNotificationClose} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
