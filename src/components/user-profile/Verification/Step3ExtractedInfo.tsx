import React, { useEffect, useState } from 'react'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import { getExtractById, updateExtractStatus } from '@/api/extract'
import { createOrUpdateUserDetail, getCurrentUserDetail } from '@/api/user'
import ScrollToTop from '@/components/scrollToTop'
import { getDistricts, getListProvinces, getWards, Ward } from '@/api/address'
import { getOrganizationsByType } from '@/api/organization'
import Select from 'react-select'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle,
  ChevronDown,
  FileText,
  Info,
  Building,
  MapPin,
  Phone,
  Mail,
  School,
  Award,
  Loader2
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Step2Props {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onNext: () => void
  onPrev: () => void
  isLoading: boolean
}
interface Organization {
  id: string
  name: string
  type: string
}

const Step3ExtractedInfo: React.FC<Step2Props> = ({
  formData,
  setFormData,
  onInputChange,
  onNext,
  onPrev,
  isLoading
}) => {
  const { extractId, cardDetails, setLoading, setError } = useExtractStore()
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [provinces, setProvinces] = React.useState<any[]>([])
  const [districts, setDistricts] = React.useState<any[]>([])
  const [contact, setContact] = React.useState<string>('')
  const [selectedProvince, setSelectedProvince] = React.useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('')
  const [wards, setWards] = React.useState<Ward[]>([])
  const [selectedWard, setSelectedWard] = React.useState<string>('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [showCardDetails, setShowCardDetails] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const LoadingSpinner = () => (
    <div className='flex items-center justify-center py-8'>
      <Loader2 className='h-8 w-8 text-red-500 animate-spin' />
    </div>
  )

  const handleConfirm = async () => {
    const errors: Record<string, string> = {}
    if (!formData.mobile) {
      errors.mobile = 'Vui lòng điền số điện thoại'
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền số điện thoại',
        variant: 'destructive'
      })
      return
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Số điện thoại không hợp lệ'
      toast({
        title: 'Lỗi',
        description: 'Số điện thoại không hợp lệ',
        variant: 'destructive'
      })
      return
    }

    if (!contact) {
      errors.contact = 'Vui lòng điền địa chỉ liên hệ'
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền địa chỉ liên hệ',
        variant: 'destructive'
      })
      return
    }

    if (!selectedProvince) {
      errors.province = 'Vui lòng chọn tỉnh/thành phố'
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn tỉnh/thành phố',
        variant: 'destructive'
      })
      return
    }

    if (!selectedDistrict) {
      errors.district = 'Vui lòng chọn quận/huyện'
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn quận/huyện',
        variant: 'destructive'
      })
      return
    }

    if (!selectedWard) {
      errors.ward = 'Vui lòng chọn phường/xã'
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn phường/xã',
        variant: 'destructive'
      })
      return
    }

    if (!extractId) {
      errors.extractId = 'Không tìm thấy thông tin CCCD'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    try {
      setLoading(true)
      setIsSubmitting(true)
      setFieldErrors({}) // Clear errors if no issues

      // Concatenate full address
      const provinceName = provinces.find((p) => p.code.toString() === selectedProvince)?.name || ''
      const districtName = districts.find((d) => d.code.toString() === selectedDistrict)?.name || ''
      const wardName = wards.find((w) => w.code.toString() === selectedWard)?.name || ''
      const fullAddress = `${contact}, ${wardName}, ${districtName}, ${provinceName}`

      const userDetailData = {
        email: formData.email,
        job_name: formData.jobName,
        student_id: formData.studentId,
        military_id: formData.militaryId,
        address_contact: fullAddress, // Use the full address here
        time_donation: Number(formData.timeDonation),
        blood_group: formData.bloodGroup,
        organization_id: Number(formData.organizationId)
      }

      const userResponse = await createOrUpdateUserDetail(userDetailData)
      if (!userResponse) {
        throw new Error('Lỗi khi cập nhật thông tin người dùng')
      }

      if (userResponse.success) {
        const extractResponse = await updateExtractStatus(extractId, 'CONFIRM_MATCHED')
        if (!extractResponse.success) {
          throw new Error(extractResponse.message || 'Lỗi khi xác nhận thông tin CCCD')
        }
      }

      setError(null)
      onNext()
    } catch (err) {
      console.error('Confirm error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Lỗi không xác định khi xác nhận thông tin')
      }
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true)
        const response = await getCurrentUserDetail()
        console.log('User detail response:', response)

        if (response.success && response.data) {
          const userData = response.data
          setFormData((prev: any) => ({
            ...prev,
            email: userData.email || '',
            mobile: userData.mobile || '',
            jobName: userData.job_name || '',
            studentId: userData.student_id || '',
            militaryId: userData.military_id || '',
            addressContact: userData.address_contact || '',
            timeDonation: userData.time_donation || 0,
            bloodGroup: userData.blood_group || '',
            organizationId: userData.organization_id ?? ''
          }))
        } else {
          console.error('Invalid response format:', response)
          setError('Không thể tải thông tin người dùng')
        }
      } catch (err) {
        console.error('Error fetching user detail:', err)
        setError('Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetail()
  }, [])

  useEffect(() => {
    const fetchExtractedInfo = async () => {
      if (!extractId) return

      try {
        setLoading(true)
        const response = await getExtractById(extractId)
        if (response.success) {
          const extractData = response.data
          setFormData((prev: any) => ({
            ...prev,
            extractedInfo: extractData,
            cardType: extractData.card_type,
            cardId: extractData.card_id,
            fullName: extractData.name || '',
            dateOfBirth: extractData.dob || ''
          }))
        } else {
          setError('Không thể lấy thông tin đã trích xuất')
        }
      } catch (err) {
        setError('Không thể lấy thông tin đã trích xuất')
      } finally {
        setLoading(false)
      }
    }

    fetchExtractedInfo()
  }, [extractId])

  // Fetch provinces and districts when the component mounts
  React.useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getListProvinces()
        setProvinces(response)
      } catch (error) {
        console.error('Error fetching provinces:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách tỉnh/thành phố',
          variant: 'destructive'
        })
      }
    }
    fetchProvinces()
  }, [])

  React.useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return // Chỉ gọi API khi đã chọn tỉnh/thành phố
      try {
        const response = await getDistricts()
        const filteredDistricts = response.filter((district) => district.province_code.toString() === selectedProvince)
        setDistricts(filteredDistricts)
      } catch (error) {
        console.error('Error fetching districts:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách quận/huyện',
          variant: 'destructive'
        })
      }
    }

    fetchDistricts()
  }, [selectedProvince])

  React.useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return
      try {
        const response = await getWards()
        const filteredWards = response.filter((ward) => ward.district_code.toString() === selectedDistrict)
        setWards(filteredWards)
      } catch (error) {
        console.error('Error fetching wards:', error)
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách phường/xã',
          variant: 'destructive'
        })
      }
    }

    fetchWards()
  }, [selectedDistrict])

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getOrganizationsByType()
        const orgs = Array.isArray(response.data) ? response.data : []
        setOrganizations([{ id: '', name: 'Tự do' }, ...orgs])
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

  return (
    <div className='space-y-6'>
      <ScrollToTop />

      <div className='text-center mb-6'>
        <div className='flex items-center justify-center mb-4'>
          <div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center'>
            <FileText className='h-8 w-8 text-red-500' />
          </div>
        </div>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>Thông tin xác thực</h2>
        <p className='text-sm text-gray-600 max-w-xl mx-auto'>
          Vui lòng kiểm tra thông tin được trích xuất từ CCCD và điền bổ sung các thông tin liên hệ.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : cardDetails ? (
        <div className='space-y-6'>
          {/* CCCD Information */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>Thông tin CCCD</h3>
              <button
                onClick={() => setShowCardDetails(!showCardDetails)}
                className='text-red-600 text-sm flex items-center gap-1'
              >
                {showCardDetails ? 'Thu gọn' : 'Xem thêm'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showCardDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showCardDetails && (
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Số CCCD'
                      value={formData.cardId || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Họ và tên'
                      value={cardDetails.name || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Ngày sinh'
                      value={cardDetails.dob || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Giới tính'
                      value={cardDetails.gender || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Quốc tịch'
                      value={cardDetails.national || '-'}
                    />
                    <InfoItem
                      icon={<MapPin className='h-5 w-5 text-gray-500' />}
                      label='Quê quán'
                      value={cardDetails.home || '-'}
                    />
                    <InfoItem
                      icon={<MapPin className='h-5 w-5 text-gray-500' />}
                      label='Địa chỉ thường trú'
                      value={cardDetails.address || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Ngày cấp'
                      value={cardDetails.issueDate || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Ngày hết hạn'
                      value={cardDetails.doe || '-'}
                    />
                    <InfoItem
                      icon={<Info className='h-5 w-5 text-gray-500' />}
                      label='Nơi cấp'
                      value={cardDetails.issueLoc || '-'}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Thông tin liên hệ</h3>
            <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
              <CardContent className='p-5 divide-y space-y-4'>
                <div className='pb-4'>
                  <FormField label='Email' icon={<Mail className='h-5 w-5 text-gray-500' />} required={false}>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                      placeholder='Nhập email'
                      className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  </FormField>
                </div>

                <div className='py-4'>
                  <FormField
                    label='Số điện thoại'
                    icon={<Phone className='h-5 w-5 text-gray-500' />}
                    required={true}
                    error={fieldErrors.mobile}
                  >
                    <input
                      type='tel'
                      value={formData.mobile}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, mobile: e.target.value }))}
                      placeholder='Nhập số điện thoại'
                      className={`w-full p-2 rounded border ${
                        fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                  </FormField>
                </div>

                <div className='py-4'>
                  <div className='flex items-center justify-between'>
                    <FormField
                      label='Tỉnh/Thành phố'
                      icon={<MapPin className='h-5 w-5 text-gray-500' />}
                      required={true}
                      error={fieldErrors.province}
                    >
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className={`w-full p-2 rounded border ${
                          fieldErrors.province ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                      >
                        <option value=''>Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      label='Quận/Huyện'
                      icon={<MapPin className='h-5 w-5 text-gray-500' />}
                      required={true}
                      error={fieldErrors.district}
                    >
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className={`w-full p-2 rounded border ${
                          fieldErrors.district ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        disabled={!selectedProvince}
                      >
                        <option value=''>Chọn quận/huyện</option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      label='Phường/Xã'
                      icon={<MapPin className='h-5 w-5 text-gray-500' />}
                      required={true}
                      error={fieldErrors.ward}
                    >
                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        className={`w-full p-2 rounded border ${
                          fieldErrors.ward ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        disabled={!selectedDistrict}
                      >
                        <option value=''>Chọn phường/xã</option>
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>
                <div className='py-4'>
                  <FormField
                    label='Địa chỉ liên hệ'
                    icon={<MapPin className='h-5 w-5 text-gray-500' />}
                    required={true}
                    error={fieldErrors.contact}
                  >
                    <input
                      type='text'
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder='Nhập số nhà, đường, thôn xóm...'
                      className={`w-full p-2 rounded border ${
                        fieldErrors.contact ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Thông tin bổ sung</h3>
            <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
              <CardContent className='p-5 divide-y space-y-4'>
                {/* <div className='pb-4'>
                  <FormField
                    label='Nghề nghiệp'
                    icon={<Briefcase className='h-5 w-5 text-gray-500' />}
                    required={false}
                  >
                    <Select
                      options={job.map((jobItem) => ({
                        value: jobItem.id,
                        label: jobItem.job
                      }))}
                      isClearable
                      isSearchable
                      isLoading={isLoadingJobs} // Hiển thị trạng thái loading
                      placeholder={isLoadingJobs ? 'Đang tải...' : 'Tìm kiếm nghề nghiệp...'}
                      value={job.find((jobItem) => jobItem.id === formData.jobId) || null} // Giá trị mặc định
                      onChange={(selectedOption) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          jobId: selectedOption ? selectedOption.value : '' // Cập nhật jobId
                        }))
                      }
                      className='basic-select'
                      classNamePrefix='select'
                    />
                  </FormField>
                </div> */}

                <div className='py-4'>
                  <FormField
                    label='Đơn vị trực thuộc'
                    icon={<Building className='h-5 w-5 text-gray-500' />}
                    required={false}
                  >
                    <Select
                      options={orgOptions}
                      isClearable
                      isSearchable
                      placeholder='Tìm kiếm tổ chức...'
                      value={orgOptions.find((option) => option.value === formData.organizationId) || null}
                      onChange={(selectedOption) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          organizationId: selectedOption ? selectedOption.value : ''
                        }))
                      }
                      className='basic-select'
                      classNamePrefix='select'
                    />
                  </FormField>
                </div>

                <div className='py-4'>
                  <FormField label='Mã sinh viên' icon={<School className='h-5 w-5 text-gray-500' />} required={false}>
                    <input
                      type='text'
                      value={formData.studentId}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, studentId: e.target.value }))}
                      placeholder='Nhập mã sinh viên (nếu có)'
                      className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  </FormField>
                </div>

                <div className='py-4'>
                  <FormField label='Mã quân nhân' icon={<Award className='h-5 w-5 text-gray-500' />} required={false}>
                    <input
                      type='text'
                      value={formData.militaryId}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, militaryId: e.target.value }))}
                      placeholder='Nhập mã quân nhân (nếu có)'
                      className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                  </FormField>
                </div>

                <div className='py-4'>
                  <FormField label='Số lần hiến máu' icon={<Info className='h-5 w-5 text-gray-500' />} required={false}>
                    <input
                      type='number'
                      value={formData.timeDonation || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, timeDonation: e.target.value }))}
                      placeholder='Nhập số lần hiến máu'
                      className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                      min='0'
                    />
                  </FormField>
                </div>

                <div className='py-4'>
                  <FormField label='Nhóm máu' icon={<Info className='h-5 w-5 text-gray-500' />} required={false}>
                    <select
                      value={formData.bloodGroup}
                      onChange={onInputChange}
                      name='bloodGroup'
                      className='w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                      <option value=''>Chọn nhóm máu</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='flex justify-between'>
            <button
              onClick={onPrev}
              className='px-4 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors'
            >
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              className='px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <CheckCircle className='h-4 w-4' />
                  <span>Xác nhận thông tin</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className='p-6 bg-yellow-50 text-yellow-600 rounded-lg text-center'>
          <Info className='h-6 w-6 mx-auto mb-2' />
          <p>Không có thông tin CCCD</p>
          <p className='text-sm mt-1'>Vui lòng quay lại bước trước và tải lên ảnh CCCD của bạn</p>
          <button
            onClick={onPrev}
            className='mt-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200'
          >
            Quay lại
          </button>
        </div>
      )}
    </div>
  )
}

// Helper components
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | null }) => (
  <div className='p-4 flex items-center justify-between'>
    <div className='flex items-center gap-3'>
      {icon}
      <span className='text-sm font-medium text-gray-700'>{label}</span>
    </div>
    <div className='flex items-center gap-2'>
      <span className='text-sm text-gray-600'>{value || '-'}</span>
    </div>
  </div>
)

const FormField = ({
  label,
  icon,
  required,
  error,
  children
}: {
  label: string
  icon: React.ReactNode
  required: boolean
  error?: string
  children: React.ReactNode
}) => (
  <div>
    <div className='flex items-center justify-between mb-2'>
      <div className='flex items-center gap-2'>
        {icon}
        <label className='text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      </div>
    </div>
    {children}
    {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
  </div>
)

export default Step3ExtractedInfo
