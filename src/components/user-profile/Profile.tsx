import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { User } from 'lucide-react'
import UserAvatar from '@/components/ui/user-avatar'

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(5, 'Địa chỉ không hợp lệ'),
  bloodType: z.string().optional()
})

const Profile = () => {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: 'Bế Minh',
      email: 'be.minh@example.com',
      phone: '0123456789',
      address: 'Hà Nội, Việt Nam',
      bloodType: 'A+'
    }
  })

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

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-8'>Hồ sơ cá nhân</h1>

        <div className='max-w-3xl mx-auto'>
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
                    name: form.getValues('fullName'),
                    image: undefined
                  }}
                  editable
                  onImageChange={handleAvatarChange}
                />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='fullName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='bloodType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhóm máu</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem className='md:col-span-2'>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
