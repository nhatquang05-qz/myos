import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Họ và tên là bắt buộc' })
    .trim()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(100, 'Tên không được vượt quá 100 ký tự'),
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .trim()
    .toLowerCase()
    .email('Định dạng email không hợp lệ')
    .max(191, 'Email không được vượt quá 191 ký tự'),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .trim()
    .toLowerCase()
    .email('Định dạng email không hợp lệ'),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(1, 'Mật khẩu không được để trống'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;