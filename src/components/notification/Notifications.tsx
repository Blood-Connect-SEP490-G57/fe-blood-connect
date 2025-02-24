import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface NotificationsProps {
  onClose: () => void
}

const notiItems = ['Tất cả', 'Chưa đọc', 'Nhắc nhở', 'Sự kiện', 'Tin tức'] // Flattened the array
const notifications = [
  {
    id: 1,
    date: '24/01/2025',
    type: 'Nhắc nhở',
    title: 'THÔNG BÁO KHẨN !!!',
    message: 'KÊU GỈ TNV MÁU HIẾM THAM GIA HIẾN MÁU TRƯỚC TẾT',
    timeAgo: '2 ngày trước',
    read: false
  },
  {
    id: 2,
    date: '23/01/2025',
    type: 'Sự kiện',
    title: 'THÔNG BÁO KHẨN !!!',
    message: 'KÊU GỈ TNV MÁU HIẾM THAM GIA HIẾN MÁU TRƯỚC TẾT',
    timeAgo: '3 ngày trước',
    read: true
  },
  {
    id: 3,
    date: '22/01/2025',
    type: 'Tin tức',
    title: 'THÔNG BÁO KHẨN !!!',
    message: 'KÊU GỈ TNV MÁU HIẾM THAM GIA HIẾN MÁU TRƯỚC TẾT',
    timeAgo: '4 ngày trước',
    read: true
  },
  {
    id: 4,
    date: '21/01/2025',
    type: 'Nhắc nhở',
    title: 'THÔNG BÁO KHẨN !!!',
    message: 'KÊU GỈ TNV MÁU HIẾM THAM GIA HIẾN MÁU TRƯỚC TẾT',
    timeAgo: '5 ngày trước',
    read: false
  },
  {
    id: 5,
    date: '21/01/2025',
    type: 'Nhắc nhở',
    title: 'THÔNG BÁO KHẨN !!!',
    message: 'KÊU GỈ TNV MÁU HIẾM THAM GIA HIẾN MÁU TRƯỚC TẾT',
    timeAgo: '5 ngày trước',
    read: false
  }
  // Add other notifications here as needed
]

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [filter, setFilter] = useState('Tất cả')

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'Tất cả') return true
    if (filter === 'Chưa đọc') return !n.read
    return n.type === filter
  })

  return (
    <div
      className='max-w-full w-full mx-auto p-4 bg-white rounded-2xl shadow-lg border overflow-y-auto'
      style={{ maxHeight: '90vh' }}
    >
      <div className='flex justify-between items-center border-b pb-2'>
        <h2 className='text-xl font-bold'>Thông báo</h2>
      </div>
      <div className='flex flex-wrap gap-2 my-2'>
        <div className='w-full overflow-x-auto pb-2 scrollbar-hide'>
          <div className='flex gap-2 min-w-max'>
            {notiItems.map((item) => (
              <Button
                key={item}
                variant={filter === item ? 'default' : 'outline'}
                className={`text-red-600 ${filter === item ? 'bg-red-500 text-white' : 'hover:bg-red-100'}`}
                onClick={() => {
                  setFilter(item)
                  onClose()
                }}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className='mt-2 '>
        {filteredNotifications.map((notif) => (
          <Card key={notif.id} className='mb-2 border hover:bg-gray-100'>
            <CardContent className='p-4'>
              <p className='text-sm text-gray-500'>{notif.date}</p>
              <h3 className='text-lg font-bold text-red-700'>{notif.title}</h3>
              <p className='text-gray-700'>{notif.message}</p>
              <p className='text-sm text-gray-500'>{notif.timeAgo}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='mt-4 flex justify-between'>
        <Button variant='outline' className='text-red-600 border-red-500 hover:text-white hover:bg-red-600'>
          Đánh dấu đã đọc tất cả
        </Button>
        <Button variant='ghost' onClick={onClose} className='text-gray-600 hover:bg-gray-100'>
          Đóng
        </Button>
      </div>
    </div>
  )
}
Notifications.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default Notifications
