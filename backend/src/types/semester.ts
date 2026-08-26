export interface SemesterRecord {
  id: string;
  user_id: string;
  name: string;
  academic_year: string;
  start_date: Date | string;
  end_date: Date | string;
  is_current: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SemesterResponse {
  id: string;
  userId: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  subjectCount?: number;
  totalCredits?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSemesterInput {
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface UpdateSemesterInput {
  name?: string;
  academicYear?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}