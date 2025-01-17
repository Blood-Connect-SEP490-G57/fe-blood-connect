'use client'

import { loginUser } from '@/api/auth'
import { LoginSchema, LoginType } from '@/schema/auth-schema'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

export default function Login() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { mutate: login, isLoading } = useMutation((data: LoginType) => loginUser(data), {
    onSuccess: (res) => {
      localStorage.clear()
      localStorage.setItem('access_token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)
      document.cookie = 'roles=' + res.roles + ';path=/'
      navigate('/')
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

  return (
    <div className='container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='flex min-h-screen flex-col items-center justify-center'>
        {/* Title and logo */}
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-10 text-center text-3xl font-semibold leading-10 text-slate-800'>
            Đăng Nhập
          </h2>
        </div>

        {/* Form */}
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-md'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder='abc1234' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input placeholder='*********' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type='submit'>
                {isLoading && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
                Đăng nhập
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
