import { z } from 'zod';

export const LoginSchema = z.object({
  phoneNumber: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(15, 'Số điện thoại không được quá dài')
    .regex(/^\d+$/, 'Số điện thoại chỉ chứa chữ số'),  // Only digits
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  mobile: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(15, 'Số điện thoại quá dài')
    .regex(/^\d+$/, 'Số điện thoại chỉ chứa chữ số'),  // Only digits
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số'), // At least 1 letter and 1 number
  confirmPassword: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  username: z.string()
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(20, 'Tên người dùng quá dài'),
  email: z.string().email('Email không hợp lệ'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    });
  }
});

export type RegisterType = z.infer<typeof RegisterSchema>;
