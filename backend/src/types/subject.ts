export interface SubjectRecord {
  id: string;
  user_id: string;
  semester_id: string;
  code: string;
  name: string;
  credits: number;
  target_grade: number | string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SubjectResponse {
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

export interface CreateSubjectInput {
  code: string;
  name: string;
  credits?: number;
  targetGrade?: number | null;
}

export interface UpdateSubjectInput {
  code?: string;
  name?: string;
  credits?: number;
  targetGrade?: number | null;
}