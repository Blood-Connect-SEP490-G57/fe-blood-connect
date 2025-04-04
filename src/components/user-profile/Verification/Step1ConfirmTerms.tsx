import React, { useState } from 'react'

interface Step1ConfirmTermsProps {
  onNext: () => void
}

const Step1ConfirmTerms: React.FC<Step1ConfirmTermsProps> = ({ onNext }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className='flex flex-col items-center justify-center space-y-6 p-8 max-w-md mx-auto border border-gray-200 rounded-xl shadow-sm bg-white'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-gray-900'>Tạo hồ sơ hiến máu</h2>
        <p className='text-gray-600'>
          Để tạo hồ sơ hiến máu, chúng tôi cần xác minh danh tính của bạn. Vui lòng đọc kỹ các quy định trước khi tiếp
          tục.
        </p>
      </div>

      <div className='flex items-start w-full p-4 space-x-3 border border-gray-200 rounded-lg hover:bg-gray-50'>
        <input
          type='checkbox'
          id='terms'
          className='mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer'
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor='terms' className='text-gray-700 cursor-pointer'>
          Tôi đồng ý với{' '}
          <a href='/dieu-khoan-su-dung' className='text-yellow-600 font-medium hover:text-red-800 underline'>
            điều khoản và điều kiện
          </a>
        </label>
      </div>

      <button
        className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
          isChecked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
        }`}
        disabled={!isChecked}
        onClick={onNext}
      >
        Xác nhận và tiếp tục
      </button>
    </div>
  )
}

export default Step1ConfirmTerms
