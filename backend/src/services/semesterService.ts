import { randomUUID } from 'crypto';
import { semesterRepository, SemesterRepository } from '../repositories/semesterRepository.js';
import { SemesterResponse, SemesterRecord, CreateSemesterInput, UpdateSemesterInput } from '../types/semester.js';
import { AppError } from '../middleware/errorHandler.js';

const formatDateToString = (val: Date | string): string => {
  if (!val) return '';
  if (typeof val === 'string') return val.split('T')[0];
  const year = val.getFullYear();
  const month = String(val.getMonth() + 1).padStart(2, '0');
  const day = String(val.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export class SemesterService {
  constructor(private semesterRepo: SemesterRepository) {}

  private mapSemesterToResponse(record: SemesterRecord & { subject_count?: number; total_credits?: number }): SemesterResponse {
    return {
      id: record.id,
      userId: record.user_id,
      name: record.name,
      academicYear: record.academic_year,
      startDate: formatDateToString(record.start_date),
      endDate: formatDateToString(record.end_date),
      isCurrent: Boolean(record.is_current),
      subjectCount: Number(record.subject_count || 0),
      totalCredits: Number(record.total_credits || 0),
      createdAt: new Date(record.created_at).toISOString(),
      updatedAt: new Date(record.updated_at).toISOString(),
    };
  }

  async getSemesters(userId: string): Promise<SemesterResponse[]> {
    const records = await this.semesterRepo.findSemestersByUser(userId);
    return records.map((r) => this.mapSemesterToResponse(r));
  }

  async getSemesterById(id: string, userId: string): Promise<SemesterResponse> {
    const record = await this.semesterRepo.findSemesterByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy học kỳ hoặc bạn không có quyền truy cập', 404, 'SEMESTER_NOT_FOUND');
    }
    return this.mapSemesterToResponse(record);
  }

  async createSemester(userId: string, input: CreateSemesterInput): Promise<SemesterResponse> {
    const semesterId = randomUUID();
    await this.semesterRepo.createSemester(semesterId, userId, input);
    return this.getSemesterById(semesterId, userId);
  }

  async updateSemester(id: string, userId: string, input: UpdateSemesterInput): Promise<SemesterResponse> {
    const existing = await this.semesterRepo.findSemesterByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy học kỳ hoặc bạn không có quyền truy cập', 404, 'SEMESTER_NOT_FOUND');
    }

    const updated = await this.semesterRepo.updateSemester(id, userId, input);
    if (!updated) {
      throw new AppError('Cập nhật học kỳ thất bại', 400, 'SEMESTER_UPDATE_FAILED');
    }

    return this.getSemesterById(id, userId);
  }

  async deleteSemester(id: string, userId: string): Promise<void> {
    const deleted = await this.semesterRepo.deleteSemester(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy học kỳ hoặc bạn không có quyền truy cập', 404, 'SEMESTER_NOT_FOUND');
    }
  }
}

export const semesterService = new SemesterService(semesterRepository);