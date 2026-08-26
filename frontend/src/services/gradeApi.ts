import api from './api';
import { ApiResponse } from '../types/api';
import {
  Grade,
  CreateGradeRequest,
  UpdateGradeRequest,
  SubjectGradeSummary,
  SemesterGpaSummary,
  CumulativeGpaSummary,
} from '../types/grade';

export const gradeApi = {
  async getGradesBySubject(subjectId: string): Promise<Grade[]> {
    const res = await api.get<ApiResponse<{ grades: Grade[] }>>(`/subjects/${subjectId}/grades`);
    return res.data.data!.grades;
  },

  async getGrade(id: string): Promise<Grade> {
    const res = await api.get<ApiResponse<{ grade: Grade }>>(`/grades/${id}`);
    return res.data.data!.grade;
  },

  async createGrade(subjectId: string, data: CreateGradeRequest): Promise<Grade> {
    const res = await api.post<ApiResponse<{ grade: Grade }>>(`/subjects/${subjectId}/grades`, data);
    return res.data.data!.grade;
  },

  async updateGrade(id: string, data: UpdateGradeRequest): Promise<Grade> {
    const res = await api.patch<ApiResponse<{ grade: Grade }>>(`/grades/${id}`, data);
    return res.data.data!.grade;
  },

  async deleteGrade(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/grades/${id}`);
  },

  async getSubjectSummary(subjectId: string): Promise<SubjectGradeSummary> {
    const res = await api.get<ApiResponse<{ subjectSummary: SubjectGradeSummary }>>(`/gpa/subjects/${subjectId}`);
    return res.data.data!.subjectSummary;
  },

  async getSemesterGpa(semesterId: string): Promise<SemesterGpaSummary> {
    const res = await api.get<ApiResponse<{ gpaSummary: SemesterGpaSummary }>>(`/gpa/semesters/${semesterId}`);
    return res.data.data!.gpaSummary;
  },

  async getCumulativeGpa(): Promise<CumulativeGpaSummary> {
    const res = await api.get<ApiResponse<{ cumulativeGpa: CumulativeGpaSummary }>>('/gpa/cumulative');
    return res.data.data!.cumulativeGpa;
  },
};