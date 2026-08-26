export interface Subject {
  id: string;
  userId: string;
  semesterId: string;
  code: string;
  name: string;
  credits: number;
  targetGrade: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  code: string;
  name: string;
  credits?: number;
  targetGrade?: number | null;
}

export interface UpdateSubjectRequest {
  code?: string;
  name?: string;
  credits?: number;
  targetGrade?: number | null;
}