import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Bell, Calendar, MoreVertical, CheckCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatExactDate, getNotifications, markAllAsRead, toggleNotificationStatus } from '@/api/notification'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { getTypeBadgeClasses, getTypeLabel, NotificationParams, NotificationType } from '@/schema/notification-schema'
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationList({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>('Tất cả')
  const { invalidateUnreadCount } = useUnreadNotifications()

  const { data: notifications } = useQuery({
    queryKey: ['notifications', filter], // Add filter to query key
    queryFn: async () => {
      const params: NotificationParams = {
        page: 0,
        size: 10,
        sortBy: 'created',
        sortDir: 'desc'
      }

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
    },
    keepPreviousData: true // Keep old data while fetching new data
  })

  // Khi bấm vào thông báo, đánh dấu thông báo là đã đọc
  const handleToggleStatus = async (id: string, status: boolean) => {
    try {
      await toggleNotificationStatus(id, status)

      // Update the notifications cache
      queryClient.setQueryData(['notifications', filter], (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          data: oldData.data.data.map((notification: any) =>
            notification.id.toString() === id ? { ...notification, status } : notification
          )
        }
      }))

      // Update unread count
      await invalidateUnreadCount()
    } catch (error) {
      console.error('Error toggling notification status:', error)
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()

      // Update notifications cache
      queryClient.setQueriesData(['notifications'], (oldData: any) => {
        if (!oldData?.data?.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((notification: any) => ({
              ...notification,
              status: true
            }))
          }
        }
      })

      // Update unread count
      await invalidateUnreadCount()
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

  // Check if notifications has data
  const hasNotifications = notifications?.data?.data && notifications.data.data.length > 0

  return (
    <div className='min-h-screen bg-gray-100 sm:py-4'>
      <div className='absolute top-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>

      <div ref={containerRef} className='mx-auto px-4 max-w-7xl relative z-10 pt-20'>
        <motion.div
          className='space-y-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-red-100 rounded-full text-red-600'>
                <Bell className='h-6 w-6' />
              </div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Thông báo</h1>
            </div>
            <motion.button
              className='text-red-600 text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors shadow-sm'
              onClick={handleMarkAllAsRead}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className='h-4 w-4' />
              <span>Đánh dấu đã đọc</span>
            </motion.button>
          </div>

          {/* Filter buttons */}
          <div className='flex flex-wrap gap-2 my-4'>
            {filterButtons.map((button) => (
              <motion.button
                key={button.value}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === button.value
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => setFilter(button.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {button.label}
              </motion.button>
            ))}
          </div>

          {!hasNotifications ? (
            <motion.div
              className='flex flex-col items-center justify-center py-16 text-gray-500 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className='bg-red-50 rounded-full p-6 mb-4'>
                <AlertCircle className='h-12 w-12 text-red-400' />
              </div>
              <p className='text-xl font-medium text-gray-700'>Không có thông báo nào</p>
              <p className='text-sm text-center text-gray-500 mt-2 max-w-md'>
                {filter === 'Tất cả'
                  ? 'Hiện tại bạn chưa có thông báo nào. Thông báo sẽ xuất hiện khi có sự kiện hoặc nhắc nhở mới.'
                  : `Không có thông báo nào thuộc loại "${filter}". Vui lòng thử lại với bộ lọc khác.`}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode='popLayout'>
              <div className='space-y-4'>
                {notifications.data.data.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Card
                      className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                        notification.status ? 'bg-white' : 'bg-gradient-to-r from-red-50 to-white'
                      } border border-gray-100 rounded-2xl p-0`}
                    >
                      <div className='flex justify-between items-start p-0'>
                        <div
                          className='flex-1 p-5 cursor-pointer'
                          onClick={() => {
                            navigate('/thong-bao/' + notification.id)
                            handleToggleStatus(notification.id.toString(), true)
                            onClose?.()
                          }}
                        >
                          <div className='flex flex-wrap items-center gap-2 mb-3'>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClasses(
                                notification.type as NotificationType
                              )} shadow-sm`}
                            >
                              {getTypeLabel(notification.type as NotificationType)}
                            </span>
                            <span className='text-xs text-gray-500 flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              {formatExactDate(notification.created)}
                            </span>
                            {!notification.status && (
                              <span className='h-2 w-2 rounded-full bg-red-500 ml-auto mr-2'></span>
                            )}
                          </div>
                          <h3 className='font-semibold text-lg text-gray-800'>{notification.title}</h3>

                          <div
                            className='text-gray-600 mt-2 prose prose-sm max-w-none'
                            dangerouslySetInnerHTML={{
                              __html:
                                notification.content.length > 100
                                  ? notification.content.slice(0, 100) + '...'
                                  : notification.content
                            }}
                          />
                        </div>

                        <div className='p-2 mt-2 mr-1'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full hover:bg-gray-100'>
                                <MoreVertical className='h-4 w-4 text-gray-500' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='min-w-[160px] p-1.5 rounded-xl shadow-lg border border-gray-100'>
                              <DropdownMenuItem
                                className='rounded-lg cursor-pointer flex items-center gap-2 py-2 px-3 hover:bg-gray-100'
                                onClick={() => {
                                  handleToggleStatus(notification.id.toString(), !notification.status)
                                  onClose?.()
                                }}
                              >
                                {notification.status ? (
                                  <>
                                    <span className='h-2 w-2 rounded-full bg-red-500'></span>
                                    <span>Đánh dấu chưa đọc</span>
                                  </>
                                ) : (
                                  <>
                                    <span className='h-2 w-2 rounded-full bg-green-500'></span>
                                    <span>Đánh dấu đã đọc</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {hasNotifications && (
            <div className='flex justify-center mt-8'>
              <motion.button
                className='bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all font-medium'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tải thêm thông báo
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
