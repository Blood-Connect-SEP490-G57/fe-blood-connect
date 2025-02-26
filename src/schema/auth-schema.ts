import { z } from 'zod'

export const LoginSchema = z.object({
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})
export type LoginType = z.infer<typeof LoginSchema>

export const RegisterSchema = z
  .object({
    mobile: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    email: z.string().email('Email không hợp lệ')  // Add email validation
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  })

export type RegisterType = z.infer<typeof RegisterSchema>

