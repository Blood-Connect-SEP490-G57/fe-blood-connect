import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface AdviceProps {
  title: string
  items: string[]
  type: 'should' | 'shouldNot' | 'note'
  doctor?: string
  position?: string
  hospital?: string
}

const AdviceItem: React.FC<AdviceProps> = ({ title, items, type, doctor, position, hospital }) => {
  let icon = null
  let headerBg = 'bg-gradient-to-r'
  let cardBg = 'bg-white'
  let titleColor = 'text-white'

  switch (type) {
    case 'should':
      icon = <CheckCircle2 className='h-5 w-5 text-white' />
      headerBg += ' from-green-500 to-green-400'
      cardBg = 'bg-gradient-to-b from-white to-green-50'
      break
    case 'shouldNot':
      icon = <XCircle className='h-5 w-5 text-white' />
      headerBg += ' from-red-500 to-red-400'
      cardBg = 'bg-gradient-to-b from-white to-red-50'
      break
    case 'note':
      icon = <AlertCircle className='h-5 w-5 text-white' />
      headerBg += ' from-amber-500 to-amber-400'
      cardBg = 'bg-gradient-to-b from-white to-amber-50'
      break
    default:
      break
  }

  return (
    <motion.div 
      className={`rounded-2xl shadow-xl overflow-hidden h-full ${cardBg} border border-gray-100`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={`${headerBg} p-4 flex items-center gap-3`}>
        <div className='p-1.5 bg-white/20 backdrop-blur-sm rounded-full'>
          {icon}
        </div>
        <h3 className={`${titleColor} font-medium text-lg`}>{title}</h3>
      </div>

      <div className='p-5'>
        <ul className='space-y-3'>
          {items.map((item, index) => (
            <motion.li 
              key={index} 
              className='flex items-start gap-3 text-gray-700'
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <div className='h-2 w-2 rounded-full bg-gray-300 flex-shrink-0 mt-2'></div>
              <span className='text-sm'>{item}</span>
            </motion.li>
          ))}
        </ul>

        {doctor && (
          <div className='text-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100'>
            <p className='font-medium text-gray-800'>{doctor}</p>
            {position && <p className='text-gray-500 text-sm'>{position}</p>}
            {hospital && <p className='text-gray-500 text-sm'>{hospital}</p>}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdviceItem
