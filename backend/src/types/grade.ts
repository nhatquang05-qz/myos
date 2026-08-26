export interface GradeRecord {
  id: string;
  user_id: string;
  subject_id: string;
  component_name: string;
  weight: number | string;
  score: number | string;
  grade_point: number | string;
  created_at: Date;
  updated_at: Date;
}

export interface GradeResponse {
  id: string;
  userId: string;
  subjectId: string;
  componentName: string;
  weight: number;
  score: number;
  gradePoint: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGradeInput {
  componentName: string;
  weight: number;
  score: number;
}

export interface UpdateGradeInput {
  componentName?: string;
  weight?: number;
  score?: number;
}

export interface SubjectGradeSummary {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  targetGrade: number | null;
  totalWeight: number;
  isComplete: boolean;
  finalScore10: number | null;
  finalGradePoint4: number | null;
  letterGrade: string | null;
  grades: GradeResponse[];
}

export interface SemesterGpaSummary {
  semesterId: string;
  semesterName: string;
  academicYear: string;
  isCurrent: boolean;
  totalCredits: number;
  completedCredits: number;
  totalSubjects: number;
  completedSubjects: number;
  gpa: number | null;
  subjects: SubjectGradeSummary[];
}

export interface CumulativeGpaSummary {
  totalSemesters: number;
  totalRegisteredCredits: number;
  totalCompletedCredits: number;
  totalSubjects: number;
  completedSubjects: number;
  cumulativeGpa: number | null;
  semesters: {
    semesterId: string;
    semesterName: string;
    academicYear: string;
    isCurrent: boolean;
    credits: number;
    gpa: number | null;
  }[];
}