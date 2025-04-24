import { useVerification } from "../verificationContext/VerificationContext"
import { useAuth } from "../authContext/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const CheckVerify = () => {
  const { isVerified } = useVerification()
  const { isLoggedIn } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn && isVerified === 'NONE') {
      setShowModal(true)
    }
  }, [isLoggedIn, isVerified])

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Thông báo</h2>
        <p className="mb-4">Vui lòng xác thực hồ sơ của bạn để có thể đăng ký hiến máu.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              navigate('/trang-ca-nhan#tao-ho-so-hien-mau')
              setShowModal(false)
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Tạo hồ sơ
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckVerify

