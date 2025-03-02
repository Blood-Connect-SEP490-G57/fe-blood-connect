import React, { useState, useEffect } from 'react'
import { Upload, Check } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import { extractFront, extractBack, getExtractById, updateExtractStatus } from '@/api/extract'

interface FormData {
  frontImage: File | null
  backImage: File | null
  extractId?: string
  fullName: string
  dateOfBirth: string
  email: string
  mobile: string
  extractedInfo?: any
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

  const {
    extractId,
    cardDetails,
    isLoading,
    error: storeError,
    setExtractId,
    setCardDetails,
    setLoading,
    setError
  } = useExtractStore()

  const frontDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    onDrop: handleFrontImageDrop,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const backDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    onDrop: handleBackImageDrop,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  async function handleFrontImageDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length === 0) {
      setError('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    try {
      setLoading(true)
      const response = await extractFront(acceptedFiles[0])
      console.log('Front response:', response)

      if (response.success) {
        const extractData = response.data
        setExtractId(extractData.extract_id)
        setCardDetails({
          id: extractData.id,
          extractId: extractData.extract_id,
          cardType: extractData.card_type,
          extractStatus: extractData.extract_status,
          cardId: extractData.card_id,
          name: extractData.name,
          dob: extractData.dob,
          gender: extractData.gender,
          national: extractData.national,
          ethnicity: '',
          home: extractData.home,
          address: extractData.address,
          doe: extractData.doe,
          issueLoc: extractData.issue_loc,
          issueDate: extractData.issue_date,
          features: extractData.features,
          data: extractData.data,
          scoreFront: extractData.score_front,
          scoreBack: extractData.score_back,
          inputSource: extractData.input_source,
          isActive: extractData.is_active,
          cardImages: extractData.card_images
        })

        setFormData(prev => ({
          ...prev,
          frontImage: acceptedFiles[0],
          extractId: extractData.extract_id,
          fullName: extractData.name,
          dateOfBirth: extractData.dob
        }))

        setError(null)
      } else {
        setError(response.message || 'Lỗi khi xử lý ảnh mặt trước')
      }
    } catch (err) {
      console.error('Front extract error:', err)
      if (err instanceof Error) {
        setError(`Lỗi khi xử lý ảnh mặt trước: ${err.message}`)
      } else {
        setError('Lỗi không xác định khi xử lý ảnh mặt trước')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleBackImageDrop(acceptedFiles: File[]) {
    if (!extractId) {
      setError('Vui lòng tải lên mặt trước trước')
      return
    }

    try {
      setLoading(true)
      const response = await extractBack(acceptedFiles[0], extractId)
      console.log('Back response:', response)

      if (response.success && response.data) {
        const extractData = response.data
        setCardDetails({
          ...cardDetails!,
          features: extractData.features || '',
          issueDate: extractData.issue_date || '',
          issueLoc: extractData.issue_loc || '',
          scoreBack: extractData.score_back || 0,
          inputSource: extractData.input_source || 'BACK',
          cardImages: {
            front: cardDetails?.cardImages?.front || '',
            back: extractData.card_images?.back || ''
          }
        })

        setFormData(prev => ({
          ...prev,
          backImage: acceptedFiles[0]
        }))

        setError(null)
        nextStep() // Chuyển sang step 2 sau khi có cả 2 mặt
      } else {
        setError(response.message || 'Lỗi khi xử lý ảnh mặt sau')
      }
    } catch (err) {
      console.error('Back extract error:', err)
      if (err instanceof Error) {
        setError(`Lỗi khi xử lý ảnh mặt sau: ${err.message}`)
      } else {
        setError('Lỗi không xác định khi xử lý ảnh mặt sau')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = (): void => setStep(step + 1)
  const prevStep = (): void => setStep(step - 1)

  const fetchExtractedInfo = async () => {
    if (!extractId) return

    try {
      setLoading(true)
      const response = await getExtractById(extractId)
      if (response.success) {
        const extractData = response.data
        setCardDetails({
          id: extractData.id,
          extractId: extractData.extract_id,
          cardType: extractData.card_type,
          extractStatus: extractData.extract_status,
          cardId: extractData.card_id,
          name: extractData.name,
          dob: extractData.dob,
          gender: extractData.gender,
          national: extractData.national,
          ethnicity: '',
          home: extractData.home,
          address: extractData.address,
          doe: extractData.doe,
          issueLoc: extractData.issue_loc,
          issueDate: extractData.issue_date,
          features: extractData.features,
          data: extractData.data,
          scoreFront: extractData.score_front,
          scoreBack: extractData.score_back,
          inputSource: extractData.input_source,
          isActive: extractData.is_active,
          cardImages: extractData.card_images
        })
        setFormData({
          ...formData,
          extractedInfo: extractData,
          fullName: extractData.name || '',
          dateOfBirth: extractData.dob || ''
        })
      } else {
        setError('Không thể lấy thông tin đã trích xuất')
      }
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
      const response = await updateExtractStatus({
        extractId: extractId,
        status: 'CONFIRMED',
        contactInfo: {
          email: formData.email,
          phone: formData.mobile
        }
      })

      if (response.success) {
        setError(null)
        nextStep()
      } else {
        setError(response.message || 'Lỗi khi xác nhận thông tin')
      }
    } catch (err) {
      console.error('Confirm error:', err)
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
      {extractId && (
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

      {storeError && <p className='text-red-500'>{storeError}</p>}
    </div>
  )

  useEffect(() => {
    if (step === 2 && extractId) {
      fetchExtractedInfo()
    }
  }, [step, extractId])


  useEffect(() => {
    console.log('cardDetails updated:', cardDetails)
  }, [cardDetails])

  const renderStep2 = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-heading font-semibold'>Thông tin đã trích xuất</h2>
      {isLoading ? (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : (
        cardDetails ? (
          <div className='space-y-4 p-6 border rounded-lg'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Loại thẻ</p>
                <p className='font-medium'>{cardDetails.cardType}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Số CCCD</p>
                <p className='font-medium'>{cardDetails.cardId}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Họ và tên</p>
                <p className='font-medium'>{cardDetails.name}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Ngày sinh</p>
                <p className='font-medium'>{cardDetails.dob}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Giới tính</p>
                <p className='font-medium'>{cardDetails.gender}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Quốc tịch</p>
                <p className='font-medium'>{cardDetails.national}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Quê quán</p>
                <p className='font-medium'>{cardDetails.home}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Ngày hết hạn</p>
                <p className='font-medium'>{cardDetails.doe}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Nơi cấp</p>
                <p className='font-medium'>{cardDetails.issueLoc}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Ngày cấp</p>
                <p className='font-medium'>{cardDetails.issueDate}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-gray-500'>Đặc điểm nhận dạng</p>
                <p className='font-medium'>{cardDetails.features}</p>
              </div>
              <div className='space-y-2 col-span-2'>
                <p className='text-sm text-gray-500'>Địa chỉ thường trú</p>
                <p className='font-medium'>{cardDetails.address}</p>
              </div>
            </div>
            {storeError && (
              <div className='p-4 bg-red-50 text-red-600 rounded-lg mt-4'>
                {storeError}
              </div>
            )}
          </div>
        ) : (
          <div className='p-4 bg-yellow-50 text-yellow-600 rounded-lg'>
            Không có thông tin thẻ
          </div>
        )
      )}
    </div>
  )

  const renderStep = (): JSX.Element | null => {
    if (isLoading) {
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
        return renderStep2()
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
              <button onClick={handleConfirm} className='w-full bg-primary text-white p-2 rounded' disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Xác nhận thông tin'}
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
