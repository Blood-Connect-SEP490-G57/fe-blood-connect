import React, { useState } from 'react'
import { Upload, Check, Lock, Mail, User, Phone, Calendar } from 'lucide-react' // Import icon từ lucide-react , ChevronRight
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'

interface FormData {
  identityDoc: File | null // Cập nhật kiểu ở đây
  fullName: string
  dateOfBirth: string
  email: string
  phone: string
  verificationCode: string
  password: string
  confirmPassword: string
}

const RegistrationPage = () => {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    identityDoc: null,
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, identityDoc: acceptedFiles[0] })
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = (): void => setStep(step + 1)
  const prevStep = (): void => setStep(step - 1)

  const renderStep = (): JSX.Element | null => {
    switch (step) {
      case 1:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-heading font-semibold text-foreground'>Tải lên giấy tờ tùy thân</h2>
            <p className='text-accent '>
              Để đăng ký tài khoản vui lòng cung cấp thông tin giấy tờ tùy thân của người hiến máu.
            </p>

            <div
              {...getRootProps()}
              className='border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors'
            >
              <input {...getInputProps()} />
              <Upload className='mx-auto h-12 w-12 text-accent' />
              <p className='mt-2'>Cách 1: Kéo và thả file tại đây</p>
              <button className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors'>
                Chọn file để tải lên
              </button>
            </div>

            <div className='mt-8 text-center'>
              <p className='text-accent mb-4'>Cách 2: Quét mã QR Code đến tải lên từ điện thoại</p>
              <div className='inline-block p-4 bg-secondary rounded-lg'>
                <img
                  src='https://images.unsplash.com/photo-1572555349055-1254827e85c1'
                  alt='QR Code'
                  className='w-32 h-32'
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-heading font-semibold text-foreground'>Thông tin cá nhân</h2>

            <div className='space-y-4'>
              <div className='relative'>
                <User className='absolute left-3 top-3 text-accent' />
                <input
                  type='text'
                  name='fullName'
                  placeholder='Họ và tên'
                  className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className='relative'>
                <Calendar className='absolute left-3 top-3 text-accent' />
                <input
                  type='date'
                  name='dateOfBirth'
                  className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className='relative'>
                <Mail className='absolute left-3 top-3 text-accent' />
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

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
            </div>
          </div>
        )

      case 3:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-heading font-semibold text-foreground'>Xác thực tài khoản</h2>
            <p className='text-accent'>Vui lòng nhập mã xác thực đã được gửi đến email của bạn</p>

            <div className='flex justify-center space-x-4'>
              {[1, 2, 3, 4, 5, 6].map((digit) => (
                <input
                  key={digit}
                  type='text'
                  maxLength={6}
                  className='w-12 h-12 text-center border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xl'
                />
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-heading font-semibold text-foreground'>Tạo mật khẩu</h2>

            <div className='space-y-4'>
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
          </div>
        )

      case 5:
        return (
          <div className='space-y-6 text-center'>
            <div className='w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto'>
              <Check className='w-8 h-8 text-primary-foreground' />
            </div>
            <h2 className='text-2xl font-heading font-semibold text-foreground'>Hoàn tất đăng ký</h2>
            <p className='text-accent'>Bạn đã đăng ký tài khoản thành công</p>
          </div>
        )

      default:
        return null
    }
  }

  const handleLoginClick = () => {
    console.log('User clicked login button')

    navigate('/login')
  }

  return (
    <div className='min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm'>
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-8'>
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary text-accent'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className='mt-8 flex justify-between'>
          {step > 1 && (
            <button
              onClick={prevStep}
              className='px-6 py-2 bg-secondary text-accent rounded-lg hover:bg-opacity-90 transition-colors'
            >
              Quay lại
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={nextStep}
              className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors ml-auto'
            >
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={() => console.log('Registration completed', formData)}
              className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors ml-auto'
            >
              Đăng nhập
            </button>
          )}
        </div>

        <p className='mt-4 text-center text-accent'>
          Đã có tài khoản?{' '}
          <button className='text-primary hover:underline' onClick={handleLoginClick}>
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegistrationPage
