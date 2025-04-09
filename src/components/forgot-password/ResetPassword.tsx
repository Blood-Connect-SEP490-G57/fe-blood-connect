import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lock, Loader2Icon, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '@/api/auth'
import { useState } from 'react'

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
    <div className='min-h-screen bg-gray-100 flex flex-col py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
            <span className='text-4xl'>🩸</span>
          </div>
        </div>

        <h2 className='mt-3 text-center text-3xl font-bold text-gray-900'>Đặt lại mật khẩu</h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Chào mừng bạn trở lại với <span className='font-semibold text-red-600'>Giọt Máu Hy Vọng</span>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-red-100'>
          <div className='text-left text-sm mb-4'>
            <button onClick={() => navigate(-1)} className='w-full text-start text-sm text-red-600 hover:underline'>
              ← Quay lại
            </button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='block text-sm font-medium text-gray-700'>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <Lock className='absolute left-3 top-3 text-accent' size={18} />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          className='appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
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
                    <FormLabel className='block text-sm font-medium text-gray-700'>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className='mt-1 relative'>
                        <Lock className='absolute left-3 top-3 text-accent' size={18} />
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className='appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500'
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

              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2Icon className='animate-spin -ml-1 mr-2 h-4 w-4' />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
