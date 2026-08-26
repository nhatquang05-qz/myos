export interface Grade {
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

export interface CreateGradeRequest {
  componentName: string;
  weight: number;
  score: number;
}

export interface UpdateGradeRequest {
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
  grades: Grade[];
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