import { useState } from 'react'
import { XCircle, Mail, ArrowRight, LogIn } from 'lucide-react'
import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { resendEmail } from '@/api/auth'
import { motion } from 'framer-motion'

export default function VerifyFalse() {
  const [email, setEmail] = useState('') // State to store the email
  const navigate = useNavigate() // Hook to programmatically navigate
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleResendEmail = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Vui lòng nhập email',
        description: 'Hãy nhập email của bạn để nhận mail xác thực mới'
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      const response = await resendEmail(email)
      if (response.success) {
        toast({
          title: 'Gửi lại email xác thực thành công!',
          description: response.message,
          variant: 'default'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gửi lại email xác thực thất bại!',
        description: (error as any).response?.message || 'Đã có lỗi xảy ra!'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <motion.div 
          className='backdrop-blur-sm bg-white/70 p-8 rounded-3xl shadow-xl border border-gray-100'
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Error icon and message */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
              className="mb-4"
            >
              <div className="h-20 w-20 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                <XCircle className='w-12 h-12 text-red-500' />
              </div>
            </motion.div>
              
            <h1 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500'>
              Xác thực thất bại
            </h1>
            
            <p className='text-gray-600 mt-2 max-w-sm mx-auto'>
              Đã có sai sót trong quá trình xác thực! Vui lòng thử lại hoặc liên hệ với đội ngũ hỗ trợ.
            </p>
          </div>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 rounded-full shadow-sm">Gửi lại email xác thực</span>
            </div>
          </div>
          
          {/* Email form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Địa chỉ email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 p-1 rounded-full bg-red-50">
                  <Mail className="text-red-500 w-4 h-4" />
                </div>
                <input
                  id='email'
                  type='email'
                  placeholder='Nhập email của bạn'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-11 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm bg-white/90'
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <motion.button
                onClick={handleResendEmail}
                disabled={isSubmitting}
                className='px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2 transition-all'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Gửi lại mail xác thực
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/dang-nhap')}
                className='px-6 py-3 bg-white text-gray-700 font-medium rounded-xl shadow-sm border border-gray-200 w-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
