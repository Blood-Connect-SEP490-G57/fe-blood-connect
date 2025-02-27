import { z } from 'zod';

export const LoginSchema = z.object({
  phoneNumber: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(15, 'Số điện thoại không được quá dài')
    .regex(/^\d+$/, 'Số điện thoại chỉ chứa chữ số'),  // Only digits
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
export type LoginType = z.infer<typeof LoginSchema>

export const RegisterSchema = z
  .object({
    mobile: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  })

export type RegisterType = z.infer<typeof RegisterSchema>

