import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckCircle, History, Info, User, ChevronRight } from 'lucide-react'
import Profile from '@/components/user-profile/Profile'
import DonationHistory from '@/components/user-profile/DonationHistory'
import { useVerification } from '@/components/verificationContext/VerificationContext'
import Verification from '@/components/user-profile/Verification/Verification'
import { motion, AnimatePresence } from 'framer-motion'
import AppointmentInfo from '@/components/user-profile/AppointmentInfo'

const UserProfilePage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('thong-tin-ca-nhan')
  const { isVerified } = useVerification()
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
 
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const validOptions = ['thong-tin-ca-nhan', 'lich-su-hien-mau']

      if (isVerified === 'NONE') {
        validOptions.push('tao-ho-so-hien-mau')
      }

      // Check if hash contains appointment view pattern
      if (hash.startsWith('xem-lich-hen-')) {
        const id = hash.replace('xem-lich-hen-', '')
        setAppointmentId(id)
        setSelectedOption('xem-lich-hen')
      } else {
        setAppointmentId(null)
        setSelectedOption(validOptions.includes(hash) ? hash : 'thong-tin-ca-nhan')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [isVerified])

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    window.location.hash = option
  }

  const renderContent = () => {
    switch (selectedOption) {
      case 'thong-tin-ca-nhan':
        return <Profile />
      case 'lich-su-hien-mau':
        return <DonationHistory />
      case 'tao-ho-so-hien-mau':
        return isVerified === 'NONE' ? <Verification /> : <Profile />
      case 'xem-lich-hen':
        return <AppointmentInfo appointmentId={appointmentId} />
      default:
        return <Profile />
    }
  }

  const navigationItems = [
    {
      id: 'thong-tin-ca-nhan',
      label: 'Thông tin cá nhân',
      icon: <Info className='w-5 h-5' />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'lich-su-hien-mau',
      label: 'Lịch sử đặt hẹn',
      icon: <History className='w-5 h-5' />,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  // Conditionally add verification option if needed
  if (isVerified === 'NONE') {
    navigationItems.push({
      id: 'tao-ho-so-hien-mau',
      label: 'Tạo hồ sơ hiến máu',
      icon: <CheckCircle className='w-5 h-5' />,
      color: 'bg-red-100 text-red-600'
    })
  }

  return (
    <div className='min-h-screen bg-gray-100 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>

      <div className='max-w-7xl mx-auto py-6 px-4'>
        <motion.div
          className='flex flex-col lg:flex-row gap-6 relative'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sidebar for desktop */}
          <div className='hidden lg:block lg:w-1/4 sticky top-0 h-fit'>
            <Card className='rounded-3xl overflow-hidden border border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg'>
              <CardHeader className='pb-3 border-b border-gray-100'>
                <CardTitle className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 flex items-center gap-2'>
                  <div className='p-2 bg-red-100 rounded-full'>
                    <User className='w-5 h-5 text-red-500' />
                  </div>
                  Hồ sơ của tôi
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 space-y-3'>
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
                      selectedOption === item.id
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick(item.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className='flex items-center gap-3'>
                      <div className={`p-2 rounded-full ${selectedOption === item.id ? 'bg-white/20' : item.color}`}>
                        {item.icon}
                      </div>
                      <span className='font-medium'>{item.label}</span>
                    </div>
                    {selectedOption === item.id && (
                      <div className='text-white'>
                        <ChevronRight className='w-5 h-5' />
                      </div>
                    )}
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={selectedOption}
              className='w-full lg:w-3/4'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfilePage
