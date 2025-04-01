import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TermItem {
  id: number
  title: string
  content: string
}

const Terms = () => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const termItems: TermItem[] = [
    {
      id: 1,
      title: 'Điều khoản sử dụng dịch vụ',
      content: `Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng website của chúng tôi.`
    },
    {
      id: 2,
      title: 'Quyền riêng tư và bảo mật thông tin',
      content: `Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng. Mọi thông tin cá nhân được thu thập sẽ chỉ được sử dụng cho mục đích cung cấp dịch vụ và sẽ được bảo mật theo quy định của pháp luật.`
    },
    {
      id: 3,
      title: 'Quy định về hiến máu',
      content: `Người hiến máu phải đáp ứng các tiêu chuẩn về sức khỏe theo quy định. Việc hiến máu phải được thực hiện tự nguyện và không vì mục đích thương mại.`
    },
    {
      id: 4,
      title: 'Trách nhiệm của người dùng',
      content: `Người dùng có trách nhiệm cung cấp thông tin chính xác và trung thực. Không được sử dụng platform cho các mục đích phi pháp hoặc gây hại cho người khác.`
    },
    {
      id: 5,
      title: 'Quyền sở hữu trí tuệ',
      content: `Tất cả nội dung trên website bao gồm nhưng không giới hạn ở text, hình ảnh, logo, đều thuộc quyền sở hữu của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ.`
    }
  ]

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Điều khoản và điều kiện
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {termItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(item.id) && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Terms