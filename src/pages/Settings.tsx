import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { changePassword } from '@/api/auth'
import { ChangePasswordSchema } from '@/schema/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { isAxiosError } from 'axios'
import { useState } from 'react'

const Settings = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const onChangePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })

      toast({
        title: 'Thành công',
        description: response.data.message,
        variant: 'default'
      })

      setIsChangingPassword(false)
      passwordForm.reset()
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: 'Lỗi',
          description: error.response?.data?.message || 'Đổi mật khẩu thất bại',
          variant: 'destructive'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12 overflow-hidden'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-red-600 flex items-center gap-2'>
                <Shield className='w-5 h-5' />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4 '>
                <Separator />
                <div>
                  <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogTrigger asChild>
                      <Button variant='outline' className='w-full border-red-600 text-red-600 hover:bg-red-50'>
                        <Lock className='w-4 h-4 mr-2' />
                        Đổi mật khẩu
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                        <DialogDescription>Vui lòng nhập mật khẩu cũ và mật khẩu mới</DialogDescription>
                      </DialogHeader>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className='space-y-4'>
                          <FormField
                            control={passwordForm.control}
                            name='oldPassword'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mật khẩu hiện tại</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input {...field} type={showOldPassword ? 'text' : 'password'} />
                                    <button
                                      type='button'
                                      onClick={() => setShowOldPassword(!showOldPassword)}
                                      className='absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none'
                                    >
                                      {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name='newPassword'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input {...field} type={showPassword ? 'text' : 'password'} />
                                    <button
                                      type='button'
                                      onClick={() => setShowPassword(!showPassword)}
                                      className='absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none'
                                    >
                                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name='confirmNewPassword'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input {...field} type={showConfirmPassword ? 'text' : 'password'} />
                                    <button
                                      type='button'
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className='absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none'
                                    >
                                      {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button variant='outline' onClick={() => setIsChangingPassword(false)}>
                              Hủy
                            </Button>
                            <Button
                              type='submit'
                              className='bg-red-600 text-white hover:bg-red-700'
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
