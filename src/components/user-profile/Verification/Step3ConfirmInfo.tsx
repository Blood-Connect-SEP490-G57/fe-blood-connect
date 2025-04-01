import React from 'react'
import { Check } from 'lucide-react'

interface Step3CompleteProps {
  onHomeClick: () => void
  onRegisterClick: () => void
}

const Step3Complete: React.FC<Step3CompleteProps> = ({ onHomeClick, onRegisterClick }) => {
  return (
    <div className='space-y-6 text-center'>
      <div className='w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto'>
        <Check className='w-8 h-8 text-primary-foreground' />
      </div>
      <h2 className='text-2xl font-heading font-semibold text-foreground'>Hoàn tất xác thực</h2>
      <p className='text-accent'>Bạn đã xác thực tài khoản thành công</p>
      <div className='flex justify-center gap-4'>
        <button onClick={onHomeClick} className='w-full bg-primary text-white p-2 rounded'>
          Trở lại trang chủ
        </button>
        <button onClick={onRegisterClick} className='w-full bg-primary text-white p-2 rounded'>
          Đăng kí hiến máu
        </button>
      </div>
    </div>
  )
}

export default Step3Complete