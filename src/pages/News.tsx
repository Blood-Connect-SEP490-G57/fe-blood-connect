import React from 'react'
import { Calendar, User, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewsItem {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  category: string
}

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')

  const newsData: NewsItem[] = [
    {
      id: 1,
      title: 'Chương trình hiến máu "Chủ nhật Đỏ" thu hút hàng nghìn người tham gia',
      excerpt: 'Sự kiện hiến máu lớn nhất năm đã diễn ra thành công tốt đẹp với sự tham gia của đông đảo người dân...',
      content: 'Nội dung chi tiết về chương trình hiến máu...',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4',
      author: 'Nguyễn Văn A',
      date: '2024-02-15',
      category: 'Sự kiện'
    },
    {
      id: 2,
      title: 'Kỹ thuật mới trong bảo quản máu được áp dụng thành công',
      excerpt: 'Phương pháp bảo quản máu mới giúp kéo dài thời gian sử dụng và đảm bảo chất lượng máu tốt hơn...',
      content: 'Nội dung chi tiết về kỹ thuật bảo quản máu mới...',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
      author: 'Trần Thị B',
      date: '2024-02-10',
      category: 'Công nghệ'
    },
    {
      id: 3,
      title: 'Hướng dẫn cách hiến máu an toàn và hiệu quả',
      excerpt: 'Một số lưu ý quan trọng khi tham gia hiến máu để đảm bảo an toàn cho bản thân và người nhận máu...',
      content: 'Nội dung chi tiết về hướng dẫn hiến máu...',
      image: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa',
      author: 'Lê Văn C',
      date: '2024-02-05',
      category: 'Hướng dẫn'
    }
  ]

  const categories = ['Tất cả', 'Sự kiện', 'Công nghệ', 'Câu chuyện', 'Hướng dẫn']

  const filteredNews = newsData.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Tin Tức & Sự Kiện</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Cập nhật những thông tin mới nhất về hoạt động hiến máu và các sự kiện sắp diễn ra
          </p>
        </div>

        {/* Search and Filter Section */}
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
          <div className='w-full overflow-x-auto pb-2 scrollbar-hide'>
            <div className='flex gap-2 min-w-max'>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className='whitespace-nowrap'
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
            >
              <img src={news.image} alt={news.title} className='w-full h-48 object-cover' />
              <div className='p-6'>
                <div className='flex items-center gap-4 text-sm text-gray-500 mb-3'>
                  <span className='inline-flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' />
                    {new Date(news.date).toLocaleDateString('vi-VN')}
                  </span>
                  <span className='inline-flex items-center'>
                    <User className='h-4 w-4 mr-1' />
                    {news.author}
                  </span>
                </div>
                <h3 className='text-xl font-semibold mb-2 text-gray-900'>{news.title}</h3>
                <p className='text-gray-600 mb-4'>{news.excerpt}</p>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full'>
                    {news.category}
                  </span>
                  <Button
                    variant='ghost'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={() => console.log(`Read more about ${news.id}`)}
                  >
                    Đọc thêm
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination or Load More */}
        <div className='mt-12 text-center'>
          <Button
            variant='outline'
            className='text-red-600 border-red-600 hover:bg-red-50'
            onClick={() => console.log('Load more')}
          >
            Xem thêm tin tức
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewsPage
