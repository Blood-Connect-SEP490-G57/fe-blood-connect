import React from 'react'
import { Check, Home, Calendar } from 'lucide-react'
import ScrollToTop from '@/components/scrollToTop'
import { Card, CardContent } from '@/components/ui/card'

interface Step3CompleteProps {
  onHomeClick: () => void
  onRegisterClick: () => void
}

const Step4Complete: React.FC<Step3CompleteProps> = ({ onHomeClick, onRegisterClick }) => {
  return (
    <div className='space-y-8 max-w-md mx-auto'>
      <ScrollToTop />
      
      <div className='flex flex-col items-center justify-center text-center space-y-4'>
        <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
          <Check className='w-10 h-10 text-green-600' />
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>Xác thực thành công</h2>
        <p className='text-gray-600'>
          Chúc mừng! Bạn đã hoàn tất xác thực tài khoản hiến máu của mình. Bây giờ bạn có thể đăng ký các chiến dịch hiến máu.
        </p>
      </div>
      
      <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
        <CardContent className='p-5'>
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-900'>Thông tin tài khoản</h3>
            <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
              <span className='text-sm text-green-700'>Trạng thái xác thực</span>
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium'>
                Đã xác thực
              </span>
            </div>
            <p className='text-sm text-gray-600'>
              Thông tin của bạn đã được xác thực và lưu trữ an toàn trong hệ thống. Bạn có thể cập nhật thông tin của mình bất kỳ lúc nào trong mục Hồ sơ.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className='grid grid-cols-2 gap-4'>
        <button
          onClick={onHomeClick}
          className='bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-5 rounded-xl transition-colors flex items-center justify-center gap-2'
        >
          <Home className='h-4 w-4' />
          <span>Trang chủ</span>
        </button>
        <button
          onClick={onRegisterClick}
          className='bg-red-600 hover:bg-red-700 text-white py-4 px-5 rounded-xl transition-colors flex items-center justify-center gap-2'
        >
          <Calendar className='h-4 w-4' />
          <span>Đăng ký hiến máu</span>
        </button>
      </div>
    </div>
  )
}

export default Step4Complete
