import { useState } from 'react'
import { ChevronDown, ChevronUp, Shield, FileText, Check, AlertCircle, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TermItem {
  id: number
  title: string
  content: string
  icon: JSX.Element
  color: string
}

const Terms = () => {
  const [openItems, setOpenItems] = useState<number[]>([1])

  const termItems: TermItem[] = [
    {
      id: 1,
      title: 'Điều khoản sử dụng',
      icon: <FileText className="h-5 w-5" />,
      color: 'from-blue-500 to-blue-400',
      content: `Chào mừng bạn đến với ứng dụng Giọt Máu Hy Vọng. Bằng việc truy cập và sử dụng ứng dụng này, bạn đồng ý tuân thủ các điều khoản sử dụng được nêu dưới đây.

Ứng dụng Giọt Máu Hy Vọng được thiết kế để hỗ trợ các hoạt động hiến máu tình nguyện, kết nối người hiến máu với các chiến dịch hiến máu, và quản lý thông tin sức khỏe liên quan đến hiến máu.

Bạn đồng ý sử dụng ứng dụng này một cách có trách nhiệm, không xâm phạm quyền của người khác và tuân thủ tất cả các quy định pháp luật hiện hành.`
    },
    {
      id: 2,
      title: 'Bảo mật thông tin',
      icon: <Shield className="h-5 w-5" />,
      color: 'from-red-500 to-red-400',
      content: `Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và tuân thủ các quy định về bảo vệ dữ liệu. Thông tin cá nhân của bạn, bao gồm thông tin sức khỏe, sẽ được sử dụng cho mục đích:

- Đánh giá khả năng hiến máu an toàn
- Liên hệ và xác nhận lịch hẹn hiến máu
- Thông báo về các chiến dịch hiến máu phù hợp
- Quản lý hồ sơ sức khỏe người hiến máu

Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba ngoại trừ các đơn vị y tế có liên quan đến quá trình hiến máu của bạn và khi được yêu cầu bởi pháp luật.`
    },
    {
      id: 3,
      title: 'Quy định hiến máu',
      icon: <Check className="h-5 w-5" />,
      color: 'from-green-500 to-green-400',
      content: `Để đảm bảo an toàn cho cả người hiến máu và người nhận máu, người hiến máu cần đáp ứng các tiêu chuẩn sau:

- Tuổi từ 18-60
- Cân nặng: Nam ≥ 50kg, Nữ ≥ 45kg
- Không mắc các bệnh truyền nhiễm
- Không trong tình trạng sức khỏe không phù hợp để hiến máu
- Thời gian giữa hai lần hiến máu tối thiểu là 12 tuần đối với hiến máu toàn phần
- Tuân thủ hướng dẫn trước và sau khi hiến máu

Việc hiến máu là hoàn toàn tự nguyện và không vì mục đích thương mại.`
    },
    {
      id: 4,
      title: 'Trách nhiệm người dùng',
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'from-amber-500 to-amber-400',
      content: `Khi sử dụng ứng dụng Giọt Máu Hy Vọng, bạn có trách nhiệm:

- Cung cấp thông tin chính xác và trung thực về sức khỏe và thông tin cá nhân
- Tuân thủ lịch hẹn hiến máu đã đăng ký hoặc thông báo hủy trước ít nhất 24 giờ
- Không sử dụng ứng dụng cho mục đích phi pháp hoặc lừa đảo
- Bảo mật thông tin đăng nhập tài khoản của bạn
- Thông báo cho chúng tôi nếu phát hiện bất kỳ sai sót nào trong thông tin hiển thị

Chúng tôi có quyền từ chối hoặc hạn chế quyền truy cập của bạn nếu phát hiện vi phạm các điều khoản sử dụng.`
    },
    {
      id: 5,
      title: 'Lợi ích hiến máu',
      icon: <Award className="h-5 w-5" />,
      color: 'from-purple-500 to-purple-400',
      content: `Hiến máu không chỉ giúp cứu sống người khác mà còn mang lại nhiều lợi ích cho chính người hiến:

- Được kiểm tra sức khỏe và xét nghiệm máu miễn phí
- Cơ thể sản sinh tế bào máu mới, giúp tái tạo hệ thống tuần hoàn
- Giảm nguy cơ mắc một số bệnh tim mạch
- Cơ hội tham gia vào cộng đồng tình nguyện viên hiến máu
- Được ưu tiên nhận máu khi cần thiết

Mỗi đơn vị máu hiến tặng có thể cứu sống đến 3 người bệnh. Hãy trở thành một phần của cộng đồng hiến máu cứu người!`
    }
  ]

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-16">
      {/* Banner section */}
      <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative">
        <div className="container mx-auto">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
              <FileText className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Điều Khoản & Điều Kiện</h1>
            <p className="text-center text-white/80 max-w-2xl">
              Các quy định và điều khoản khi sử dụng dịch vụ hiến máu của chúng tôi
            </p>
          </div>
        </div>
        <div className="absolute -bottom-0 left-1/4 w-16 h-16 bg-red-400 rounded-full opacity-20"></div>
        <div className="absolute top-8 right-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-6 right-10 w-20 h-20 bg-red-300 rounded-full opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <motion.div 
          className="overflow-hidden rounded-xl shadow-sm border-none mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {termItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            >
              <button
                className="w-full p-5 flex justify-between items-center focus:outline-none"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 bg-gradient-to-r ${item.color} text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>
                <div className="bg-gray-100 rounded-full p-1.5 transition-transform duration-200 ease-in-out transform">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openItems.includes(item.id) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 border-t border-gray-100">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                        {item.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Terms