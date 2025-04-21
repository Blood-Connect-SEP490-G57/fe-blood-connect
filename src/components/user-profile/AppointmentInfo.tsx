import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCurrent, updateinfor } from '@/api/appointment'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from '../ui/use-toast'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'
import AppointmentDetailsPopup from './AppointmentDetailsPopup'
import JobSelector from '@/components/Selector/job/JobSelector'
import AddressSelector from '@/components/Selector/address/AddressSelector'
import OrganizationSelector from '@/components/Selector/organization/OrganizationSelector'
import { Campaign } from '@/api/campaign'

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

interface AppointmentInfoProps {
  appointmentId?: string | null
}

const AppointmentInfo = ({ appointmentId }: AppointmentInfoProps) => {
  const [data, setData] = useState<AppointmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPopupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    const fetchAppointmentInfo = async () => {
      try {
        setLoading(true)
        if (!appointmentId) {
          setError('Không tìm thấy thông tin lịch hẹn')
          return
        }

        const response = await getCurrent(appointmentId)

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
  }, [appointmentId])

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
    organization_id: 0,
    organizationName: ''
  })

  useEffect(() => {
    if (data?.userInfo) {
      const userInfo = data.userInfo as any
      setFormData({
        userId: userInfo.userId || '',
        jobName: userInfo.jobName || '',
        organization_id: userInfo.organizationId || '',
        bloodGroup: userInfo.bloodGroup || '',
        addressContact: userInfo.addressContact || '',
        studentId: userInfo.studentId || '',
        militaryId: userInfo.militaryId || '',
        phoneNumber: userInfo.phoneNumber || '',
        email: userInfo.email || '',
        organizationName: userInfo.organizationName || ''
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
    const statusConfig: Record<string, { label: string }> = {
      BOOKING: { label: 'Đã đặt lịch' },
      COMPLETED: { label: 'Hoàn thành' },
      CANCELLED: { label: 'Đã hủy' },
      PENDING: { label: 'Đang chờ' }
    }

    const config = statusConfig[status] || { label: status }

    return <span className={`font-medium`}>{config.label}</span>
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

  const handleBackToHistory = () => {
    window.location.hash = 'lich-su-hien-mau'
  }
  // Hàm gửi phản hồi
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    message: ''
  })
  const [formFeedback, setFormFeedback] = useState({
    name: '',
    email: '',
    campaign: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormFeedback((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: { message: string } = { message: '' }
    if (!formFeedback.message.trim()) newErrors.message = 'Tin nhắn là bắt buộc.'
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error) // Trả về true nếu không có lỗi
  }
  const sendFeedback = async () => {
    const formUrl =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfEiCuB3whodj9KdBroWXAQyy1WTu6kQf8FkEcoSLLbZeNm2A/formResponse'

    const formData = new FormData()
    formData.append('entry.352160787', formFeedback.name)
    formData.append('entry.25561806', formFeedback.email)
    formData.append('entry.1358451724', formFeedback.campaign)
    formData.append('entry.490855480', formFeedback.message)

    await fetch(formUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })

    return { result: 'success' }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const result = await sendFeedback()
      if (result.result === 'success') {
        toast({
          title: 'Thành công!',
          description: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
          variant: 'default'
        })
      }
    } catch (err) {
      console.error('Error sending feedback:', err)
    } finally {
      setIsLoading(false)
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

  const hasAppointment = data.campaign !== null

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 rounded-xl relative'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-4 left-4 text-white hover:bg-white/20'
          onClick={handleBackToHistory}
        >
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <Calendar className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-1xl font-bold mb-1'>{userInfo.fullName}</h1>
            <div className='flex items-center gap-2'>
              {hasAppointment ? (
                <>
                  <span className='px-2 py-1 text-sm rounded-full bg-white/20'>
                    {renderStatusBadge(data.campaign?.status || '')}
                  </span>
                </>
              ) : (
                <span>Chưa có lịch hiến máu</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='py-2'>
        {/* Card for active appointment */}
        {hasAppointment && (
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Lịch hẹn hiện tại</h2>
            <Card className='overflow-hidden rounded-xl shadow-sm bg-white border-none'>
              <CardContent className='p-2 sm:p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-semibold text-red-600 flex items-center'>
                    <div>{data.campaign?.campaignName}</div>
                  </h3>
                </div>
                <div className='space-y-3 mb-4'>
                  <div className='flex items-start gap-2'>
                    <div>
                      <Calendar className='w-5 h-5 text-gray-500 mt-0.5' />
                    </div>
                    <div>
                      <span className='text-sm text-gray-500'>Thời gian</span>
                      <p className='font-medium'>{formatDateTime(data.campaign?.appointmentDate || '')}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div>
                      <MapPin className='w-5 h-5 text-gray-500 mt-0.5' />
                    </div>
                    <div>
                      <span className='text-sm text-gray-500'>Địa điểm</span>
                      <p className='font-medium'>{data.campaign?.location || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
                {data.campaign?.status === 'BOOKING' ||
                  (data.campaign?.status === 'DONE' && (
                    <Button onClick={() => setPopupOpen(true)} className='w-full bg-red-600 hover:bg-red-700 mt-2'>
                      Xem chi tiết phiếu đăng ký
                    </Button>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

        {data.campaign?.status === 'BOOKING' ? (
          <div>
            {/* User Info Form */}
            <div className='mb-6'>
              <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin cá nhân</h2>
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    <div className='p-2 sm:p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div>
                          <span className='text-sm font-medium text-gray-700'>Họ và tên</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs sm:text-sm text-gray-600'>{userInfo.fullName}</span>
                      </div>
                    </div>

                    <div className='p-2 sm:p-4  flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Số CCCD/Hộ chiếu</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs sm:text-sm text-gray-600'>{userInfo.identityNumber}</span>
                      </div>
                    </div>

                    <div className='p-2 sm:p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Ngày sinh</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs sm:text-sm text-gray-600'>{formatDate(userInfo.dob)}</span>
                      </div>
                    </div>

                    <div className='p-2 sm:p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Giới tính</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs sm:text-sm text-gray-600'>{userInfo.gender}</span>
                      </div>
                    </div>
                    <div className='p-2 sm:p-4'>
                      <div className='flex justify-between items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Địa chỉ thường trú</span>
                        <div>
                          <span className='text-xs sm:hidden sm:text-sm text-gray-600'>
                            {userInfo.address
                              ? userInfo.address.split(',').map((part, index) => (
                                  <span key={`address-part-${index}`}>
                                    {part.trim()}
                                    {index < 4 && <br />}
                                  </span>
                                ))
                              : 'Chưa có địa chỉ'}
                          </span>
                          <span className='text-xs hidden sm:block sm:text-sm text-gray-600'>{userInfo.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className='p-2 sm:p-4'>
                      <div className='flex items-center justify-between gap-3'>
                        <span className='text-sm w-1/3 font-medium text-gray-700'>Nơi cấp</span>
                        <span className='text-xs text-end sm:text-sm text-gray-600'>
                          {userInfo.issueLoc.charAt(0) + userInfo.issueLoc.slice(1).toLowerCase()}
                        </span>
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
                    <div className='p-2 sm:p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span className='text-sm font-medium text-gray-700'>Địa chỉ liên hệ</span>
                        </div>
                        <div className='flex items-center justify-end gap-2'>
                          <span className='text-xs sm:hidden sm:text-sm text-gray-600'>
                            {userInfo.addressContact
                              ? userInfo.addressContact.split(',').map((part, index) => (
                                  <span key={index}>
                                    {part.trim()}
                                    {index < 3 && <br />}
                                  </span>
                                ))
                              : 'Chưa có địa chỉ'}
                          </span>
                          <span className='text-xs hidden sm:block sm:text-sm text-gray-600'>
                            {userInfo.addressContact}
                          </span>
                          {isEditing && (
                            <AddressSelector
                              initialAddress={formData.addressContact}
                              onAddressSelect={(address) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  addressContact: address
                                }))
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='p-2 sm:p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Điện thoại</span>
                      </div>
                      {isEditing ? (
                        <input
                          type='number'
                          name='phoneNumber'
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className='w-1/2 p-2 sm:text-sm text-xs text-right bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                        />
                      ) : (
                        <div className='flex items-center gap-2'>
                          <span className='text-xs sm:text-sm text-gray-600'>{userInfo.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className='p-2 sm:p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Email</span>
                      </div>
                      {isEditing ? (
                        <input
                          type='text'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          className='w-1/2 p-2 sm:text-sm text-xs text-right bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                        />
                      ) : (
                        <div className='flex items-center gap-2'>
                          <span className='text-xs sm:text-sm text-gray-600'>{userInfo.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Work Information */}
            <div className='mb-4'>
              <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin nghề nghiệp</h2>
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='p-2 sm:p-4 divide-y'>
                    <div className='flex items-center justify-between py-2'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Nghề nghiệp</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs sm:text-sm text-gray-600'>{formData.jobName}</span>
                        {isEditing && (
                          <JobSelector
                            initialJob={formData.jobName}
                            onJobSelect={(job) => {
                              setFormData((prev) => ({
                                ...prev,
                                jobName: job
                              }))
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {formData.jobName === 'Sinh viên' && (
                      <div className='flex items-center justify-between py-2'>
                        <div className='flex items-center gap-3'>
                          <span className='text-sm font-medium text-gray-700'>Mã sinh viên</span>
                        </div>
                        {isEditing ? (
                          <input
                            type='text'
                            name='studentId'
                            value={formData.studentId}
                            onChange={handleInputChange}
                            className='w-1/2 p-2 sm:text-sm text-xs text-right bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                          />
                        ) : (
                          <div className='flex items-center gap-2'>
                            <span className='text-xs sm:text-sm text-gray-600'>{userInfo.studentId || '-'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {(formData.jobName === 'Công an' ||
                      formData.jobName === 'Bộ đội' ||
                      formData.jobName === 'Quân nhân') && (
                      <div className='flex items-center justify-between py-2'>
                        <div className='flex items-center gap-3'>
                          <span className='text-sm font-medium text-gray-700'>Mã quân nhân</span>
                        </div>
                        {isEditing ? (
                          <input
                            type='text'
                            name='militaryId'
                            value={formData.militaryId}
                            onChange={handleInputChange}
                            className='w-1/2 p-2 sm:text-sm text-xs text-right bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                          />
                        ) : (
                          <div className='flex items-center gap-2'>
                            <span className='text-xs sm:text-sm text-gray-600'>{userInfo.militaryId || '-'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className='flex items-center justify-between py-2'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-medium text-gray-700'>Tổ chức</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs sm:text-sm text-gray-600'>{formData.organizationName}</span>
                        {isEditing && (
                          <OrganizationSelector
                            initialOrganization={formData.organizationName}
                            onOrganizationSelect={(org) => {
                              setFormData((prev) => ({
                                ...prev,
                                organizationId: org.id,
                                organizationName: org.name
                              }))
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='py-4 space-y-4 flex flex-row justify-end items-center gap-4'>
              {isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className='bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-xl px-6'
                  >
                    Hủy
                  </Button>
                  <Button onClick={updateUserInfo} className='bg-red-600 text-white hover:bg-red-700 rounded-xl px-6'>
                    Lưu thay đổi
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className='bg-red-600 text-white hover:bg-red-700 py-5 rounded-xl w-full'
                >
                  Chỉnh sửa thông tin
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>Phản hồi của bạn</h2>

            <div className='flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-6 w-full'>
              <form onSubmit={handleSubmit} className='w-full'>
                <div className='mb-4 space-y-4 w-full'>
                  <div className='w-full'>
                    <label htmlFor='campaign' className='block text-sm font-medium text-gray-700 mb-1'>
                      Tên buổi hiến máu
                    </label>
                    <input
                      type='text'
                      id='campaign'
                      name='campaign'
                      value={data.campaign?.campaignName}
                      readOnly
                      className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-100'
                    />
                  </div>

                  <div className='w-full'>
                    <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                      Nội dung phản hồi <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      rows={4}
                      value={formFeedback.message}
                      onChange={handleChange}
                      className='w-full bg-gray-100 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm'
                      placeholder='Nhập phản hồi của bạn tại đây...'
                    ></textarea>
                    {errors.message && <p className='text-sm text-red-500 mt-1'>{errors.message}</p>}
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    onClick={() => {
                      setFormFeedback((prev) => ({
                        ...prev,
                        name: userInfo.fullName || '',
                        email: userInfo.email || '',
                        campaign: data.campaign?.campaignName || ''
                      }))
                    }}
                    className='rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-5 hover:opacity-90 transition'
                  >
                    {isLoading ? (
                      'Đang gửi...'
                    ) : (
                      <span className='flex items-center justify-center'>
                        Gửi Phản Hồi
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Appointment Details Popup */}
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
