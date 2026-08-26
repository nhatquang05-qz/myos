import { z } from 'zod';

export const createSubjectSchema = z.object({
  code: z
    .string({ required_error: 'Mã môn học là bắt buộc' })
    .trim()
    .min(1, 'Mã môn học không được để trống')
    .max(50, 'Mã môn học không vượt quá 50 ký tự')
    .toUpperCase(),
  name: z
    .string({ required_error: 'Tên môn học là bắt buộc' })
    .trim()
    .min(1, 'Tên môn học không được để trống')
    .max(150, 'Tên môn học không vượt quá 150 ký tự'),
  credits: z
    .number()
    .int('Số tín chỉ phải là số nguyên')
    .min(1, 'Số tín chỉ tối thiểu là 1')
    .max(20, 'Số tín chỉ tối đa là 20')
    .optional()
    .default(3),
  targetGrade: z
    .number()
    .min(0, 'Điểm mục tiêu không được nhỏ hơn 0')
    .max(10, 'Điểm mục tiêu không được lớn hơn 10')
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Điểm mục tiêu chỉ được có tối đa 2 chữ số thập phân',
    })
    .optional()
    .nullable(),
});

export const updateSubjectSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Mã môn học không được để trống')
    .max(50, 'Mã môn học không vượt quá 50 ký tự')
    .toUpperCase()
    .optional(),
  name: z
    .string()
    .trim()
    .min(1, 'Tên môn học không được để trống')
    .max(150, 'Tên môn học không vượt quá 150 ký tự')
    .optional(),
  credits: z
    .number()
    .int('Số tín chỉ phải là số nguyên')
    .min(1, 'Số tín chỉ tối thiểu là 1')
    .max(20, 'Số tín chỉ tối đa là 20')
    .optional(),
  targetGrade: z
    .number()
    .min(0, 'Điểm mục tiêu không được nhỏ hơn 0')
    .max(10, 'Điểm mục tiêu không được lớn hơn 10')
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Điểm mục tiêu chỉ được có tối đa 2 chữ số thập phân',
    })
    .optional()
    .nullable(),
});

export const semesterSubjectParamSchema = z.object({
  semesterId: z.string().trim().min(1, 'Semester ID không hợp lệ'),
});

export const subjectIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Subject ID không hợp lệ'),
});