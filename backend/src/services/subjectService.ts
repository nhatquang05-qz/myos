import { randomUUID } from 'crypto';
import { subjectRepository, SubjectRepository } from '../repositories/subjectRepository.js';
import { semesterRepository, SemesterRepository } from '../repositories/semesterRepository.js';
import { SubjectResponse, SubjectRecord, CreateSubjectInput, UpdateSubjectInput } from '../types/subject.js';
import { AppError } from '../middleware/errorHandler.js';

export class SubjectService {
  constructor(
    private subjectRepo: SubjectRepository,
    private semesterRepo: SemesterRepository
  ) {}

  private mapSubjectToResponse(record: SubjectRecord): SubjectResponse {
    return {
      id: record.id,
      userId: record.user_id,
      semesterId: record.semester_id,
      code: record.code,
      name: record.name,
      credits: Number(record.credits),
      targetGrade: record.target_grade !== null ? Number(record.target_grade) : null,
      createdAt: new Date(record.created_at).toISOString(),
      updatedAt: new Date(record.updated_at).toISOString(),
    };
  }

  async getSubjectsBySemester(semesterId: string, userId: string): Promise<SubjectResponse[]> {
    const semester = await this.semesterRepo.findSemesterByIdAndUser(semesterId, userId);
    if (!semester) {
      throw new AppError('Không tìm thấy học kỳ hoặc bạn không có quyền truy cập', 404, 'SEMESTER_NOT_FOUND');
    }

    const records = await this.subjectRepo.findSubjectsBySemesterAndUser(semesterId, userId);
    return records.map((r) => this.mapSubjectToResponse(r));
  }

  async getSubjectById(id: string, userId: string): Promise<SubjectResponse> {
    const record = await this.subjectRepo.findSubjectByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy môn học hoặc bạn không có quyền truy cập', 404, 'SUBJECT_NOT_FOUND');
    }
    return this.mapSubjectToResponse(record);
  }

  async createSubject(semesterId: string, userId: string, input: CreateSubjectInput): Promise<SubjectResponse> {
    const semester = await this.semesterRepo.findSemesterByIdAndUser(semesterId, userId);
    if (!semester) {
      throw new AppError('Không tìm thấy học kỳ hoặc bạn không có quyền truy cập', 404, 'SEMESTER_NOT_FOUND');
    }

    const existingCode = await this.subjectRepo.findSubjectByCodeInSemester(input.code, semesterId, userId);
    if (existingCode) {
      throw new AppError(`Mã môn học '${input.code}' đã tồn tại trong học kỳ này`, 409, 'SUBJECT_CODE_ALREADY_EXISTS');
    }

    const subjectId = randomUUID();
    await this.subjectRepo.createSubject(subjectId, userId, semesterId, input);

    return this.getSubjectById(subjectId, userId);
  }

  async updateSubject(id: string, userId: string, input: UpdateSubjectInput): Promise<SubjectResponse> {
    const existing = await this.subjectRepo.findSubjectByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy môn học hoặc bạn không có quyền truy cập', 404, 'SUBJECT_NOT_FOUND');
    }

    if (input.code && input.code !== existing.code) {
      const codeConflict = await this.subjectRepo.findSubjectByCodeInSemester(input.code, existing.semester_id, userId);
      if (codeConflict && codeConflict.id !== id) {
        throw new AppError(`Mã môn học '${input.code}' đã tồn tại trong học kỳ này`, 409, 'SUBJECT_CODE_ALREADY_EXISTS');
      }
    }

    const updated = await this.subjectRepo.updateSubject(id, userId, input);
    if (!updated) {
      throw new AppError('Cập nhật môn học thất bại', 400, 'SUBJECT_UPDATE_FAILED');
    }

    return this.getSubjectById(id, userId);
  }

  async deleteSubject(id: string, userId: string): Promise<void> {
    const deleted = await this.subjectRepo.deleteSubject(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy môn học hoặc bạn không có quyền truy cập', 404, 'SUBJECT_NOT_FOUND');
    }
  }
}

export const subjectService = new SubjectService(subjectRepository, semesterRepository);