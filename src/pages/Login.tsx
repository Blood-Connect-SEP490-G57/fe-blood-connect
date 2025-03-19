import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import * as z from 'zod'
import { Loader2Icon, Phone, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginSchema, LoginType } from '@/schema/auth-schema'
import { loginUser } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuth } from '@/components/authContext/AuthContext'

export default function Login() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { setIsLoggedIn } = useAuth()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const { mutate: login, isLoading } = useMutation((data: LoginType) => loginUser(data), {
    onSuccess: (res) => {
      localStorage.clear()
      localStorage.setItem('access_token', res.accessToken)
      localStorage.setItem('refresh_token', res.refreshToken)
      setIsLoggedIn(true)
      // document.cookie = 'roles=' + res.roles + ';path=/'
      const redirectTo = new URLSearchParams(location.search).get('redirect') || '/'

      // Chuyển hướng sau khi đăng nhập thành công
      navigate(redirectTo)
    },
    onError: (error: Error) => {
      if (isAxiosError(error)) {
        toast({
          variant: 'destructive',
          title: 'Đã có lỗi xảy ra',
          description: error.response?.data?.message
        })
      }
    }
  })

  const onSubmit = (data: LoginType) => {
    login(data)
  }

  const handleRegisterClick = () => {
    navigate('/dang-ky')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
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
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>Số điện thoại</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <Phone className='absolute left-3 top-3 text-accent' size={18} />
                        <Input
                          {...field}
                          className='appearance-none block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
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
                        <Lock className='absolute left-3 top-3 text-accent' size={18} />
                        <Input
                          {...field}
                          type='password'
                          className='appearance-none block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
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
