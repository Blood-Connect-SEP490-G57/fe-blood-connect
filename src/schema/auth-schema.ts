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
