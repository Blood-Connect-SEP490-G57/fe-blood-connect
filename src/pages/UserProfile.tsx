import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, CheckCircle, History, Info, User } from 'lucide-react'
import Profile from '@/components/user-profile/Profile'
import AppointmentInfo from '@/components/user-profile/AppointmentInfo'
import DonationHistory from '@/components/user-profile/DonationHistory'
// import UserVerification from '@/components/user-profile/UserVerification'
import { useVerification } from '@/components/verificationContext/VerificationContext'
import Verification from '@/components/user-profile/Verification/Verification'

const UserProfilePage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('thong-tin-ca-nhan')
  const { isVerified } = useVerification()

  useEffect(() => {
    console.log('UserProfile - Current verification status:', isVerified)
  }, [isVerified])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const validOptions = ['thong-tin-ca-nhan', 'lich-hen', 'lich-su-hien-mau']

      if (isVerified === 'NONE') {
        validOptions.push('xac-thuc-tai-khoan')
      }

      setSelectedOption(validOptions.includes(hash) ? hash : 'thong-tin-ca-nhan')
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
      case 'lich-hen':
        return <AppointmentInfo />
      case 'lich-su-hien-mau':
        return <DonationHistory />
      case 'xac-thuc-tai-khoan':
        return isVerified === 'NONE' ? <Verification /> : <Profile />
      default:
        return <Profile />
    }
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='hidden md:flex md:w-1/4 p-4 bg-white shadow-lg sticky top-0 overflow-y-auto'>
        <Card className='border-none w-full'>
          <CardHeader>
            <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
              <User className='w-5 h-5' />
              Hồ sơ
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <button
              className={`w-full text-left p-3 rounded-md flex items-center gap-2 ${
                selectedOption === 'thong-tin-ca-nhan' ? 'bg-red-100' : ''
              }`}
              onClick={() => handleOptionClick('thong-tin-ca-nhan')}
            >
              <Info className='w-5 h-5' />
              Thông tin cá nhân
            </button>
            <button
              className={`w-full text-left p-3 rounded-md flex items-center gap-2 ${
                selectedOption === 'lich-hen' ? 'bg-red-100' : ''
              }`}
              onClick={() => handleOptionClick('lich-hen')}
            >
              <Calendar className='w-5 h-5' />
              Lịch hẹn của tôi
            </button>
            <button
              className={`w-full text-left p-3 rounded-md flex items-center gap-2 ${
                selectedOption === 'lich-su-hien-mau' ? 'bg-red-100' : ''
              }`}
              onClick={() => handleOptionClick('lich-su-hien-mau')}
            >
              <History className='w-5 h-5' />
              Lịch sử đặt hẹn
            </button>

            {isVerified === 'NONE' && (
              <button
                className={`w-full text-left p-3 rounded-md flex items-center gap-2 ${
                  selectedOption === 'xac-thuc-tai-khoan' ? 'bg-red-100' : ''
                }`}
                onClick={() => handleOptionClick('xac-thuc-tai-khoan')}
              >
                <CheckCircle className='w-5 h-5' />
                Xác thực tài khoản
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='w-full md:w-3/4 p-6 md:p-8 lg:p-10'>{renderContent()}</div>
    </div>
  )
}

export default UserProfilePage
