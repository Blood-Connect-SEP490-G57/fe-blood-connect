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
import { Info, User } from 'lucide-react'

const Profile = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

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
    if (hasFetched.current) return // Nếu đã fetch thì không gọi lại
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

  const onSubmit = async () => {
    const formattedValues = {
      email: form2.getValues('email'),
      job: form2.getValues('job_name'),
      student: form2.getValues('student_id'),
      military: form2.getValues('military_id'),
      address: form2.getValues('address_contact')
    }
    console.log(formattedValues)
    await updateProfile(formattedValues)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Empty />
  }
  // console.log(form2.formState.errors)

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-6xl mx-auto'>
          <Card className='mb-6'>
            <CardContent>
              {/* Phần 1: Thông tin cá nhân */}
              <div>
                <h2 className='flex items-center text-lg font-semibold text-red-500 mb-4 mt-4'>
                <User className='mr-2' size={20} />
                  Thông tin cá nhân</h2>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Họ và tên:</span> {form.getValues('full_name')}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Số CCCD:</span> {form.getValues('card_id')}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Ngày sinh:</span> {form.getValues('dob')}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Giới tính:</span> {form.getValues('gender')}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Nhóm máu:</span> {form.getValues('blood_group')}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Quốc gia:</span> {form.getValues('national')}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Số lần hiến máu:</span> {form.getValues('time_donation')}
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold'>Quốc gia:</span> {form.getValues('national')}
                    </div>
                  </div>
                  <div>
                    <span className='font-bold mr-2'>Quê quán:</span> {form.getValues('home')}
                  </div>
                  <div>
                    <span className='font-bold mr-2'>Địa chỉ thường trú:</span> {form.getValues('address')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Form {...form2}>
                <form onSubmit={form2.handleSubmit(onSubmit)} className='space-y-8'>
                  {/* Phần 2: Thông tin liên hệ */}
                  <div>
                    <h2 className='flex items-center text-lg font-semibold text-red-500 mb-4 mt-4'>
                      <Info className='mr-2' size={20} />
                      Thông tin liên hệ
                    </h2>
                    <div className='grid grid-cols-1 gap-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form2.control}
                          name='address_contact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-bold'>Địa chỉ liên hệ</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e)
                                    form2.setValue('address_contact', e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form2.control}
                          name='mobile'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-bold'>Điện thoại di động</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e)
                                    form2.setValue('mobile', e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form2.control}
                          name='student_id'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-bold'>Mã sinh viên</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e)
                                    form2.setValue('student_id', e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form2.control}
                          name='military_id'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-bold'>Mã quân nhân</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e)
                                    form2.setValue('military_id', e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form2.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-bold'>Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type='email'
                                  onChange={(e) => {
                                    field.onChange(e)
                                    form2.setValue('email', e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form2.control}
                          name='job_name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font-bold'>Nghề nghiệp</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e)
                                    form2.setValue('job_name', e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end space-x-4'>
                    <Button type='submit' className='bg-red-600 text-white hover:bg-red-700'>
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
