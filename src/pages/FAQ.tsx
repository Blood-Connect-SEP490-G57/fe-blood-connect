import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQPage = () => {
  const faqs = [
    {
      category: 'Thông tin chung về hiến máu',
      questions: [
        {
          question: 'Tại sao cần phải hiến máu?',
          answer: 'Hiến máu là việc làm cần thiết và có ý nghĩa nhân đạo sâu sắc. Máu hiến tặng được sử dụng để điều trị cho người bệnh cần truyền máu, không có sản phẩm nào thay thế được máu trong điều trị. Mỗi giọt máu cho đi là một cuộc đời ở lại.'
        },
        {
          question: 'Ai có thể hiến máu?',
          answer: 'Những người từ 18-60 tuổi, cân nặng nam ≥ 45kg, nữ ≥ 42kg, có sức khỏe tốt, không mắc các bệnh lây nhiễm như viêm gan B, C, HIV, giang mai... có thể hiến máu.'
        },
        {
          question: 'Hiến máu có ảnh hưởng đến sức khỏe không?',
          answer: 'Hiến máu không ảnh hưởng đến sức khỏe. Lượng máu hiến (250-350ml) chỉ bằng 1/13 lượng máu cơ thể, sẽ được bù lại sau 24-48 giờ. Người hiến máu được khám sức khỏe, xét nghiệm máu miễn phí.'
        }
      ]
    },
    {
      category: 'Quy trình hiến máu',
      questions: [
        {
          question: 'Quy trình hiến máu như thế nào?',
          answer: 'Quy trình hiến máu gồm 6 bước:\n1. Đăng ký hiến máu\n2. Khám sàng lọc\n3. Xét nghiệm máu\n4. Hiến máu\n5. Nghỉ ngơi và bồi phụ\n6. Nhận giấy chứng nhận hiến máu'
        },
        {
          question: 'Cần chuẩn bị gì trước khi hiến máu?',
          answer: 'Trước khi hiến máu cần:\n- Ngủ đủ giấc đêm hôm trước\n- Ăn sáng đầy đủ\n- Mang theo CMND/CCCD\n- Trang phục gọn gàng, thuận tiện cho việc hiến máu'
        }
      ]
    },
    {
      category: 'Sau khi hiến máu',
      questions: [
        {
          question: 'Sau khi hiến máu cần lưu ý những gì?',
          answer: '- Nghỉ ngơi tại chỗ 15 phút\n- Uống nhiều nước\n- Ăn nhẹ\n- Không hút thuốc trong 30 phút\n- Không lái xe máy trong 1 giờ\n- Không mang vác nặng trong ngày'
        },
        {
          question: 'Bao lâu có thể hiến máu lại?',
          answer: 'Nam giới có thể hiến máu lại sau 3 tháng, nữ giới sau 4 tháng. Một người không nên hiến máu quá 4 lần/năm đối với nam và 3 lần/năm đối với nữ.'
        }
      ]
    },
    {
      category: 'Quyền lợi người hiến máu',
      questions: [
        {
          question: 'Người hiến máu được hưởng những quyền lợi gì?',
          answer: '- Được khám sức khỏe và xét nghiệm máu miễn phí\n- Được cấp giấy chứng nhận hiến máu\n- Được bồi dưỡng theo quy định\n- Được cấp thẻ người hiến máu thường xuyên (nếu đủ điều kiện)\n- Được ưu tiên tiếp nhận máu khi cần truyền máu'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những thông tin cần thiết về hiến máu nhân đạo
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                    <AccordionTrigger className="hover:bg-red-50 px-6 py-4 text-left">
                      <span className="text-gray-900">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQPage 