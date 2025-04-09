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
            <svg
              aria-hidden='true'
              className='h-12 w-12 fill-red-600 drop-shadow-md'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2C12 2 5 10 5 15C5 19.4183 8.58172 23 12 23C15.4183 23 19 19.4183 19 15C19 10 12 2 12 2Z'
                fill='currentFill'
              />
            </svg>
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
          
          <div className='flex justify-center space-x-1 mt-1'>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -10, 0]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 1,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  },
                  opacity: { delay: 0.5 + (index * 0.1) },
                  scale: { delay: 0.5 + (index * 0.1) }
                }}
                className='w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full'
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Decorative background blur */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
    </div>
  )
}
