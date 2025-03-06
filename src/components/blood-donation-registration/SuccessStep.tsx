import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ChevronRight } from 'lucide-react'

import { FC } from 'react'

interface SuccessStepProps {
  navigate: (path: string) => void
}

const SuccessStep: FC<SuccessStepProps> = ({ navigate }) => {
  return (
    <Card className='border-none shadow-lg text-center'>
      <CardContent className='pt-6'>
        <div className='mb-6'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='h-8 w-8 text-green-500' />
          </div>
        </div>
        <h2 className='text-2xl font-semibold mb-2'>Đăng ký thành công!</h2>
        <p className='text-gray-600 mb-6'>
          Cảm ơn bạn đã đăng ký hiến máu. Chúng tôi sẽ gửi thông tin chi tiết qua email.
        </p>
        <Button className='bg-red-600 text-white hover:bg-red-700' onClick={() => navigate('/appointment-info')}>
          Xem lịch hẹn
          <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
        <Button className='bg-red-600 text-white hover:bg-red-700' onClick={() => navigate('/')}>
          Trở lại trang chủ
          <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </CardContent>
    </Card>
  )
}

export default SuccessStep
