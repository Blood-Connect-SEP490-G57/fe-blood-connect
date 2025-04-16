import { Camera, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface CameraCaptureProps {
  onCapture: (file: File) => Promise<void>
  onClose: () => void
  side: 'front' | 'back'
}

const CameraCapture = ({ onCapture, onClose, side }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Khởi động camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: side === 'front' ? 'user' : 'environment' }
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Camera error:', err)
        setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.')
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [side])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            const file = new File([blob], `${side}-${Date.now()}.jpg`, { type: 'image/jpeg' })
            await onCapture(file)
            onClose()
          }
        },
        'image/jpeg',
        0.9
      )
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium'>Chụp ảnh mặt {side === 'front' ? 'trước' : 'sau'}</h3>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {error ? (
          <div className='text-red-500 text-center p-4'>{error}</div>
        ) : (
          <>
            <div className='relative'>
              <video ref={videoRef} autoPlay playsInline className='w-full h-auto rounded-lg bg-black' />
              <canvas ref={canvasRef} className='hidden' />
            </div>

            <div className='mt-4 flex justify-center'>
              <button onClick={capturePhoto} className='p-3 bg-red-500 text-white rounded-full hover:bg-red-600'>
                <Camera className='h-6 w-6' />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CameraCapture
