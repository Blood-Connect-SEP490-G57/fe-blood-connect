import React, { useState } from 'react'
import { FileText, Check } from 'lucide-react'

interface Step1ConfirmTermsProps {
  onNext: () => void
}

const Step1ConfirmTerms: React.FC<Step1ConfirmTermsProps> = ({ onNext }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className='flex flex-col sm:p-4 space-y-6'>
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center mt-2'>
          <div className='w-16 h-16 flex items-center justify-center'>
            <FileText className='h-8 w-8 text-red-500' />
          </div>
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>Tạo hồ sơ hiến máu</h2>
        <p className='text-gray-600'>
          Để tạo hồ sơ hiến máu, chúng tôi cần xác minh danh tính của bạn. Vui lòng đọc kỹ các quy định trước khi tiếp
          tục.
        </p>
      </div>

      <div>
        <div className='p-5 border-b'>
          <h3 className='text-lg font-medium text-gray-900'>Điều khoản sử dụng</h3>
        </div>
        <div className='p-5 space-y-4'>
          <p className='text-sm text-gray-600'>
            Khi sử dụng dịch vụ xác minh danh tính của chúng tôi, bạn đồng ý rằng:
          </p>
          <ul className='space-y-2'>
            <li className='flex gap-2 text-sm text-gray-600'>
              <Check className='h-5 w-5 text-red-500 flex-shrink-0' />
              <span>Thông tin cung cấp là chính xác và thuộc về bạn</span>
            </li>
            <li className='flex gap-2 text-sm text-gray-600'>
              <Check className='h-5 w-5 text-red-500 flex-shrink-0' />
              <span>Bạn cho phép chúng tôi lưu trữ và xử lý thông tin cá nhân</span>
            </li>
            <li className='flex gap-2 text-sm text-gray-600'>
              <Check className='h-5 w-5 text-red-500 flex-shrink-0' />
              <span>Bạn hiểu rằng thông tin này sẽ được sử dụng cho mục đích hiến máu</span>
            </li>
          </ul>
        </div>
        <div className='bg-gray-50 p-5'>
          <label className='flex items-start gap-3 cursor-pointer'>
            <div className='relative flex items-center'>
              <input
                type='checkbox'
                className='peer h-5 w-5 appearance-none rounded-md border border-gray-300 checked:bg-red-500 checked:border-red-500 transition-colors'
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <Check
                className={`h-3 w-3 text-white absolute inset-0 m-auto ${isChecked ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            <span className='text-sm text-gray-700'>
              Tôi đồng ý với{' '}
              <a href='/dieu-khoan-su-dung' className='text-red-600 font-medium hover:text-red-800 underline'>
                điều khoản và điều kiện
              </a>{' '}
              của dịch vụ
            </span>
          </label>
        </div>
      </div>
      <div className='p-4'>
        <button
          className={`w-full py-4  text-white font-medium rounded-xl transition-colors ${
            isChecked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!isChecked}
          onClick={onNext}
        >
          Xác nhận và tiếp tục
        </button>
      </div>
    </div>
  )
}

export default Step1ConfirmTerms
