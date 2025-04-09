import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lock, ArrowRight, ChevronLeft } from 'lucide-react'
import { resetPassword } from '@/api/auth'
import { motion } from 'framer-motion'

// Validation schema using Zod
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .max(50, 'Mật khẩu không quá 50 ký tự')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất một chữ cái thường') // At least one lowercase letter
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ cái in hoa') // At least one uppercase letter
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất một chữ số') // At least one digit
      .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất một ký tự đặc biệt') // At least one special character
      .trim(),
    confirmPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(50, 'Mật khẩu không quá 50 ký tự').trim()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

export default function ResetPassword() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    try {
      const resetToken = localStorage.getItem('resetToken')
      const email = localStorage.getItem('email')
      if (!resetToken || !email) {
        toast({
          title: 'Lỗi',
          description: 'Không tìm thấy mã xác nhận hoặc email. Vui lòng thử lại.',
          variant: 'destructive'
        })
        return
      }
      // Call your API to reset the password
      const response = await resetPassword(email, resetToken, data.newPassword, data.confirmPassword)
      toast({
        title: 'Thành công',
        description: response.message,
        variant: 'default'
      })
      localStorage.clear() // Clear local storage
      setTimeout(() => {
        navigate('/dang-nhap')
      }, 2000)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: (error as Error).message || 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-20 right-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      <div className='absolute bottom-20 left-10 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30 -z-10'></div>
      
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className='absolute top-8 left-8 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 text-gray-600 hover:text-red-600 transition-all'
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      
      <div className='w-full max-w-md space-y-8 z-10'>
        <motion.div 
          className='flex flex-col items-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg'>
            <span className='text-4xl'>🩸</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2 className='mt-6 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500'>
              Đặt lại mật khẩu
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              Tạo mật khẩu mới cho tài khoản của bạn
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
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-gray-700'>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <div className='absolute left-3 top-3 p-1 rounded-full bg-red-50'>
                          <Lock className='text-red-500' size={16} />
                        </div>
                        <Input
                          {...field}
                          type='password'
                          className='appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all'
                          placeholder='Nhập mật khẩu mới'
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
                          type='password'
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
                  disabled={form.formState.isSubmitting}
                  className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all'
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Đặt lại mật khẩu
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
              
              <div className="pt-2">
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">Mật khẩu phải có:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ít nhất 8 ký tự</li>
                    <li>Ít nhất một chữ cái thường (a-z)</li>
                    <li>Ít nhất một chữ cái in hoa (A-Z)</li>
                    <li>Ít nhất một chữ số (0-9)</li>
                    <li>Ít nhất một ký tự đặc biệt (@$!%*?&)</li>
                  </ul>
                </div>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  )
}
