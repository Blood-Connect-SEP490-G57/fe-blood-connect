import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { axiosPrivate } from '..'

export interface NotificationListResponse {
  id: number
  title: string
  content: string
  link?: string
  status: boolean
  type: number
  created: string
}

interface NotificationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  type?: number
  unread?: boolean
}

interface PaginatedResponse<T> {
  currentPage: number
  totalPages: number
  totalItems: number
  data: T[]
  hasNext: boolean
}

interface ApiResponse<T> {
  success: boolean
  data: PaginatedResponse<T>
  message?: string
}

export const getNotifications = async (params: NotificationParams): Promise<ApiResponse<NotificationListResponse>> => {
  const response = await axiosPrivate.get('/api/notifications/user', {
    params: {
      ...params,
      sortBy: params.sortBy || 'created',
      sortDir: params.sortDir || 'desc'
    }
  })

  // Add error handling
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch notifications')
  }

  return response.data
}

export const getUnreadCount = async (): Promise<number> => {
  const response = await axiosPrivate.get('/api/notifications/user/unread')
  return response.data.data
}

export const markAllAsRead = async () => {
  return axiosPrivate.put('/api/notifications/user/read-all')
}

export const markAsRead = async (id: string) => {
  return axiosPrivate.post(`/api/notifications/user/${id}/read`)
}

export const getNotificationById = async (id: string) => {
  const response = await axiosPrivate.get(`/api/notifications/user/${id}`)
  return response.data.data
}

export const formatExactDate = (dateString: string) => {
  try {
    if (!dateString) return ''

    // Check if date is in backend format (HH:mm:ss dd/MM/yyyy)
    if (dateString.includes('/')) {
      const [time, date] = dateString.split(' ')
      const [day, month, year] = date.split('/')
      const [hours, minutes, seconds] = time.split(':')
      const parsedDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'dd/MM/yyyy HH:mm', { locale: vi })
      }
    }

    // Fallback to regular date parsing
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString)
      return dateString // Return original string if parsing fails
    }
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString // Return original string on error
  }
}

export const formatRelativeTime = (dateString: string) => {
  try {
    if (!dateString) return ''

    // Check if date is in backend format (HH:mm:ss dd/MM/yyyy)
    if (dateString.includes('/')) {
      const [time, date] = dateString.split(' ')
      const [day, month, year] = date.split('/')
      const [hours, minutes, seconds] = time.split(':')
      const parsedDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)
      if (!isNaN(parsedDate.getTime())) {
        return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi })
      }
    }

    // Fallback to regular date parsing
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString)
      return ''
    }
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return ''
  }
}
