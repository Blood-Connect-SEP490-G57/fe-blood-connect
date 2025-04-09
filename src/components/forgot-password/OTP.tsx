import { resendOtp, verifyOtp } from '@/api/auth'
import { useEffect, useState } from 'react'
import { OtpInput } from 'reactjs-otp-input'
import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'

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
        description: (error as any)?.response?.message || 'Đã xảy ra lỗi không xác định.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 py-12'>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex flex-col items-center'>
          <div className='w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg'>
            <span className='text-4xl'>🩸</span>
          </div>
          <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Xác Nhận OTP</h2>
          <p className='mt-2 text-center text-sm text-gray-600'>Nhập mã OTP được gửi đến email của bạn</p>
        </div>

        <div className='bg-white rounded-lg shadow-md px-8 py-6'>
          <div className='text-left text-sm mb-4'>
            <button onClick={() => navigate(-1)} className='w-full text-start text-sm text-red-600 hover:underline'>
              ← Quay lại
            </button>
          </div>
          <div className='text-left text-sm mb-4'>
            <span className='text-gray-500'>Gmail:</span>
            <p className='font-medium text-gray-800'>{localStorage.getItem('email')}</p>
          </div>

          <div className='text-left text-sm mb-4'>
            <span className='text-gray-500'>Mã OTP:</span>
            <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6}
              inputStyle={{
                width: '3rem',
                height: '3rem',
                fontSize: '1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                textAlign: 'center',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                margin: '0 0.4rem',
                backgroundColor: '#f9fafb'
              }}
              focusStyle={{
                border: '2px solid #ef4444',
                backgroundColor: '#fff'
              }}
              isInputNum
              shouldAutoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full mt-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isLoading ? 'bg-gray-300 cursor-not-allowed text-gray-700' : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
          <button
            onClick={handleResendOtp}
            disabled={countdown > 0}
            className={`w-full mt-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
              countdown > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {countdown > 0
              ? `Gửi lại mã OTP (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
              : 'Gửi lại mã OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}
