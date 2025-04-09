import { resendOtp, verifyOtp } from '@/api/auth'
import { useEffect, useState } from 'react'
import { OtpInput } from 'reactjs-otp-input'
import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, Mail } from 'lucide-react'

export default function OTPInput() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes

  const handleChange = (otp: string) => setOtp(otp)

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Lỗi',
        description: 'Mã OTP phải có 6 chữ số.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      const email = localStorage.getItem('email')
      if (!email) {
        toast({
          title: 'Lỗi',
          description: 'Không tìm thấy email vui lòng kiểm tra lại',
          variant: 'destructive'
        })
        throw new Error('Email not found in local storage')
      }

      const response = await verifyOtp(email, otp)
      toast({
        title: 'Thành công',
        description: response.message,
        variant: 'default'
      })
      localStorage.setItem('resetToken', response.data.resetToken)
      setTimeout(() => {
        navigate('/thay-doi-mat-khau')
      }, 2000)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: (error as any)?.response?.data?.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [countdown])

  const handleResendOtp = async () => {
    const email = localStorage.getItem('email')
    if (!email) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy email vui lòng kiểm tra lại',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await resendOtp(email) // Gọi API resendOtp từ file API
      toast({
        title: 'Thành công',
        description: response.message,
        variant: 'default'
      })
      setCountdown(300) // Reset lại 5 phút
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: (error as any)?.response?.data?.message || 'Đã xảy ra lỗi không xác định.',
        variant: 'destructive'
      })
    }
  }

  const emailAddress = localStorage.getItem('email') || ''

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className='absolute top-8 left-8 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 text-gray-600 hover:text-red-600 transition-all'
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      
      <div className='w-full max-w-md space-y-8 z-10'>
        <motion.div 
          className='flex flex-col items-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg'>
            <span className='text-4xl'>🩸</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className='mt-6 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500'>
              Xác Nhận OTP
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Nhập mã OTP được gửi đến email của bạn
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='backdrop-blur-sm bg-white/70 py-8 px-6 shadow-xl rounded-3xl border border-gray-100'
        >
          <div className='space-y-6'>
            <div className='bg-red-50 rounded-xl p-4 flex items-center gap-3'>
              <div className='p-2 bg-white rounded-full'>
                <Mail className='w-5 h-5 text-red-500' />
              </div>
              <div>
                <p className='text-xs text-gray-500 font-medium'>Gmail</p>
                <p className='font-medium text-gray-800'>{emailAddress}</p>
              </div>
            </div>
            
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-gray-700'>
                Mã OTP <span className='text-red-500'>*</span>
              </label>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className='flex justify-center'
              >
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  inputStyle={{
                    width: '2.8rem',
                    height: '3.2rem',
                    fontSize: '1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    margin: '0 0.25rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#374151'
                  }}
                  focusStyle={{
                    border: '2px solid #ef4444',
                    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)',
                    backgroundColor: '#fff'
                  }}
                  isInputNum
                  shouldAutoFocus
                />
              </motion.div>
            </div>
            
            <motion.div className='pt-2 space-y-3'>
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isLoading 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-md'
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : undefined}
                whileTap={!isLoading ? { scale: 0.98 } : undefined}
              >
                {isLoading ? (
                  <>
                    <span className='inline-block h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Xác nhận
                    <ArrowRight className='w-4 h-4' />
                  </>
                )}
              </motion.button>
              
              <motion.button
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-all ${
                  countdown > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={countdown <= 0 ? { scale: 1.02 } : undefined}
                whileTap={countdown <= 0 ? { scale: 0.98 } : undefined}
              >
                {countdown > 0
                  ? `Gửi lại mã OTP (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
                  : 'Gửi lại mã OTP'}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
