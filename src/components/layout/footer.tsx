import { FacebookIcon, Globe, Mail, MapPin, Phone, Heart, ExternalLink } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

const Footer: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <footer className='relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-10'>
      {/* Decorative Elements */}
      <div className='absolute -top-40 left-[20%] w-80 h-80 rounded-full bg-red-500/5 blur-3xl'></div>
      <div className='absolute -bottom-40 right-[20%] w-80 h-80 rounded-full bg-red-500/5 blur-3xl'></div>
      
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='grid grid-cols-1 md:grid-cols-3 gap-10'
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50'
            variants={fadeIn}
          >
            <h3 className='text-lg font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300'>
              <Heart className='w-5 h-5 mr-2 text-red-400' />
              Về chúng tôi
            </h3>
            <div className='space-y-4'>
              <p className='text-gray-300 leading-relaxed'>
                Giọt Máu Hi Vọng là dự án phi lợi nhuận nhằm kết nối những người hiến máu tình nguyện với những người cần
                máu. Chúng tôi tin rằng mỗi giọt máu đều mang lại hy vọng và sự sống cho những người đang cần.
              </p>
              <p className='text-gray-300 leading-relaxed'>
                Dự án này được thực hiện dưới sự hợp tác với Hội chữ thập đỏ Tỉnh Ninh Bình
              </p>

              <motion.div
                className='pt-4 inline-block'
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <button className='flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 px-5 py-2.5 rounded-full text-white font-medium shadow-lg shadow-red-500/20'>
                  <span>Tìm hiểu thêm</span>
                  <ExternalLink className='w-4 h-4' />
                </button>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50'
            variants={fadeIn}
          >
            <h3 className='text-lg font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300'>
              <Phone className='w-5 h-5 mr-2 text-red-400' />
              Liên hệ
            </h3>
            <div className='space-y-4 text-gray-300'>
              <motion.p 
                className='flex items-start group'
                whileHover={{ x: 3 }}
              >
                <Mail className='w-5 h-5 mr-3 mt-0.5 text-red-400 flex-shrink-0' />
                <span className='group-hover:text-white transition-colors'>
                  Email: ctdninhbinh@gmail.com
                </span>
              </motion.p>
              
              <motion.p 
                className='flex items-start group'
                whileHover={{ x: 3 }}
              >
                <Phone className='w-5 h-5 mr-3 mt-0.5 text-red-400 flex-shrink-0' />
                <span className='group-hover:text-white transition-colors'>
                  Hotline: (+84)(229)3872.198
                </span>
              </motion.p>
              
              <motion.p 
                className='flex items-start group'
                whileHover={{ x: 3 }}
              >
                <Phone className='w-5 h-5 mr-3 mt-0.5 text-red-400 flex-shrink-0' />
                <span className='group-hover:text-white transition-colors'>
                  Fax: (+84)(229)3875.148
                </span>
              </motion.p>
              
              <motion.p 
                className='flex items-start group'
                whileHover={{ x: 3 }}
              >
                <Phone className='w-5 h-5 mr-3 mt-0.5 text-red-400 flex-shrink-0' />
                <span className='group-hover:text-white transition-colors'>
                  Điện thoại: 0229 3899 505
                </span>
              </motion.p>
              
              <motion.a
                className='flex items-start group'
                href='https://maps.app.goo.gl/itVhswxLUjWxUd7t6'
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ x: 3 }}
              >
                <MapPin className='w-5 h-5 mr-3 mt-0.5 text-red-400 flex-shrink-0' />
                <span className='group-hover:text-white transition-colors'>
                  Địa chỉ: Số 72 - đường Lương Văn Tụy, Ninh Bình, Vietnam
                </span>
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50'
            variants={fadeIn}
          >
            <h3 className='text-lg font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300'>
              <Globe className='w-5 h-5 mr-2 text-red-400' />
              Theo dõi chúng tôi
            </h3>
            <div className='space-y-4'>
              <motion.a
                href='https://www.facebook.com/hoichuthapdotinhninhbinh'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all'
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <FacebookIcon className='w-5 h-5' />
                <span>Facebook: Giọt Máu Hy Vọng</span>
              </motion.a>
              
              <motion.a
                href='http://chuthapdoninhbinh.org.vn/'
                className='flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all'
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe className='w-5 h-5' />
                <span>Website Hội Chữ Thập Đỏ Ninh Bình</span>
              </motion.a>
              
              <h3 className='text-lg font-semibold mt-8 mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300'>
                Điều khoản sử dụng
              </h3>
              
              <motion.a 
                href='/dieu-khoan-su-dung' 
                className='inline-block px-4 py-2 rounded-xl border border-gray-700 hover:border-red-500/50 hover:bg-red-500/10 text-gray-300 hover:text-white transition-all'
                whileHover={{ x: 3 }}
              >
                Xem điều khoản sử dụng
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className='border-t border-gray-700/50 mb-10 sm:mb-2 mt-12 pt-8 text-center'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className='text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-2'>
            <span>© {new Date().getFullYear()} Giọt Máu Hy Vọng.</span>
            <span className='hidden sm:block h-1 w-1 rounded-full bg-gray-500'></span>
            <span>Tất cả quyền được bảo lưu.</span>
          </p>
          <div className='mt-4 text-gray-500 text-xs'>
            <p>Phát triển bởi nhóm SEP490_G57 - 2024</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer