import { getNews, getNewsById } from '@/api/news'
import Empty from '@/components/warnings/empty'
import Loading from '@/components/warnings/loading'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ArrowLeft, Clock, Share2, BookmarkPlus, ChevronRight } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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
    navigate(-1)
  }

  if (isLoading) return <Loading />
  if (error) return <Empty />
  if (!news) return null

  // Filter out current news and get only other news items
  const otherNews = relatedNews?.data.data.filter((item) => item.id !== Number(id)) || []

  // Format date like "12 Th03, 2024"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day} Th${month < 10 ? '0' + month : month}, ${year}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
      <motion.div 
        className="max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back button */}
        <button 
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden">
              {/* Article thumbnail */}
              {news.thumbnailUrl && (
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <img 
                    src={news.thumbnailUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Article content */}
              <div className="p-6 sm:p-8">
                {/* Article header */}
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {news.title}
                  </h1>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-red-500 dark:text-red-400" />
                        {formatDate(news.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-red-500 dark:text-red-400" />
                        {new Date(news.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 my-6"></div>
                </div>
                
                {/* Article body */}
                <div className="prose prose-red max-w-none dark:prose-invert mb-8">
                  <div 
                    dangerouslySetInnerHTML={{ __html: news.content }} 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

                {/* Article footer */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-8">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Đăng bởi: {news.createdBy || 'Admin'}</span>
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="bg-red-500 w-1 h-6 rounded-full mr-3"></span>
                  Tin tức liên quan
                </h2>
                
                <div className="space-y-6">
                  {otherNews.slice(0, 5).map((item) => (
                    <motion.div 
                      key={item.id}
                      className="group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link to={`/tin-tuc/${item.id}`}>
                        <div className="mb-2 overflow-hidden rounded-2xl">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(item.createdAt)}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NewsDetailPage
