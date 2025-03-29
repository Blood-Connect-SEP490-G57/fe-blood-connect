import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MoreVertical, Calendar, Bell, AlertCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NotificationType, getTypeLabel, getTypeBadgeClasses, NotificationParams } from '@/schema/notification-schema'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatExactDate, getNotifications, markAllAsRead, toggleNotificationStatus } from '@/api/notification'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'

export default function Notifications({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>('Tất cả')

  const { data: notifications } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => {
      const params: NotificationParams = { page: 0, size: 10 }

      // Add type filter
      if (filter === 'Nhắc nhở') {
        params.type = NotificationType.REMINDER
      } else if (filter === 'Sự kiện') {
        params.type = NotificationType.EVENT
      } else if (filter === 'Tin tức') {
        params.type = NotificationType.NEWS
      } else if (filter === 'Chưa đọc') {
        params.unread = true
      }

      return getNotifications(params)
    }
  })

  const handleToggleStatus = async (id: string, status: boolean) => {
    await toggleNotificationStatus(id, status)
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      // Update the notifications cache to mark all as read
      queryClient.setQueryData(['notifications'], (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          data: oldData.data.data.map((notification: any) => ({
            ...notification,
            status: true
          }))
        }
      }))
      // Reset unread count to 0
      queryClient.setQueryData(['unreadCount'], 0)

      // Optional: Close the notifications panel
      onClose?.()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const filterButtons = [
    { label: 'Tất cả', value: 'Tất cả' },
    { label: 'Chưa đọc', value: 'Chưa đọc' },
    { label: 'Nhắc nhở', value: 'Nhắc nhở', type: NotificationType.REMINDER },
    { label: 'Sự kiện', value: 'Sự kiện', type: NotificationType.EVENT },
    { label: 'Tin tức', value: 'Tin tức', type: NotificationType.NEWS }
  ]

  return (
    <div
      ref={containerRef}
      className='h-full min-w-[250px] lg:min-w-[300px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 bg-white rounded-2xl shadow-lg border overflow-y-auto'
    >
      <div className='flex justify-between items-center border-b pb-2'>
        <div className='flex items-center gap-2'>
          <Bell className='h-6 w-6 text-red-500' />
          <h1 className='text-2xl font-bold'>Thông báo</h1>
        </div>
        <Button
          variant='ghost'
          onClick={handleMarkAllAsRead}
          className='text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200'
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      {/* Filter buttons */}
      <div className='inline-flex w-full gap-1 my-2 justify-start overflow-x-auto'>
        {filterButtons.map((button) => (
          <Button
            key={button.value}
            variant={filter === button.value ? 'default' : 'outline'}
            className={`text-red-600 text-xs sm:text-sm ${
              filter === button.value ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-red-100 hover:text-red-700'
            } transition-colors duration-200`}
            onClick={() => setFilter(button.value)}
          >
            {button.label}
          </Button>
        ))}
      </div>

      <div className='space-y-4'>
        {notifications?.data.data.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
            <AlertCircle className='h-12 w-12 mb-2 text-red-400' />
            <p className='text-lg font-medium'>Không có thông báo nào</p>
            <p className='text-sm'>
              {filter === 'Tất cả'
                ? 'Hiện tại bạn chưa có thông báo nào'
                : `Không có thông báo nào thuộc loại "${filter}"`}
            </p>
          </div>
        ) : (
          <>
            {notifications?.data.data.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all duration-200 hover:shadow-md ${
                  notification.status ? 'bg-white' : 'bg-red-50'
                }`}
              >
                <div className='flex justify-between items-start gap-4'>
                  <div
                    className='flex-1'
                    onClick={() => {
                      navigate('/thong-bao/' + notification.id)
                      handleToggleStatus(notification.id.toString(), true)
                      onClose?.()
                    }}
                  >
                    <div className='flex items-center gap-2 mb-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeClasses(
                          notification.type as NotificationType
                        )}`}
                      >
                        {getTypeLabel(notification.type as NotificationType)}
                      </span>
                      <span className='text-xs text-gray-500 flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {formatExactDate(notification.created)}
                      </span>
                    </div>
                    <h3 className='font-semibold text-lg text-gray-900'>{notification.title}</h3>
                    <div
                      className='text-gray-600 mt-2 prose prose-sm max-w-none'
                      dangerouslySetInnerHTML={{
                        __html:
                          notification.content.length > 100
                            ? notification.content.slice(0, 50) + '...'
                            : notification.content
                      }}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => {
                          handleToggleStatus(notification.id.toString(), !notification.status)
                          onClose?.()
                        }}
                      >
                        {notification.status ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
      <div className='mt-4'>
        <Button
          variant='outline'
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-10 px-4 py-2 w-full text-red-600 border-red-500 hover:text-white hover:bg-red-600 text-sm sm:text-base'
          onClick={() => navigate('/thong-bao')}
        >
          Xem thêm
        </Button>
      </div>
    </div>
  )
}
