import { apiGetCall, apiPostCall, apiPutCall, apiDeleteCall } from '..'
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
