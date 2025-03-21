import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import {
  getNotifications,
  markAllAsRead,
  NotificationListResponse,
  formatExactDate,
  formatRelativeTime
} from '@/api/notification/index'

interface NotificationsProps {
  onClose: () => void
}

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: Event) => void) {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

/**
 * Hàm mapping từ số type sang nhãn văn bản.
 */
const getTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return 'Nhắc nhở'
    case 2:
      return 'Sự kiện'
    case 3:
      return 'Tin tức'
    default:
      return ''
  }
}

/**
 * Hàm trả về các lớp CSS cho badge dựa trên type.
 * Bạn có thể điều chỉnh màu sắc theo yêu cầu.
 */
const getTypeBadgeClasses = (type: number): string => {
  switch (type) {
    case 1:
      return 'bg-yellow-500 text-white' // Nhắc nhở: màu vàng
    case 2:
      return 'bg-blue-500 text-white' // Sự kiện: màu xanh lam
    case 3:
      return 'bg-green-500 text-white' // Tin tức: màu xanh lá
    default:
      return 'bg-gray-500 text-white'
  }
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, onClose)
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>('Tất cả')
  const queryClient = useQueryClient()

  // Fixed query parameters logic
  const getParams = () => {
    let type: number | undefined
    let unread: boolean | undefined

    switch (filter) {
      case 'Nhắc nhở':
        type = 1
        break
      case 'Sự kiện':
        type = 2
        break
      case 'Tin tức':
        type = 3
        break
      case 'Chưa đọc':
        unread = true
        break
    }

    return { type, unread }
  }

  const { data, isLoading } = useQuery(
    ['notifications-preview', filter],
    async () => {
      const { type, unread } = getParams()
      const response = await getNotifications({
        page: 0,
        size: 5,
        type,
        unread
      })
      console.log('API Response:', response) // Debug logging
      return response
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 30000 // Cache for 30 seconds
    }
  )

  const markAllReadMutation = useMutation(markAllAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications-preview'])
      queryClient.invalidateQueries(['unread-count'])
    }
  })

  // Add loading state
  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className='h-full min-w-[250px] lg:min-w-[300px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 bg-white rounded-2xl shadow-lg border overflow-y-auto'
      >
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-8 bg-gray-200 rounded w-full'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Safe access to notifications data
  const notifications: NotificationListResponse[] = data?.data.data|| []
  console.log('Parsed notifications:', notifications) // Debug logging

  return (
    <div
      ref={containerRef}
      className='h-full min-w-[250px] lg:min-w-[300px] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 bg-white rounded-2xl shadow-lg border overflow-y-auto'
    >
      {/* Header */}
      <div className='flex justify-between items-center border-b pb-2'>
        <h2 className='text-lg font-bold'>Thông báo</h2>
        <Button
          variant='outline'
          onClick={() => markAllReadMutation.mutate()}
          className='text-red-600 border-red-500 hover:text-white hover:bg-red-600 text-xs sm:text-sm'
        >
          Đánh dấu đã đọc tất cả
        </Button>
      </div>

      {/* Filter buttons */}
      <div className='inline-flex w-full gap-1 my-2 justify-start overflow-x-auto'>
        {['Tất cả', 'Chưa đọc', 'Nhắc nhở', 'Sự kiện', 'Tin tức'].map((item) => (
          <Button
            key={item}
            variant={filter === item ? 'default' : 'outline'}
            className={`text-red-600 text-xs sm:text-sm ${
              filter === item ? 'bg-red-500 text-white' : 'hover:bg-red-100'
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Notification list */}
      <div className='mt-2 space-y-2'>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border hover:bg-gray-100 cursor-pointer transition-colors ${
                notification.status ? 'bg-white' : 'bg-red-50'
              }`}
              onClick={() => {
                onClose()
                navigate(`/notifications/${notification.id}`)
              }}
            >
              <CardContent className='p-3'>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Calendar className='h-3 w-3' />
                  {notification.created && (
                    <>
                      <span>{formatExactDate(notification.created)}</span>
                    </>
                  )}
                </div>
                <div className='flex items-center justify-between mt-1'>
                  <h3 className='text-sm sm:text-lg font-bold text-red-500 truncate'>{notification.title}</h3>
                  {notification.type !== null && notification.type !== undefined && (
                    <span
                      className={`inline-block text-xs font-medium rounded-full px-2 ${getTypeBadgeClasses(
                        notification.type
                      )}`}
                    >
                      {getTypeLabel(notification.type)}
                    </span>
                  )}
                </div>
                <div
                  className='text-gray-600 line-clamp-1'
                  dangerouslySetInnerHTML={{ __html: notification.content }}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-center text-sm text-gray-500'>Không có thông báo nào</p>
        )}
      </div>

      {/* Footer */}
      <div className='mt-4'>
        <Button
          variant='outline'
          onClick={() => {
            onClose()
            navigate('/notifications')
          }}
          className='w-full text-red-600 border-red-500 hover:text-white hover:bg-red-600 text-sm sm:text-base'
        >
          Xem thêm
        </Button>
      </div>
    </div>
  )
}

Notifications.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default Notifications
