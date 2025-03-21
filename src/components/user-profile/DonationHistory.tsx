import { Calendar, MapPin, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import { getHistory } from '@/api/appointment'
import { toast } from '@/components/ui/use-toast'
import { cancelAppointment } from '@/api/campaign'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'
import { AppointmentType } from '@/schema/appointment-schema'
import { formatExactDate } from '@/api/notification'

function CancelAppointmentModal({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded shadow-lg'>
        <h2 className='text-lg font-bold mb-4'>Xác nhận hủy lịch hẹn</h2>
        <p className='mb-4'>Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
        <div className='flex justify-end space-x-2'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>
            Hủy bỏ
          </button>
          <button onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}

const DonationHistory = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchDonationHistory = async () => {
      try {
        setLoading(true)
        const response = await getHistory()

        if (Array.isArray(response.data)) {
          setAppointments(response.data)
        } else {
          setError('Không thể tải dữ liệu lịch sử hiến máu')
        }
      } catch (error) {
        console.error('Error fetching donation history:', error)
        setError('Đã xảy ra lỗi khi tải dữ liệu')
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDonationHistory()
  }, [])

  const handleCancelAppointment = async (appointment: AppointmentType) => {
    try {
      await cancelAppointment(appointment.campaignId)
      toast({
        title: 'Đã hủy lịch hẹn',
        description: 'Lịch hẹn của bạn đã được hủy thành công',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể hủy lịch hẹn. Vui lòng thử lại sau.',
        variant: 'destructive'
      })
    }
    setModalOpen(false)
  }

  if (loading) return <Loading />
  if (error) return <Empty />

  return (
    <div className='min-h-screen py-12 px-4 container mx-auto bg-white'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900'>Lịch Sử Hiến Máu</h1>
        <p className='text-lg text-gray-600'>Theo dõi lịch sử đặt hẹn và hiến máu của bạn</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='p-6 bg-blue-100 rounded-lg shadow-sm text-blue-800'>
          <h3 className='text-lg font-semibold'>Tổng lượt hiến máu</h3>
          <p className='text-3xl font-bold'>{appointments.filter((a) => a.status === 'DONE').length}</p>
        </div>

        <div className='p-6 bg-yellow-100 rounded-lg shadow-sm text-yellow-800'>
          <h3 className='text-lg font-semibold'>Lịch hẹn sắp tới</h3>
          <p className='text-3xl font-bold'>{appointments.filter((a) => a.status === 'BOOKING').length}</p>
        </div>

        <div className='p-6 bg-red-100 rounded-lg shadow-sm text-red-800'>
          <h3 className='text-lg font-semibold'>Lịch hẹn đã hủy</h3>
          <p className='text-3xl font-bold'>{appointments.filter((a) => a.status === 'CANCELLED').length}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        {appointments.map((appointment) => (
          <Card key={appointment.id} className='p-6 shadow-md rounded-lg border'>
            <div className='flex justify-end items-center'>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold  
                  ${
                    appointment.status === 'DONE'
                      ? 'bg-green-100 text-green-700'
                      : appointment.status === 'BOOKING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : appointment.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {appointment.status === 'DONE'
                  ? 'Hoàn thành'
                  : appointment.status === 'BOOKING'
                  ? 'Đã đặt lịch'
                  : 'Đã hủy'}
              </span>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 flex items-center mt-3'>
              <Calendar className='h-5 w-5 text-gray-500 mr-2' /> {formatExactDate(appointment.appointmentDate)}
            </h3>

            <p className='text-gray-700 flex items-center mt-2'>
              <MapPin className='h-5 w-5 text-gray-500 mr-2' />
              <span className='font-bold'>Địa điểm:</span> {appointment.location || 'Không có thông tin'}
            </p>
            {appointment.campaignName && (
              <p className='text-gray-700 flex items-center mt-2'>
                <Info className='h-5 w-5 text-gray-500 mr-2' />
                <span className='font-bold'>Chiến dịch:</span> {appointment.campaignName}
              </p>
            )}
            <div className='mt-4 flex justify-end space-x-2'>
              {appointment.status === 'BOOKING' && (
                <Button
                  variant='outline'
                  size='sm'
                  className='text-red-600 border-red-600 hover:bg-red-500 hover:text-white'
                  onClick={() => setModalOpen(true)}
                >
                  Hủy lịch hẹn
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      <CancelAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => handleCancelAppointment(appointments[0])}
      />
    </div>
  )
}

export default DonationHistory
