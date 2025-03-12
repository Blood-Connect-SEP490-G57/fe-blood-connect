import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Home, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { FC } from 'react'

interface SuccessStepProps {
  navigate: (path: string) => void
}

const SuccessStep: FC<SuccessStepProps> = ({ navigate }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className='border-none shadow-xl overflow-hidden'>
        <div className='bg-gradient-to-r from-red-500 to-red-600 h-16'></div>
        <CardContent className='pt-0'>
          <motion.div
            className='mx-auto w-24 h-24 -mt-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.5 }}>
              <CheckCircle className='h-14 w-14 text-green-500' />
            </motion.div>
          </motion.div>

          <div className='text-center mt-6 space-y-4'>
            <motion.h2
              className='text-2xl font-bold text-gray-800'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Đăng ký hiến máu thành công!
            </motion.h2>

            <motion.p
              className='text-gray-600 max-w-md mx-auto'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Cảm ơn bạn đã đăng ký hiến máu. Chúng tôi sẽ gửi thông tin chi tiết về buổi hiến máu qua email của bạn.
            </motion.p>

            <motion.div
              className='bg-red-50 rounded-lg p-4 mx-auto max-w-sm mt-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className='text-red-700 text-sm'>
                <span className='font-medium'>Lưu ý:</span> Vui lòng kiểm tra email và đến đúng giờ hẹn. Hãy nhớ mang
                theo CMND/CCCD và đảm bảo bạn đã nghỉ ngơi đầy đủ trước khi hiến máu.
              </p>
            </motion.div>

            <motion.div
              className='flex flex-col sm:flex-row gap-4 justify-center pt-6 pb-2'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                className='bg-red-600 hover:bg-red-700 text-white shadow transition-all duration-200 hover:shadow-lg flex items-center justify-center'
                onClick={() => navigate('/appointment-info')}
              >
                <Calendar className='mr-2 h-4 w-4' />
                Xem lịch hẹn
              </Button>

              <Button
                variant='outline'
                className='border-red-200 text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center justify-center'
                onClick={() => navigate('/')}
              >
                <Home className='mr-2 h-4 w-4' />
                Trở lại trang chủ
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SuccessStep
