import React, { useState, useEffect } from 'react'
import { Upload, Check } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { extractFront, extractBack, getExtractById, updateExtractStatus } from '@/api/extract'

interface FormData {
  frontImage: File | null
  backImage: File | null
  extractId?: string
  fullName: string
  dateOfBirth: string
  email: string
  mobile: string
  extractedInfo?: {
    fullName?: string
    dateOfBirth?: string
    idNumber?: string
  }
}

const UserVerification = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    frontImage: null,
    backImage: null,
    fullName: '',
    dateOfBirth: '',
    email: '',
    mobile: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFrontImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    try {
      setLoading(true)
      const response = await extractFront(acceptedFiles[0])
      if (response.success) {
        setFormData({
          ...formData,
          frontImage: acceptedFiles[0],
          extractId: response.data.extractId
        })
        setError('')
      } else {
        setError(response.message || 'Lỗi khi xử lý ảnh mặt trước')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Lỗi khi xử lý ảnh mặt trước: ${err.message}`)
      } else {
        setError('Lỗi không xác định khi xử lý ảnh mặt trước')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackImageDrop = async (acceptedFiles: File[]) => {
    try {
      setLoading(true)
      const response = await extractBack(acceptedFiles[0], formData.extractId || '')
      if (response.success) {
        setFormData({ ...formData, backImage: acceptedFiles[0] })
        nextStep()
      } else {
        setError(response.message || 'Lỗi khi xử lý ảnh mặt sau')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Lỗi khi xử lý ảnh mặt sau: ${err.message}`)
      } else {
        setError('Lỗi không xác định khi xử lý ảnh mặt sau')
      }
    } finally {
      setLoading(false)
    }
  }

  const frontDropzone = useDropzone({
    onDrop: handleFrontImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const backDropzone = useDropzone({
    onDrop: handleBackImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = (): void => setStep(step + 1)
  const prevStep = (): void => setStep(step - 1)

  const fetchExtractedInfo = async () => {
    if (!formData.extractId) return

    try {
      setLoading(true)
      const response = await getExtractById(formData.extractId)
      setFormData({
        ...formData,
        extractedInfo: response,
        fullName: response.fullName || '',
        dateOfBirth: response.dateOfBirth || ''
      })
    } catch (err) {
      setError('Không thể lấy thông tin đã trích xuất')
    } finally {
      setLoading(false)
    }
  }

  const validateContactInfo = () => {
    if (!formData.email || !formData.mobile) {
      setError('Vui lòng điền đầy đủ thông tin liên hệ')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.mobile)) {
      setError('Số điện thoại không hợp lệ')
      return false
    }

    return true
  }

  const handleConfirm = async () => {
    if (!validateContactInfo()) return

    try {
      setLoading(true)
      await updateExtractStatus({
        extractId: formData.extractId,
        status: 'CONFIRMED',
        contactInfo: {
          email: formData.email,
          phone: formData.mobile
        }
      })
      setError('')
      nextStep()
    } catch (err) {
      if (err instanceof Error) {
        setError(`Lỗi khi xác nhận thông tin: ${err.message}`)
      } else {
        setError('Lỗi không xác định khi xác nhận thông tin')
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-heading font-semibold text-foreground'>Tải lên CCCD</h2>

      {/* Mặt trước */}
      <div className='space-y-2'>
        <p>Mặt trước CCCD:</p>
        <div
          {...frontDropzone.getRootProps()}
          className='border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer'
        >
          <input {...frontDropzone.getInputProps()} />
          {formData.frontImage ? (
            <div className='space-y-2'>
              <p>Đã tải lên mặt trước</p>
              <p className='text-sm text-gray-500'>{formData.frontImage.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFormData({ ...formData, frontImage: null })
                }}
                className='px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200'
              >
                Xóa
              </button>
            </div>
          ) : (
            <>
              <Upload className='mx-auto h-12 w-12 text-accent' />
              <p className='mt-2'>Kéo thả hoặc click để tải lên ảnh mặt trước</p>
              <p className='text-sm text-gray-500 mt-1'>Hỗ trợ: JPG, PNG (Tối đa 5MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Mặt sau - chỉ hiện khi đã có mặt trước */}
      {formData.frontImage && (
        <div className='space-y-2'>
          <p>Mặt sau CCCD:</p>
          <div
            {...backDropzone.getRootProps()}
            className='border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer'
          >
            <input {...backDropzone.getInputProps()} />
            {formData.backImage ? (
              <div className='space-y-2'>
                <p>Đã tải lên mặt sau</p>
                <p className='text-sm text-gray-500'>{formData.backImage.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFormData({ ...formData, backImage: null })
                  }}
                  className='px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200'
                >
                  Xóa
                </button>
              </div>
            ) : (
              <>
                <Upload className='mx-auto h-12 w-12 text-accent' />
                <p className='mt-2'>Kéo thả hoặc click để tải lên ảnh mặt sau</p>
                <p className='text-sm text-gray-500 mt-1'>Hỗ trợ: JPG, PNG (Tối đa 5MB)</p>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )

  useEffect(() => {
    if (step === 2 && formData.extractId) {
      fetchExtractedInfo()
    }
  }, [step])

  useEffect(() => {
    return () => {
      // Cleanup if component unmounts during upload
      if (loading) {
        setError('Quá trình xử lý đã bị hủy')
        setLoading(false)
      }
    }
  }, [loading])

  const renderStep = (): JSX.Element | null => {
    if (loading) {
      return (
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-2'>Đang xử lý...</span>
        </div>
      )
    }

    switch (step) {
      case 1:
        return renderStep1()
      case 2:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-heading font-semibold'>Thông tin đã trích xuất</h2>
            {loading ? (
              <p>Đang tải thông tin...</p>
            ) : (
              <div className='space-y-4'>
                <p>Họ tên: {formData.extractedInfo?.fullName}</p>
                <p>Ngày sinh: {formData.extractedInfo?.dateOfBirth}</p>
                {/* Hiển thị các thông tin khác từ API */}
              </div>
            )}
          </div>
        )
      case 3:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-heading font-semibold'>Xác nhận thông tin</h2>
            <div className='space-y-4'>
              {/* Form nhập thông tin liên hệ */}
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Email'
                className='w-full p-2 border rounded'
              />
              <input
                type='tel'
                name='mobile'
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder='Số điện thoại'
                className='w-full p-2 border rounded'
              />
              <button onClick={handleConfirm} className='w-full bg-primary text-white p-2 rounded' disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Xác nhận thông tin'}
              </button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className='space-y-6 text-center'>
            <div className='w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto'>
              <Check className='w-8 h-8 text-primary-foreground' />
            </div>
            <h2 className='text-2xl font-heading font-semibold text-foreground'>Hoàn tất xác thực</h2>
            <p className='text-accent'>Bạn đã xác thực tài khoản thành công</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          {[1, 2, 3, 4].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary text-accent'
                }`}
              >
                {stepNumber}
              </div>
              {index < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all duration-500 ease-in-out ${
                    step > stepNumber ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className='mt-8 flex justify-between'>
        {step > 1 && step < 4 && (
          <button
            onClick={prevStep}
            className='px-6 py-2 bg-secondary text-accent rounded-lg hover:bg-opacity-90 transition-colors'
          >
            Quay lại
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={nextStep}
            className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors ml-auto'
          >
            Tiếp tục
          </button>
        ) : (
          <button
            onClick={() => console.log('Verification completed', formData)}
            className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors ml-auto'
          >
            Đăng kí hiến máu
          </button>
        )}
      </div>
    </div>
  )
}

export default UserVerification
