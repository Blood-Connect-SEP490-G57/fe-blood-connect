import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import * as z from 'zod'
import { Loader2Icon, Lock, ArrowRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginSchema, LoginType } from '@/schema/auth-schema'
import { loginUser } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuth } from '@/components/authContext/AuthContext'
import { motion } from 'framer-motion'

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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col py-12 sm:px-6 lg:px-8 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div 
          className='flex justify-center mb-8'
        >
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className='mt-3 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500'>
            Đăng Nhập
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Chào mừng bạn trở lại với <span className='font-semibold text-red-600'>Giọt Máu Hi Vọng</span>
          </p>
        </motion.div>
      </div>

      <motion.div 
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className='bg-white/70 backdrop-blur-sm py-8 px-6 sm:shadow-xl rounded-3xl sm:px-10 border border-gray-100'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-gray-700'>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <div className='absolute left-3 top-3 p-1 rounded-full bg-red-50'>
                          <User className='text-red-500' size={16} />
                        </div>
                        <Input
                          {...field}

                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
                          placeholder='Nhập tên đăng nhập'
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
                    <FormLabel className='text-sm font-medium text-gray-700'>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <div className='absolute left-3 top-3 p-1 rounded-full bg-red-50'>
                          <Lock className='text-red-500' size={16} />
                        </div>
                        <Input
                          {...field}
                          type='password'
                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
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
                  <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                    <input 
                      type='checkbox' 
                      id='remember-me' 
                      name='remember-me'
                      className='absolute block w-5 h-5 bg-white border-2 border-gray-300 rounded-md appearance-none cursor-pointer checked:bg-red-500 checked:border-red-500'
                    />
                    <label 
                      htmlFor='remember-me'
                      className='block overflow-hidden h-5 rounded-md cursor-pointer'
                    ></label>
                  </div>
                  <label htmlFor='remember-me' className='text-sm text-gray-700 cursor-pointer'>
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className='text-sm'>
                  <a href='/quen-mat-khau' className='font-medium text-red-600 hover:text-red-500 transition-colors'>
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all'
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className='animate-spin -ml-1 mr-2 h-4 w-4' />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Đăng nhập
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600 mb-3'>
              Chưa có tài khoản?
            </p>
            <motion.button 
              onClick={handleRegisterClick}
              className='inline-flex items-center justify-center py-2 px-6 border border-red-100 rounded-full text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Đăng ký ngay
              <ArrowRight className='ml-1 h-4 w-4' />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
