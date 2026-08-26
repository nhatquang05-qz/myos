import api from './api';
import { ApiResponse } from '../types/api';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject';

export const subjectApi = {
  async getSubjectsBySemester(semesterId: string): Promise<Subject[]> {
    const res = await api.get<ApiResponse<{ subjects: Subject[] }>>(`/semesters/${semesterId}/subjects`);
    return res.data.data!.subjects;
  },

  async getSubject(id: string): Promise<Subject> {
    const res = await api.get<ApiResponse<{ subject: Subject }>>(`/subjects/${id}`);
    return res.data.data!.subject;
  },

  async createSubject(semesterId: string, data: CreateSubjectRequest): Promise<Subject> {
    const res = await api.post<ApiResponse<{ subject: Subject }>>(`/semesters/${semesterId}/subjects`, data);
    return res.data.data!.subject;
  },

  async updateSubject(id: string, data: UpdateSubjectRequest): Promise<Subject> {
    const res = await api.patch<ApiResponse<{ subject: Subject }>>(`/subjects/${id}`, data);
    return res.data.data!.subject;
  },

  async deleteSubject(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/subjects/${id}`);
  },
};