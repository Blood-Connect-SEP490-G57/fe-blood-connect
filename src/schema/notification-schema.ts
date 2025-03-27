export interface Notification {
  id: number
  title: string
  content: string
  status: boolean
  type: number
  link: string | null
  created: string
}

export interface PaginatedResponse<T> {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  data: T[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface NotificationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  type?: number
  unread?: boolean
}

export enum NotificationType {
  REMINDER = 1,
  EVENT = 2,
  NEWS = 3
}

export const getTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.REMINDER:
      return 'Nhắc nhở'
    case NotificationType.EVENT:
      return 'Sự kiện'
    case NotificationType.NEWS:
      return 'Tin tức'
    default:
      return 'Thông báo'
  }
}

export const getTypeBadgeClasses = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.REMINDER:
      return 'bg-yellow-100 text-yellow-800'
    case NotificationType.EVENT:
      return 'bg-blue-100 text-blue-800'
    case NotificationType.NEWS:
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
