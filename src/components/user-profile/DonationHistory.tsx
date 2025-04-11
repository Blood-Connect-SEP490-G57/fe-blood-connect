import { Calendar, MapPin, Info, ChevronRight, Droplet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <div className='bg-white rounded-xl shadow-lg w-11/12 max-w-md overflow-hidden'>
        <div className='p-5 border-b'>
          <h2 className='text-lg font-bold'>Xác nhận hủy lịch hẹn</h2>
        </div>
        <div className='p-5'>
          <p className='mb-4 text-gray-600'>Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
          <div className='flex justify-end space-x-2'>
            <Button onClick={onClose} variant='outline' className='px-5 py-2 rounded-xl border border-gray-300'>
              Hủy bỏ
            </Button>
            <Button onClick={onConfirm} className='px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700'>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Status Badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-gray-100 text-gray-800'
  let label = status

  switch (status) {
    case 'DONE':
      color = 'bg-green-100 text-green-800'
      label = 'Hoàn thành'
      break
    case 'BOOKING':
      color = 'bg-yellow-100 text-yellow-800'
      label = 'Đã đặt lịch'
      break
    case 'CANCELLED':
      color = 'bg-red-100 text-red-800'
      label = 'Đã hủy'
      break
  }

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>{label}</span>
}

const DonationHistory = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null)

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

      // Update local state
      setAppointments(appointments.map((app) => (app.id === appointment.id ? { ...app, status: 'CANCELLED' } : app)))

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

  const handleOpenModal = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment)
    setModalOpen(true)
  }

  const doneAppointments = appointments.filter((a) => a.status === 'DONE').length
  const upcomingAppointments = appointments.filter((a) => a.status === 'BOOKING').length
  const cancelledAppointments = appointments.filter((a) => a.status === 'CANCELLED').length

  if (loading) return <Loading />
  if (error) return <Empty />

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Banner */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white rounded-xl p-8 md:p-12'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center md:flex-row md:justify-center md:space-x-8'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4 md:mb-0 md:h-32 md:w-32'>
              <Droplet className='h-12 w-12 text-red-500 md:h-16 md:w-16' />
            </div>
            <div className='text-center md:text-left'>
              <h1 className='text-2xl font-bold mb-1 md:text-4xl'>Lịch Sử Hiến Máu</h1>
              <p className='text-white/80 md:text-lg'>Theo dõi lịch sử đặt hẹn và hiến máu của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4'>
        {/* Stats Cards */}
        <div className='grid grid-cols-3 gap-3 mb-6 md:gap-6 md:mx-auto'>
          <Card className='overflow-hidden rounded-xl shadow-sm border-none hover:shadow-md transition-shadow'>
            <CardContent className='p-4 md:p-6'>
              <div className='flex flex-col items-center'>
                <p className='text-sm md:text-base text-gray-500 mb-1'>Hiến máu</p>
                <p className='text-2xl md:text-4xl font-bold text-green-600'>{doneAppointments}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='overflow-hidden rounded-xl shadow-sm border-none hover:shadow-md transition-shadow'>
            <CardContent className='p-4 md:p-6'>
              <div className='flex flex-col items-center'>
                <p className='text-sm md:text-base text-gray-500 mb-1'>Sắp tới</p>
                <p className='text-2xl md:text-4xl font-bold text-yellow-600'>{upcomingAppointments}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='overflow-hidden rounded-xl shadow-sm border-none hover:shadow-md transition-shadow'>
            <CardContent className='p-4 md:p-6'>
              <div className='flex flex-col items-center'>
                <p className='text-sm md:text-base text-gray-500 mb-1'>Đã hủy</p>
                <p className='text-2xl md:text-4xl font-bold text-red-600'>{cancelledAppointments}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment List */}
        <div className=' md:mx-auto'>
          <h2 className='text-lg md:text-2xl font-semibold text-gray-700 mb-2 px-2'>Tất cả lịch hẹn</h2>

          {appointments.length === 0 ? (
            <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
              <CardContent className='p-6 flex flex-col items-center'>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <Calendar className='h-8 w-8 text-gray-400' />
                </div>
                <p className='text-gray-500 text-center'>Bạn chưa có lịch hẹn nào</p>
              </CardContent>
            </Card>
          ) : (
            <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
              <CardContent className='p-0'>
                <div className='divide-y'>
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className='p-4 md:p-6 flex items-start justify-between hover:bg-gray-50 transition-colors'>
                      <div className='flex gap-3 md:gap-6 flex-1'>
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                          ${appointment.status === 'DONE' ? 'bg-green-100' : 
                            appointment.status === 'BOOKING' ? 'bg-yellow-100' : 'bg-red-100'}`}
                        >
                          <Calendar className={`h-5 w-5 md:h-6 md:w-6 
                            ${appointment.status === 'DONE' ? 'text-green-600' : 
                              appointment.status === 'BOOKING' ? 'text-yellow-600' : 'text-red-600'}`}
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between mb-1 md:mb-2'>
                            <p className='font-bold md:text-lg'>{formatExactDate(appointment.appointmentDate)}</p>
                            <StatusBadge status={appointment.status} />
                          </div>
                          <div className='flex flex-col space-y-1 py-2 text-sm md:text-base text-gray-500'>
                            <div className='flex items-center gap-2'>
                              <MapPin className='h-5 w-5 md:h-6 md:w-6' />
                              <span>{appointment.location || 'Không có thông tin'}</span>
                            </div>
                            {appointment.campaignName && (
                              <div className='flex items-center gap-2'>
                                <Info className='h-5 w-5 md:h-6 md:w-6' />
                                <span>{appointment.campaignName}</span>
                              </div>
                            )}
                          </div>
                          <div className='flex items-center justify-end mt-2'>
                            {appointment.status === 'BOOKING' && (
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-600 hover:bg-red-50 md:text-base md:px-6'
                                onClick={() => handleOpenModal(appointment)}
                              >
                                Hủy lịch hẹn
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className='h-5 w-5 md:h-6 md:w-6 text-gray-400 mt-2' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <CancelAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() => handleCancelAppointment(selectedAppointment)}
        />
      )}
    </div>
  )
}

export default DonationHistory
