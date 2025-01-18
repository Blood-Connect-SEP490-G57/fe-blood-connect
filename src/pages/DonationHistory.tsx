import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    },
    {
      id: 3,
      date: '2024-01-10',
      time: '08:00',
      location: 'Trung tâm Y tế Yên Khánh',
      status: 'cancelled',
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
      <Badge className={`${config.color} gap-1`}>
        <Icon className="h-4 w-4" />
        {status === 'completed' && 'Đã hoàn thành'}
        {status === 'upcoming' && 'Sắp tới'}
        {status === 'cancelled' && 'Đã hủy'}
        {status === 'pending' && 'Đang chờ'}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lịch Sử Hiến Máu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi lịch sử đặt hẹn và hiến máu của bạn
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tổng lượt hiến máu</h3>
            <p className="text-3xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tổng ml máu đã hiến</h3>
            <p className="text-3xl font-bold text-red-600">
              {appointments.reduce((sum, a) => sum + (a.amount || 0), 0)}ml
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lịch hẹn sắp tới</h3>
            <p className="text-3xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'upcoming').length}
            </p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Lượng máu</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(appointment.date).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {appointment.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {appointment.location}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>{appointment.bloodType || '-'}</TableCell>
                  <TableCell>{appointment.amount ? `${appointment.amount}ml` : '-'}</TableCell>
                  <TableCell>{appointment.notes || '-'}</TableCell>
                  <TableCell>
                    {appointment.status === 'upcoming' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => console.log(`Cancel appointment ${appointment.id}`)}
                      >
                        Hủy lịch hẹn
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DonationHistory 