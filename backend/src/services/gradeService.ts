import { randomUUID } from 'crypto';
import { gradeRepository, GradeRepository } from '../repositories/gradeRepository.js';
import { subjectRepository, SubjectRepository } from '../repositories/subjectRepository.js';
import { gpaService, GpaService } from './gpaService.js';
import { CreateGradeInput, UpdateGradeInput, GradeResponse, GradeRecord } from '../types/grade.js';
import { AppError } from '../middleware/errorHandler.js';

export class GradeService {
  constructor(
    private gradeRepo: GradeRepository,
    private subjectRepo: SubjectRepository,
    private gpaEngine: GpaService
  ) {}

  private mapGradeToResponse(record: GradeRecord): GradeResponse {
    return {
      id: record.id,
      userId: record.user_id,
      subjectId: record.subject_id,
      componentName: record.component_name,
      weight: Number(record.weight),
      score: Number(record.score),
      gradePoint: Number(record.grade_point),
      createdAt: new Date(record.created_at).toISOString(),
      updatedAt: new Date(record.updated_at).toISOString(),
    };
  }

  async getGradesBySubject(subjectId: string, userId: string): Promise<GradeResponse[]> {
    const subject = await this.subjectRepo.findSubjectByIdAndUser(subjectId, userId);
    if (!subject) {
      throw new AppError('Không tìm thấy môn học hoặc bạn không có quyền truy cập', 404, 'SUBJECT_NOT_FOUND');
    }

    const records = await this.gradeRepo.findGradesBySubjectAndUser(subjectId, userId);
    return records.map((r) => this.mapGradeToResponse(r));
  }

  async getGradeById(id: string, userId: string): Promise<GradeResponse> {
    const record = await this.gradeRepo.findGradeByIdAndUser(id, userId);
    if (!record) {
      throw new AppError('Không tìm thấy điểm thành phần hoặc bạn không có quyền truy cập', 404, 'GRADE_NOT_FOUND');
    }
    return this.mapGradeToResponse(record);
  }

  async createGrade(subjectId: string, userId: string, input: CreateGradeInput): Promise<GradeResponse> {
    const subject = await this.subjectRepo.findSubjectByIdAndUser(subjectId, userId);
    if (!subject) {
      throw new AppError('Không tìm thấy môn học hoặc bạn không có quyền truy cập', 404, 'SUBJECT_NOT_FOUND');
    }

    const existingGrades = await this.gradeRepo.findGradesBySubjectAndUser(subjectId, userId);
    const currentTotalWeight = existingGrades.reduce((sum, g) => sum + Number(g.weight), 0);

    if (currentTotalWeight + input.weight > 100.001) {
      throw new AppError(
        `Tổng trọng số các cột điểm không được vượt quá 100%. Hiện tại: ${currentTotalWeight}%, thêm: ${input.weight}%`,
        400,
        'WEIGHT_EXCEEDS_LIMIT'
      );
    }

    const gradePoint = input.score;
    const gradeId = randomUUID();

    await this.gradeRepo.createGrade(gradeId, userId, subjectId, input, gradePoint);
    return this.getGradeById(gradeId, userId);
  }

  async updateGrade(id: string, userId: string, input: UpdateGradeInput): Promise<GradeResponse> {
    const existing = await this.gradeRepo.findGradeByIdAndUser(id, userId);
    if (!existing) {
      throw new AppError('Không tìm thấy điểm thành phần hoặc bạn không có quyền truy cập', 404, 'GRADE_NOT_FOUND');
    }

    if (input.weight !== undefined) {
      const otherGrades = (await this.gradeRepo.findGradesBySubjectAndUser(existing.subject_id, userId)).filter(
        (g) => g.id !== id
      );
      const otherTotalWeight = otherGrades.reduce((sum, g) => sum + Number(g.weight), 0);

      if (otherTotalWeight + input.weight > 100.001) {
        throw new AppError(
          `Tổng trọng số các cột điểm không được vượt quá 100%. Các cột khác: ${otherTotalWeight}%, sửa thành: ${input.weight}%`,
          400,
          'WEIGHT_EXCEEDS_LIMIT'
        );
      }
    }

    const targetScore = input.score !== undefined ? input.score : Number(existing.score);
    const gradePoint = targetScore;

    const updated = await this.gradeRepo.updateGrade(id, userId, {
      componentName: input.componentName,
      weight: input.weight,
      score: input.score,
      gradePoint,
    });

    if (!updated) {
      throw new AppError('Cập nhật điểm số thất bại', 400, 'GRADE_UPDATE_FAILED');
    }

    return this.getGradeById(id, userId);
  }

  async deleteGrade(id: string, userId: string): Promise<void> {
    const deleted = await this.gradeRepo.deleteGrade(id, userId);
    if (!deleted) {
      throw new AppError('Không tìm thấy điểm thành phần hoặc bạn không có quyền truy cập', 404, 'GRADE_NOT_FOUND');
    }
  }
}

export const gradeService = new GradeService(gradeRepository, subjectRepository, gpaService);