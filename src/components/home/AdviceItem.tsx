import React from 'react'

interface AdviceProps {
  title: string
  items: string[]
  type: 'should' | 'shouldNot' | 'note'
  doctor?: string
  position?: string
  hospital?: string
}

const AdviceItem: React.FC<AdviceProps> = ({ title, items, type, doctor }) => {
  let icon = null
  let titleClassName = 'font-bold text-lg'
  let containerClassName = 'p-4 rounded-lg shadow-md'

  switch (type) {
    case 'should':
      icon = <span className='text-green-500 text-2xl mr-2'>✓</span>
      containerClassName += ' bg-green-50'
      titleClassName += ' text-green-700'
      break
    case 'shouldNot':
      icon = <span className='text-red-500 text-2xl mr-2'>✗</span>
      containerClassName += ' bg-red-50'
      titleClassName += ' text-red-700'
      break
    case 'note':
      icon = <span className='text-yellow-500 text-2xl mr-2'>!</span>
      containerClassName += ' bg-yellow-50'
      titleClassName += ' text-yellow-700'
      break
    default:
      break
  }

  return (
    <div className={containerClassName}>
      <div className='flex items-center mb-2'>
        {icon}
        <h3 className={titleClassName}>{title}</h3>
      </div>
      <ul className='list-disc ml-6 text-gray-700'>
        {items.map((item, index) => (
          <li key={index} className='mb-1'>
            {item}
          </li>
        ))}
      </ul>
      {doctor && <p className='text-center mt-4 text-gray-500'>{doctor}</p>}
    </div>
  )
}

export default AdviceItem
