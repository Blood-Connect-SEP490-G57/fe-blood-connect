import { z } from 'zod'

export const LoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, {
      message: 'Tên đăng nhập không được để trống'
    })
    .max(50),

  password: z
    .string()
    .trim()
    .min(1, {
      message: 'Mật khẩu không được để trống'
    })
    .max(50)
})

export type LoginType = z.infer<typeof LoginSchema>

export const RegisterSchema = z
  .object({
    email: z.string().trim().email('Email không hợp lệ').min(1, 'Email không được để trống').max(50, 'Email không quá 50 ký tự'),
    username: z.string().trim().min(1, 'Tên đăng nhập không được để trống').max(50, 'Tên đăng nhập không quá 50 ký tự'),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

export type RegisterType = z.infer<typeof RegisterSchema>

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .max(50, 'Mật khẩu không quá 50 ký tự')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất một chữ cái thường')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ cái in hoa')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất một chữ số')
      .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất một ký tự đặc biệt'),
    confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới')
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmNewPassword']
  })
