import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getCurrent, updateinfor } from '@/api/appointment'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { toast } from '../ui/use-toast'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'
import AppointmentDetailsPopup from './AppointmentDetailsPopup'
import { getOrganizationsByType } from '@/api/organization'
import Select from 'react-select'

interface UserInfo {
  userId: string
  fullName: string
  identityNumber: string
  dob: string
  gender: string
  jobName: string
  organizationName: string
  organizationId: string
  address: string
  issueLoc: string
  studentId: string
  militaryId: string
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

interface Organization {
  id: string
  name: string
}

const AppointmentInfo = () => {
  const [data, setData] = useState<AppointmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrganizationsByType()
        setOrganizations(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error('Error fetching organizations:', err)
        setOrganizations([])
      }
    }

    fetchOrganizations()
  }, [])

  const orgOptions = organizations.map((org) => ({
    value: org.id,
    label: org.name
  }))

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

  // Hàm chỉnh sửa thông tin cá nhân
  const [isEditing, setIsEditing] = useState(false) // Trạng thái chỉnh sửa
  const [formData, setFormData] = useState({
    userId: '',
    studentId: '',
    militaryId: '',
    phoneNumber: '',
    email: '',
    addressContact: '',
    bloodGroup: '',
    jobName: '',
    organizationId: ''
  })

  useEffect(() => {
    if (data?.userInfo) {
      setFormData({
        userId: data.userInfo.userId || '',
        jobName: data.userInfo.jobName || '',
        organizationId: data.userInfo.organizationId || '',
        bloodGroup: data.userInfo.bloodGroup || '',
        addressContact: data.userInfo.addressContact || '',
        studentId: data.userInfo.studentId || '',
        militaryId: data.userInfo.militaryId || '',
        phoneNumber: data.userInfo.phoneNumber || '',
        email: data.userInfo.email || ''
      })
    }
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
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

  // update thông tin cá nhân
  const updateUserInfo = async () => {
    try {
      // Gửi dữ liệu từ formData
      const data = await updateinfor(formData)
      console.log('Update response:', data)
      // Cập nhật lại dữ liệu trong state
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          userInfo: {
            ...prev.userInfo,
            ...formData // Cập nhật với giá trị mới từ formData
          }
        }
      })

      toast({
        title: 'Thành công',
        description: 'Thông tin đã được cập nhật thành công',
        variant: 'default'
      })

      setIsEditing(false) // Thoát chế độ chỉnh sửa
    } catch (error) {
      console.error('Error updating user info:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error || !data) {
    return <Empty />
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
    <div className='min-h-screen bg-white py-4 md:py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-4 md:gap-6'>
          {/* Personal Information Card */}
          <Card className='h-full'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg md:text-xl text-red-600 flex items-center gap-2'>
                <User className='w-5 h-5 md:w-6 md:h-6' />
                Hồ sơ hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 pt-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  { label: 'Họ và tên (CCCD)', value: userInfo.fullName },
                  { label: 'Số CCCD/Hộ chiếu (CCCD)', value: userInfo.identityNumber },
                  { label: 'Ngày sinh (CCCD)', value: formatDate(userInfo.dob) },
                  { label: 'Giới tính (CCCD)', value: userInfo.gender }
                ].map((item, index) => (
                  <div key={index} className='col-span-1'>
                    <span className='text-gray-700 mb-1 font-bold mr-2'>{item.label}:</span>
                    <span className='text-gray-900'>{item.value}</span>
                  </div>
                ))}

                <div className='col-span-1'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Nghề nghiệp:</span>
                  {isEditing ? (
                    <input
                      type='text'
                      name='jobName'
                      value={formData.jobName} // Sử dụng formData thay vì userInfo
                      onChange={handleInputChange}
                      className='w-full bg-gray-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900'
                    />
                  ) : (
                    <span className='text-gray-900'>{userInfo.jobName}</span>
                  )}
                </div>

                <div className='col-span-1'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Cơ quan/Trường, Lớp:</span>
                  {isEditing ? (
                    <Select
                      options={orgOptions}
                      isSearchable
                      className='w-full p2'
                      placeholder='Tìm kiếm tổ chức...'
                      value={orgOptions.find((option) => option.value === formData.organizationId) || null}
                      onChange={(selectedOption) => {
                        setFormData((prev) => ({
                          ...prev,
                          organizationId: selectedOption ? selectedOption.value : ''
                        }))
                      }}
                    />
                  ) : (
                    <span className='text-gray-900'>
                      {organizations.find((org) => org.id === userInfo.organizationId)?.name || 'Chưa cập nhật'}
                    </span>
                  )}
                </div>

                <div className='col-span-1'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Số thẻ HS/SV:</span>
                  {isEditing ? (
                    <input
                      type='text'
                      name='studentId'
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className='w-full bg-gray-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900'
                    />
                  ) : (
                    <span className='text-gray-900'>{userInfo.studentId}</span>
                  )}
                </div>

                <div className='col-span-1'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Số thẻ quân nhân:</span>
                  {isEditing ? (
                    <input
                      type='text'
                      name='militaryId'
                      value={formData.militaryId}
                      onChange={handleInputChange}
                      className='w-full bg-gray-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900'
                    />
                  ) : (
                    <span className='text-gray-900'>{userInfo.militaryId || '-'}</span>
                  )}
                </div>

                <div className='col-span-1'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Điện thoại:</span>
                  {isEditing ? (
                    <input
                      type='text'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className='w-full bg-gray-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900'
                    />
                  ) : (
                    <span className='text-gray-900'>{userInfo.phoneNumber}</span>
                  )}
                </div>

                <div className='col-span-1'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Email:</span>
                  {isEditing ? (
                    <input
                      type='text'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className='w-full bg-gray-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900'
                    />
                  ) : (
                    <span className='text-gray-900'>{userInfo.email}</span>
                  )}
                </div>

                <div className='col-span-2'>
                  <span className='text-gray-700 mb-1 font-bold mr-2'>Địa chỉ liên hệ:</span>
                  {isEditing ? (
                    <input
                      type='text'
                      name='addressContact'
                      value={formData.addressContact}
                      onChange={handleInputChange}
                      className='w-full bg-gray-50 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900'
                    />
                  ) : (
                    <span className='text-gray-900'>{userInfo.addressContact}</span>
                  )}
                </div>

                <div className='col-span-1 md:col-span-2'>
                  <span className='font-bold text-gray-700 mb-1 mr-2'>Địa chỉ thường trú (CCCD):</span>
                  <span className='text-gray-900'>{userInfo.address}</span>
                </div>
                <div className='col-span-1 md:col-span-2'>
                  <span className='font-bold text-gray-700 mb-1 mr-2'>Nơi cấp (CCCD):</span>
                  <span className='text-gray-900'>{userInfo.issueLoc}</span>
                </div>
              </div>
              <div className='flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4'>
                {isEditing ? (
                  <>
                    <Button
                      variant='outline'
                      onClick={() => setIsEditing(false)}
                      className='border-gray-300 text-gray-600 hover:bg-gray-100 w-full md:w-auto'
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={updateUserInfo}
                      className='bg-red-600 hover:bg-red-700 text-white w-full md:w-auto'
                    >
                      Lưu
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className='bg-red-600 hover:bg-red-700 text-white w-full md:w-auto'
                      onClick={() => setPopupOpen(true)}
                    >
                      Xem phiếu đăng ký
                    </Button>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className='bg-red-600 hover:bg-red-700 text-white w-full md:w-auto'
                    >
                      Chỉnh sửa thông tin
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AppointmentDetailsPopup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        appointmentItems={appointmentItems}
        groupedSections={groupedSections}
        renderStatusBadge={renderStatusBadge}
        status={data.campaign?.status || ''}
      />
    </div>
  )
}

export default AppointmentInfo
