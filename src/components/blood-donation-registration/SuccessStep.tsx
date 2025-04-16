import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Home, Calendar, Heart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FC } from 'react'
import ScrollToTop from '../scrollToTop'

interface SuccessStepProps {
  navigate: (path: string) => void
}

const SuccessStep: FC<SuccessStepProps> = ({ navigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <ScrollToTop />
      <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
        <div className='bg-gradient-to-r from-red-600 to-red-400 h-24 flex items-center justify-center'>
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.3 
            }}
            className="text-white text-xl font-bold"
          >
            Đăng ký thành công!
          </motion.div>
        </div>
        
        <CardContent className='p-0'>
          <motion.div
            className='mx-auto w-20 h-20 -mt-8 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
              transition={{ 
                scale: { delay: 0.5 },
                rotate: { delay: 0.8, duration: 0.5 }
              }}
            >
              <CheckCircle className='h-14 w-14 text-green-500' strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          <div className='p-6 pb-8 text-center'>
            <motion.div
              className='space-y-5'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-gray-800'>Cảm ơn bạn đã đăng ký hiến máu!</h2>
                <p className='text-gray-600 max-w-md mx-auto'>
                  Đăng ký của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn qua email để xác nhận thời gian và địa điểm cụ thể.
                </p>
              </div>

              <div className='bg-red-50 rounded-xl p-5 mx-auto max-w-md'>
                <div className='flex items-center gap-3 mb-2 text-red-700'>
                  <Heart className='h-5 w-5 text-red-500' />
                  <h3 className='font-medium'>Lưu ý trước khi hiến máu</h3>
                </div>
                <ul className='text-left text-sm text-red-600 space-y-1.5'>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 h-1 w-1 rounded-full bg-red-500'></div>
                    <span>Ngủ đủ giấc (ít nhất 6 giờ) đêm hôm trước</span>
                  </li>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 h-1 w-1 rounded-full bg-red-500'></div>
                    <span>Ăn sáng đầy đủ, uống nhiều nước</span>
                  </li>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 h-1 w-1 rounded-full bg-red-500'></div>
                    <span>Mang theo CMND/CCCD</span>
                  </li>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 h-1 w-1 rounded-full bg-red-500'></div>
                    <span>Tránh uống rượu bia ít nhất 24 giờ trước khi hiến máu</span>
                  </li>
                </ul>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                <Button
                  className='rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium shadow-sm hover:opacity-90 transition'
                  onClick={() => navigate('/trang-ca-nhan#lich-su-hien-mau')}
                >
                  <Calendar className='mr-2 h-4 w-4' />
                  Xem lịch hẹn
                  <ArrowRight className='ml-1 h-4 w-4 opacity-70' />
                </Button>

                <Button
                  variant='outline'
                  className='rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 transition'
                  onClick={() => navigate('/')}
                >
                  <Home className='mr-2 h-4 w-4' />
                  Trở lại trang chủ
                </Button>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SuccessStep
