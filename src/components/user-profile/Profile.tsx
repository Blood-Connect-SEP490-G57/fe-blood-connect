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
    return (
      <div className='flex items-center justify-center mt-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        <span className='ml-2'>Đang xử lý...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center mt-12'>
        <div className='text-red-500'>{error}</div>
      </div>
    )
  }
  // console.log(form2.formState.errors)

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl font-semibold mb-8'>Thông tin cá nhân</h2>
        <div className='max-w-6xl mx-auto'>
          <Card>
            <CardContent>
              <Form {...form}>
                {/* Phần 1: Thông tin cá nhân */}
                <div>
                  <h2 className='text-lg font-semibold mb-4 mt-4'>Thông tin cá nhân</h2>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='card_id'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số CCCD</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='full_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='dob'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày sinh</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='gender'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới tính</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='blood_group'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nhóm máu</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='national'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quốc gia</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='time_donation'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số lần hiến máu</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='home'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nơi thường trú</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quê quán</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Form>
              <Form {...form2}>
                <form onSubmit={form2.handleSubmit(onSubmit)} className='space-y-8'>
                  {/* Phần 2: Thông tin liên hệ */}
                  <div>
                    <h2 className='text-lg font-semibold mb-4 mt-4'>Thông tin liên hệ</h2>
                    <div className='grid grid-cols-1 gap-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form2.control}
                          name='address_contact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa chỉ liên hệ</FormLabel>
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
                              <FormLabel>Điện thoại di động</FormLabel>
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
                              <FormLabel>Mã sinh viên</FormLabel>
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
                              <FormLabel>Mã quân nhân</FormLabel>
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
                              <FormLabel>Email</FormLabel>
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
                              <FormLabel>Nghề nghiệp</FormLabel>
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
