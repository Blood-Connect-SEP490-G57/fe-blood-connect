import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Mail, ArrowRight } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { isAxiosError } from 'axios'
import { forgotPassword } from '@/api/auth'
import { motion } from 'framer-motion'

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
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center pb-10 px-4 relative overflow-hidden'>
      <div className='w-full max-w-md space-y-8 z-10'>
        <motion.div 
          className='flex flex-col items-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className='mt-6 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500'>
              Quên Mật Khẩu
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Nhập gmail của bạn để nhận mail đặt lại mật khẩu
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='backdrop-blur-sm bg-white/70 py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-100'
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-gray-700'>Gmail</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <div className='absolute left-3 top-2 p-1 rounded-full bg-red-50'>
                          <Mail className='text-red-500' size={16} />
                        </div>
                        <Input
                          {...field}
                          type='email'
                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
                          placeholder='Nhập gmail của bạn'
                        />
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
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Gửi yêu cầu khôi phục mật khẩu
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
              
              <div className='mt-2 flex justify-center'>
                <motion.button
                  onClick={() => navigate('/dang-nhap')}
                  className='text-sm text-red-600 hover:text-red-500 transition-colors'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Quay lại đăng nhập
                </motion.button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword
