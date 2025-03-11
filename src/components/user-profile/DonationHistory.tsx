import { Calendar, MapPin, CheckCircle, XCircle, AlertCircle, Droplet, StickyNote, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { getHistory } from '@/api/history'
import { toast } from '@/components/ui/use-toast'

interface DonationAppointment {
  id: number
  date: string
  time: string
  location: string
  status: 'completed' | 'cancelled' | 'pending' | 'upcoming'
  campaignId?: number
  campaignName?: string
  bloodType?: string
  amount?: number
  notes?: string
}

const DonationHistory = () => {
  const [appointments, setAppointments] = useState<DonationAppointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        setLoading(true)
        const response = await getHistory()
        
        if (response.success && Array.isArray(response.data)) {
          // Map API response to our interface
          const formattedAppointments: DonationAppointment[] = response.data.map((item: any) => {
            // Chuyển đổi status sang định dạng frontend
            let status: 'completed' | 'cancelled' | 'pending' | 'upcoming';
            switch (item.status) {
              case 'BOOKING':
                status = 'upcoming';
                break;
              case 'COMPLETED':
                status = 'completed';
                break;
              case 'CANCELLED':
                status = 'cancelled';
                break;
              default:
                status = 'pending';
            }

            // Xử lý định dạng ngày và giờ từ mảng
            let date = '';
            let time = '';
            if (Array.isArray(item.appointmentDate) && item.appointmentDate.length >= 3) {
              const [year, month, day, hour, minute] = item.appointmentDate;
              // Tạo date string với định dạng YYYY-MM-DD
              date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              
              // Tạo time string với định dạng HH:MM
              if (hour !== undefined && minute !== undefined) {
                time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              }
            } else if (item.appointmentDate) {
              // Nếu appointmentDate là một string hoặc timestamp
              const dateObj = new Date(item.appointmentDate);
              date = dateObj.toISOString().split('T')[0];
              time = dateObj.toTimeString().substring(0, 5);
            }

            // Định dạng dữ liệu để phù hợp với component
            return {
              id: item.id,
              campaignId: item.campaignId,
              campaignName: item.campaignName,
              date,
              time,
              location: item.location || item.campaignName || 'Không có thông tin',
              status,
              // Các trường khác có thể không tồn tại trong API response
              bloodType: undefined,
              amount: undefined,
              notes: undefined
            };
          });
          
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

  const handleCancelAppointment = async (appointmentId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        // TODO: Add API call to cancel appointment
        toast({
          title: 'Đã hủy lịch hẹn',
          description: 'Lịch hẹn của bạn đã được hủy thành công',
          variant: 'default'
        })
        
        // Cập nhật state sau khi hủy thành công
        setAppointments(prev => 
          prev.map(app => app.id === appointmentId ? {...app, status: 'cancelled'} : app)
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      upcoming: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className='h-4 w-4' />
        {status === 'completed' && 'Đã hoàn thành'}
        {status === 'upcoming' && 'Sắp tới'}
        {status === 'cancelled' && 'Đã hủy'}
        {status === 'pending' && 'Đang chờ'}
      </Badge>
    )
  }

  // Trạng thái loading
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <Loader2 className='w-8 h-8 animate-spin text-red-600' />
        <p className='text-gray-600'>Đang tải lịch sử hiến máu...</p>
      </div>
    )
  }

  // Trạng thái lỗi
  if (error) {
    return (
      <div className='min-h-screen bg-gray-100 py-12'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>Lịch Sử Hiến Máu</h1>
          </div>
          <div className='bg-red-50 p-6 rounded-lg text-center'>
            <XCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <p className='text-red-700'>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className='mt-4 bg-red-600 hover:bg-red-700 text-white'
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='container mx-auto px-4'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Lịch Sử Hiến Máu</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Theo dõi lịch sử đặt hẹn và hiến máu của bạn</p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Tổng lượt hiến máu</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'completed').length}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lịch hẹn sắp tới</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'upcoming').length}
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lịch hẹn đã hủy</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {appointments.length === 0 && (
          <div className='bg-white rounded-lg shadow-md p-8 text-center'>
            <Calendar className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>Chưa có lịch sử hiến máu</h3>
            <p className='text-gray-500 mb-6'>Bạn chưa có lịch hẹn hiến máu nào. Hãy đăng ký hiến máu để cứu sống nhiều người!</p>
            <Button 
              className='bg-red-600 hover:bg-red-700 text-white'
              onClick={() => window.location.href = '/blood-donation-registration'}
            >
              Đăng ký hiến máu ngay
            </Button>
          </div>
        )}

        {/* Donation Cards */}
        {appointments.length > 0 && (
          <div className='flex flex-col gap-6'>
            {appointments.map((appointment) => (
              <div key={appointment.id} className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    <Calendar className='inline-block h-5 w-5 text-gray-500 mr-2' />
                    {new Date(appointment.date).toLocaleDateString('vi-VN')}
                    {appointment.time && ` - ${appointment.time}`}
                  </h3>
                  {getStatusBadge(appointment.status)}
                </div>

                <p className='text-gray-700 flex items-center mb-2 justify-between'>
                  <div className='flex'>
                    <MapPin className='h-5 w-5 text-gray-500 mr-2' />
                    <strong>Địa điểm:</strong>
                  </div>
                  {appointment.location}
                </p>

                {appointment.campaignName && (
                  <p className='text-gray-700 flex items-center mb-2 justify-between'>
                    <div className='flex'>
                      <Calendar className='h-5 w-5 text-gray-500 mr-2' />
                      <strong>Chiến dịch:</strong>
                    </div>
                    {appointment.campaignName}
                  </p>
                )}

                {appointment.bloodType && (
                  <p className='text-gray-700 flex items-center mb-2 justify-between'>
                    <div className='flex'>
                      <Droplet className='h-5 w-5 text-gray-500 mr-2 ' />
                      <strong>Nhóm máu:</strong>
                    </div>
                    {appointment.bloodType}
                  </p>
                )}

                {appointment.amount && (
                  <p className='text-gray-700 flex item-center mb-2 justify-between'>
                    <div className='flex'>
                      <Droplet className='h-5 w-5 text-gray-500 mr-2 ' />
                      <strong>Lượng máu:</strong>
                    </div>
                    {appointment.amount}ml
                  </p>
                )}

                {appointment.notes && (
                  <p className='text-gray-700 flex item-center mb-2 justify-between'>
                    <div className='flex'>
                      <StickyNote className='h-5 w-5 text-gray-500 mr-2 ' />
                      <strong>Ghi chú:</strong>
                    </div>
                    {appointment.notes}
                  </p>
                )}

                {appointment.status === 'upcoming' && (
                  <div className='mt-4 flex justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 border-red-600 hover:bg-red-500 hover:text-white'
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Hủy lịch hẹn
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationHistory
