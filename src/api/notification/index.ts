import axios from 'axios'
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
  items: T[]
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
  return axiosPrivate.put('/api/notifications/user/readAll')
}

export const markAsRead = async (id: string) => {
  return axiosPrivate.post(`/api/notifications/user/${id}/read`)
}

export const getNotificationById = async (id: string) => {
  const response = await axiosPrivate.get(`/api/notifications/user/${id}`)
  return response.data.data
}

export const formatExactDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi })
}

export const formatRelativeTime = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
}
