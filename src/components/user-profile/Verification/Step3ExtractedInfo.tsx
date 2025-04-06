import React, { useEffect, useState } from 'react'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import { getExtractById, updateExtractStatus } from '@/api/extract'
import { createOrUpdateUserDetail, getCurrentUserDetail } from '@/api/user'
import ScrollToTop from '@/components/scrollToTop'
import { getDistricts, getListProvinces } from '@/api/address'
import { getOrganizationsByType } from '@/api/organization'
import Select from 'react-select'

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
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({}) // Object to store field-specific errors
  const [provinces, setProvinces] = React.useState<any[]>([])
  const [districts, setDistricts] = React.useState<any[]>([])
  const [contact, setContact] = React.useState<string>('')
  const [selectedProvince, setSelectedProvince] = React.useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('')
  const [organizations, setOrganizations] = useState<Organization[]>([])

  console.log('Card details:', JSON.stringify(cardDetails))

  // Separate components for better organization
  const LoadingSpinner = () => (
    <div className='flex items-center justify-center py-8'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
    </div>
  )

  const CardInfoField = ({ label, value }: { label: string; value: string }) => (
    <div className='space-y-2'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='font-medium'>{value || '---'}</p>
    </div>
  )

  const handleConfirm = async () => {
    const errors: Record<string, string> = {}

    if (!formData.mobile) {
      errors.mobile = 'Vui lòng điền số điện thoại'
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Số điện thoại không hợp lệ'
    }

    if (!contact) {
      errors.contact = 'Vui lòng điền địa chỉ liên hệ'
    }

    if (!selectedProvince) {
      errors.province = 'Vui lòng chọn tỉnh/thành phố'
    }

    if (!selectedDistrict) {
      errors.district = 'Vui lòng chọn quận/huyện'
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
      setFieldErrors({}) // Clear errors if no issues

      // Concatenate full address
      const provinceName = provinces.find((p) => p.code.toString() === selectedProvince)?.name || ''
      const districtName = districts.find((d) => d.code.toString() === selectedDistrict)?.name || ''
      const fullAddress = `${contact}, ${districtName}, ${provinceName}`

      

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
      }
    }

    fetchProvinces()
  }, [])

  React.useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return // Fetch districts only when a province is selected
      try {
        const response = await getDistricts()
        const filteredDistricts = response.filter((district) => district.province_code.toString() === selectedProvince)
        setDistricts(filteredDistricts)
      } catch (error) {
        console.error('Error fetching districts:', error)
      }
    }

    fetchDistricts()
  }, [selectedProvince])

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

  return (
    <div className='space-y-6'>
      <ScrollToTop />
      <h3 className='text-2xl font-heading font-semibold'>Thông tin xác thực</h3>

      {isLoading ? (
        <LoadingSpinner />
      ) : cardDetails ? (
        <div className='space-y-6'>
          <div className='space-y-4 p-6 border rounded-lg'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <CardInfoField label='Loại thẻ' value={formData.cardType} />
              <CardInfoField label='Số CCCD' value={cardDetails.id?.toString() || '---'} />
              <CardInfoField label='Họ và tên' value={cardDetails.name} />
              <CardInfoField label='Ngày sinh' value={cardDetails.dob} />
              <CardInfoField label='Giới tính' value={cardDetails.gender} />
              <CardInfoField label='Quốc tịch' value={cardDetails.national} />
              <CardInfoField label='Quê quán' value={cardDetails.home} />
              <CardInfoField label='Ngày hết hạn' value={cardDetails.doe} />
              <CardInfoField label='Nơi cấp' value={cardDetails.issueLoc} />
              <CardInfoField label='Ngày cấp' value={cardDetails.issueDate} />
              <CardInfoField label='Đặc điểm nhận dạng' value={cardDetails.features || ''} />
              <CardInfoField label='Địa chỉ thường trú' value={cardDetails.address} />
            </div>
          </div>

          {/* <PersonalInfoForm /> */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thông tin cá nhân</h3>
            <div className='p-4 border rounded-lg'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Email</p>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                    placeholder='Email'
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>
                    Số điện thoại <span className='text-red-700'>*</span>
                  </p>
                  <input
                    type='tel'
                    name='mobile'
                    value={formData.mobile}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, mobile: e.target.value }))}
                    placeholder='Số điện thoại'
                    className='w-full p-2 border rounded required'
                  />
                  {fieldErrors.mobile && <p className='text-sm text-red-600'>{fieldErrors.mobile}</p>}
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Nghề nghiệp</p>
                  <input
                    type='text'
                    name='jobName'
                    value={formData.jobName}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, jobName: e.target.value }))}
                    placeholder='Nghề nghiệp'
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                    <p className='text-sm text-gray-500'>Đơn vị trực thuộc</p>
                    <Select
                    options={orgOptions}
                    isClearable
                    isSearchable
                    className='w-full p2'
                    placeholder='Tìm kiếm tổ chức...'
                    value={orgOptions.find((option) => option.value === formData.organizationId) || null}
                    onChange={(selectedOption) =>
                      setFormData((prev: any) => ({
                      ...prev,
                      organizationId: selectedOption ? selectedOption.value : ''
                      }))
                    }
                    />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Mã sinh viên</p>
                  <input
                    type='text'
                    name='studentId'
                    value={formData.studentId}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, studentId: e.target.value }))}
                    placeholder='Mã sinh viên'
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Mã quân nhân</p>
                  <input
                    type='text'
                    name='militaryId'
                    value={formData.militaryId}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, militaryId: e.target.value }))}
                    placeholder='Mã quân nhân'
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Số lần hiến máu</p>
                  <input
                    type='number'
                    name='timeDonation'
                    value={formData.timeDonation || ''}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, timeDonation: e.target.value }))}
                    placeholder='Số lần hiến máu'
                    className='w-full p-2 border rounded'
                    min='0'
                  />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Nhóm máu</p>
                  <select
                    name='bloodGroup'
                    value={formData.bloodGroup}
                    onChange={onInputChange}
                    className='w-full p-2 border rounded'
                  >
                    <option value=''>Chọn nhóm máu</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>
                    Tỉnh/Thành phố <span className='text-red-700'>*</span>
                  </p>
                  <select
                    name='province'
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className='w-full p-2 border rounded'
                  >
                    <option value=''>Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.province && <p className='text-sm text-red-600'>{fieldErrors.province}</p>}
                </div>
                <div>
                  <p className='text-sm text-gray-500'>
                    Quận/Huyện <span className='text-red-700'>*</span>
                  </p>
                  <select
                    name='district'
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className='w-full p-2 border rounded'
                  >
                    <option value=''>Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.district && <p className='text-sm text-red-600'>{fieldErrors.district}</p>}
                </div>
                <div className='col-span-2'>
                  <p className='text-sm text-gray-500'>
                    Địa chỉ liên hệ <span className='text-red-700'>*</span>
                  </p>
                  <input
                    type='text'
                    name='addressContact'
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder='Xóm thôn, xã phường'
                    className='w-full p-2 border rounded required'
                  />
                  {fieldErrors.contact && <p className='text-sm text-red-600'>{fieldErrors.contact}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between'>
            <button onClick={onPrev} className='px-4 py-2 bg-secondary text-accent rounded hover:bg-secondary/80'>
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/80'
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận thông tin'}
            </button>
          </div>

          {/* {error && <div className='p-4 bg-red-50 text-red-600 rounded-lg'>{error}</div>} */}
        </div>
      ) : (
        <div className='p-4 bg-yellow-50 text-yellow-600 rounded-lg'>Không có thông tin thẻ</div>
      )}
    </div>
  )
}

export default Step3ExtractedInfo
