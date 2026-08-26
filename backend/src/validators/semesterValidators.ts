import { z } from 'zod';

export const createSemesterSchema = z
  .object({
    name: z
      .string({ required_error: 'Tên học kỳ là bắt buộc' })
      .trim()
      .min(1, 'Tên học kỳ không được để trống')
      .max(100, 'Tên học kỳ không vượt quá 100 ký tự'),
    academicYear: z
      .string({ required_error: 'Năm học là bắt buộc' })
      .trim()
      .min(1, 'Năm học không được để trống')
      .max(50, 'Năm học không vượt quá 50 ký tự'),
    startDate: z
      .string({ required_error: 'Ngày bắt đầu là bắt buộc' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng startDate phải là YYYY-MM-DD'),
    endDate: z
      .string({ required_error: 'Ngày kết thúc là bắt buộc' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng endDate phải là YYYY-MM-DD'),
    isCurrent: z.boolean().optional().default(false),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Ngày bắt đầu phải trước hoặc cùng ngày kết thúc',
    path: ['endDate'],
  });

export const updateSemesterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Tên học kỳ không được để trống')
      .max(100, 'Tên học kỳ không vượt quá 100 ký tự')
      .optional(),
    academicYear: z
      .string()
      .trim()
      .min(1, 'Năm học không được để trống')
      .max(50, 'Năm học không vượt quá 50 ký tự')
      .optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng startDate phải là YYYY-MM-DD')
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng endDate phải là YYYY-MM-DD')
      .optional(),
    isCurrent: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: 'Ngày bắt đầu phải trước hoặc cùng ngày kết thúc',
      path: ['endDate'],
    }
  );

export const semesterIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Semester ID không hợp lệ'),
});