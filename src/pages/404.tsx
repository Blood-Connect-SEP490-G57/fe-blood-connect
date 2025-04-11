import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, Home } from 'lucide-react'
import { motion } from 'framer-motion'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-100 relative overflow-hidden flex items-center justify-center py-12 px-4'>
      {/* Decorative elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className='w-full backdrop-blur-sm bg-white/70 p-8 rounded-3xl text-center space-y-8 border border-gray-100 shadow-xl'>
          <motion.div 
            className='space-y-4'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mx-auto w-24 h-24 flex items-center justify-center mb-2">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
                className="text-8xl font-bold"
              >
                🔍
              </motion.div>
            </div>
            
            <h1
              className={cn(
                'text-7xl font-bold',
                'bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent'
              )}
            >
              404
            </h1>
            <h2 className='text-2xl font-semibold text-gray-800'>Trang không tồn tại</h2>
            <p className='text-gray-600 max-w-sm mx-auto'>Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
          </motion.div>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate(-1)} 
                variant="outline"
                className='px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 flex items-center gap-2 shadow-sm'
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/')} 
                className='px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center gap-2 shadow-md border-0'
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
