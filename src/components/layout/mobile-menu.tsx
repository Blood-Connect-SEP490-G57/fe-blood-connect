import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Calendar, User, History, CheckCircle } from 'lucide-react'
import { useMenuStore } from '@/hooks/stores/menuStore'
import { useVerification } from '../verificationContext/VerificationContext'
import { useAuth } from '../authContext/AuthContext'

const MobileMenu: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isHeaderMenuOpen } = useMenuStore()
  const { isVerified } = useVerification()
  const { isLoggedIn } = useAuth()
  const navigationItems = [
    { id: 'trang-chu', label: 'Trang chủ', icon: <Home className='w-5 h-5' />, path: '/' },
    { id: 'dang-ky-hien-mau', label: 'Đăng ký', icon: <Calendar className='w-5 h-5' />, path: '/dang-ky-hien-mau' }
  ]

 

  if (!isLoggedIn) {
    navigationItems.push({
      id: 'dang-nhap',
      label: 'Đăng nhập',
      icon: <User className='w-5 h-5' />,
      path: '/dang-nhap'
    })
  }

  if (!isLoggedIn) {
    navigationItems.push({
      id: 'dang-ky',
      label: 'Đăng ký',
      icon: <User className='w-5 h-5' />,
      path: '/dang-ky'
    })
  }

  if (isLoggedIn) {
    navigationItems.push({
      id: 'trang-ca-nhan',
      label: 'Thông tin',
      icon: <User className='w-5 h-5' />,
      path: '/trang-ca-nhan#thong-tin-ca-nhan'
    })
  }

  if (isLoggedIn) {
    navigationItems.push({
      id: 'lich-su-hien-mau',
      label: 'Lịch sử đặt hẹn',
      icon: <History className='w-5 h-5' />,
      path: '/trang-ca-nhan#lich-su-hien-mau'
    })
  }

  if (isVerified === 'NONE') {
    navigationItems.push({
      id: 'tao-ho-so-hien-mau',
      label: 'Hồ sơ hiến máu',
      icon: <CheckCircle className='w-5 h-5' />,
      path: '/trang-ca-nhan#tao-ho-so-hien-mau'
    })
  }

  const isActive = (path: string) => {
    const [pathname, hash] = path.split('#')
    if (hash) {
      return location.pathname === pathname && location.hash === `#${hash}`
    }
    return location.pathname === path
  }

  if (isHeaderMenuOpen) return null

  return (
    <div className='lg:hidden md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-[999]'>
      <div className='flex justify-around'>
        {navigationItems.map((item) => (
          <motion.button
            key={item.id}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${
              isActive(item.path) ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`p-2 rounded-full ${isActive(item.path) ? 'bg-red-100' : 'bg-gray-100'}`}>{item.icon}</div>
            <span className='text-xs font-medium'>{item.label.split(' ').slice(0, 2).join(' ')}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default MobileMenu
