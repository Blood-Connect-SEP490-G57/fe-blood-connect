import { useState } from 'react'
import { XCircle } from 'lucide-react'

export default function VerifyFalse() {
  const [email, setEmail] = useState('') // State to store the email
  const [message, setMessage] = useState('') // State to store success/error messages

  const handleResendEmail = async () => {
    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('Email xác thực đã được gửi lại thành công!')
      } else {
        setMessage('Đã xảy ra lỗi khi gửi lại email xác thực. Vui lòng thử lại.')
      }
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi gửi lại email xác thực. Vui lòng thử lại.')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center'>
        <XCircle className='w-16 h-16 text-red-500 mx-auto' />
        <h1 className='text-2xl font-bold text-gray-800 mt-4'>Xác thực thất bại</h1>
        <p className='text-gray-600 mt-4'>
          Đã có sai sót trong quá trình xác thực! Vui lòng thử lại hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.
        </p>
      </div>
      <div className='mt-6'>
        <p>Nhập lại địa chỉ email của bạn để nhận lại mail xác thực mới</p>
        <input
          type='email'
          placeholder='Nhập email của bạn'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mt-2 p-2 border border-gray-300 rounded-lg w-full'
        />
        <button
          onClick={handleResendEmail}
          className='mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500'
        >
          Gửi lại mail xác thực
        </button>
        {message && <p className='mt-4 text-sm text-gray-700'>{message}</p>}
      </div>
    </div>
  )
}