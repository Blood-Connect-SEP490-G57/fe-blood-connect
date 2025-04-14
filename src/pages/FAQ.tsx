import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Heart, Droplet, Activity, Award, HelpCircle, Gift, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'

const FAQPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

  // Icons for each category
  const categoryIcons: Record<string, React.ReactNode> = {
    'Thông tin chung về hiến máu': <Droplet className='w-6 h-6' />,
    'Quy trình hiến máu': <Activity className='w-6 h-6' />,
    'Sau khi hiến máu': <Heart className='w-6 h-6' />,
    'Quyền lợi người hiến máu': <Gift className='w-6 h-6' />
  }

  const faqs = [
    {
      category: 'Thông tin chung về hiến máu',
      questions: [
        {
          question: 'Tại sao cần phải hiến máu?',
          answer:
            'Hiến máu là việc làm cần thiết và có ý nghĩa nhân đạo sâu sắc. Máu hiến tặng được sử dụng để điều trị cho người bệnh cần truyền máu, không có sản phẩm nào thay thế được máu trong điều trị. Mỗi giọt máu cho đi là một cuộc đời ở lại.'
        },
        {
          question: 'Ai có thể hiến máu?',
          answer:
            'Những người từ 18-60 tuổi, cân nặng nam ≥ 45kg, nữ ≥ 42kg, có sức khỏe tốt, không mắc các bệnh lây nhiễm như viêm gan B, C, HIV, giang mai... có thể hiến máu.'
        },
        {
          question: 'Hiến máu có ảnh hưởng đến sức khỏe không?',
          answer:
            'Hiến máu không ảnh hưởng đến sức khỏe. Lượng máu hiến (250-350ml) chỉ bằng 1/13 lượng máu cơ thể, sẽ được bù lại sau 24-48 giờ. Người hiến máu được khám sức khỏe, xét nghiệm máu miễn phí.'
        }
      ]
    },
    {
      category: 'Quy trình hiến máu',
      questions: [
        {
          question: 'Quy trình hiến máu như thế nào?',
          answer:
            'Quy trình hiến máu gồm 6 bước:\n1. Đăng ký hiến máu\n2. Khám sàng lọc\n3. Xét nghiệm máu\n4. Hiến máu\n5. Nghỉ ngơi và bồi phụ\n6. Nhận giấy chứng nhận hiến máu'
        },
        {
          question: 'Cần chuẩn bị gì trước khi hiến máu?',
          answer:
            'Trước khi hiến máu cần:\n- Ngủ đủ giấc đêm hôm trước\n- Ăn sáng đầy đủ\n- Mang theo CMND/CCCD\n- Trang phục gọn gàng, thuận tiện cho việc hiến máu'
        }
      ]
    },
    {
      category: 'Sau khi hiến máu',
      questions: [
        {
          question: 'Sau khi hiến máu cần lưu ý những gì?',
          answer:
            '- Nghỉ ngơi tại chỗ 15 phút\n- Uống nhiều nước\n- Ăn nhẹ\n- Không hút thuốc trong 30 phút\n- Không lái xe máy trong 1 giờ\n- Không mang vác nặng trong ngày'
        },
        {
          question: 'Bao lâu có thể hiến máu lại?',
          answer:
            'Nam giới có thể hiến máu lại sau 3 tháng, nữ giới sau 4 tháng. Một người không nên hiến máu quá 4 lần/năm đối với nam và 3 lần/năm đối với nữ.'
        }
      ]
    },
    {
      category: 'Quyền lợi người hiến máu',
      questions: [
        {
          question: 'Người hiến máu được hưởng những quyền lợi gì?',
          answer:
            '- Được khám sức khỏe và xét nghiệm máu miễn phí\n- Được cấp giấy chứng nhận hiến máu\n- Được bồi dưỡng theo quy định\n- Được cấp thẻ người hiến máu thường xuyên (nếu đủ điều kiện)\n- Được ưu tiên tiếp nhận máu khi cần truyền máu'
        }
      ]
    }
  ]

  // Filter FAQs based on search term
  const filteredFaqs = React.useMemo(() => {
    if (!searchTerm.trim()) return faqs

    return faqs
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter((category) => category.questions.length > 0)
  }, [faqs, searchTerm])

  return (
    <div className='min-h-screen mt-10 bg-gray-100'>
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <HelpCircle className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold mb-1'>Câu Hỏi Thường Gặp</h1>
            <p className='text-center text-white/80 max-w-2xl'>
              Tìm hiểu thêm về quy trình hiến máu và giải đáp các thắc mắc của bạn
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className='absolute -bottom-0 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20'></div>
        <div className='absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10'></div>
        <div className='absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15'></div>
      </div>

      <div className='max-w-7xl mx-auto px-2 py-6'>
        {/* Search section */}
        <Card className='overflow-hidden rounded-xl shadow-sm border-none mb-6'>
          <CardContent className='p-4'>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Tìm kiếm câu hỏi...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-full focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50'
              />
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Category cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {faqs.map((category, index) => (
            <Card
              key={index}
              className={`overflow-hidden rounded-xl shadow-sm border-none cursor-pointer transition-all hover:shadow-md ${
                activeCategory === category.category ? 'ring-2 ring-red-500 ring-offset-2' : ''
              }`}
              onClick={() => {
                setActiveCategory(activeCategory === category.category ? null : category.category)
                document.getElementById(`category-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <CardContent className='p-4 flex flex-col items-center text-center'>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    activeCategory === category.category ? 'bg-red-500' : 'bg-red-100'
                  }`}
                >
                  <div className={activeCategory === category.category ? 'text-white' : 'text-red-500'}>
                    {categoryIcons[category.category] || <HelpCircle className='w-6 h-6' />}
                  </div>
                </div>
                <h3 className='font-medium text-gray-800'>{category.category}</h3>
                <p className='text-gray-500 mt-1 text-sm'>{category.questions.length} câu hỏi</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-nowrap overflow-x-auto space-x-2 pb-4">
          {faqs.map((category) => (
            <Button
              key={category.category}
              variant={activeCategory === category.category ? 'default' : 'outline'}
              className={`whitespace-nowrap ${
                activeCategory === category.category
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'hover:bg-red-50 hover:text-red-600'
              }`}
              onClick={() => setActiveCategory(category.category)}
            >
              {categoryIcons[category.category] || <HelpCircle className='w-4 h-4 mr-2' />}
              {category.category}
            </Button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className='max-w-7xl mx-auto space-y-8'>
          {filteredFaqs.map(
            (category, index) =>
              category.questions.length > 0 && (
                <motion.div
                  id={`category-${index}`}
                  key={index}
                  className='scroll-mt-16'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className='overflow-hidden rounded-xl shadow-sm border-none mb-2'>
                    <CardContent className='p-4'>
                      <div className='flex items-center'>
                        <div className='p-2.5 bg-red-100 rounded-lg mr-3'>
                          {categoryIcons[category.category] || <HelpCircle className='w-5 h-5 text-red-500' />}
                        </div>
                        <h2 className='text-xl font-semibold text-gray-900'>{category.category}</h2>
                      </div>
                    </CardContent>
                  </Card>

                  <Accordion type='single' collapsible className='space-y-2'>
                    {category.questions.map((faq, faqIndex) => (
                      <Card key={faqIndex} className='overflow-hidden rounded-xl shadow-sm border-none'>
                        <AccordionItem value={`item-${index}-${faqIndex}`} className='border-none'>
                          <AccordionTrigger className='px-5 py-4 hover:no-underline group'>
                            <div className='flex items-center text-left'>
                              <span className='w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs mr-3 font-medium shrink-0'>
                                {faqIndex + 1}
                              </span>
                              <span className='text-gray-800 group-hover:text-red-600 transition-colors font-medium'>
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className='px-5 pb-5 pt-0 text-gray-600 whitespace-pre-line'>
                            <div className='pl-9 border-l-2 border-red-100'>{faq.answer}</div>
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                    ))}
                  </Accordion>
                </motion.div>
              )
          )}

          {filteredFaqs.every((category) => category.questions.length === 0) && (
            <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
              <Search className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>Không tìm thấy kết quả</h3>
              <p className='text-gray-500'>Không tìm thấy câu hỏi nào phù hợp với tìm kiếm của bạn.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className='overflow-hidden rounded-xl shadow-sm border-none bg-gradient-to-r from-red-500 to-red-600 text-white mt-12 mb-4 max-w-7xl mx-auto'>
          <CardContent className='p-8 text-center'>
            <h3 className='text-2xl font-bold mb-3'>Bạn vẫn còn thắc mắc?</h3>
            <p className='text-white/90 mb-6 max-w-2xl mx-auto'>
              Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, hãy liên hệ với chúng tôi qua hotline hoặc
              email.
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-3'>
              <Button
                onClick={() => navigate('/lien-he')}
                variant='default'
                className='bg-white text-red-600 hover:bg-gray-100 font-medium'
                size='lg'
              >
                <Award className='mr-2 h-4 w-4' />
                Liên hệ tư vấn
              </Button>
              <Button
                onClick={() => navigate('/dang-ky-hien-mau')}
                variant='outline'
                className='bg-transparent border-white text-white hover:bg-white/10 font-medium'
                size='lg'
              >
                Đăng ký hiến máu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FAQPage
