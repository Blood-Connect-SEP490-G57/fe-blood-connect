import { CheckCircle, Home, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VerifySuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-green-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 left-10 w-72 h-72 bg-green-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <motion.div 
          className='backdrop-blur-sm bg-white/70 p-8 text-center space-y-8'
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="flex flex-col items-center"
          >
            <div className="h-24 w-24 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-sm mb-1">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="w-14 h-14 text-green-500 drop-shadow-md" />
              </motion.div>
            </div>
            
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500 mt-6">
              Xác thực thành công
            </h2>
            
            <p className="text-gray-600 max-w-sm mx-auto mt-4">
              Cảm ơn bạn đã xác thực tài khoản! Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi.
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-3 pt-2">
            <motion.a
              href="/dang-nhap"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Đăng nhập ngay
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            
            <motion.a
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl shadow-sm border border-gray-200 flex items-center justify-center gap-2 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              Quay lại trang chủ
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}