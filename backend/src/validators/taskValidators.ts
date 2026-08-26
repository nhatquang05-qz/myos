import { z } from 'zod';

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
  errorMap: () => ({ message: 'Priority phải là LOW, MEDIUM, HIGH hoặc URGENT' }),
});

export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
  errorMap: () => ({ message: 'Status phải là TODO, IN_PROGRESS, COMPLETED hoặc CANCELLED' }),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Tiêu đề task là bắt buộc' })
    .trim()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không vượt quá 255 ký tự'),
  description: z.string().trim().max(5000, 'Mô tả không vượt quá 5000 ký tự').optional().nullable(),
  priority: taskPriorityEnum.default('MEDIUM'),
  status: taskStatusEnum.default('TODO'),
  dueDate: z
    .string()
    .datetime({ offset: true, message: 'Định dạng dueDate phải là ISO string hợp lệ' })
    .optional()
    .nullable(),
  tagIds: z.array(z.string().trim().min(1)).optional().default([]),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không vượt quá 255 ký tự')
    .optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  dueDate: z
    .string()
    .datetime({ offset: true, message: 'Định dạng dueDate phải là ISO string hợp lệ' })
    .optional()
    .nullable(),
  tagIds: z.array(z.string().trim().min(1)).optional(),
});

export const taskQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  search: z.string().trim().optional(),
  tagId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const taskIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Task ID không hợp lệ'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;