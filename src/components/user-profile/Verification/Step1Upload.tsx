import { Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { extractFront, extractBack } from '@/api/extract'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import Loading from '@/components/warnings/loading'
import { useState } from 'react'

interface Step1UploadProps {
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

const Step1Upload: React.FC<Step1UploadProps> = ({ formData, setFormData, error, onNext }) => {
  const { setExtractId, setCardDetails, setError } = useExtractStore()
  const [uploadLoading, setUploadLoading] = useState<LoadingState>({
    front: false,
    back: false
  })

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

        setFormData((prev: any) => ({
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
        setCardDetails({
          ...formData,
          extractId: formData.extractId || '',
          name: formData.fullName || '',
          extractStatus: '',
          cardId: '',
          cardType: '',
          dob: formData.dateOfBirth || '',
          gender: '',
          national: '',
          ethnicity: '',
          home: '',
          address: '',
          doe: '',
          issueLoc: extractData.issue_loc || '',
          issueDate: extractData.issue_date || '',
          features: extractData.features || '',
          data: '',
          scoreFront: 0,
          scoreBack: extractData.score_back || 0,
          inputSource: extractData.input_source || 'BACK',
          isActive: true,
          cardImages: {
            front: typeof formData.frontImage === 'string' ? formData.frontImage : formData.frontImage?.name || '',
            back: extractData.card_images?.back || ''
          }
        })

        setFormData((prev: any) => ({
          ...prev,
          backImage: acceptedFiles[0]
        }))

        setError(null)
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
          {uploadLoading.front ? (
            <Loading />
          ) : formData.frontImage ? (
            <div className='space-y-2 flex flex-col items-center align-center'>
              <img src={URL.createObjectURL(formData.frontImage)} alt='Front' className='w-40 h-40 rounded-lg' />
              <p>Đã tải lên mặt trước</p>
              <p className='text-sm text-gray-500'>{formData.frontImage.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFormData((prev: any) => ({ ...prev, frontImage: null }))
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

      {/* Mặt sau */}
      <div className='space-y-2'>
        <p>Mặt sau CCCD:</p>
        <div
          {...backDropzone.getRootProps()}
          className='border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer'
        >
          <input {...backDropzone.getInputProps()} />
          {uploadLoading.back ? (
            <Loading />
          ) : formData.backImage ? (
            <div className='space-y-2 flex flex-col items-center align-center'>
              <img src={URL.createObjectURL(formData.backImage)} alt='Back' className='w-40 h-40 rounded-lg' />
              <p>Đã tải lên mặt sau</p>
              <p className='text-sm text-gray-500'>{formData.backImage.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFormData((prev: any) => ({ ...prev, backImage: null }))
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
      <button
        onClick={onNext}
        disabled={!formData.frontImage || !formData.backImage || uploadLoading.front || uploadLoading.back}
        className={`w-full bg-primary text-white p-2 rounded ${
          !formData.frontImage || !formData.backImage || uploadLoading.front || uploadLoading.back
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
      >
        {uploadLoading.front || uploadLoading.back ? 'Đang xử lý...' : 'Tiếp theo'}
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default Step1Upload
