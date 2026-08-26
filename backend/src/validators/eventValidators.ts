import { z } from 'zod';

export const createEventSchema = z
  .object({
    title: z
      .string({ required_error: 'Tiêu đề sự kiện là bắt buộc' })
      .trim()
      .min(1, 'Tiêu đề không được để trống')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    description: z.string().trim().max(5000, 'Mô tả không được vượt quá 5000 ký tự').optional().nullable(),
    startAt: z.string({ required_error: 'Thời gian bắt đầu là bắt buộc' }).datetime({ offset: true, message: 'startAt phải là ISO datetime hợp lệ' }),
    endAt: z.string({ required_error: 'Thời gian kết thúc là bắt buộc' }).datetime({ offset: true, message: 'endAt phải là ISO datetime hợp lệ' }),
    location: z.string().trim().max(255, 'Địa điểm không được vượt quá 255 ký tự').optional().nullable(),
  })
  .refine((data) => new Date(data.startAt) < new Date(data.endAt), {
    message: 'Thời gian bắt đầu phải trước thời gian kết thúc',
    path: ['endAt'],
  });

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Tiêu đề không được để trống')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự')
      .optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    startAt: z.string().datetime({ offset: true, message: 'startAt phải là ISO datetime hợp lệ' }).optional(),
    endAt: z.string().datetime({ offset: true, message: 'endAt phải là ISO datetime hợp lệ' }).optional(),
    location: z.string().trim().max(255).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return new Date(data.startAt) < new Date(data.endAt);
      }
      return true;
    },
    {
      message: 'Thời gian bắt đầu phải trước thời gian kết thúc',
      path: ['endAt'],
    }
  );

export const eventQuerySchema = z.object({
  from: z.string().datetime({ offset: true, message: 'from phải là ISO datetime hợp lệ' }).optional(),
  to: z.string().datetime({ offset: true, message: 'to phải là ISO datetime hợp lệ' }).optional(),
  search: z.string().trim().optional(),
});

export const eventIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Event ID không hợp lệ'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQueryInput = z.infer<typeof eventQuerySchema>;