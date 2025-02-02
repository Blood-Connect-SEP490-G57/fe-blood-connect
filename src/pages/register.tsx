import React, { useState } from 'react'
import { Lock, Phone, Check } from 'lucide-react' // Import icon từ lucide-react
import { useNavigate } from 'react-router-dom'

interface FormData {
  phone: string
  password: string
  confirmPassword: string
}

const RegistrationPage = () => {
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRegister = (): void => {
    console.log('Registration completed', formData)
    navigate('/login')
  }

  return (
    <div className='min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm'>
        <div className='space-y-6'>
          <h2 className='text-2xl font-heading font-semibold text-foreground'>Đăng ký tài khoản</h2>

          <div className='space-y-4'>
            <div className='relative'>
              <Phone className='absolute left-3 top-3 text-accent' />
              <input
                type='tel'
                name='phone'
                placeholder='Số điện thoại'
                className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-accent' />
              <input
                type='password'
                name='password'
                placeholder='Mật khẩu'
                className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-accent' />
              <input
                type='password'
                name='confirmPassword'
                placeholder='Xác nhận mật khẩu'
                className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <ul className='text-sm text-accent space-y-1'>
              <li className='flex items-center'>
                <Check className='mr-2 text-chart-2' /> Ít nhất 8 ký tự
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 text-chart-2' /> Bao gồm chữ hoa và chữ thường
              </li>
              <li className='flex items-center'>
                <Check className='mr-2 text-chart-2' /> Bao gồm số và ký tự đặc biệt
              </li>
            </ul>
          </div>

          <button
            onClick={handleRegister}
            className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors w-full'
          >
            Đăng ký
          </button>

          <p className='mt-4 text-center text-accent'>
            Đã có tài khoản?{' '}
            <button className='text-primary hover:underline' onClick={() => navigate('/login')}>
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
