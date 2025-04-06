import { verifyOtp } from '@/api/auth'
import { useState } from 'react'
import { OtpInput } from 'reactjs-otp-input'
import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'

export default function OTPInput() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
        description: (error as any)?.response?.message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-red-600 rounded-full flex items-center justify-center'>
            <span className='text-4xl'>🩸</span>
          </div>
        </div>

        <h2 className='mt-3 text-center text-3xl font-extrabold text-gray-900'>Quên Mật Khẩu</h2>
        <p className='mt-2 text-center text-sm text-gray-600'>Nhập gmail của bạn để nhận mail đặt lại mật khẩu</p>

        <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center mt-8'>
          <button
            onClick={() => navigate(-1)}
            className='absolute top-4 left-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow'
          >
            Quay lại
          </button>
          <h1 className='text-2xl font-bold text-gray-800'>Nhập mã OTP</h1>
          <p className='text-gray-600 mt-4'>Vui lòng nhập mã OTP đã được gửi đến email của bạn.</p>
          <div className='flex justify-center gap-4 mt-6'>
            <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6}
              inputStyle={{
                width: '3rem',
                height: '3rem',
                fontSize: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                textAlign: 'center',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                margin: '0 0.5rem'
              }}
              focusStyle={{
                border: '2px solid #ef4444'
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`mt-6 px-8 py-3 font-semibold rounded-lg shadow ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  )
}
