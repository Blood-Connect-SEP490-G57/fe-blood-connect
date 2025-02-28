import { useState } from 'react'
import { Bell, Calendar } from 'lucide-react'
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
  const tabs = [
    { title: 'Tất cả', value: 'all' },
    { title: 'Chưa đọc', value: 'unread' },
    { title: 'Nhắc nhở', value: 'reminders' },
    { title: 'Sự kiện', value: 'events' },
    { title: 'Tin tức', value: 'news' }
  ]
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
    },
    {
      id: 3,
      date: '22/01/2025',
      type: 'Tin tức',
      title: 'THÔNG BÁO KHẨN !!!',
      message: 'KÊU GỈ TNV MÁU HIẾM THAM GIA HIẾN MÁU TRƯỚC TẾT',
      timeAgo: '4 ngày trước',
      read: false
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
      case 'news':
        return notifications.filter((n) => n.type === 'Tin tức')
      default:
        return notifications
    }
  }

  return (
    <div className='min-h-screen bg-white py-12'>
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
          <div className='flex items-center gap-4 mb-6 justify-end'>
            {/* <Filter className='h-5 w-5 text-gray-500' /> */}
            <div className='w-full overflow-x-auto pb-2 scrollbar-hide'>
              <div className='flex gap-2 min-w-max'>
                <TabsList className='bg-white border border-gray-200'>
                  {tabs.map((tabs) => (
                    <TabsTrigger
                      key={tabs.value}
                      value={tabs.value}
                      className='whitespace-nowrap'
                    >
                      {tabs.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
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
          <TabsContent value='news' className='space-y-4'>
            {getFilteredNotifications('news').map((notification) => (
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
        {!notification.read && (
          <Button
            variant='ghost'
            className='text-red-600 hover:bg-red-50'
            onClick={() => onMarkAsRead(notification.id)}
          >
            Đánh dấu đã đọc
          </Button>
        )}
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
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationDetail
