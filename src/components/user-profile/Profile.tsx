import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { User } from 'lucide-react'
import UserAvatar from '@/components/ui/user-avatar'
import { UserFullInfoResponseSchema } from '@/schema/user-schema'
import { User as fetchUser } from '@/api/user'

const Profile = () => {
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

  useEffect(() => {
    if (hasFetched.current) return // Nếu đã fetch thì không gọi lại
    hasFetched.current = true

    const fetchUserData = async () => {
      try {
        const response = await fetchUser()
        console.log(response)
        form.reset({
          email: response.email || '',
          mobile: response.mobile || '',
          job_name: response.job_name || '',
          student_id: response.student_id || '',
          military_id: response.military_id || '',
          address_contact: response.address_contact || '',
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
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [form])

  const handleAvatarChange = async (file: File) => {
    try {
      // TODO: Implement actual file upload to server
      console.log('Uploading file:', file)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate upload
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  const onSubmit = (values: z.infer<typeof UserFullInfoResponseSchema>) => {
    console.log(values)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className='min-h-screen bg-white py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Hồ sơ cá nhân</h1>
        <div className='max-w-6xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <User className='w-5 h-5' />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center mb-8'>
                <UserAvatar
                  size='lg'
                  user={{
                    name: form.getValues('full_name'),
                    image: undefined
                  }}
                  editable
                  onImageChange={handleAvatarChange}
                />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                  {/* Phần 1: Thông tin cá nhân */}
                  <div>
                    <h2 className='text-lg font-semibold mb-4'>Thông tin cá nhân</h2>
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
                                <Input {...field} />
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
                                <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Phần 2: Thông tin liên hệ */}
                  <div>
                    <h2 className='text-lg font-semibold mb-4'>Thông tin liên hệ</h2>
                    <div className='grid grid-cols-1 gap-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form.control}
                          name='address_contact'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa chỉ liên hệ</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='mobile'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Điện thoại di động</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type='email' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='job_name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nghề nghiệp</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end space-x-4'>
                    <Button type='button' variant='outline' className='border-red-600 text-red-600 hover:bg-red-50'>
                      Hủy
                    </Button>
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
