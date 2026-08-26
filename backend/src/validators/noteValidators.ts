import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: 'Tiêu đề ghi chú là bắt buộc' })
    .trim()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không vượt quá 255 ký tự'),
  content: z
    .string({ required_error: 'Nội dung ghi chú là bắt buộc' })
    .default(''),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  tagIds: z.array(z.string().trim().min(1)).optional().default([]),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không vượt quá 255 ký tự')
    .optional(),
  content: z.string().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  tagIds: z.array(z.string().trim().min(1)).optional(),
});

export const noteQuerySchema = z.object({
  search: z.string().trim().optional(),
  pinned: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  archived: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  tagId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const noteIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Note ID không hợp lệ'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteQueryInput = z.infer<typeof noteQuerySchema>;