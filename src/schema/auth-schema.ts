import { z } from 'zod'

export const LoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, {
      message: 'Tên đăng nhập không được để trống'
    })
    .max(20),
  password: z
    .string()
    .trim()
    .min(1, {
      message: 'Mật khẩu không được để trống'
    })
    .max(50)
})

export type LoginType = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
  mobile: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
})

export type RegisterType = z.infer<typeof RegisterSchema>
