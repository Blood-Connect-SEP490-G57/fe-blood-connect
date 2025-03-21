import { ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'  // Add useQueryClient
import { formatExactDate, getNotificationById, markAsRead } from '@/api/notification/index'
import { useNavigate, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'

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
      return 'bg-yellow-500 text-white'
    case 2:
      return 'bg-blue-500 text-white'
    case 3:
      return 'bg-green-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

const NotificationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()  // Add this line

  const {
    data: notification,
    refetch,
    isLoading,
    isError
  } = useQuery(['notification', id], () => getNotificationById(id as string), {
    enabled: !!id,
    onSuccess: (data) => {
      if (!data.status) {
        markNotificationRead.mutate(id as string)
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải thông báo. Vui lòng thử lại sau.'
      })
    }
  })

  const markNotificationRead = useMutation(markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      queryClient.invalidateQueries(['notifications-preview'])
      queryClient.invalidateQueries(['unread-count'])
    }
  })

  if (isError) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4 max-w-4xl'>
          <Button variant='ghost' className='mb-6' onClick={() => navigate('/notifications')}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Quay lại
          </Button>
          <div className='text-center text-gray-500'>
            <p>Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4 max-w-4xl'>
          <Button variant='ghost' className='mb-6' disabled>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Quay lại
          </Button>
          <Card>
            <CardContent className='p-6 space-y-4'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-40 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!notification) return null

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <Button variant='ghost' className='mb-6 hover:bg-gray-100' onClick={() => navigate('/notifications')}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Quay lại
        </Button>

        <Card className='bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2 text-sm text-gray-500'>
                <Calendar className='h-4 w-4' />
                {notification.created && (
                  <>
                    <span>{formatExactDate(notification.created)}</span>
                    <span>•</span>
                    {/* <span>{formatRelativeTime(notification.created)}</span> */}
                  </>
                )}
              </div>
              {notification.type !== undefined && notification.type !== null && (
                <span
                  className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${getTypeBadgeClasses(
                    notification.type
                  )}`}
                >
                  {getTypeLabel(notification.type)}
                </span>
              )}
            </div>

            <h1 className='text-2xl font-bold text-gray-900 mb-6'>{notification.title}</h1>

            <div className='prose prose-red max-w-none'>
              <div dangerouslySetInnerHTML={{ __html: notification.content }} />
            </div>

            {notification.link && (
              <div className='mt-6 flex justify-end'>
                <Button
                  className='bg-red-600 hover:bg-red-700 text-white'
                  onClick={() => window.open(notification.link, '_blank')}
                >
                  Xem thêm chi tiết
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotificationDetail
