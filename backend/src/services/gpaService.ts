import { GradeResponse, SubjectGradeSummary, SemesterGpaSummary, CumulativeGpaSummary } from '../types/grade.js';
import { gradeRepository, GradeRepository } from '../repositories/gradeRepository.js';
import { subjectRepository, SubjectRepository } from '../repositories/subjectRepository.js';
import { semesterRepository, SemesterRepository } from '../repositories/semesterRepository.js';
import { AppError } from '../middleware/errorHandler.js';

const roundTo1Decimal = (num: number): number => {
  return Math.round(num * 10) / 10;
};

export class GpaService {
  constructor(
    private gradeRepo: GradeRepository,
    private subjectRepo: SubjectRepository,
    private semesterRepo: SemesterRepository
  ) {}

  public getClassificationScale10(score: number): string {
    if (score >= 9.0) return 'Xuất sắc';
    if (score >= 8.0) return 'Giỏi';
    if (score >= 7.0) return 'Khá';
    if (score >= 5.0) return 'Trung bình';
    return 'Yếu';
  }

  public calculateSubjectFinal(grades: GradeResponse[]): {
    totalWeight: number;
    isComplete: boolean;
    finalScore10: number | null;
    classification: string | null;
  } {
    if (grades.length === 0) {
      return {
        totalWeight: 0,
        isComplete: false,
        finalScore10: null,
        classification: null,
      };
    }

    let totalWeight = 0;
    let weightedSum = 0;

    for (const g of grades) {
      totalWeight += g.weight;
      weightedSum += g.score * (g.weight / 100);
    }

    totalWeight = Number(totalWeight.toFixed(2));
    const isComplete = Math.abs(totalWeight - 100.0) < 0.001;

    if (!isComplete) {
      return {
        totalWeight,
        isComplete: false,
        finalScore10: roundTo1Decimal(weightedSum),
        classification: null,
      };
    }

    const finalScore10 = roundTo1Decimal(weightedSum);
    const classification = this.getClassificationScale10(finalScore10);

    return {
      totalWeight: 100.0,
      isComplete: true,
      finalScore10,
      classification,
    };
  }

  async getSubjectGradeSummary(subjectId: string, userId: string): Promise<SubjectGradeSummary> {
    const subject = await this.subjectRepo.findSubjectByIdAndUser(subjectId, userId);
    if (!subject) {
      throw new AppError('Không tìm thấy môn học hoặc bạn không có quyền truy cập', 404, 'SUBJECT_NOT_FOUND');
    }

    const gradeRecords = await this.gradeRepo.findGradesBySubjectAndUser(subjectId, userId);
    const grades: GradeResponse[] = gradeRecords.map((r) => ({
      id: r.id,
      userId: r.user_id,
      subjectId: r.subject_id,
      componentName: r.component_name,
      weight: Number(r.weight),
      score: Number(r.score),
      gradePoint: Number(r.score),
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    }));

    const calc = this.calculateSubjectFinal(grades);

    return {
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectName: subject.name,
      credits: Number(subject.credits),
      targetGrade: subject.target_grade !== null ? Number(subject.target_grade) : null,
      totalWeight: calc.totalWeight,
      isComplete: calc.isComplete,
      finalScore10: calc.finalScore10,
      finalGradePoint4: null,
      letterGrade: calc.classification,
      grades,
    };
  }

  async getSemesterGpa(semesterId: string, userId: string): Promise<SemesterGpaSummary> {
    const semester = await this.semesterRepo.findSemesterByIdAndUser(semesterId, userId);
    if (!semester) {
      throw new AppError('Không tìm thấy học kỳ hoặc bạn không có quyền truy cập', 404, 'SEMESTER_NOT_FOUND');
    }

    const subjects = await this.subjectRepo.findSubjectsBySemesterAndUser(semesterId, userId);
    const subjectSummaries: SubjectGradeSummary[] = [];

    let totalCredits = 0;
    let completedCredits = 0;
    let totalWeightedScore10 = 0;
    let completedSubjectsCount = 0;

    for (const sub of subjects) {
      const summary = await this.getSubjectGradeSummary(sub.id, userId);
      subjectSummaries.push(summary);

      totalCredits += summary.credits;
      if (summary.isComplete && summary.finalScore10 !== null) {
        completedCredits += summary.credits;
        totalWeightedScore10 += summary.credits * summary.finalScore10;
        completedSubjectsCount++;
      }
    }

    const gpa = completedCredits > 0 ? Number((totalWeightedScore10 / completedCredits).toFixed(2)) : null;

    return {
      semesterId: semester.id,
      semesterName: semester.name,
      academicYear: semester.academic_year,
      isCurrent: Boolean(semester.is_current),
      totalCredits,
      completedCredits,
      totalSubjects: subjects.length,
      completedSubjects: completedSubjectsCount,
      gpa,
      subjects: subjectSummaries,
    };
  }

  async getCumulativeGpa(userId: string): Promise<CumulativeGpaSummary> {
    const semesters = await this.semesterRepo.findSemestersByUser(userId);

    let totalRegisteredCredits = 0;
    let totalCompletedCredits = 0;
    let totalSubjects = 0;
    let totalCompletedSubjects = 0;
    let totalWeightedScore10 = 0;

    const semesterListSummary: {
      semesterId: string;
      semesterName: string;
      academicYear: string;
      isCurrent: boolean;
      credits: number;
      gpa: number | null;
    }[] = [];

    for (const sem of semesters) {
      const semGpa = await this.getSemesterGpa(sem.id, userId);

      totalRegisteredCredits += semGpa.totalCredits;
      totalCompletedCredits += semGpa.completedCredits;
      totalSubjects += semGpa.totalSubjects;
      totalCompletedSubjects += semGpa.completedSubjects;

      for (const sub of semGpa.subjects) {
        if (sub.isComplete && sub.finalScore10 !== null) {
          totalWeightedScore10 += sub.credits * sub.finalScore10;
        }
      }

      semesterListSummary.push({
        semesterId: semGpa.semesterId,
        semesterName: semGpa.semesterName,
        academicYear: semGpa.academicYear,
        isCurrent: semGpa.isCurrent,
        credits: semGpa.completedCredits,
        gpa: semGpa.gpa,
      });
    }

    const cumulativeGpa =
      totalCompletedCredits > 0 ? Number((totalWeightedScore10 / totalCompletedCredits).toFixed(2)) : null;

    return {
      totalSemesters: semesters.length,
      totalRegisteredCredits,
      totalCompletedCredits,
      totalSubjects,
      completedSubjects: totalCompletedSubjects,
      cumulativeGpa,
      semesters: semesterListSummary,
    };
  }
}

export const gpaService = new GpaService(gradeRepository, subjectRepository, semesterRepository);