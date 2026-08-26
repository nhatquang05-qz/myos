import api from './api';
import { ApiResponse } from '../types/api';
import { Semester, CreateSemesterRequest, UpdateSemesterRequest } from '../types/semester';

export const semesterApi = {
  async getSemesters(): Promise<Semester[]> {
    const res = await api.get<ApiResponse<{ semesters: Semester[] }>>('/semesters');
    return res.data.data!.semesters;
  },

  async getSemester(id: string): Promise<Semester> {
    const res = await api.get<ApiResponse<{ semester: Semester }>>(`/semesters/${id}`);
    return res.data.data!.semester;
  },

  async createSemester(data: CreateSemesterRequest): Promise<Semester> {
    const res = await api.post<ApiResponse<{ semester: Semester }>>('/semesters', data);
    return res.data.data!.semester;
  },

  async updateSemester(id: string, data: UpdateSemesterRequest): Promise<Semester> {
    const res = await api.patch<ApiResponse<{ semester: Semester }>>(`/semesters/${id}`, data);
    return res.data.data!.semester;
  },

  async deleteSemester(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/semesters/${id}`);
  },
};