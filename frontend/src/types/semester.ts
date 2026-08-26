export interface Semester {
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

export interface CreateSemesterRequest {
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface UpdateSemesterRequest {
  name?: string;
  academicYear?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}