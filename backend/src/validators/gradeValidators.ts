import { z } from 'zod';

export const createGradeSchema = z.object({
  componentName: z
    .string({ required_error: 'Tên thành phần điểm là bắt buộc' })
    .trim()
    .min(1, 'Tên thành phần điểm không được để trống')
    .max(100, 'Tên thành phần điểm không vượt quá 100 ký tự'),
  weight: z
    .number({ required_error: 'Trọng số điểm (%) là bắt buộc' })
    .min(0.01, 'Trọng số điểm tối thiểu là 0.01%')
    .max(100.0, 'Trọng số điểm tối đa là 100%'),
  score: z
    .number({ required_error: 'Điểm số là bắt buộc' })
    .min(0.0, 'Điểm số không được nhỏ hơn 0')
    .max(10.0, 'Điểm số không được lớn hơn 10'),
});

export const updateGradeSchema = z.object({
  componentName: z
    .string()
    .trim()
    .min(1, 'Tên thành phần điểm không được để trống')
    .max(100, 'Tên thành phần điểm không vượt quá 100 ký tự')
    .optional(),
  weight: z
    .number()
    .min(0.01, 'Trọng số điểm tối thiểu là 0.01%')
    .max(100.0, 'Trọng số điểm tối đa là 100%')
    .optional(),
  score: z
    .number()
    .min(0.0, 'Điểm số không được nhỏ hơn 0')
    .max(10.0, 'Điểm số không được lớn hơn 10')
    .optional(),
});

export const subjectIdParamSchema = z.object({
  subjectId: z.string().trim().min(1, 'Subject ID không hợp lệ'),
});

export const gradeIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Grade ID không hợp lệ'),
});

export const semesterIdParamSchema = z.object({
  semesterId: z.string().trim().min(1, 'Semester ID không hợp lệ'),
});

export type CreateGradeInput = z.infer<typeof createGradeSchema>;
export type UpdateGradeInput = z.infer<typeof updateGradeSchema>;