import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  Baby,
  Briefcase,
  Droplet,
  Contact,
  Clock,
  AlertCircle,
  Loader2,
  ClipboardList
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getCurrent } from '@/api/appointment'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

interface UserInfo {
  fullName: string
  identityNumber: string
  dob: string
  gender: string
  jobName: string
  organizationName: number
  address: string
  issueLoc: string
  addressContact: string
  phoneNumber: string
  email: string
  bloodGroup: string
}

interface Campaign {
  campaignId: number
  campaignName: string
  location: string
  appointmentDate: string
  status: string
}

interface Answer {
  id: number
  questionText: string
  subQuestionContent: string
  answerText: string
  questionOrder: number
}

interface AppointmentData {
  userInfo: UserInfo
  campaign: Campaign | null
  answer: Answer[] | null
}

const AppointmentInfo = () => {
  const [data, setData] = useState<AppointmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const fetchAppointmentInfo = async () => {
      try {
        setLoading(true)
        const response = await getCurrent()

        if (response.success && response.data) {
          setData({
            userInfo: response.data.userInfo || {},
            campaign: response.data.campaign || null,
            answer: response.data.answer || null
          })
        } else {
          setError('Không thể tải dữ liệu. Vui lòng thử lại sau.')
        }
      } catch (err) {
        console.error('Error fetching appointment data:', err)
        setError('Đã xảy ra lỗi khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointmentInfo()
  }, [])

  // Hàm format ngày giờ
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'dd/MM/yyyy', { locale: vi })
    } catch (err) {
      return dateString || '-'
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi })
    } catch (err) {
      return dateTimeString || '-'
    }
  }

  // Hiển thị trạng thái
  const renderStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      BOOKING: { color: 'bg-blue-100 text-blue-800', label: 'Đã đặt lịch' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Hoàn thành' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Đã hủy' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Đang chờ' }
    }

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status }

    return <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
  }

  // Nhóm câu trả lời theo câu hỏi
  const groupAnswersByQuestion = (answers: Answer[] | null) => {
    if (!answers || !Array.isArray(answers)) return []

    const groupedAnswers = answers.reduce(
      (acc, answer) => {
        const key = `${answer.questionOrder}_${answer.questionText}`

        if (!acc[key]) {
          acc[key] = {
            questionText: answer.questionText,
            questionOrder: answer.questionOrder,
            answers: []
          }
        }

        acc[key].answers.push({
          id: answer.id,
          content: answer.subQuestionContent,
          answerText: answer.answerText
        })

        return acc
      },
      {} as Record<
        string,
        {
          questionText: string
          questionOrder: number
          answers: Array<{ id: number; content: string; answerText: string }>
        }
      >
    )

    // Chuyển từ object thành array và sắp xếp
    return Object.values(groupedAnswers).sort((a, b) => a.questionOrder - b.questionOrder)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4 flex flex-col items-center justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-red-600 mb-4' />
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4 flex flex-col items-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mb-4' />
          <p className='text-red-600 text-xl mb-6'>{error || 'Không thể tải dữ liệu'}</p>
          <Button onClick={() => window.location.reload()} className='bg-blue-600 hover:bg-blue-700 text-white'>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const { userInfo } = data
  const groupedAnswers = groupAnswersByQuestion(data.answer)

  const personalInfoItems = [
    { icon: User, label: 'Họ và tên', value: userInfo.fullName },
    { icon: CreditCard, label: 'Số CCCD', value: userInfo.identityNumber },
    { icon: Calendar, label: 'Ngày sinh', value: formatDate(userInfo.dob) },
    { icon: Baby, label: 'Giới tính', value: userInfo.gender },
    { icon: Briefcase, label: 'Nghề nghiệp', value: userInfo.jobName },
    { icon: Building, label: 'Đơn vị', value: userInfo.organizationName },
    { icon: Droplet, label: 'Nhóm máu', value: userInfo.bloodGroup },
    { icon: MapPin, label: 'Địa chỉ thường trú', value: userInfo.address },
    { icon: CreditCard, label: 'Nơi cấp CCCD', value: userInfo.issueLoc }
  ]

  const contactInfoItems = [
    { icon: MapPin, label: 'Địa chỉ liên hệ', value: userInfo.addressContact },
    { icon: Phone, label: 'Số điện thoại', value: userInfo.phoneNumber },
    { icon: Mail, label: 'Email', value: userInfo.email }
  ]

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Thông tin đăng ký hiến máu</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mx-4'>
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <User className='w-5 h-5' />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                {personalInfoItems.map((item, index) => (
                  <div key={index} className='flex justify-between items-center'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <item.icon className='w-4 h-4' />
                      <span>{item.label}:</span>
                    </div>
                    <span className='font-medium'>{item.value || '-'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Contact className='w-5 h-5' />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {contactInfoItems.map((item, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <item.icon className='w-5 h-5 text-gray-500 mt-1' />
                    <div>
                      <span className='text-gray-600'>{item.label}:</span>
                      <p className='font-medium'>{item.value || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointment Registration Card */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Phiếu đăng ký hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-center justify-center space-y-6'>
              {data.campaign ? (
                <div className='w-full space-y-4'>
                  <div className='flex justify-between items-center border-b pb-3'>
                    <h3 className='font-semibold text-lg'>Thông tin buổi hiến máu</h3>
                    {renderStatusBadge(data.campaign.status)}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-start gap-2'>
                      <Calendar className='w-5 h-5 text-gray-500 mt-1' />
                      <div>
                        <span className='text-gray-600'>Tên chiến dịch:</span>
                        <p className='font-medium'>{data.campaign.campaignName || '-'}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <Clock className='w-5 h-5 text-gray-500 mt-1' />
                      <div>
                        <span className='text-gray-600'>Thời gian:</span>
                        <p className='font-medium'>{formatDateTime(data.campaign.appointmentDate)}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2'>
                      <MapPin className='w-5 h-5 text-gray-500 mt-1' />
                      <div>
                        <span className='text-gray-600'>Địa điểm:</span>
                        <p className='font-medium'>{data.campaign.location || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Questionnaire answers */}
                  {groupedAnswers.length > 0 && (
                    <div className='mt-6 border-t pt-4'>
                      <div className='flex items-center gap-2 mb-4'>
                        <ClipboardList className='w-5 h-5 text-red-600' />
                        <h3 className='font-semibold text-lg'>Bảng câu hỏi sức khỏe</h3>
                      </div>

                      <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
                        {groupedAnswers.map((group) => (
                          <div key={group.questionOrder} className='border-b pb-3 last:border-b-0 last:pb-0'>
                            <p className='font-medium text-gray-800'>
                              <span>Câu {group.questionOrder}:</span> {group.questionText}
                            </p>
                            <div className='ml-5 mt-2 space-y-1'>
                              {group.answers.map((answer) => (
                                <div key={answer.id} className='flex gap-2 items-center'>
                                  <div className='w-2 h-2 rounded-full bg-black'></div>
                                  <span>{answer.content}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons for actions */}
                  <div className='flex justify-end space-x-4 mt-6'>
                    <Button
                      variant='outline'
                      className='border-blue-200 text-red-600 hover:bg-blue-50'
                      onClick={() => navigate('/history')}
                    >
                      Xem lịch sử
                    </Button>

                    {data.campaign.status === 'BOOKING' && (
                      <Button
                        variant='outline'
                        className='border-red-200 text-red-600 hover:bg-red-50'
                        onClick={() => {
                          // TODO: Implement cancel appointment API
                          alert('Chức năng hủy lịch hẹn sẽ được cập nhật sớm')
                        }}
                      >
                        Hủy lịch hẹn
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-lg text-gray-600 text-center'>Chưa có phiếu đăng ký hiến máu</p>
                  <Button
                    className='bg-blue-600 hover:bg-blue-700 text-white'
                    onClick={() => navigate('/blood-donation-registration')}
                  >
                    Đăng ký hiến máu
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AppointmentInfo
