import React from 'react'
import { ChevronRight, Search, Newspaper, Clock, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('vi-VN', options)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='min-h-screen bg-gray-100 '>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Banner section */}
        <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-6 relative rounded-xl'>
          <div className='container mx-auto'>
            <div className='flex flex-col items-center'>
              <div className='h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
                <Newspaper className='h-12 w-12 text-red-500' />
              </div>
              <h1 className='text-xl font-bold mb-1'>Tin Tức & Sự Kiện</h1>
              <p className='text-center text-white/80 max-w-2xl text-sm'>
                Cập nhật những thông tin mới nhất về hoạt động hiến máu và các sự kiện sắp diễn ra
              </p>
            </div>
          </div>
          <div className='absolute -bottom-0 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
          <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
          <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
        </div>

        <div className='mt-6'>
          {/* Search and filter section */}
          <Card className='overflow-hidden rounded-xl shadow-sm border-none mb-6'>
            <CardContent className='p-4'>
              <div className='flex flex-col space-y-4'>
                <div className='relative'>
                  <Input
                    type='text'
                    placeholder='Tìm kiếm tin tức...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-full focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50'
                  />
                  <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* News Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {news?.data.data.map((item) => (
              <Card
                key={item.id}
                className='overflow-hidden rounded-xl shadow-sm border-none transition-transform hover:scale-[1.02] hover:shadow-md cursor-pointer'
                onClick={() => navigate(`/tin-tuc/${item.id}`)}
              >
                <div className='h-48 overflow-hidden relative'>
                  <img src={item.thumbnailUrl} alt={item.title} className='w-full h-full object-cover' />
                  <div className='absolute top-3 right-3'>
                    <span className='px-3 py-1 bg-red-500/70 backdrop-blur-sm text-white text-xs font-medium rounded-full'>
                      Tin tức
                    </span>
                  </div>
                </div>

                <CardContent className='p-5'>
                  <div className='flex items-center gap-2 text-sm text-gray-500 mb-3'>
                    <Clock className='h-4 w-4 text-red-400' />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  <h3 className='text-lg font-medium text-gray-900 mb-3 line-clamp-2'>{item.title}</h3>

                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                      <Tags className='h-4 w-4 text-gray-400' />
                      <span className='text-xs text-gray-500'>Hiến máu</span>
                    </div>

                    <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-700 hover:bg-red-50 p-0'>
                      Đọc thêm
                      <ChevronRight className='ml-1 h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {news?.data.data.length === 0 && (
            <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
              <Search className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>Không tìm thấy kết quả</h3>
              <p className='text-gray-500'>Không tìm thấy tin tức nào phù hợp với tìm kiếm của bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsPage
