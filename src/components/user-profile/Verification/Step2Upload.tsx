import { Upload, Camera, ChevronRight, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { extractFront, extractBack } from '@/api/extract'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import Loading from '@/components/warnings/loading'
import { useEffect, useState } from 'react'
import ScrollToTop from '@/components/scrollToTop'

interface Step2UploadProps {
  formData: {
    frontImage: File | null
    backImage: File | null
    extractId?: string
    fullName?: string
    dateOfBirth?: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  error: string | null
  onNext: () => void
}

interface LoadingState {
  front: boolean
  back: boolean
}

const Step2Upload: React.FC<Step2UploadProps> = ({ formData, setFormData, error, onNext }) => {
  const { setExtractId, setCardDetails, setError } = useExtractStore()
  const [uploadLoading, setUploadLoading] = useState<LoadingState>({
    front: false,
    back: false
  })

  useEffect(() => {
    if (!localStorage.getItem('change')) {
      localStorage.setItem('change', 'false')
    }
  }, [])

  const handleFrontImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    try {
      setUploadLoading((prev) => ({ ...prev, front: true }))
      const response = await extractFront(acceptedFiles[0])
      console.log('Front response:', response)

      if (response.success) {
        const extractData = response.data
        setExtractId(extractData.extract_id)
        setCardDetails({
          id: extractData.id,
          extractId: extractData.extract_id,
          cardType: extractData.cardType,
          extractStatus: extractData.extract_status,
          cardId: extractData.card_id,
          name: extractData.name,
          dob: extractData.dob,
          gender: extractData.sex,
          national: extractData.nationality,
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

        setFormData((prev: Step2UploadProps['formData']) => ({
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
    } catch (err: any) {
      console.error('Front extract error:', err)
      setError('Lỗi không xác định khi xử lý ảnh mặt trước')
    } finally {
      setUploadLoading((prev) => ({ ...prev, front: false }))
    }
  }

  const handleBackImageDrop = async (acceptedFiles: File[]) => {
    if (!formData.extractId) {
      setError('Vui lòng tải lên mặt trước trước')
      return
    }

    try {
      setUploadLoading((prev) => ({ ...prev, back: true }))
      const response = await extractBack(acceptedFiles[0], formData.extractId)
      console.log('Back response:', response)

      if (response.success && response.data) {
        const extractData = response.data
        // Get current card details from store
        const currentCardDetails = useExtractStore.getState().cardDetails
        // Update only back-specific data while preserving front data
        setCardDetails({
          ...currentCardDetails!,
          features: extractData.features || '',
          issueDate: extractData.issue_date || '',
          issueLoc: extractData.issue_loc || '',
          scoreBack: extractData.score_back || 0,
          inputSource: 'BACK',
          cardImages: {
            front: currentCardDetails?.cardImages?.front || '',
            back: extractData.card_images?.back || ''
          }
        })

        setFormData((prev: Step2UploadProps['formData']) => ({
          ...prev,
          backImage: acceptedFiles[0]
        }))

        setError(null)
      } else {
        setError(response.message || 'Lỗi khi xử lý ảnh mặt sau')
      }
    } catch (err: any) {
      console.error('Back extract error:', err)
      setError('Lỗi không xác định khi xử lý ảnh mặt sau')
    } finally {
      setUploadLoading((prev) => ({ ...prev, back: false }))
    }
  }

  const frontDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: handleFrontImageDrop
  })

  const backDropzone = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: handleBackImageDrop
  })

  return (
    <div className='space-y-6 mt-2'>
      <ScrollToTop />
      <div className='text-center mb-6'>
        <div className='flex items-center justify-center mb-4'>
          <div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center'>
            <Camera className='h-8 w-8 text-red-500' />
          </div>
        </div>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>Tải lên CCCD</h2>
        <p className='text-sm text-gray-600 max-w-xl mx-auto'>
          Vui lòng tải lên ảnh căn cước công dân (mặt trước và mặt sau) để xác thực thông tin.
        </p>
      </div>

      <div className='p-5 mb-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-medium text-gray-900'>Lưu ý khi chụp ảnh</h3>
          </div>
          <ul className='space-y-2'>
            <li className='flex items-start gap-2 text-sm text-gray-600'>
              <ChevronRight className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
              <span>Ảnh cần rõ nét, không mờ, không bị chói hoặc che khuất thông tin</span>
            </li>
            <li className='flex items-start gap-2 text-sm text-gray-600'>
              <ChevronRight className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
              <span>Chụp thẳng, không lệch góc, toàn bộ CCCD phải nằm trong khung hình</span>
            </li>
            <li className='flex items-start gap-2 text-sm text-gray-600'>
              <ChevronRight className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
              <span>Nếu tải sai ảnh, vui lòng tải lại cả ảnh mặt trước và mặt sau</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mặt trước */}
      <div className='mb-4'>
        <div className='p-5'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-medium text-gray-900'>Mặt trước CCCD</h3>
            {formData.frontImage && (
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>Đã tải lên</span>
            )}
          </div>

          <div
            {...frontDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              formData.frontImage
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <input {...frontDropzone.getInputProps()} />
            {uploadLoading.front ? (
              <Loading />
            ) : formData.frontImage ? (
              <div className='space-y-2 flex flex-col items-center'>
                <img
                  src={URL.createObjectURL(formData.frontImage)}
                  alt='Front'
                  className='w-40 h-32 object-cover rounded-lg shadow-sm'
                />
                <p className='text-sm text-gray-600 font-medium'>{formData.frontImage.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFormData((prev: any) => ({ ...prev, frontImage: null }))
                  }}
                  className='flex items-center gap-1 px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200'
                >
                  <X className='h-3 w-3' />
                  <span>Xóa</span>
                </button>
              </div>
            ) : (
              <>
                <Upload className='mx-auto h-10 w-10 text-red-400' />
                <p className='mt-2 text-sm font-medium text-gray-700'>Tải lên ảnh mặt trước</p>
                <p className='text-xs text-gray-500 mt-1'>Nhấp để chọn hoặc kéo thả (JPG, PNG - tối đa 5MB)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mặt sau */}
      <div className={`mb-4 transition-opacity ${formData.frontImage ? 'opacity-100' : 'opacity-50'}`}>
        <div className='p-5'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-medium text-gray-900'>Mặt sau CCCD</h3>
            {formData.backImage && (
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>Đã tải lên</span>
            )}
          </div>

          <div
            {...(formData.frontImage ? backDropzone.getRootProps() : {})}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              formData.frontImage
                ? `cursor-pointer ${
                    formData.backImage
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                  }`
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            {formData.frontImage && <input {...backDropzone.getInputProps()} />}
            {uploadLoading.back ? (
              <Loading />
            ) : formData.backImage ? (
              <div className='space-y-2 flex flex-col items-center'>
                <img
                  src={URL.createObjectURL(formData.backImage)}
                  alt='Back'
                  className='w-40 h-32 object-cover rounded-lg shadow-sm'
                />
                <p className='text-sm text-gray-600 font-medium'>{formData.backImage.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFormData((prev: any) => ({ ...prev, backImage: null }))
                  }}
                  className='flex items-center gap-1 px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200'
                >
                  <X className='h-3 w-3' />
                  <span>Xóa</span>
                </button>
              </div>
            ) : formData.frontImage ? (
              <>
                <Upload className='mx-auto h-10 w-10 text-red-400' />
                <p className='mt-2 text-sm font-medium text-gray-700'>Tải lên ảnh mặt sau</p>
                <p className='text-xs text-gray-500 mt-1'>Nhấp để chọn hoặc kéo thả (JPG, PNG - tối đa 5MB)</p>
              </>
            ) : (
              <>
                <Upload className='mx-auto h-10 w-10 text-gray-300' />
                <p className='mt-2 text-sm font-medium text-gray-400'>Tải lên ảnh mặt sau</p>
                <p className='text-xs text-gray-400 mt-1'>Vui lòng tải lên mặt trước trước</p>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <div className='p-4 bg-red-50 text-red-600 rounded-lg text-sm'>{error}</div>}

      <div>
        <button className='flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200'>
          <span>Quay lại</span>
        </button>
        <button
          onClick={onNext}
          disabled={!formData.frontImage || !formData.backImage || uploadLoading.front || uploadLoading.back}
          className={`w-full py-4 text-white font-medium rounded-xl transition-colors ${
            !formData.frontImage || !formData.backImage || uploadLoading.front || uploadLoading.back
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {uploadLoading.front || uploadLoading.back ? 'Đang xử lý...' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  )
}

export default Step2Upload
