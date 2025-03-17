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
    onSuccess: () => refetch()
  })

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
          onClick={() => markAllRead()}
          className='text-red-600 border-red-500 hover:text-white hover:bg-red-600 text-xs sm:text-sm'
        >
          Đánh dấu đã đọc tất cả
        </Button>
      </div>

      {/* Thanh lọc */}
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

      {/* Danh sách thông báo */}
      <div className='mt-2 space-y-2'>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`border hover:bg-gray-100 cursor-pointer transition-colors ${
                notif.status ? 'bg-white' : 'bg-red-50'
              }`}
              onClick={() => {
                if (notif.link && notif.link.trim() !== '') {
                  window.location.href = notif.link
                }
              }}
            >
              <CardContent className='p-3'>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Calendar className='h-3 w-3' />
                  <span>{formatExactDate(notif.created)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(notif.created)}</span>
                </div>
                <div className='flex items-center justify-between mt-1'>
                  <h3 className='text-sm sm:text-lg font-bold text-red-500 truncate'>{notif.title}</h3>
                  {notif.type !== null && notif.type !== undefined && (
                    <span
                      className={`inline-block text-xs font-medium rounded-full px-2 ${getTypeBadgeClasses(
                        notif.type
                      )}`}
                    >
                      {getTypeLabel(notif.type)}
                    </span>
                  )}
                </div>
                <p className='text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-1'>{notif.content}</p>
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
          onClick={() => navigate('/thong-bao')}
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
