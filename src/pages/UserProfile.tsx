import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, CheckCircle, History, Info, User } from 'lucide-react'
import Profile from '@/components/user-profile/Profile'
import AppointmentInfo from '@/components/user-profile/AppointmentInfo'
import DonationHistory from '@/components/user-profile/DonationHistory'
import UserVerificationPage from '../components/user-profile/UserVerification'

const UserProfilePage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('profile')

  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
        return <Profile />
      case 'appointment-info':
        return <AppointmentInfo />
      case 'appointment-history':
        return <DonationHistory />
      case 'verification':
        return <UserVerificationPage />
      default:
        return <Profile />
    }
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
      <div className='w-full md:w-1/4 p-4 bg-white shadow-lg'>
        <Card className='border-none'>
          <CardHeader>
            <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
              <User className='w-5 h-5' />
              Hồ sơ
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <button
              className={`w-full text-left p-2 rounded-md flex items-center gap-2 ${
                selectedOption === 'profile' ? 'bg-red-100' : ''
              }`}
              onClick={() => setSelectedOption('profile')}
            >
              <Info className='w-5 h-5' />
              Thông tin cá nhân
            </button>
            <button
              className={`w-full text-left p-2 rounded-md flex items-center gap-2 ${
                selectedOption === 'appointment-info' ? 'bg-red-100' : ''
              }`}
              onClick={() => setSelectedOption('appointment-info')}
            >
              <Calendar className='w-5 h-5' />
              Lịch Hẹn của Tôi
            </button>
            <button
              className={`w-full text-left p-2 rounded-md flex items-center gap-2 ${
                selectedOption === 'appointment-history' ? 'bg-red-100' : ''
              }`}
              onClick={() => setSelectedOption('appointment-history')}
            >
              <History className='w-5 h-5' />
              Lịch sử đặt hẹn
            </button>
            <button
              className={`w-full text-left p-2 rounded-md flex items-center gap-2 ${
                selectedOption === 'verification' ? 'bg-red-100' : ''
              }`}
              onClick={() => setSelectedOption('verification')}
            >
              <CheckCircle className='w-5 h-5' />
              Xác thực tài khoản
            </button>
          </CardContent>
        </Card>
      </div>
      <div className='w-full md:w-3/4 p-4'>{renderContent()}</div>
    </div>
  )
}

export default UserProfilePage
