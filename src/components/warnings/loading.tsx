import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className='min-h-[50vh] flex flex-col items-center justify-center relative z-10'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center justify-center space-y-8'
      >
        {/* Loading icon with gradient and shadow */}
        <div className='relative flex items-center justify-center'>
          {/* Outer spinning gradient ring */}
          <div className='absolute h-24 w-24 rounded-full bg-gradient-to-r from-red-400 to-red-600 opacity-20 blur-md'></div>
          
          {/* Main spinning ring */}
          <div className='absolute h-20 w-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin'></div>
          
          {/* Inner shadow glow */}
          <div className='absolute h-16 w-16 rounded-full bg-red-50 blur-sm'></div>
          
          {/* Blood drop icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            className='relative z-10'
          >
            <img 
              src="./images/icon/icon.png" 
              alt="Giọt Máu Hy Vọng" 
              className="h-12 w-12 drop-shadow-md"
            />
          </motion.div>
        </div>

        {/* Loading text with staggered dots animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className='flex flex-col items-center space-y-1'
        >
          <p className='text-center text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500'>
            Đang tải dữ liệu
          </p>
          
        </motion.div>
      </motion.div>
      
      {/* Decorative background blur */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
    </div>
  )
}
