import { useState } from 'react'
import { XCircle } from 'lucide-react'
import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { resendEmail } from '@/api/auth'

export default function VerifyFalse() {
  const [email, setEmail] = useState('') // State to store the email
  const navigate = useNavigate() // Hook to programmatically navigate
  const handleResendEmail = async () => {
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
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center'>
        <XCircle className='w-16 h-16 text-red-500 mx-auto' />
        <h1 className='text-2xl font-bold text-gray-800 mt-4'>Xác thực thất bại</h1>
        <p className='text-gray-600 mt-4'>
          Đã có sai sót trong quá trình xác thực! Vui lòng thử lại hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.
        </p>
        <h2 className='text-lg font-semibold text-gray-800'>Nhập lại email để nhận mail xác thực mới</h2>
        <label htmlFor='email' className='block text-sm text-gray-600 mt-4'>
          Địa chỉ email
        </label>
        <input
          id='email'
          type='email'
          placeholder='Nhập email của bạn'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500'
        />
        <button
          onClick={handleResendEmail}
          className='mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500 w-full'
        >
          Gửi lại mail xác thực
        </button>
        <button
          onClick={() => navigate('/dang-nhap')}
          className='mt-4 px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-red-500 w-full'
        >
          Đăng nhập
        </button>
      </div>
    </div>
  )
}
