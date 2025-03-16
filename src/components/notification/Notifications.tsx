import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery, useMutation } from '@tanstack/react-query'
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

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, onClose)
  const navigate = useNavigate()

  // State filter, mặc định là "Tất cả"
  const [filter, setFilter] = useState<string>('Tất cả')

  // Xác định tham số type/unread khi gọi API dựa trên filter
  const getTypeParam = (): number | undefined => {
    if (filter === 'Nhắc nhở') return 1
    if (filter === 'Sự kiện') return 2
    if (filter === 'Tin tức') return 3
    return undefined
  }
  const getUnreadParam = (): boolean | undefined => {
    if (filter === 'Chưa đọc') return true
    return undefined
  }

  // Sử dụng useQuery để load danh sách thông báo (page 0, 5 bản ghi)
  const { data, refetch } = useQuery(['notifications', filter], () =>
    getNotifications(0, 5, 'created', 'desc', undefined, getTypeParam(), getUnreadParam())
  )
  const notifications: NotificationListResponse[] = data?.data ?? []

  // Mutation đánh dấu tất cả đã đọc
  const { mutate: markAllRead } = useMutation(markAllAsRead, {
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <div
      ref={containerRef}
      className='max-w-full w-full mx-auto p-4 bg-white rounded-2xl shadow-lg border overflow-y-auto'
      style={{ maxHeight: '90vh' }}
    >
      {/* Header: hiển thị tiêu đề và nút "Đánh dấu đã đọc tất cả" */}
      <div className='flex justify-between items-center border-b pb-2'>
        <h2 className='text-xl font-bold'>Thông báo</h2>
        <Button
          variant='outline'
          onClick={() => markAllRead()}
          className='text-red-600 border-red-500 hover:text-white hover:bg-red-600'
        >
          Đánh dấu đã đọc tất cả
        </Button>
      </div>

      {/* Thanh lọc */}
      <div className='flex flex-wrap gap-2 my-2'>
        <div className='w-full overflow-x-auto pb-2 scrollbar-hide'>
          <div className='flex gap-2 min-w-max'>
            {['Tất cả', 'Chưa đọc', 'Nhắc nhở', 'Sự kiện', 'Tin tức'].map((item) => (
              <Button
                key={item}
                variant={filter === item ? 'default' : 'outline'}
                className={`text-red-600 ${filter === item ? 'bg-red-500 text-white' : 'hover:bg-red-100'}`}
                onClick={() => setFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className='mt-2'>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`mb-2 border hover:bg-gray-100 cursor-pointer transition-colors ${
                notif.status ? 'bg-white' : 'bg-red-50'
              }`}
              onClick={() => {
                if (notif.link && notif.link.trim() !== '') {
                  window.location.href = notif.link
                }
              }}
            >
              <CardContent className='p-4'>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <Calendar className='h-4 w-4' />
                  <span>{formatExactDate(notif.created)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(notif.created)}</span>
                </div>
                <h3 className='text-lg font-bold text-red-500 truncate'>{notif.title}</h3>
                <p className='text-gray-500 line-clamp-1'>{notif.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-center text-gray-500'>Không có thông báo nào</p>
        )}
      </div>

      {/* Footer: nút "Xem thêm" chuyển đến trang chi tiết */}
      <div className='mt-4 flex justify-between'>
        <Button
          variant='outline'
          onClick={() => navigate('/notifications')}
          className='w-full text-red-600 border-red-500 hover:text-white hover:bg-red-600'
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
