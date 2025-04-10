import { getNews, getNewsById } from '@/api/news'
import Empty from '@/components/warnings/empty'
import Loading from '@/components/warnings/loading'
import { useQuery } from '@tanstack/react-query'
import { 
  Calendar, 
  ArrowLeft, 
  Clock, 
  Share2, 
  BookmarkPlus, 
  ChevronRight, 
  Newspaper, 
  Tags 
} from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

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
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }

  return (
    <div className="min-h-screen mt-10 bg-gray-100">
      {/* Banner section - Matching the News page banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative">
        <div className="container mx-auto">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
              <Newspaper className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Chi Tiết Tin Tức</h1>
            <p className="text-center text-white/80 max-w-2xl">
              {news.title}
            </p>
          </div>
        </div>
        <div className='absolute -bottom-0 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
        <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
        <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-500 hover:text-red-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Quay lại danh sách tin tức</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Article thumbnail */}
              {news.thumbnailUrl && (
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <img 
                    src={news.thumbnailUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-red-500/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      Tin tức
                    </span>
                  </div>
                </div>
              )}
              
              {/* Article content */}
              <div className="p-6">
                {/* Article header */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {news.title}
                  </h1>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-red-500" />
                        {formatDate(news.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-red-500" />
                        {new Date(news.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Tags className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Hiến máu</span>
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>
                </div>
                
                {/* Article body */}
                <div className="prose max-w-none mb-8">
                  <div 
                    dangerouslySetInnerHTML={{ __html: news.content }} 
                    className="text-gray-700 leading-relaxed"
                  />
                </div>

                {/* Article footer */}
                <div className="border-t border-gray-100 pt-6 mt-8">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Đăng bởi: {news.createdBy || 'Admin'}</span>
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
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
                        <div className="mb-2 overflow-hidden rounded-xl">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-500 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 text-red-400" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
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
