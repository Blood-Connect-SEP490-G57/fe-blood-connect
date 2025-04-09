import { Mail } from 'lucide-react'

export default function Success() {
  const email = localStorage.getItem('email')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Mail className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">🎉 Đăng ký thành công!</h1>
        <p className="text-gray-600 mt-3">
          Vui lòng kiểm tra email <span className="font-bold text-black">{email}</span> để xác thực tài khoản.
        </p>
        <p className="text-gray-600 mt-3">
          📬 Mail đăng ký chỉ có hiệu lực trong vòng <strong>24 giờ</strong>. Vui lòng hoàn tất xác thực trong khoảng thời gian này.
        </p>
        <p className="text-gray-600 mt-2">
          ❗ Nếu không tìm thấy email, hãy kiểm tra trong thư mục <strong>Spam</strong> hoặc <strong>Thư rác</strong>.
        </p>
        <div className="mt-6">
          <a
            href="/dang-nhap"
            onClick={() => localStorage.removeItem('email')}
            className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  )
}
