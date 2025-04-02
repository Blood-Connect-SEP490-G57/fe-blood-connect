import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import { Heart, Droplet, Activity, Award, HelpCircle, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const FAQPage = () => {
  const navigate = useNavigate()
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

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Banner hero */}
      <section className='bg-gradient-to-r from-red-600 to-red-500 text-white py-16 sm:py-24'>
        <div className='container mx-auto px-4 relative'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center relative z-10'
          >
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>Câu Hỏi Thường Gặp</h1>
            <p className='text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8'>
              Tìm hiểu thêm về quy trình hiến máu và giải đáp các thắc mắc của bạn
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className='absolute -bottom-10 left-1/4 w-20 h-20 bg-red-400 rounded-full opacity-20'></div>
          <div className='absolute top-10 right-1/4 w-16 h-16 bg-white rounded-full opacity-10'></div>
          <div className='absolute bottom-10 right-10 w-32 h-32 bg-red-300 rounded-full opacity-15'></div>
        </div>
      </section>

      <div className='container mx-auto px-4 py-12 md:py-20'>
        {/* Quick links to categories */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16'>
          {faqs.map((category, index) => (
            <motion.a
              key={index}
              href={`#category-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-center text-center group'
            >
              <div className='w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500 transition-all'>
                <div className='text-red-500 group-hover:text-white transition-all'>
                  {categoryIcons[category.category] || <HelpCircle className='w-6 h-6' />}
                </div>
              </div>
              <h3 className='font-medium text-lg text-gray-800'>{category.category}</h3>
              <p className='text-gray-500 mt-2 text-sm'>{category.questions.length} câu hỏi</p>
            </motion.a>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className='max-w-4xl mx-auto'>
          {faqs.map((category, index) => (
            <motion.div
              id={`category-${index}`}
              key={index}
              className='mb-12 scroll-mt-20'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className='flex items-center mb-6'>
                <div className='p-3 bg-red-100 rounded-lg mr-4'>
                  {categoryIcons[category.category] || <HelpCircle className='w-5 h-5 text-red-500' />}
                </div>
                <h2 className='text-2xl sm:text-3xl font-semibold text-gray-900'>{category.category}</h2>
              </div>

              <Accordion type='single' collapsible className='bg-white rounded-2xl shadow-md border border-gray-100'>
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`item-${index}-${faqIndex}`}
                    className={faqIndex !== category.questions.length - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <AccordionTrigger className='hover:bg-red-50/60 px-6 py-5 text-left hover:no-underline group'>
                      <div className='flex items-center'>
                        <span className='w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs mr-3 font-medium'>
                          {faqIndex + 1}
                        </span>
                        <span className='text-gray-800 group-hover:text-red-600 transition-colors font-medium'>
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='px-6 py-5 text-gray-600 whitespace-pre-line bg-gray-50/60'>
                      <div className='pl-9'>{faq.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className='mt-20 text-center bg-gradient-to-r from-red-500 to-red-600 p-10 rounded-3xl shadow-xl max-w-4xl mx-auto'
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className='text-3xl font-bold text-white mb-4'>Bạn vẫn còn thắc mắc?</h3>
          <p className='text-white/90 mb-8 max-w-2xl mx-auto'>
            Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, hãy liên hệ với chúng tôi qua hotline hoặc email.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Button
              onClick={() => navigate('/lien-he')}
              variant='default'
              className='bg-white text-red-600 hover:bg-gray-100 py-6 px-8 text-lg'
            >
              <Award className='mr-2 h-5 w-5' />
              Liên hệ tư vấn
            </Button>
            <Button
              onClick={() => navigate('/dang-ky-hien-mau')}
              variant='default'
              className='bg-white text-red-600 hover:bg-gray-100 py-6 px-8 text-lg'
            >
              Đăng ký hiến máu
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQPage
