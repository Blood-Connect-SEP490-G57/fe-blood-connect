import { Calendar, MapPin, Droplet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import { getHistory } from '@/api/appointment'
import { toast } from '@/components/ui/use-toast'
import { cancelAppointment } from '@/api/campaign'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'
import { useNavigate } from 'react-router-dom'

interface DonationAppointment {
  id: number
  date: string
  time: string
  location: string
  status: 'completed' | 'cancelled' | 'pending' | 'upcoming'
  campaignId: number
  campaignName?: string
  bloodType?: string
  amount?: number
  notes?: string
}

const DonationHistory = () => {
  const [appointments, setAppointments] = useState<DonationAppointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const navigate = useNavigate()

  // Scroll to top when component mounts
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

        if (response.success && Array.isArray(response.data)) {
          const formattedAppointments: DonationAppointment[] = response.data.map((item: any) => {
            let status: 'completed' | 'cancelled' | 'pending' | 'upcoming'
            switch (item.status) {
              case 'BOOKING':
                status = 'upcoming'
                break
              case 'COMPLETED':
                status = 'completed'
                break
              case 'CANCELLED':
                status = 'cancelled'
                break
              default:
                status = 'pending'
            }

            let date = ''
            let time = ''
            if (Array.isArray(item.appointmentDate) && item.appointmentDate.length >= 3) {
              const [year, month, day, hour, minute] = item.appointmentDate
              date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
              if (hour !== undefined && minute !== undefined) {
                time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
              }
            } else if (item.appointmentDate) {
              const dateObj = new Date(item.appointmentDate)
              date = dateObj.toISOString().split('T')[0]
              time = dateObj.toTimeString().substring(0, 5)
            }

            return {
              id: item.id,
              campaignId: item.campaignId,
              campaignName: item.campaignName,
              date,
              time,
              location: item.location || item.campaignName || 'Không có thông tin',
              status,
              bloodType: undefined,
              amount: undefined,
              notes: undefined
            }
          })

          setAppointments(formattedAppointments)
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

  const handleCancelAppointment = async (appointments: DonationAppointment) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        // TODO: Add API call to cancel appointment
        await cancelAppointment(appointments.campaignId)
        toast({
          title: 'Đã hủy lịch hẹn',
          description: 'Lịch hẹn của bạn đã được hủy thành công',
          variant: 'default'
        })

        // Cập nhật state sau khi hủy thành công
        setAppointments((prev) =>
          prev.map((app) => (app.id === appointments.id ? { ...app, status: 'cancelled' } : app))
        )
      } catch (error) {
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể hủy lịch hẹn. Vui lòng thử lại sau.',
          variant: 'destructive'
        })
      }
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Empty />
  }

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Lịch Sử Hiến Máu</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Theo dõi lịch sử đặt hẹn và hiến máu của bạn</p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg border shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Tổng lượt hiến máu</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'completed').length}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg border shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lịch hẹn sắp tới</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'upcoming').length}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg border shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lịch hẹn đã hủy</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {appointments.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {appointments.map((appointment) => (
              <Card key={appointment.id} className='p-6 shadow-md rounded-lg'>
                <h3 className='text-xl font-semibold text-gray-900 flex items-center mb-2'>
                  <Calendar className='h-5 w-5 text-gray-500 mr-2' />
                  {appointment.date} {appointment.time && `- ${appointment.time}`}
                </h3>
                <p className='text-gray-700 flex items-center mb-2'>
                  <MapPin className='h-5 w-5 text-gray-500 mr-2' />
                  <strong>Địa điểm:</strong> {appointment.location}
                </p>
                {appointment.campaignName && (
                  <p className='text-gray-700 flex items-center mb-2'>
                    <Calendar className='h-5 w-5 text-gray-500 mr-2' />
                    <strong>Chiến dịch:</strong> {appointment.campaignName}
                  </p>
                )}
                {appointment.bloodType && (
                  <p className='text-gray-700 flex items-center mb-2'>
                    <Droplet className='h-5 w-5 text-gray-500 mr-2' />
                    <strong>Nhóm máu:</strong> {appointment.bloodType}
                  </p>
                )}
                {appointment.amount && (
                  <p className='text-gray-700 flex items-center mb-2'>
                    <Droplet className='h-5 w-5 text-gray-500 mr-2' />
                    <strong>Lượng máu:</strong> {appointment.amount}ml
                  </p>
                )}
                {appointment.status === 'upcoming' && (
                  <div className='mt-4 flex justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 border-red-600 hover:bg-red-500 hover:text-white'
                      onClick={() => handleCancelAppointment(appointment)}
                    >
                      Hủy lịch hẹn
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center space-y-4 p-6 bg-white border shadow-sm rounded-lg'>
            <h3 className='text-gray-500 text-lg font-medium text-center'>Chưa có lịch sử hiến máu</h3>
            <Button onClick={() => navigate('/blood-donation-registration')} className='w-full max-w-xs bg-red-600 text-white hover:bg-red-700 py-3 text-lg rounded-lg shadow-md transition-all'>
              Đặt lịch hiến máu
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationHistory
