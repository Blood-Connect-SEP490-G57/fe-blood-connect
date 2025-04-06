import { Mail } from 'lucide-react'

export default function Success() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray'>
      <div className='bg-white max-w-lg w-full text-center'>
        <Mail className='w-16 h-16 text-blue-500 mx-auto' />
        <h1 className='text-2xl font-bold text-gray-800 mt-4'>Đăng ký thành công</h1>
        <p className='text-gray-600 mt-4'>Vui lòng kiểm tra Gmail để xác thực tài khoản!</p>
        <p className='text-gray-600 mt-2'>
          Mail đăng ký chỉ có hiệu lực trong vòng 24h. Vui lòng hoàn thiện đăng ký trong khoảng thời gian này.
        </p>
        <p className='text-gray-600 mt-2'>
          Nếu không tìm thấy mail của chúng tôi, hãy thử tìm kiếm trong thư rác hoặc spam.
        </p>
        <div className='mt-6'>
          <a href='/login' className='px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500'>
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  )
}
