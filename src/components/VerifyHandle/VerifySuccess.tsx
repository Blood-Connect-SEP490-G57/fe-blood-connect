import { CheckCircle } from 'lucide-react'

export default function VerifySuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center mt-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Xác thực thành công</h2>
        <p className="text-gray-600 mt-4">
          Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <a
            href="/dang-nhap"
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500"
          >
            Đăng nhập ngay
          </a>
          <a
            href="/"
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300"
          >
            Quay lại trang chủ
          </a>
        </div>
      </main>
    </div>
  )
}