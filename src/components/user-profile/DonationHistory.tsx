import { Calendar, MapPin, CheckCircle, XCircle, AlertCircle, Droplet, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DonationAppointment {
  id: number
  date: string
  time: string
  location: string
  status: 'completed' | 'cancelled' | 'pending' | 'upcoming'
  bloodType?: string
  amount?: number
  notes?: string
}

const DonationHistory = () => {
  const appointments: DonationAppointment[] = [
    {
      id: 1,
      date: '2024-02-15',
      time: '09:00',
      location: 'Trung tâm Hiến máu Nhân đạo Ninh Bình',
      status: 'completed',
      bloodType: 'A+',
      amount: 350,
      notes: 'Hiến máu thành công'
    },
    {
      id: 2,
      date: '2024-03-01',
      time: '10:30',
      location: 'Bệnh viện Đa khoa Ninh Bình',
      status: 'upcoming',
      bloodType: '-',
      amount: 1,
      notes: 'Không đến trung tâm'
    },
    {
      id: 3,
      date: '2024-01-10',
      time: '08:00',
      location: 'Trung tâm Y tế Yên Khánh',
      status: 'cancelled',
      bloodType: '-',
      amount: 1,
      notes: 'Bận công việc đột xuất'
    }
  ]

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
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Tổng ml máu đã hiến</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.reduce((sum, a) => sum + (a.amount || 0), 0)}ml
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Lịch hẹn sắp tới</h3>
            <p className='text-3xl font-bold text-red-600'>
              {appointments.filter((a) => a.status === 'upcoming').length}
            </p>
          </div>
        </div>

        {/* Donation Cards (Instead of Table) */}
        <div className='flex flex-col gap-6'>
          {appointments.map((appointment) => (
            <div key={appointment.id} className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  <Calendar className='inline-block h-5 w-5 text-gray-500 mr-2' />
                  {new Date(appointment.date).toLocaleDateString('vi-VN')} - {appointment.time}
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
                    onClick={() => console.log(`Cancel appointment ${appointment.id}`)}
                  >
                    Hủy lịch hẹn
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DonationHistory
