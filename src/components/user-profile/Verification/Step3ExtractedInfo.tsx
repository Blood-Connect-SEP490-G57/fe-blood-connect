import React, { useEffect, useState } from 'react'
import { useExtractStore } from '@/hooks/stores/useExtractStore'
import { getExtractById, updateExtractStatus } from '@/api/extract'
import { createOrUpdateUserDetail, getCurrentUserDetail } from '@/api/user'
import { getOrganizationsByType } from '@/api/organization'
import { Button } from '@/components/ui/button'
import { ChevronDown, Info, Loader2, Pencil } from 'lucide-react'
import JobSelector from '@/components/Selector/job/JobSelector'
import AddressSelector from '@/components/Selector/address/AddressSelector'
import OrganizationSelector from '@/components/Selector/organization/OrganizationSelector'
import { FormField } from '@/components/ui/form-field'
import BloodTypeSelector from '@/components/Selector/bloodtype/bloodtype'
import NumberDonateSelector from '@/components/Selector/NumberDonate.tsx/DonateSelector'
import EmailSelector from '@/components/Selector/email/emailSelector'
import PhoneSelector from '@/components/Selector/phone/PhoneSelector'
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

const Step3ExtractedInfo: React.FC<Step2Props> = ({ formData, setFormData, onNext, onPrev, isLoading }) => {
  const { extractId, cardDetails, setLoading, setError } = useExtractStore()
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [contact, setContact] = React.useState<string>('')
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
    let hasErrors = false

    if (!formData.mobile) {
      errors.mobile = 'Vui lòng điền số điện thoại'
      hasErrors = true
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Số điện thoại không hợp lệ'
      hasErrors = true
    }

    if (!contact) {
      errors.contact = 'Vui lòng điền địa chỉ liên hệ'
      hasErrors = true
    }

    if (!extractId) {
      errors.extractId = 'Không tìm thấy thông tin CCCD'
      hasErrors = true
    }

    setFieldErrors(errors)
    if (hasErrors) {
      return
    }

    try {
      setLoading(true)
      setIsSubmitting(true)

      const userDetailData = {
        email: formData.email || '',
        mobile: formData.mobile, // Ensure mobile is included
        job_name: formData.jobName || '',
        student_id: formData.studentId || '',
        military_id: formData.militaryId || '',
        address_contact: contact,
        time_donation: Number(formData.timeDonation || 0),
        blood_group: formData.bloodGroup || '',
        organization_id: Number(formData.organizationId || 0)
      }

      const userResponse = await createOrUpdateUserDetail(userDetailData)
      if (!userResponse) {
        throw new Error('Lỗi khi cập nhật thông tin người dùng')
      }

      if (userResponse.success) {
        const extractResponse = await updateExtractStatus(extractId, 'CONFIRM_MATCHED')
        if (!extractResponse.success) {
          throw extractResponse
        }
      }

      setError(null)
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Lỗi không xác định khi xác nhận thông tin'
      setError(errorMessage)
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive'
      })
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

  return (
    <div className='space-y-6 sm:p-4 p-2'>

      {isLoading ? (
        <LoadingSpinner />
      ) : cardDetails ? (
        <div className='space-y-6'>
          {/* CCCD Information */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-gray-900'>Thông tin CCCD</h3>
              <button
                onClick={() => setShowCardDetails(!showCardDetails)}
                className='text-red-600 text-sm flex items-center gap-1'
              >
                {showCardDetails ? 'Thu gọn' : 'Xem thêm'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showCardDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showCardDetails && (
              <div className='divide-y bg-white rounded-xl'>
                <InfoItem label='Số CCCD' value={formData.cardId || '-'} />
                <InfoItem label='Họ và tên' value={cardDetails.name || '-'} />
                <InfoItem label='Ngày sinh' value={cardDetails.dob || '-'} />
                <InfoItem label='Giới tính' value={cardDetails.gender || '-'} />
                <InfoItem label='Quốc tịch' value={cardDetails.national || '-'} />
                <InfoItem label='Quê quán' value={cardDetails.home || '-'} />
                <InfoItem label='Địa chỉ thường trú' value={cardDetails.address || '-'} />
                <InfoItem label='Ngày cấp' value={cardDetails.issueDate || '-'} />
                <InfoItem label='Ngày hết hạn' value={cardDetails.doe || '-'} />
                <InfoItem label='Nơi cấp' value={cardDetails.issueLoc || '-'} />
              </div>
            )}
          </div>

          <ContactInformationSection
            formData={formData}
            setFormData={setFormData}
            contact={contact}
            setContact={setContact}
            fieldErrors={fieldErrors}
          />

          <AdditionalInformationSection formData={formData} setFormData={setFormData} organizations={organizations} />

          <div className='flex flex-col  sm:flex-row sm:items-center sm:justify-between'>
            <button
              onClick={onPrev}
              className='px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-sm'
            >
              Quay lại
            </button>
            <button
              onClick={handleConfirm}
              className={`mt-2 px-4 py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-red-400 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <>Đang xử lý...</> : <>Xác nhận</>}
            </button>
          </div>
        </div>
      ) : (
        <div className='p-6 bg-yellow-50 text-yellow-600 rounded-lg text-center'>
          <Info className='h-6 w-6 mx-auto mb-2' />
          <p>Không có thông tin CCCD</p>
          <p className='text-sm mt-1'>Vui lòng quay lại bước trước và tải lên ảnh CCCD của bạn</p>
          <button onClick={onPrev} className='mt-4 px-4  bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200'>
            Quay lại
          </button>
        </div>
      )}
    </div>
  )
}

// Helper components
const InfoItem = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className='p-2 sm:p-4 flex items-center justify-between px-2'>
    <div className='flex items-center gap-3 w-1/2'>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
    </div>
    <div className='flex items-center justify-end'>
      {typeof value === 'string' && value.includes(',') ? (
        <div>
          <div className='sm:hidden'>
            <span className='text-sm text-gray-600 text-end'>
              {value.split(',').map((part, index) => (
                <React.Fragment key={index}>
                  {part.trim()}
                  {index < value.split(',').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>
          <div className='hidden sm:block'>
            <span className='text-sm text-gray-600 text-end'>{value || '-'}</span>
          </div>
        </div>
      ) : (
        <span className='text-sm text-gray-600 text-end'>{value || '-'}</span>
      )}
    </div>
  </div>
)

// Component for Contact Information Section
const ContactInformationSection = ({
  formData,
  setFormData,
  contact,
  setContact,
  fieldErrors
}: {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  contact: string
  setContact: (contact: string) => void
  fieldErrors: Record<string, string>
}) => (
  <div className='space-y-4'>
    <h3 className='text-xl font-semibold text-gray-900'>Thông tin liên hệ</h3>
    <div className='bg-white rounded-xl p-4 space-y-4'>
      <div>
        <FormField label='Email'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm text-gray-600'>{formData.email || 'Chưa có email'}</span>
              <EmailSelector
                initialEmail={formData.email}
                onEmailSelect={(email) => {
                  setFormData((prev: any) => ({ ...prev, email: email }))
                }}
              />
            </div>
            {fieldErrors.email && (
              <span className='text-sm text-red-500'>{fieldErrors.email}</span>
            )}
          </div>
        </FormField>
      </div>
      <div>
        <FormField label='Số điện thoại'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm text-gray-600'>{formData.mobile || 'Chưa có số điện thoại'}</span>
              <PhoneSelector
                initialPhone={formData.mobile}
                onPhoneSelect={(phone) => {
                  setFormData((prev: any) => ({ ...prev, mobile: phone }))
                }}
              />
            </div>
            {fieldErrors.mobile && (
              <span className='text-sm text-red-500'>{fieldErrors.mobile}</span>
            )}
          </div>
        </FormField>
      </div>
      <div>
        <FormField label='Địa chỉ liên hệ'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center justify-between border-b pb-2'>
              {contact ? (
                <div className='flex-1'>
                  <div className='sm:hidden'>
                    <span className='text-sm text-gray-600'>
                      {contact.split(',').map((part, index) => (
                        <React.Fragment key={index}>
                          {part.trim()}
                          {index < 3 && <br />}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                  <div className='hidden sm:block'>
                    <span className='text-sm text-gray-600'>{contact}</span>
                  </div>
                </div>
              ) : (
                <span className='text-sm text-gray-600'>Chưa có địa chỉ</span>
              )}
              <AddressSelector
                onAddressSelect={(address) => {
                  setContact(address)
                }}
              />
            </div>
            {fieldErrors.contact && (
              <span className='text-sm text-red-500'>{fieldErrors.contact}</span>
            )}
          </div>
        </FormField>
      </div>
    </div>
  </div>
)

// Component for Additional Information Section
const AdditionalInformationSection = ({
  formData,
  setFormData,
  organizations
}: {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  organizations: Organization[]
}) => {
  const shouldShowStudentId = formData.jobName === 'Sinh viên'
  const shouldShowMilitaryId =
    formData.jobName === 'Quân nhân' || formData.jobName === 'Công an' || formData.jobName === 'Bộ đội'

  return (
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-gray-900'>Thông tin bổ sung</h3>
      <div className='bg-white rounded-xl p-4 space-y-4'>
        <div>
          <FormField label='Nghề nghiệp'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm text-gray-600'>{formData.jobName || 'Chưa có nghề nghiệp'}</span>
              <JobSelector
                trigger={
                  <Button variant='outline' size='sm'>
                    <Pencil className='w-4 h-4' />
                  </Button>
                }
                onJobSelect={(job) => {
                  setFormData((prev: any) => ({ ...prev, jobName: job }))
                }}
              />
            </div>
          </FormField>
        </div>

        {shouldShowStudentId && (
          <div>
            <FormField label='Mã sinh viên'>
              <input
                type='text'
                value={formData.studentId}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, studentId: e.target.value }))}
                className='w-full text-sm rounded-lg focus:outline-none border-b pb-2'
                placeholder='Nhập mã sinh viên'
              />
            </FormField>
          </div>
        )}

        {shouldShowMilitaryId && (
          <div>
            <FormField label='Mã quân nhân'>
              <input
                type='text'
                value={formData.militaryId}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, militaryId: e.target.value }))}
                className='w-full text-sm rounded-lg focus:outline-none border-b pb-2'
                placeholder='Nhập mã quân nhân'
              />
            </FormField>
          </div>
        )}

        <div>
          <FormField label='Tổ chức'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm text-gray-600'>
                {organizations.find((org) => org.id === formData.organizationId)?.name || 'Chưa có tổ chức'}
              </span>
              <OrganizationSelector
                onOrganizationSelect={(organization) => {
                  setFormData((prev: any) => ({ ...prev, organizationId: organization.id }))
                }}
              />
            </div>
          </FormField>
        </div>

        <div>
          <FormField label='Số lần hiến máu'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm text-gray-600'>{formData.timeDonation || 'Chưa có số lần hiến máu'}</span>
              <NumberDonateSelector
                onNumberSelect={(number) => {
                  setFormData((prev: any) => ({ ...prev, timeDonation: number }))
                }}
              />
            </div>
          </FormField>
        </div>

        <div>
          <FormField label='Nhóm máu'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm text-gray-600'>{formData.bloodGroup || 'Chưa có nhóm máu'}</span>
              <BloodTypeSelector
                value={formData.bloodGroup}
                onChange={(value) => {
                  setFormData((prev: any) => ({ ...prev, bloodGroup: value }))
                }}
              />
            </div>
          </FormField>
        </div>
      </div>
    </div>
  )
}

export default Step3ExtractedInfo
