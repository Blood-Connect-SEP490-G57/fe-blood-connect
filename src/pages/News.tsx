import React from 'react'
import { Calendar, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNews } from '@/api/news'
import { NewsParams } from '@/schema/news-schema'
import { useNavigate } from 'react-router-dom'
import Loading from '@/components/warnings/loading'

const NewsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // Reduced delay to 500ms for better responsiveness

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', debouncedSearchTerm],
    queryFn: async () => {
      const params: NewsParams = {
        sortBy: 'createdAt',
        sortDir: 'desc',
        search: debouncedSearchTerm || ''
      }
      return getNews(params)
    },
    staleTime: 30000, // Data considered fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Cache kept for 5 minutes
    keepPreviousData: true // Keep showing old data while fetching new data
  })

  // Prefetch next page of results
  React.useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      const prefetchData = async () => {
        await queryClient.prefetchQuery({
          queryKey: ['news', searchTerm],
          queryFn: async () => {
            const params: NewsParams = {
              sortBy: 'createdAt',
              sortDir: 'desc',
              search: searchTerm || ''
            }
            return getNews(params)
          }
        })
      }
      prefetchData()
    }
  }, [searchTerm, debouncedSearchTerm, queryClient])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='container mx-auto px-4'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Tin Tức & Sự Kiện</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Cập nhật những thông tin mới nhất về hoạt động hiến máu và các sự kiện sắp diễn ra
          </p>
        </div>

        {/* Search Section */}
        <div className='mb-8 flex flex-col md:flex-row gap-4 justify-between items-center'>
          <div className='relative w-full md:w-96'>
            <Input
              type='text'
              placeholder='Tìm kiếm tin tức...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
            <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {/* News Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {news?.data.data.map((item) => (
            <div
              key={item.id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
            >
              <img src={item.thumbnailUrl} alt={item.title} className='w-full h-48 object-cover' />
              <div className='p-6'>
                <div className='flex items-center gap-4 text-sm text-gray-500 mb-3'>
                  <span className='inline-flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' />
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className='text-xl font-semibold mb-2 text-gray-900'>{item.title}</h3>
                <div className='flex items-center justify-end'>
                  <Button
                    variant='ghost'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={() => navigate(`/tin-tuc/${item.id}`)}
                  >
                    Đọc thêm
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewsPage
