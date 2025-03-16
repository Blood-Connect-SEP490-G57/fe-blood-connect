import { useState } from 'react'
import { Bell, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  markAllAsRead,
  NotificationListResponse,
  formatExactDate,
  formatRelativeTime
} from '@/api/notification/index'

const tabs = [
  { title: 'Tất cả', value: 'all' },
  { title: 'Chưa đọc', value: 'unread' },
  { title: 'Nhắc nhở', value: 'reminders' },
  { title: 'Sự kiện', value: 'events' },
  { title: 'Tin tức', value: 'news' }
]

const getFilterParams = (tab: string) => {
  let typeParam: number | undefined = undefined
  let unreadParam: boolean | undefined = undefined
  if (tab === 'unread') {
    unreadParam = true
  } else if (tab === 'reminders') {
    typeParam = 1
  } else if (tab === 'events') {
    typeParam = 2
  } else if (tab === 'news') {
    typeParam = 3
  }
  return { typeParam, unreadParam }
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

const NotificationDetail = () => {
  const [activeTab, setActiveTab] = useState<string>('all')
  const { typeParam, unreadParam } = getFilterParams(activeTab)

  // Sử dụng useInfiniteQuery để load thông báo, 10 bản ghi mỗi trang
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    ['notifications', activeTab],
    ({ pageParam = 0 }) => getNotifications(pageParam, 10, 'created', 'desc', undefined, typeParam, unreadParam),
    {
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.currentPage
        const totalPages = lastPage.totalPages
        return currentPage < totalPages - 1 ? currentPage + 1 : undefined
      }
    }
  )

  const notifications: NotificationListResponse[] = data?.pages.flatMap((page) => page.data) ?? []

  const { mutate: markAllRead } = useMutation(markAllAsRead, {
    onSuccess: () => refetch()
  })

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <Bell className='h-8 w-8 text-red-600' />
            <h1 className='text-3xl font-bold text-gray-900'>Thông báo</h1>
          </div>
          <Button
            variant='outline'
            className='border-red-600 text-red-600 hover:bg-red-50'
            onClick={() => markAllRead()}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <div className='flex items-center gap-4 mb-6 justify-end'>
            <div className='w-full overflow-x-auto pb-2 scrollbar-hide'>
              <div className='flex gap-2 min-w-max'>
                <TabsList className='bg-white border border-gray-200'>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className='whitespace-nowrap'>
                      {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          </div>

          <TabsContent value={activeTab} className='space-y-4'>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <p className='text-center text-gray-500'>Không có thông báo nào</p>
            )}
            {hasNextPage && (
              <div className='flex justify-center'>
                <Button
                  variant='outline'
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className='border-red-600 text-red-600 hover:bg-red-50'
                >
                  {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface NotificationCardProps {
  notification: NotificationListResponse
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  return (
    <Card
      className={`transition-colors ${
        notification.status ? 'bg-white' : 'bg-red-50'
      } mb-2 border hover:bg-gray-100 cursor-pointer`}
      onClick={() => {
        if (notification.link && notification.link.trim() !== '') {
          window.location.href = notification.link
        }
      }}
    >
      <CardContent className='p-6'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <Calendar className='h-4 w-4' />
          <span>{formatExactDate(notification.created)}</span>
          <span>•</span>
          <span>{formatRelativeTime(notification.created)}</span>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <h3 className='text-lg font-semibold text-gray-900 truncate'>{notification.title}</h3>
          {notification.type !== undefined && notification.type !== null && (
            <span
              className={`inline-block text-xs font-medium rounded-full px-2 ${getTypeBadgeClasses(notification.type)}`}
            >
              {getTypeLabel(notification.type)}
            </span>
          )}
        </div>
        <p className='text-gray-600 line-clamp-1'>{notification.content}</p>
      </CardContent>
    </Card>
  )
}

export default NotificationDetail
