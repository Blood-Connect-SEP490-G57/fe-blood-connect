import { ArrowLeft, Calendar, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { formatExactDate, getNotificationById } from '@/api/notification/index'
import { useNavigate, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'

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
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-sm'
    case 2:
      return 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-sm'
    case 3:
      return 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-sm'
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-sm'
  }
}

const NotificationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: notification,
    isLoading,
    isError
  } = useQuery(['notification', id], () => getNotificationById(id as string), {
    enabled: !!id
  })

  if (isError) {
    return (
      <div className='min-h-screen bg-gray-100'>
        <div className='container mx-auto px-4 max-w-4xl'>
          <motion.button 
            className='flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-6 px-3 py-2 rounded-full hover:bg-red-50'
            onClick={() => navigate('/thong-bao')}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft className='h-5 w-5' />
            <span>Quay lại</span>
          </motion.button>
          <motion.div 
            className='flex flex-col items-center justify-center py-16 text-gray-500 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='text-center text-gray-500'>
              <p className='text-xl font-medium text-gray-700 mb-2'>Đã có lỗi xảy ra</p>
              <p className='text-gray-500'>Không thể tải thông báo. Vui lòng thử lại sau.</p>
              <motion.button
                className='mt-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all font-medium'
                onClick={() => navigate('/thong-bao')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Quay lại danh sách
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100 py-12'>
        <div className='mx-auto px-4 max-w-7xl'>
          <Button variant='ghost' className='mb-6' disabled>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Quay lại
          </Button>
          <Card className='overflow-hidden rounded-3xl shadow-sm border border-gray-100'>
            <CardContent className='p-8 space-y-6'>
              <div className='flex justify-between items-center'>
                <Skeleton className='h-4 w-32 rounded-full' />
                <Skeleton className='h-6 w-24 rounded-full' />
              </div>
              <Skeleton className='h-10 w-full rounded-xl' />
              <div className='space-y-4'>
                <Skeleton className='h-4 w-full rounded-lg' />
                <Skeleton className='h-4 w-full rounded-lg' />
                <Skeleton className='h-4 w-4/5 rounded-lg' />
                <Skeleton className='h-4 w-3/5 rounded-lg' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!notification) return null

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='absolute top-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <div className='container mx-auto px-4 max-w-4xl py-6 relative z-10'>
        <motion.button 
          className='flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-8 px-3 py-2 rounded-full hover:bg-red-50'
          onClick={() => navigate('/thong-bao')}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <ChevronLeft className='h-5 w-5' />
          <span>Quay lại danh sách</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className='bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100'>
            <CardContent className='p-8'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <div className='p-1.5 bg-gray-100 rounded-full'>
                    <Calendar className='h-4 w-4 text-gray-600' />
                  </div>
                  {notification.created && (
                    <span>{formatExactDate(notification.created)}</span>
                  )}
                </div>
                {notification.type !== undefined && notification.type !== null && (
                  <span
                    className={`inline-block text-xs font-medium rounded-full px-4 py-1.5 ${getTypeBadgeClasses(
                      notification.type
                    )}`}
                  >
                    {getTypeLabel(notification.type)}
                  </span>
                )}
              </div>

              <h1 className='text-2xl font-bold text-gray-800 mb-6'>{notification.title}</h1>

              <div className='prose prose-red max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600'>
                <div dangerouslySetInnerHTML={{ __html: notification.content }} />
              </div>

              {notification.link && (
                <div className='mt-8 flex justify-end'>
                  <motion.a
                    href={notification.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all font-medium'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Xem thêm chi tiết
                  </motion.a>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default NotificationDetail
