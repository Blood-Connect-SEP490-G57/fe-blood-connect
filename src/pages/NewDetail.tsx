import { getNews, getNewsById } from '@/api/news'
import Empty from '@/components/warnings/empty'
import Loading from '@/components/warnings/loading'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'

const NewsDetailPage = () => {
  const { id } = useParams()

  // Query for current news
  const {
    data: news,
    isLoading,
    error
  } = useQuery({
    queryKey: ['news', id],
    queryFn: () => getNewsById(Number(id)),
    enabled: !!id
  })

  // Query for related news
  const { data: relatedNews } = useQuery({
    queryKey: ['news'],
    queryFn: () =>
      getNews({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'desc'
      }),
    enabled: !!id
  })

  if (isLoading) return <Loading />
  if (error) return <Empty />
  if (!news) return null

  // Filter out current news and get only other news items
  const otherNews = relatedNews?.data.data.filter((item) => item.id !== Number(id)) || []

  return (
    <div className='bg-gary-100 min-h-screen py-12 mt-10 max-w-4xl mx-auto'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content Column - Takes up 2/3 of the space */}
          <div className='lg:col-span-2'>
            <div className='max-w-none'>
              {/* Article header */}
              <div className='mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{news.title}</h1>

                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-gray-600 mb-6'>
                  <div className='flex items-center gap-4 text-sm'>
                    <span className='flex items-center'>
                      <Calendar className='h-4 w-4 mr-1' />
                      {new Date(news.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className='border-t border-gray-200 my-4'></div>
              </div>
              {/* Article content */}
              <div className='prose max-w-none mb-12'>
                {/* <img src={news.thumbnailUrl} alt={news.title} className='w-full h-96 object-cover mb-6' /> */}
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>
            </div>
          </div>

          {/* Sidebar Column - Takes up 1/3 of the space */}
          <div className='lg:col-span-1'>
            <div className='sticky top-4'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Tin tức liên quan</h2>
              <div className='space-y-4'>
                {otherNews.slice(0, 5).map((item) => (
                  <div>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className='w-full h-48 object-cover mb-2 rounded-lg'
                      loading='lazy'
                    />
                    <div key={item.id} className='flex items-start gap-4'>
                      <Link
                        to={`/tin-tuc/${item.id}`}
                        className='text-lg text-gray-900 hover:text-red-600 hover:underline flex-1'
                      >
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage
