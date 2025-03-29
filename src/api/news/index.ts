import { ApiResponse, News, NewsParams } from '@/schema/news-schema'
import { apiGetCall } from '..'
import axios from 'axios'

export const getNews = async (params: NewsParams): Promise<ApiResponse<News>> => {
  const response = await axios.get('/api/news', {
    params: {
      search: params.search || '',
      offset: params.page || 0,
      limit: params.size || 10,
      sortBy: params.sortBy || 'createdAt',
      sortDir: params.sortDir || 'desc'
    }
  })

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch news')
  }

  return response.data
}

export const getNewsById = async (id: number): Promise<News> => {
  const response = await apiGetCall(`/api/news/${id}`)

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch news details')
  }

  return response.data.data
}
