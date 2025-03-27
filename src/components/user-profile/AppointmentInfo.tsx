import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, AlertCircle, ClipboardList, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getCurrent } from '@/api/appointment'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cancelAppointment } from '@/api/campaign'
import { toast } from '../ui/use-toast'

interface UserInfo {
  fullName: string
  identityNumber: string
  dob: string
  gender: string
  jobName: string
  organizationName: number
  address: string
  issueLoc: string
  student_id: string
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
  sectionId: number
  questionId: number
  content: string
  answer: boolean
  detail: string
}

interface Question {
  id: number
  sectionId: number
  content: string
  order: number
  hasDetail: boolean
}

interface Section {
  id: number
  name: string
  order: number
  questionSetId: number
  hidden: boolean
  questions: Question[]
  answers: Answer[]
}

interface AppointmentData {
  userInfo: UserInfo
  campaign: Campaign | null
  answer: {
    sections: Section[]
    questionSetId: number
    userId: number
    campaignId: number
  } | null
}

const AppointmentInfo = () => {
  const [data, setData] = useState<AppointmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const hasFetched = useRef(false)
  const [isModalOpen, setModalOpen] = useState(false)
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  function CancelAppointmentModal({
    isOpen,
    onClose,
    onConfirm
  }: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
  }) {
    if (!isOpen) return null

    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-6 rounded shadow-lg'>
          <h2 className='text-lg font-bold mb-4'>Xác nhận hủy lịch hẹn</h2>
          <p className='mb-4'>Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
          <div className='flex justify-end space-x-2'>
            <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>
              Hủy bỏ
            </button>
            <button onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Hàm hủy lịch hẹn
  const handleCancelAppointment = async () => {
    if (!data?.campaign?.campaignId) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy thông tin lịch hẹn',
        variant: 'destructive'
      })
      return
    }

    try {
      await cancelAppointment(data.campaign.campaignId)
      
      // Update local state to reflect cancellation
      setData(prev => prev ? {
        ...prev,
        campaign: prev.campaign ? {
          ...prev.campaign,
          status: 'CANCELLED'
        } : null
      } : null)

      toast({
        title: 'Thành công',
        description: 'Lịch hẹn đã được hủy thành công',
        variant: 'default'
      })
      
      setModalOpen(false)
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy lịch hẹn. Vui lòng thử lại sau.',
        variant: 'destructive'
      })
    }
  }

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
      BOOKING: { color: 'bg-red-100 text-red-800', label: 'Đã đặt lịch' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Hoàn thành' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Đã hủy' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Đang chờ' }
    }

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status }

    return <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
  }

  // Nhóm câu trả lời theo section
  const groupAnswersBySection = (sections: Section[] | null) => {
    if (!sections || !Array.isArray(sections)) return []

    return sections.sort((a, b) => a.order - b.order)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center mt-12'>
        <Loader2 className='w-8 h-8 text-red-600 animate-spin mr-2' />
        <span className='ml-2'>Đang xử lý...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-white py-12'>
        <div className='container mx-auto px-4 flex flex-col items-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mb-4' />
          <p className='text-red-600 text-xl mb-6'>{error || 'Không thể tải dữ liệu'}</p>
          <Button onClick={() => window.location.reload()} className='bg-red-600 hover:bg-red-700 text-white'>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const { userInfo } = data
  const groupedSections = groupAnswersBySection(data.answer?.sections || null)

  const appointmentItems = data.campaign
    ? [
        { label: 'Tên chiến dịch', value: data.campaign.campaignName || '-' },
        { label: 'Thời gian', value: formatDateTime(data.campaign.appointmentDate) },
        { label: 'Địa điểm', value: data.campaign.location || 'Chưa cập nhật' }
      ]
    : []

  return (
    <div className='min-h-screen bg-white py-8'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Thông tin đăng ký hiến máu</h1>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-6 mx-2'>
          {/* Personal Information Card */}
          <Card className='h-full p-4'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg text-red-600 flex items-center gap-2'>
                <User className='w-5 h-5' />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 pt-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  { label: 'Họ và tên', value: userInfo.fullName },
                  { label: 'Số CMND/Hộ chiếu', value: userInfo.identityNumber },
                  { label: 'Ngày sinh', value: formatDate(userInfo.dob) },
                  { label: 'Giới tính', value: userInfo.gender },
                  { label: 'Nghề nghiệp', value: userInfo.jobName },
                  { label: 'Cơ quan/Trường, Lớp', value: userInfo.organizationName },
                  { label: 'Số thẻ HS/SV/Quân nhân', value: userInfo.student_id || '-' },
                  { label: 'Điện thoại', value: userInfo.phoneNumber },
                  { label: 'Email', value: userInfo.email, fullWidth: true },
                  { label: 'Điện thoại', value: userInfo.addressContact, fullWidth: true }
                ].map((item, index) => (
                  <div key={index} className={item.fullWidth ? 'col-span-1 md:col-span-2' : ''}>
                    <span className='font-medium text-gray-700 block mb-1'>{item.label}:</span>
                    <div className='flex items-center p-3 border rounded-lg bg-gray-50 w-full'>
                      <input
                        type='text'
                        value={item.value}
                        readOnly
                        className='w-full bg-transparent border-none focus:outline-none text-gray-900'
                      />
                    </div>
                  </div>
                ))}
                <div className='col-span-1 md:col-span-2'>
                  <span className='font-medium text-gray-700 block mb-1'>Địa chỉ thường trú (CMND):</span>
                  <div className='flex items-center p-3 border rounded-lg bg-gray-50'>
                    <input
                      type='text'
                      value={userInfo.address}
                      readOnly
                      className='w-full bg-transparent border-none focus:outline-none text-gray-900'
                    />
                  </div>
                </div>
                <div className='col-span-1 md:col-span-2'>
                  <span className='font-medium text-gray-700 block mb-1'>Nơi cấp:</span>
                  <div className='flex items-center p-3 border rounded-lg bg-gray-50'>
                    <input
                      type='text'
                      value={userInfo.issueLoc}
                      readOnly
                      className='w-full bg-transparent border-none focus:outline-none text-gray-900'
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Registration Card */}
          <Card className='h-full'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg text-red-600 flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Phiếu đăng ký hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-2'>
              {data.campaign ? (
                <div className='w-full space-y-3'>
                  <div className='flex justify-between items-center border-b pb-2'>
                    <h3 className='font-medium'>Thông tin buổi hiến máu</h3>
                    {renderStatusBadge(data.campaign.status)}
                  </div>

                  <div className='flex flex-col gap-3'>
                    {appointmentItems.map((item, index) => (
                      <div key={index} className='flex items-start gap-2'>
                        <div>
                          <span className='text-gray-600 text-sm'>{item.label}:</span>
                          <p className='font-medium text-sm'>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100'>
                    {/* <Button
                      variant='outline'
                      className='border-red-200 text-red-600 hover:bg-red-50 text-sm py-1 h-9'
                      onClick={() => {
                        window.scrollTo(0, 0)
                        navigate('/trang-ca-nhan#lich-su-hien-mau')
                      }}
                    >
                      Xem lịch sử
                    </Button> */}

                    {data.campaign.status === 'BOOKING' && (
                      <Button
                        variant='outline'
                        className='border-red-200 text-red-600 hover:bg-red-50 text-sm py-1 h-9'
                        onClick={() => setModalOpen(true)}
                      >
                        Hủy lịch hẹn
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                  <p className='text-gray-600 text-center'>Chưa có phiếu đăng ký hiến máu</p>
                  <Button
                    className='bg-red-600 hover:bg-red-700 text-white'
                    onClick={() => {
                      window.scrollTo(0, 0)
                      navigate('/dang-ky-hien-mau')
                    }}
                  >
                    Đăng ký hiến máu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chi tiết bảng câu hỏi sức khỏe */}
        {groupedSections.length > 0 && (
          <div id='health-questionnaire' className='mt-8 mx-2'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg text-red-600 flex items-center gap-2'>
                  <ClipboardList className='w-5 h-5' />
                  Chi tiết câu hỏi sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-gray-50 rounded-lg p-4 space-y-6'>
                  {groupedSections.map((section) => (
                    <div key={section.id} className='border-b pb-4 last:border-b-0 last:pb-0'>
                      <h3 className='font-medium text-gray-800 mb-3'>{section.name}</h3>
                      <div className='space-y-3'>
                        {section.answers.map((answer) => (
                          <div key={answer.id} className='flex flex-col gap-1'>
                            <div className='flex gap-2 items-start'>
                              <div className={`w-2 h-2 rounded-full mt-2 bg-red-600`}></div>
                              <div className='flex-1'>
                                <div className='flex justify-between items-start'>
                                  <span className='text-gray-700'>{answer.content}</span>
                                  <span className={`ml-4 font-medium`}>{answer.answer ? 'Có' : 'Không'}</span>
                                </div>
                                {answer.detail && (
                                  <p className='text-sm text-gray-500 mt-1 ml-4'>Chi tiết: {answer.detail}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <CancelAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCancelAppointment}
      />
    </div>
  )
}

export default AppointmentInfo
