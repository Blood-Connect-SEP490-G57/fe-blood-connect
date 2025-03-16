import { apiGetCall, apiPutCall } from '..'
import { PaginatedResponse } from '../../schema/paginated-response-schema'

export interface NotificationListResponse {
  id: number
  title: string
  content: string
  status: boolean
  link: string
  type: number
  created: string
}

export const getNotifications = async (
  page = 0,
  size = 10,
  sortBy = 'created',
  sortDir = 'desc',
  search?: string,
  type?: number,
  unread?: boolean
): Promise<PaginatedResponse<NotificationListResponse>> => {
  // Xây dựng đối tượng query params
  const params: any = { page, size, sortBy, sortDir }
  if (search) params.search = search
  if (type !== undefined) params.type = type
  if (unread !== undefined) params.unread = unread

  // Chuyển đổi params thành query string
  const queryString = new URLSearchParams(params).toString()
  // Nối query string vào URL
  const url = `/api/notifications/user?${queryString}`

  // Gọi API với URL đã có query string
  const response = await apiGetCall(url, true)
  return response.data.data
}

export const getUnreadCount = async (): Promise<number> => {
  const response = await apiGetCall('/api/notifications/user/unread', true)
  return response.data.data
}

export const markAllAsRead = async (): Promise<string> => {
  const response = await apiPutCall('/api/notifications/user/readAll', null, true)
  return response.data.data
}


export function parseCustomDate(dateString: string): Date {
  const [timePart, datePart] = dateString.split(' ')
  const [hour, minute, second] = timePart.split(':').map(Number)
  const [day, month, year] = datePart.split('/').map(Number)
  return new Date(year, month - 1, day, hour, minute, second)
}

export function formatExactDate(dateString: string): string {
  const date = parseCustomDate(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

/**
 * Hàm định dạng thời gian tương đối, ví dụ “5 phút trước”, “2 ngày trước”...
 */
export function formatRelativeTime(dateString: string): string {
  const createdDate = parseCustomDate(dateString)
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
