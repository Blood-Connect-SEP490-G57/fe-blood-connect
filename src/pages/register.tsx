import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import * as z from 'zod'
import { Loader2Icon, Lock, Mail, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterSchema, RegisterType } from '@/schema/auth-schema'
import { registerUser } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Register() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const { mutate: register, isLoading } = useMutation((data: RegisterType) => registerUser(data), {
    onSuccess: (response) => {
      toast({
        title: 'Đăng ký thành công',
        description: response.data.message,
        variant: 'default'
      })
      setTimeout(() => {
        navigate('/hoan-thanh-dang-ky')
      }, 2000)
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

  const onSubmit = (data: RegisterType) => {
    localStorage.setItem('email', data.email)
    register(data)
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12 flex flex-col justify-center relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      {/* Back button */}
      <motion.button
        onClick={() => navigate('/dang-nhap')}
        className='absolute top-8 left-8 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 text-gray-600 hover:text-red-600 transition-all'
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      
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
            Đăng Ký
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Chào mừng bạn đến với <span className='font-semibold text-red-600'>Giọt Máu Hy Vọng</span>
          </p>
        </motion.div>
      </div>

      <motion.div 
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className='bg-white/70 backdrop-blur-sm py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-100'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-gray-700'>
                      Email<span className='text-red-500 ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <div className='absolute left-3 top-3 p-1 rounded-full bg-red-50'>
                          <Mail className='text-red-500' size={16} />
                        </div>
                        <Input
                          {...field}
                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
                          placeholder='Nhập email'
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
                          type={showPassword ? 'text' : 'password'}
                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
                          placeholder='Nhập mật khẩu'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none'
                        >
                          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500 text-sm mt-1' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-gray-700'>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <div className='absolute left-3 top-3 p-1 rounded-full bg-red-50'>
                          <Lock className='text-red-500' size={16} />
                        </div>
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
                          placeholder='Xác nhận mật khẩu'
                        />
                        <button
                          type='button'
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className='absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none'
                        >
                          {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500 text-sm mt-1' />
                  </FormItem>
                )}
              />

              <motion.div 
                className='pt-2'
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
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
                      Đăng ký
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600 mb-3'>
              Đã có tài khoản?
            </p>
            <motion.button 
              onClick={() => navigate('/dang-nhap')}
              className='inline-flex items-center justify-center py-2 px-6 border border-red-100 rounded-full text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Đăng nhập ngay
              <ArrowRight className='ml-1 h-4 w-4' />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
