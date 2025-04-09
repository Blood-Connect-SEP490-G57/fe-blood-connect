import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Phone } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { isAxiosError } from 'axios'
import { forgotPassword } from '@/api/auth'

const formSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ').nonempty('Gmail không được để trống')
})

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const response = await forgotPassword(values.email)
      localStorage.setItem('email', values.email)
      toast({
        title: 'Thành công',
        description: response.message,
        variant: 'default'
      })
      navigate('/xac-thuc-otp')
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: 'Lỗi',
          description: error.response?.data?.message || 'Không thể gửi yêu cầu khôi phục mật khẩu',
          variant: 'destructive'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
            <span className='text-4xl'>🩸</span>
          </div>
        </div>

        <h2 className='mt-3 text-center text-3xl font-bold text-gray-900'>Quên Mật Khẩu</h2>
        <p className='mt-2 text-center text-sm text-gray-600'>Nhập gmail của bạn để nhận mail đặt lại mật khẩu</p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-red-100'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>Gmail</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-accent' />
                        <Input
                          {...field}
                          type='email'
                          className='appearance-none block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                          placeholder='Nhập gmail của bạn'
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500 text-sm mt-1' />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu khôi phục mật khẩu'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
