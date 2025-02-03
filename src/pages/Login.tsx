'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      password: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    // Xử lý đăng nhập ở đây
    console.log(values)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const handleRegisterClick = () => {
    navigate('/register')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-red-600 rounded-full flex items-center justify-center'>
            <span className='text-4xl'>🩸</span>
          </div>
        </div>

        <h2 className='mt-3 text-center text-3xl font-extrabold text-gray-900'>Đăng Nhập</h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Chào mừng bạn trở lại với <span className='font-semibold text-red-600'>Giọt Máu Hi Vọng</span>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-red-100'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>Số điện thoại</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <Input
                          {...field}
                          className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                          placeholder='Nhập số điện thoại'
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500 text-sm mt-1' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <Input
                          {...field}
                          type='password'
                          className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
                          placeholder='Nhập mật khẩu'
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500 text-sm mt-1' />
                  </FormItem>
                )}
              />

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className='text-sm'>
                  <a href='/forgot-password' className='font-medium text-red-600 hover:text-red-500'>
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className='animate-spin -ml-1 mr-2 h-4 w-4' />
                      Đang xử lý...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <p className='mt-8 text-center text-sm text-gray-600'>
            Chưa có tài khoản?{' '}
            <button onClick={handleRegisterClick} className='font-medium text-red-600 hover:text-red-500'>
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
