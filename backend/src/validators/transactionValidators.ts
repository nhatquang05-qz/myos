import { z } from 'zod';

export const transactionTypeEnum = z.enum(['INCOME', 'EXPENSE'], {
  errorMap: () => ({ message: 'Loại giao dịch phải là INCOME hoặc EXPENSE' }),
});

export const createTransactionSchema = z.object({
  type: transactionTypeEnum,
  category: z
    .string({ required_error: 'Danh mục giao dịch là bắt buộc' })
    .trim()
    .min(1, 'Danh mục không được để trống')
    .max(100, 'Danh mục không được vượt quá 100 ký tự'),
  amount: z
    .number({ required_error: 'Số tiền là bắt buộc' })
    .positive('Số tiền phải lớn hơn 0')
    .max(9999999999999.99, 'Số tiền vượt quá giới hạn cho phép')
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Số tiền chỉ được có tối đa 2 chữ số thập phân',
    }),
  description: z.string().trim().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional().nullable(),
  transactionDate: z
    .string({ required_error: 'Ngày giao dịch là bắt buộc' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày giao dịch phải là YYYY-MM-DD'),
});

export const updateTransactionSchema = z.object({
  type: transactionTypeEnum.optional(),
  category: z.string().trim().min(1).max(100).optional(),
  amount: z
    .number()
    .positive('Số tiền phải lớn hơn 0')
    .max(9999999999999.99)
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Số tiền chỉ được có tối đa 2 chữ số thập phân',
    })
    .optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày giao dịch phải là YYYY-MM-DD')
    .optional(),
});

export const transactionQuerySchema = z.object({
  type: transactionTypeEnum.optional(),
  category: z.string().trim().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from phải có định dạng YYYY-MM-DD').optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'to phải có định dạng YYYY-MM-DD').optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const transactionSummaryQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from phải có định dạng YYYY-MM-DD').optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'to phải có định dạng YYYY-MM-DD').optional(),
});

export const transactionIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Transaction ID không hợp lệ'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
export type TransactionSummaryQueryInput = z.infer<typeof transactionSummaryQuerySchema>;