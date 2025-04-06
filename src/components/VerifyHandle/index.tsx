import VerifyFalse from '@/components/VerifyHandle/VerifyFalse'
import VerifySuccess from '@/components/VerifyHandle/VerifySuccess'
import { useParams } from 'react-router-dom'

export default function VerificationHandler() {
  const { status } = useParams()

  if (status === 'success') {
    return <VerifySuccess />
  } else if (status === 'failed') {
    return <VerifyFalse />
  } else {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-xl font-bold text-red-600'>Trạng thái xác thực không hợp lệ!</h1>
      </div>
    )
  }
}
