import { getNews, getNewsById } from '@/api/news'
import Empty from '@/components/warnings/empty'
import Loading from '@/components/warnings/loading'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ArrowLeft, Clock, BookmarkPlus, ChevronRight, Tags } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ShareLink from '@/components/sharelink/ShareNew'

const NewsDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

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

  const handleGoBack = () => {
    navigate('/tin-tuc')
  }

  if (isLoading) return <Loading />
  if (error) return <Empty />
  if (!news) return null

  // Filter out current news and get only other news items
  const otherNews = relatedNews?.data.data.filter((item) => item.id !== Number(id)) || []

  // Format date like "12 Th03, 2024"
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('vi-VN', options)
  }

  return (
    <div className='min-h-screen mt-12 bg-gray-100'>
      <div className='max-w-7xl mx-auto px-2 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <motion.div
              className='bg-white rounded-xl shadow-sm overflow-hidden'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
                <div
                  onClick={handleGoBack}
                  className='flex items-center px-4 py-4 hover:underline cursor-pointer text-red-500 transition-colors'
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  <span className='text-sm font-medium'>Quay lại</span>
                </div>
              {/* Article thumbnail */}
              {news.thumbnailUrl && (
                <div className='relative w-full h-64 sm:h-80 overflow-hidden'>
                  <img src={news.thumbnailUrl} alt={news.title} className='w-full h-full object-cover' />
                  <div className='absolute top-3 right-3'>
                    <span className='px-3 py-1 bg-red-500/70 backdrop-blur-sm text-white text-xs font-medium rounded-full'>
                      Tin tức
                    </span>
                  </div>
                </div>
              )}

              {/* Article content */}
              <div className='p-6'>
                {/* Article header */}
                <div className='mb-6'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight'>{news.title}</h1>

                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <span className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1.5 text-red-500' />
                        {formatDate(news.createdAt)}
                      </span>
                      <span className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1.5 text-red-500' />
                        {new Date(news.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className='flex items-center space-x-2'>
                      {/* <button className='p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors'>
                        <BookmarkPlus className='h-4 w-4' />
                      </button> */}
                      <ShareLink />
                    </div>
                  </div>

                  <div className='flex items-center gap-2 mb-4'>
                    <Tags className='h-4 w-4 text-gray-400' />
                    <span className='text-xs text-gray-500'>Hiến máu</span>
                  </div>

                  <div className='border-t border-gray-100 my-4'></div>
                </div>

                {/* Article body */}
                <div className='prose max-w-none mb-8'>
                  <div dangerouslySetInnerHTML={{ __html: news.content }} className='text-gray-700 leading-relaxed' />
                </div>

                {/* Article footer */}
                <div className='border-t border-gray-100 pt-6 mt-8'>
                  <div className='flex items-center justify-between text-sm text-gray-500'>
                    <span>Đăng bởi: {news.createdBy || 'Admin'}</span>
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className='lg:col-span-1'>
            <div className='sticky top-0'>
              <div className='bg-white rounded-xl shadow-sm overflow-hidden p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
                  <span className='bg-red-500 w-1 h-6 rounded-full mr-3'></span>
                  Tin tức liên quan
                </h2>

                <div className='space-y-6'>
                  {otherNews.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className='group'
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Link to={`/tin-tuc/${item.id}`}>
                        {index === 0 ? (
                          <>
                            <div className='mb-2 overflow-hidden rounded-xl'>
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className='w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105'
                                loading='lazy'
                              />
                            </div>
                            <div className='flex items-center justify-between'>
                              <h3 className='text-sm font-medium text-gray-900 group-hover:text-red-500 transition-colors line-clamp-2'>
                                {item.title}
                              </h3>
                              <ChevronRight className='h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors' />
                            </div>
                          </>
                        ) : (
                          <div className='flex items-start space-x-4'>
                            <div className='flex-shrink-0 w-24 h-16 overflow-hidden rounded-lg'>
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                loading='lazy'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h3 className='text-sm font-medium text-gray-900 group-hover:text-red-500 transition-colors line-clamp-2'>
                                {item.title}
                              </h3>
                              <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                                <Clock className='h-3 w-3 text-red-400' />
                                <span>{formatDate(item.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage
