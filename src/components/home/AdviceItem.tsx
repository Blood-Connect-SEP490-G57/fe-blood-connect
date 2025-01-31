import React from 'react'

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
  let titleClassName = 'font-bold text-lg'
  let containerClassName = 'p-6 rounded-lg shadow-md'

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
      <div className='flex items-center mb-4'>
        {icon}
        <h3 className={titleClassName}>{title}</h3>
      </div>
      <ul className='list-disc ml-8 text-gray-700'>
        {items.map((item, index) => (
          <li key={index} className='mb-2'>
            {item}
          </li>
        ))}
      </ul>
      {doctor && (
        <div className='text-center mt-6 text-gray-500'>
          <p>{doctor}</p>
          {position && <p>{position}</p>}
          {hospital && <p>{hospital}</p>}
        </div>
      )}
    </div>
  )
}

export default AdviceItem
