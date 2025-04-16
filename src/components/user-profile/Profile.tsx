import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { userDetailSchema, UserFullInfoResponseSchema } from '@/schema/user-schema'
import { User as fetchUser, updateUserDetail } from '@/api/user'
import { toast } from '../ui/use-toast'
import Loading from '../warnings/loading'
import Empty from '../warnings/empty'
import { User, MapPin, Briefcase, Building } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import AddressSelector from '../address/AddressSelector'
import JobSelector from '../job/JobSelector'
import OrganizationSelector from '../organization/OrganizationSelector'
import React from 'react'

const Profile = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const [isEdit, setIsEdit] = useState(false)

  const form = useForm<z.infer<typeof UserFullInfoResponseSchema>>({
    resolver: zodResolver(UserFullInfoResponseSchema),
    defaultValues: {
      user_id: 0,
      username: '',
      email: '',
      mobile: '',
      enable: false,
      status: 0,
      job_name: '',
      student_id: '',
      military_id: '',
      address_contact: '',
      time_donation: 0,
      blood_group: '',
      extract_id: '',
      is_active: false,
      extract_status: '',
      card_id: '',
      full_name: '',
      dob: '',
      gender: '',
      national: '',
      ethnicity: '',
      home: '',
      address: '',
      doe: '',
      issue_loc: '',
      issue_date: '',
      organization_id: 0,
      organization_name: ''
    }
  })

  const form2 = useForm<z.infer<typeof userDetailSchema>>({
    resolver: zodResolver(userDetailSchema),
    defaultValues: {
      email: '',
      mobile: '',
      job_name: '',
      student_id: '',
      military_id: '',
      address_contact: '',
      organization_id: 0,
      organization_name: ''
    }
  })

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchUserData = async () => {
      try {
        const response = await fetchUser()
        form.reset({
          job_name: response.job_name || '',
          time_donation: response.time_donation || 0,
          blood_group: response.blood_group || '-',
          card_id: response.card_id || '',
          full_name: response.full_name || '',
          dob: response.dob || '',
          gender: response.gender || '',
          national: response.national || '',
          address: response.address || '',
          home: response.home || '',
          organization_id: response.organization_id || 0,
          organization_name: response.organization_name || ''
        })
        form2.reset({
          email: response.email || '',
          mobile: response.mobile || '',
          job_name: response.job_name || '',
          student_id: response.student_id || '',
          military_id: response.military_id || '',
          address_contact: response.address_contact || ''
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [form])

  const updateProfile = async (value: any) => {
    try {
      const response = await updateUserDetail(value)
      if (response.success) {
        toast({
          title: 'Cập nhật thành công',
          description: response.message || 'Thông tin cá nhân đã được cập nhật.',
          variant: 'default'
        })
      } else {
        toast({
          title: 'Lỗi',
          description: response.message || 'Không thể cập nhật thông tin cá nhân.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin cá nhân.',
        variant: 'destructive'
      })
    }
  }

  const handleEditToggle = () => {
    if (isEdit) {
      form2.reset()
    }
    setIsEdit(!isEdit)
  }

  const onSubmit = async () => {
    const formattedValues = {
      mobile: form2.getValues('mobile'),
      email: form2.getValues('email'),
      job_name: form2.getValues('job_name'),
      student_id: form2.getValues('student_id'),
      military_id: form2.getValues('military_id'),
      address_contact: form2.getValues('address_contact'),
      organization_id: form.getValues('organization_id'),
      time_donation: form.getValues('time_donation'),
      blood_group: form.getValues('blood_group')
    }
    await updateProfile(formattedValues)
    setIsEdit(false)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Empty />
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Banner section */}
      <div className='bg-gradient-to-r from-red-600 to-red-400 text-white p-8 relative rounded-xl border-2 border-red-500'>
        <div className='container mx-auto'>
          <div className='flex flex-col items-center'>
            <div className='h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4'>
              <User className='h-12 w-12 text-red-500' />
            </div>
            <h1 className='text-xl font-bold mb-1'>{form.getValues('full_name')}</h1>
            <div className='flex items-center gap-1'>
              <div className='flex items-center gap-1'>
                <span className='text-xs sm:text-sm'>Nhóm máu: {form.getValues('blood_group')}</span>
              </div>
              <span className='mx-2'>•</span>
              <div>
                <span className='text-xs sm:text-sm'>Đã hiến {form.getValues('time_donation')} lần</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='py-2'>
        {/* Personal Information Group */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin cá nhân</h2>
          <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
            <CardContent className='p-0'>
              <div className='divide-y'>
                <InfoItem label='Họ và tên' value={form.getValues('full_name')} />
                <InfoItem label='Số CCCD' value={form.getValues('card_id')} />
                <InfoItem label='Ngày sinh' value={form.getValues('dob')} />
                <InfoItem label='Giới tính' value={form.getValues('gender')} />
                <InfoItem label='Quốc gia' value={form.getValues('national')} />
                <InfoItem label='Quê quán' value={form.getValues('home')} isAddress={true} />
                <InfoItem label='Địa chỉ thường trú' value={form.getValues('address')} isAddress={true} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Group */}
        <Form {...form2}>
          <form className='space-y-6 '>
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin liên hệ</h2>
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    <FormField
                      control={form2.control}
                      name='address_contact'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Địa chỉ liên hệ</FormLabel>
                            </div>
                            <FormControl>
                              <div className='flex items-center justify-between'>
                                <span className='text-xs sm:text-sm text-gray-600 text-end'>
                                  {field.value
                                    ? field.value.split(',').map((part, index) => (
                                        <React.Fragment key={index}>
                                          {part.trim()}
                                          {index < 3 && <br />}
                                        </React.Fragment>
                                      ))
                                    : 'Chưa có địa chỉ'}
                                </span>
                                {isEdit && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant='ghost' size='icon' className='ml-1'>
                                        <MapPin className='h-4 w-4 text-red-500' />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md' aria-describedby='dialog-address-select'>
                                      <div id='dialog-address-select' className='sr-only'>
                                        Chọn địa chỉ liên hệ của bạn
                                      </div>
                                      <AddressSelector
                                        onAddressSelect={(address) => {
                                          field.onChange(address)
                                        }}
                                        initialAddress={field.value}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </FormControl>
                          </div>
                          <FormMessage className='ml-8 text-xs' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name='mobile'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>
                                Điện thoại di động
                              </FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  type='tel'
                                  className='w-1/2 bg-gray-100 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập số điện thoại'
                                />
                              ) : (
                                <span className='text-xs sm:text-sm text-gray-600'>{field.value || 'Chưa có điện thoại'}</span>
                              )}
                            </FormControl>
                          </div>
                          <FormMessage className='ml-8 text-xs' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Email</FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  type='email'
                                  className='w-1/2 bg-gray-100 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập email'
                                  readOnly={!isEdit}
                                />
                              ) : (
                                <span className='text-xs sm:text-sm text-gray-600 '>{field.value || 'Chưa có email'}</span>
                              )}
                            </FormControl>
                          </div>
                          <FormMessage className='ml-8 text-xs' />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Work Information Group with updated FormField for job_name */}
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2 '>Thông tin nghề nghiệp</h2>
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    <FormField
                      control={form2.control}
                      name='job_name'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Nghề nghiệp</FormLabel>
                            </div>
                            <FormControl>
                              <div className='flex items-center justify-between'>
                                <span className='text-xs sm:text-sm text-gray-600 '>{field.value || 'Chưa có nghề nghiệp'}</span>
                                {isEdit && (
                                  <Dialog>
                                    <DialogTrigger>
                                      <Button variant='ghost' size='icon' className='ml-1'>
                                        <Briefcase className='h-4 w-4 text-red-500' />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md' aria-describedby='dialog-profile-job-select'>
                                      <div id='dialog-profile-job-select' className='sr-only'>
                                        Chọn nghề nghiệp của bạn
                                      </div>
                                      <JobSelector
                                        initialJob={form2.getValues('job_name')}
                                        onJobSelect={(job) => {
                                          form2.setValue('job_name', job)
                                        }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage className='ml-8 text-xs' />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name='student_id'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Mã sinh viên</FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  className='w-1/2 bg-gray-100 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập mã sinh viên'
                                  readOnly={!isEdit}
                                />
                              ) : (
                                <span className='text-xs sm:text-sm text-gray-600'>{field.value || '-'}</span>
                              )}
                            </FormControl>
                          </div>
                          <FormMessage className='ml-8 text-xs' />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name='military_id'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Mã quân nhân</FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  className='w-1/2 bg-gray-100 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập mã quân nhân'
                                  readOnly={!isEdit}
                                />
                              ) : (
                                <span className='text-xs sm:text-sm text-gray-600'>{field.value || '-'}</span>
                              )}
                            </FormControl>
                          </div>
                          <FormMessage className='ml-8 text-xs' />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organization Information Group */}
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2 '>Thông tin tổ chức</h2>
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    <FormField
                      control={form.control}
                      name='organization_name'
                      render={({ field }) => (
                        <FormItem className='p-2 sm:p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Tổ chức</FormLabel>
                            </div>
                            <FormControl>
                              <div className='flex items-center justify-between'>
                                <span className='text-xs sm:text-sm text-gray-600 '>{field.value || 'Chưa có tổ chức'}</span>
                                {isEdit && (
                                  <Dialog>
                                    <DialogTrigger>
                                      <Button variant='ghost' size='icon' className='ml-1'>
                                        <Building className='h-4 w-4 text-red-500' />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md' aria-describedby='dialog-profile-org-select'>
                                      <div id='dialog-profile-org-select' className='sr-only'>
                                        Chọn tổ chức của bạn
                                      </div>
                                      <OrganizationSelector
                                        initialOrganization={form.getValues('organization_name')}
                                        onOrganizationSelect={(organization) => {
                                          form.setValue('organization_name', organization.name);
                                          form.setValue('organization_id', organization.id);
                                        }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage className='ml-8 text-xs' />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
        <div className='flex justify-end mt-4 px-2 gap-2'>
          {isEdit ? (
            <>
              <Button onClick={handleEditToggle} variant='outline' className='border-gray-300 hover:bg-gray-100'>
                Hủy
              </Button>
              <Button onClick={form2.handleSubmit(onSubmit)} className='bg-red-600 text-white hover:bg-red-700'>
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEditToggle}
              variant='outline'
              className='border-red-500 text-red-500 hover:bg-red-50'
            >
              Chỉnh sửa thông tin
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Thay đổi component InfoItem để hỗ trợ hiển thị địa chỉ nhiều dòng
const InfoItem = ({
  label,
  value,
  isAddress = false
}: {
  label: string
  value: string | number
  isAddress?: boolean
}) => (
  <div className='p-2 sm:p-4 flex items-center justify-between'>
    <div className='flex items-center'>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
    </div>
    <div className='flex items-center justify-end'>
      {isAddress ? (
        <span className='text-xs sm:text-sm text-gray-600 text-end'>
          {String(value)
            .split(',')
            .map((part, index) => (
              <React.Fragment key={index}>
                {part.trim()}
                {index < 3 && <br />}
              </React.Fragment>
            ))}
        </span>
      ) : (
        <span className='text-xs sm:text-sm text-gray-600 text-end'>{value}</span>
      )}
    </div>
  </div>
)

export default Profile
