import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, CheckCircle, History, Info, User, Loader2 } from 'lucide-react'
import Profile from '@/components/user-profile/Profile'
import AppointmentInfo from '@/components/user-profile/AppointmentInfo'
import DonationHistory from '@/components/user-profile/DonationHistory'
import UserVerification from '@/components/user-profile/UserVerification'
import { CheckExtractStatus } from '@/api/extract'
import { toast } from '@/components/ui/use-toast'

const UserProfilePage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('thong-tin-ca-nhan')
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const hasFetched = useRef(false)
  // Effect to initialize state on mount from the URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && ['thong-tin-ca-nhan', 'lich-hen', 'lich-su-hien-mau', 'xac-thuc-tai-khoan'].includes(hash)) {
        setSelectedOption(hash)
      }
    }
    // Set the initial option from URL
    handleHashChange()

    // Add an event listener for hash changes
    window.addEventListener('hashchange', handleHashChange)

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    // Update the URL hash without reloading the page
    window.location.hash = option 
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const checkVerificationStatus = async () => {
      try {
        setIsCheckingStatus(true)
        const response = await CheckExtractStatus()

        if (response.success && response.data) {
          setIsVerified(response.data.status === 1)
          if (response.data.status === 1 && selectedOption === 'verification') {
            setSelectedOption('profile')
            window.location.hash = 'profile'
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error)
        toast({
          title: 'Lỗi kiểm tra trạng thái',
          description: 'Không thể kiểm tra trạng thái xác thực',
          variant: 'destructive'
        })
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkVerificationStatus()
  }, [selectedOption])

  const renderContent = () => {
    if (isCheckingStatus) {
      return (
        <div className='flex flex-col items-center justify-center h-full py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-red-600 mb-4' />
          <p className='text-gray-600'>Đang tải thông tin...</p>
        </div>
      )
    }

    switch (selectedOption) {
      case 'thong-tin-ca-nhan':
        return <Profile />
      case 'lich-hen':
        return <AppointmentInfo />
      case 'lich-su-hien-mau':
        return <DonationHistory />
      case 'xac-thuc-tai-khoan':
        // Chỉ hiển thị UserVerification nếu chưa xác thực
        return isVerified ? <Profile /> : <UserVerification />
      default:
        return <Profile />
    }
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='hidden md:flex md:w-1/4 p-4 bg-white shadow-lg sticky top-0 h-screen overflow-y-auto'>
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
              Lịch Hẹn của Tôi
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

            {!isVerified && (
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
