export interface News {
  id: number
  title: string
  thumbnailUrl: string
  content: string
  createdBy: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: PaginatedResponse<T>
}

export interface NewsParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  search?: string
}