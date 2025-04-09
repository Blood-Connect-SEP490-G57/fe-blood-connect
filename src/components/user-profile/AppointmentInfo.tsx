import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronRight, MapPin, User, Phone, Mail, Briefcase, School, Award, Calendar as CalendarIcon, Building } from 'lucide-react'
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
      BOOKING: { color: 'bg-yellow-100 text-yellow-800', label: 'Đã đặt lịch' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Hoàn thành' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Đã hủy' },
      PENDING: { color: 'bg-gray-100 text-gray-800', label: 'Đang chờ' }
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
    
  const hasAppointment = data.campaign !== null;

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <Calendar className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold mb-1'>{userInfo.fullName}</h1>
            <div className='flex items-center gap-2'>
              {hasAppointment ? (
                <>
                  <span className='px-2 py-1 rounded-full bg-white/20'>
                    Đã đặt lịch hiến máu
                  </span>
                </>
              ) : (
                <span>Chưa có lịch hiến máu</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        {/* Card for active appointment */}
        {hasAppointment && (
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Lịch hẹn hiện tại</h2>
            <Card className='overflow-hidden rounded-xl shadow-sm bg-white border-none'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-semibold text-red-600 flex items-center'>
                    <CalendarIcon className='w-5 h-5 mr-2' />
                    {data.campaign?.campaignName}
                  </h3>
                  {renderStatusBadge(data.campaign?.status || '')}
                </div>
                <div className='space-y-3 mb-4'>
                  <div className='flex items-start gap-2'>
                    <Calendar className='w-5 h-5 text-gray-500 mt-0.5' />
                    <div>
                      <span className='text-sm text-gray-500'>Thời gian</span>
                      <p className='font-medium'>{formatDateTime(data.campaign?.appointmentDate || '')}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <MapPin className='w-5 h-5 text-gray-500 mt-0.5' />
                    <div>
                      <span className='text-sm text-gray-500'>Địa điểm</span>
                      <p className='font-medium'>{data.campaign?.location || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setPopupOpen(true)}
                  className='w-full bg-red-600 hover:bg-red-700 mt-2'
                >
                  Xem chi tiết phiếu đăng ký
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Info Form */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin cá nhân</h2>
          <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-0'>
              <div className='divide-y'>
                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <User className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Họ và tên</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>{userInfo.fullName}</span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <User className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Số CCCD/Hộ chiếu</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>{userInfo.identityNumber}</span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Ngày sinh</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>{formatDate(userInfo.dob)}</span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <User className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Giới tính</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>{userInfo.gender}</span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin liên hệ</h2>
          <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-0'>
              <div className='divide-y'>
                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Địa chỉ liên hệ</span>
                  </div>
                  {isEditing ? (
                    <input
                      type='text'
                      name='addressContact'
                      value={formData.addressContact}
                      onChange={handleInputChange}
                      className='w-1/2 p-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{userInfo.addressContact}</span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Phone className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Điện thoại</span>
                  </div>
                  {isEditing ? (
                    <input
                      type='text'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className='w-1/2 p-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{userInfo.phoneNumber}</span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Mail className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Email</span>
                  </div>
                  {isEditing ? (
                    <input
                      type='text'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className='w-1/2 p-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{userInfo.email}</span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Information */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin nghề nghiệp</h2>
          <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-0'>
              <div className='divide-y'>
                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Briefcase className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Nghề nghiệp</span>
                  </div>
                  {isEditing ? (
                    <input
                      type='text'
                      name='jobName'
                      value={formData.jobName}
                      onChange={handleInputChange}
                      className='w-1/2 p-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{userInfo.jobName}</span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Building className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Tổ chức</span>
                  </div>
                  {isEditing ? (
                    <div className='w-1/2'>
                      <Select
                        options={orgOptions}
                        isSearchable
                        placeholder='Tìm kiếm tổ chức...'
                        value={orgOptions.find((option) => option.value === formData.organizationId) || null}
                        onChange={(selectedOption) => {
                          setFormData((prev) => ({
                            ...prev,
                            organizationId: selectedOption ? selectedOption.value : ''
                          }))
                        }}
                        className='text-right'
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            borderRadius: '0.375rem',
                            minHeight: '38px'
                          })
                        }}
                      />
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>
                        {organizations.find((org) => org.id === userInfo.organizationId)?.name || 'Chưa cập nhật'}
                      </span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <School className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Mã sinh viên</span>
                  </div>
                  {isEditing ? (
                    <input
                      type='text'
                      name='studentId'
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className='w-1/2 p-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{userInfo.studentId || '-'}</span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Award className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Mã quân nhân</span>
                  </div>
                  {isEditing ? (
                    <input
                      type='text'
                      name='militaryId'
                      value={formData.militaryId}
                      onChange={handleInputChange}
                      className='w-1/2 p-2 text-sm text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{userInfo.militaryId || '-'}</span>
                      <ChevronRight className='h-4 w-4 text-gray-400' />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CCCD Information */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin CCCD</h2>
          <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-0'>
              <div className='divide-y'>
                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Địa chỉ thường trú</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>{userInfo.address}</span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>

                <div className='p-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-5 w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>Nơi cấp</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>{userInfo.issueLoc}</span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='py-4 space-y-4'>
          {isEditing ? (
            <>
              <Button
                onClick={updateUserInfo}
                className='w-full bg-red-600 text-white hover:bg-red-700 py-5 rounded-xl'
              >
                Lưu thay đổi
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className='w-full bg-gray-200 text-gray-800 hover:bg-gray-300 py-5 rounded-xl'
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className='w-full bg-red-600 text-white hover:bg-red-700 py-5 rounded-xl'
            >
              Chỉnh sửa thông tin
            </Button>
          )}
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
