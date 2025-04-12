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
import { Droplet, User, MapPin, Briefcase } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import AddressSelector from '../address/AddressSelector'
import JobSelector from '../job/JobSelector'

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
      issue_date: ''
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
      address_contact: ''
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
          home: response.home || ''
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
      // Reset form về giá trị ban đầu khi hủy chỉnh sửa
      form2.reset()
    }
    setIsEdit(!isEdit)
  }

  const onSubmit = async () => {
    const formattedValues = {
      email: form2.getValues('email'),
      job: form2.getValues('job_name'),
      student: form2.getValues('student_id'),
      military: form2.getValues('military_id'),
      address: form2.getValues('address_contact')
    }
    await updateProfile(formattedValues)
    setIsEdit(false) // Tắt chế độ chỉnh sửa sau khi lưu
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
            <h1 className='text-2xl font-bold mb-1'>{form.getValues('full_name')}</h1>
            <div className='flex items-center gap-2'>
              <Droplet className='h-4 w-4' />
              <span>Nhóm máu: {form.getValues('blood_group')}</span>
              <span className='mx-2'>•</span>
              <span>Đã hiến {form.getValues('time_donation')} lần</span>
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
                <InfoItem label='Quê quán' value={form.getValues('home')} />
                <InfoItem label='Địa chỉ thường trú' value={form.getValues('address')} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Group */}
        <Form {...form2}>
          <form onSubmit={form2.handleSubmit(onSubmit)} className='space-y-6 '>
            <div>
              <h2 className='text-lg font-semibold text-gray-700 mb-2 px-2'>Thông tin liên hệ</h2>
              <Card className='overflow-hidden rounded-xl shadow-sm border-none'>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    <FormField
                      control={form2.control}
                      name='address_contact'
                      render={({ field }) => (
                        <FormItem className='p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Địa chỉ liên hệ</FormLabel>
                            </div>
                            <FormControl>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600 '>{field.value || 'Chưa có địa chỉ'}</span>
                                {isEdit && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant='ghost' size='icon' className='ml-1'>
                                        <MapPin className='h-4 w-4 text-red-500' />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md'>
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
                        <FormItem className='p-2'>
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
                                  className='w-1/2 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập số điện thoại'
                                />
                              ) : (
                                <span className='text-sm text-gray-600'>{field.value || 'Chưa có điện thoại'}</span>
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
                        <FormItem className='p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Email</FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  type='email'
                                  className='w-1/2 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập email'
                                  readOnly={!isEdit}
                                />
                              ) : (
                                <span className='text-sm text-gray-600 '>{field.value || 'Chưa có email'}</span>
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
                        <FormItem className='p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Nghề nghiệp</FormLabel>
                            </div>
                            <FormControl>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600 '>{field.value || 'Chưa có nghề nghiệp'}</span>
                                {isEdit && (
                                  <Dialog>
                                    <DialogTrigger>
                                      <Button variant='ghost' size='icon' className='ml-1'>
                                        <Briefcase className='h-4 w-4 text-red-500' />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-md'>
                                      <JobSelector
                                        onJobSelect={(job) => {
                                          field.onChange(job)
                                        }}
                                        initialJob={field.value}
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
                        <FormItem className='p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Mã sinh viên</FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  className='w-1/2 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập mã sinh viên'
                                  readOnly={!isEdit}
                                />
                              ) : (
                                <span className='text-sm text-gray-600'>{field.value || '-'}</span>
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
                        <FormItem className='p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <FormLabel className='text-sm font-medium text-gray-700 m-0'>Mã quân nhân</FormLabel>
                            </div>
                            <FormControl>
                              {isEdit ? (
                                <Input
                                  {...field}
                                  className='w-1/2 border-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0'
                                  placeholder='Nhập mã quân nhân'
                                  readOnly={!isEdit}
                                />
                              ) : (
                                <span className='text-sm text-gray-600'>{field.value || '-'}</span>
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

// Helper component for read-only info items
const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className='p-2 flex items-center justify-between'>
    <div className='flex items-center gap-3'>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
    </div>
    <div className='flex items-center gap-2'>
      <span className='text-sm text-gray-600'>{value}</span>
    </div>
  </div>
)

export default Profile
