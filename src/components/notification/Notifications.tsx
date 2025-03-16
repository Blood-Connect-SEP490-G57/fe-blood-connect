import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getNotifications, markAllAsRead, NotificationListResponse } from '@/api/notification/index'

/**
 * Các mục lọc được hiển thị trên thanh điều hướng của thông báo.
 */
const notiItems = ['Tất cả', 'Chưa đọc', 'Nhắc nhở', 'Sự kiện', 'Tin tức']

interface NotificationsProps {
  onClose: () => void
}

/**
 * Hook tự động gọi onClose khi click bên ngoài phần tử được chỉ định.
 */
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
 * Hàm định dạng thời gian theo dạng “x giây/phút/tiếng/ngày/tuần/tháng/năm trước”
 */
function formatRelativeTime(dateString: string): string {
  const createdDate = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - createdDate.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds} giây trước`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} tiếng trước`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} tuần trước`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} tháng trước`
  const years = Math.floor(days / 365)
  return `${years} năm trước`
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, onClose)
  const navigate = useNavigate()

  // State filter, mặc định là "Tất cả"
  const [filter, setFilter] = useState<string>('Tất cả')

  // Xác định tham số type khi gọi API dựa trên filter
  const getTypeParam = (): number | undefined => {
    if (filter === 'Nhắc nhở') return 1
    if (filter === 'Sự kiện') return 2
    if (filter === 'Tin tức') return 3
    return undefined
  }
  // Nếu chọn "Chưa đọc" thì truyền tham số unread=true
  const getUnreadParam = (): boolean | undefined => {
    if (filter === 'Chưa đọc') return true
    return undefined
  }

  // Sử dụng useQuery để load danh sách thông báo (trang 0, 5 bản ghi)
  const { data, refetch } = useQuery(['notifications', filter], () =>
    getNotifications(0, 5, 'created', 'desc', undefined, getTypeParam(), getUnreadParam())
  )

  // Lấy danh sách thông báo
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
      {/* Header: chỉ hiển thị tiêu đề */}
      <div className='flex justify-between items-center border-b pb-2'>
        <h2 className='text-xl font-bold'>Thông báo</h2>
      </div>

      {/* Thanh lọc */}
      <div className='flex flex-wrap gap-2 my-2'>
        <div className='w-full overflow-x-auto pb-2 scrollbar-hide'>
          <div className='flex gap-2 min-w-max'>
            {notiItems.map((item) => (
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

      {/* Nút đánh dấu tất cả đã đọc */}
      <div className='mb-2'>
        <Button variant='outline' onClick={() => markAllRead()} className='w-full'>
          Đánh dấu đã đọc tất cả
        </Button>
      </div>

      {/* Danh sách thông báo */}
      <div className='mt-2'>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className='mb-2 border hover:bg-gray-100 cursor-pointer'
              onClick={() => {
                if (notif.link && notif.link.trim() !== '') {
                  window.location.href = notif.link
                }
              }}
            >
              <CardContent className='p-4'>
                <p className='text-sm text-gray-500'>{formatRelativeTime(notif.created)}</p>
                <h3 className='text-lg font-bold text-red-700'>{notif.title}</h3>
                <p className='text-gray-700'>{notif.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-center text-gray-500'>Không có thông báo nào</p>
        )}
      </div>

      {/* Footer: 2 nút "Xem thêm" và "Đóng" */}
      <div className='mt-4 flex justify-between'>
        <Button variant='outline' onClick={() => navigate('/notifications')} className='w-1/2'>
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
