import { motion } from 'framer-motion'
import AdviceItem from './AdviceItem'

const AdviceSection = () => {
  return (
    <div className='py-8 bg-gradient-to-b from-red-600 via-red-500 to-red-400 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-2 relative'>
        {/* iOS style decorative elements */}
        <div className='absolute top-10 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl'></div>
        <div className='absolute bottom-20 right-1/4 w-24 h-24 bg-red-300 opacity-20 rounded-full blur-xl'></div>
        
        {/* Header with iOS style */}
        <motion.div 
          className='relative z-10 text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-4'>
            Những lời khuyên trước và sau khi hiến máu
          </h2>
          <div className='w-24 h-1 bg-white/30 mx-auto rounded-full'></div>
        </motion.div>

        {/* Card container with iOS style shadow and animation */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <AdviceItem
              title='Nên:'
              type='should'
              items={[
                'Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.',
                'Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ băng keo cá nhân trong 4-6 giờ.',
                'Nằm và ngồi nghỉ tại chỗ 10 phút sau khi hiến máu.',
                'Nằm nghỉ đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn.',
                'Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm vết chích nếu bị sưng, bầm tím.',
              ]}
              doctor=''
              position=''
              hospital=''
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AdviceItem
              title='Không nên:'
              type='shouldNot'
              items={[
                'Uống sữa, rượu bia trước khi hiến máu.',
                'Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao gắng sức trong ngày lấy máu.',
                'Nhịn ăn trước khi hiến máu, vì có thể gây chóng mặt, mệt mỏi.',
                'Sử dụng các chất kích thích như cà phê, thuốc lá trước khi hiến máu.',
                'Mặc quần áo quá chật khi đi hiến máu, tránh gây khó khăn cho việc lấy máu.',
              ]}
              doctor=''
              position=''
              hospital=''
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AdviceItem
              title='Lưu ý:'
              type='note'
              items={[
                'Nếu phát hiện chảy máu tại chỗ chích:',
                'Giơ tay cao.',
                'Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính.',
                'Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết.',
                'Uống nhiều nước và bổ sung thực phẩm giàu sắt để phục hồi lượng máu đã hiến.',
                'Không tháo băng dính quá sớm để tránh chảy máu.'
              ]}
              doctor=''
              position=''
              hospital=''
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdviceSection
