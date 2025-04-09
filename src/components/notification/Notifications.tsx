import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MoreVertical, Calendar, Bell, AlertCircle, CheckCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NotificationType, getTypeLabel, getTypeBadgeClasses, NotificationParams } from '@/schema/notification-schema'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatExactDate, getNotifications, markAllAsRead, toggleNotificationStatus } from '@/api/notification'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getUnreadCount } from '@/api/notification'
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications'
import { motion, AnimatePresence } from 'framer-motion'

export default function Notifications({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>('Tất cả')

  const { invalidateUnreadCount } = useUnreadNotifications()

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

  useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => getUnreadCount(),
    refetchOnWindowFocus: true,
    initialData: 0
  })

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

  // Handle click outside to close the notification panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Check if click is on dropdown menu or its children
      const isDropdownClick =
        target.closest('[role="menu"]') || target.closest('[role="menuitem"]') || target.closest('[data-state="open"]')

      if (containerRef.current && !containerRef.current.contains(target) && !isDropdownClick) {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <motion.div
      ref={containerRef}
      className='h-full min-w-[250px] lg:min-w-[300px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-h-[80vh]'
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className='px-5 py-4 bg-gradient-to-b from-red-50 to-white'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-red-100 rounded-full text-red-600'>
              <Bell className='h-5 w-5' />
            </div>
            <h1 className='text-xl font-bold text-gray-800'>Thông báo</h1>
          </div>
          <motion.button
            className='text-red-600 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors'
            onClick={() => {
              handleMarkAllAsRead()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className='h-3.5 w-3.5' />
            <span>Đánh dấu đã đọc</span>
          </motion.button>
        </div>

        {/* Filter buttons */}
        <div className='flex gap-1.5 mt-4 pb-1 overflow-x-auto px-0.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
          {filterButtons.map((button) => (
            <motion.button
              key={button.value}
              className={`px-3 py-1.5 rounded-full text-xs font-medium min-w-max transition-all ${
                filter === button.value
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setFilter(button.value)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {button.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className='overflow-y-auto max-h-[calc(80vh-120px)] py-3 px-5 space-y-3'>
        {notifications?.data.data.length === 0 ? (
          <motion.div 
            className='flex flex-col items-center justify-center py-8 text-gray-500'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className='bg-red-50 rounded-full p-4 mb-4'>
              <AlertCircle className='h-10 w-10 text-red-400' />
            </div>
            <p className='text-lg font-medium text-gray-700'>Không có thông báo</p>
            <p className='text-sm text-center text-gray-500 mt-1'>
              {filter === 'Tất cả'
                ? 'Hiện tại bạn chưa có thông báo nào'
                : `Không có thông báo nào thuộc loại "${filter}"`}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications?.data.data.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Card
                  className={`p-0 transition-all duration-200 hover:shadow-md overflow-hidden ${
                    notification.status ? 'bg-white' : 'bg-red-50'
                  } border-0 shadow-sm rounded-2xl`}
                >
                  <div className='flex justify-between items-start gap-3'>
                    <div
                      className='flex-1 p-4 cursor-pointer'
                      onClick={() => {
                        navigate('/thong-bao/' + notification.id)
                        handleToggleStatus(notification.id.toString(), true)
                        onClose?.()
                      }}
                    >
                      <div className='flex flex-wrap items-center gap-2 mb-2'>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadgeClasses(
                            notification.type as NotificationType
                          )} shadow-sm`}
                        >
                          {getTypeLabel(notification.type as NotificationType)}
                        </span>
                        <span className='text-xs text-gray-500 flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {formatExactDate(notification.created)}
                        </span>
                      </div>
                      <h3 className='font-semibold text-md text-gray-800'>{notification.title}</h3>
                      <div
                        className='text-gray-600 mt-1.5 prose prose-sm max-w-none text-sm'
                        dangerouslySetInnerHTML={{
                          __html:
                            notification.content.length > 100
                              ? notification.content.slice(0, 80) + '...'
                              : notification.content
                        }}
                      />
                    </div>

                    <div className='p-1 mt-2 mr-1'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full hover:bg-gray-100'>
                            <MoreVertical className='h-4 w-4 text-gray-500' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='min-w-[160px] p-1.5 rounded-xl shadow-lg border border-gray-100' align='end'>
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
          </AnimatePresence>
        )}
      </div>
      <div className='p-4 border-t border-gray-100 bg-white'>
        <motion.button
          className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium'
          onClick={() => navigate('/thong-bao')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Xem tất cả thông báo
        </motion.button>
      </div>
    </motion.div>
  )
}
