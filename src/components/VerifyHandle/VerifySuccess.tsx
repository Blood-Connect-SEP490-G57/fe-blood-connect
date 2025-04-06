import { CheckCircle } from 'lucide-react'

export default function VerifySuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Xác thực thành công</h1>
        <p className="text-gray-600 mt-4">
          Cảm ơn bạn đã xác thực tài khoản của mình! Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi.
        </p>
        <div className="mt-6">
          <a
            href="/login"
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  )
}