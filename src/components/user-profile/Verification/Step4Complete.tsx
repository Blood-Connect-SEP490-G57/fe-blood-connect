import React, { useEffect, useState } from 'react'
import ScrollToTop from '@/components/scrollToTop'
import { Card, CardContent } from '@/components/ui/card'
import { CheckExtractStatus } from '@/api/extract'

interface Step3CompleteProps {
  onRegisterClick: () => void
}

const Step4Complete: React.FC<Step3CompleteProps> = ({ onRegisterClick }) => {
  const [verificationStatus, setVerificationStatus] = useState<string>('pending')

  const checkStatus = async (): Promise<void> => {
    try {
      const response = await CheckExtractStatus()
      setVerificationStatus(response.data.status)
    } catch (error) {
      console.error('Error checking status:', error)
      setVerificationStatus('error')
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className='space-y-6 mx-auto sm:p-4 p-2'>
      <ScrollToTop />
      <div className='flex flex-col items-center justify-center text-center mt-2 space-y-4'>
        <h2 className='text-xl font-semibold text-gray-900'>Xác thực thành công</h2>
        <p className='text-gray-600'>
          Chúc mừng! Bạn đã hoàn tất hồ sơ hiến máu. Bây giờ bạn có thể đăng ký các chiến dịch hiến máu.
        </p>
      </div>

      <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
        <CardContent className='p-5'>
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-900'>Thông tin tài khoản</h3>
            <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
              <span className='text-sm text-green-700'>Trạng thái xác thực</span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium `}>
                {verificationStatus === 'EXTRACTED' ? 'Đã xác thực' : 'Chờ xác thực'}
              </span>
            </div>
            <p className='text-sm text-gray-600'>
              Thông tin của bạn đã được xác thực và lưu trữ an toàn trong hệ thống. Bạn có thể cập nhật thông tin của
              mình bất kỳ lúc nào trong mục Hồ sơ.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <button
          onClick={onRegisterClick}
          className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition-colors flex items-center justify-center gap-2'
        >
          <div>
            <span>Đăng ký hiến máu</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Step4Complete
