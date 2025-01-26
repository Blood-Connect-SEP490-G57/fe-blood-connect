import { useState } from 'react'
import { Bell, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Notification {
  id: number
  date: string
  type: string
  title: string
  message: string
  timeAgo: string
  read: boolean
}

const NotificationDetail = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([
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
    }
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getFilteredNotifications = (tab: string) => {
    switch (tab) {
      case 'unread':
        return notifications.filter((n) => !n.read)
      case 'reminders':
        return notifications.filter((n) => n.type === 'Nhắc nhở')
      case 'events':
        return notifications.filter((n) => n.type === 'Sự kiện')
      default:
        return notifications
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <Bell className='h-8 w-8 text-red-600' />
            <h1 className='text-3xl font-bold text-gray-900'>Thông báo</h1>
          </div>
          <Button variant='outline' className='border-red-600 text-red-600 hover:bg-red-50' onClick={markAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        </div>

        <Tabs defaultValue='all' className='space-y-6'>
          <div className='flex items-center gap-4 mb-6'>
            <Filter className='h-5 w-5 text-gray-500' />
            <TabsList className='bg-white border border-gray-200'>
              <TabsTrigger value='all'>Tất cả</TabsTrigger>
              <TabsTrigger value='unread'>Chưa đọc</TabsTrigger>
              <TabsTrigger value='reminders'>Nhắc nhở</TabsTrigger>
              <TabsTrigger value='events'>Sự kiện</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='all' className='space-y-4'>
            {getFilteredNotifications('all').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
            ))}
          </TabsContent>

          <TabsContent value='unread' className='space-y-4'>
            {getFilteredNotifications('unread').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
            ))}
          </TabsContent>

          <TabsContent value='reminders' className='space-y-4'>
            {getFilteredNotifications('reminders').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
            ))}
          </TabsContent>

          <TabsContent value='events' className='space-y-4'>
            {getFilteredNotifications('events').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: number) => void
}

const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
  return (
    <Card className={`transition-colors ${notification.read ? 'bg-white' : 'bg-red-50'}`}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <Calendar className='h-4 w-4' />
              <span>{notification.date}</span>
              <span>•</span>
              <span>{notification.timeAgo}</span>
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>{notification.title}</h3>
            <p className='text-gray-600'>{notification.message}</p>
          </div>
          {!notification.read && (
            <Button
              variant='ghost'
              className='text-red-600 hover:bg-red-50'
              onClick={() => onMarkAsRead(notification.id)}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationDetail
