import React, { useEffect, useState } from 'react';
import { useGradeStore } from '../stores/gradeStore';
import { Grade, CreateGradeRequest, UpdateGradeRequest, SemesterGpaSummary } from '../types/grade';
import { GpaSummary } from '../components/grades/GpaSummary';
import { SubjectGradeSummaryCard } from '../components/grades/SubjectGradeSummary';
import { GradeComponentModal } from '../components/grades/GradeComponentModal';
import { GradeDeleteModal } from '../components/grades/GradeDeleteModal';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateFeedback';
import { CheckCircle2, GraduationCap } from 'lucide-react';

export const GradesPage: React.FC = () => {
  const {
    semesters,
    selectedSemesterId,
    semesterGpaSummary,
    allSemestersSummaries,
    cumulativeGpaSummary,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchInitialData,
    selectSemester,
    createGrade,
    updateGrade,
    deleteGrade,
    clearSuccessMessage,
  } = useGradeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [targetSubjectId, setTargetSubjectId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleOpenAddGrade = (subjectId: string) => {
    setEditingGrade(null);
    setTargetSubjectId(subjectId);
    setModalOpen(true);
  };

  const handleOpenEditGrade = (grade: Grade) => {
    setEditingGrade(grade);
    setTargetSubjectId(grade.subjectId);
    setModalOpen(true);
  };

  const handleOpenDeleteGrade = (grade: Grade) => {
    setDeletingGrade(grade);
    setDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateGradeRequest | UpdateGradeRequest) => {
    if (editingGrade) {
      await updateGrade(editingGrade.id, data);
    } else if (targetSubjectId) {
      await createGrade(targetSubjectId, data as CreateGradeRequest);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingGrade) {
      await deleteGrade(deletingGrade.id);
      setDeleteModalOpen(false);
      setDeletingGrade(null);
    }
  };

  const displayedSemesters: SemesterGpaSummary[] =
    selectedSemesterId === 'ALL'
      ? allSemestersSummaries
      : semesterGpaSummary
      ? [semesterGpaSummary]
      : [];

  // Tổng hợp số liệu chính xác khi chọn 'ALL' hoặc chọn từng học kỳ cụ thể
  const currentSummaryForTopMetrics: SemesterGpaSummary | null =
    selectedSemesterId === 'ALL'
      ? {
          semesterId: 'ALL',
          semesterName: 'Tất cả học kỳ',
          academicYear: 'Toàn khóa',
          isCurrent: false,
          totalCredits: allSemestersSummaries.reduce((sum, s) => sum + s.totalCredits, 0),
          completedCredits: allSemestersSummaries.reduce((sum, s) => sum + s.completedCredits, 0),
          totalSubjects: allSemestersSummaries.reduce((sum, s) => sum + s.totalSubjects, 0),
          completedSubjects: allSemestersSummaries.reduce((sum, s) => sum + s.completedSubjects, 0),
          gpa: cumulativeGpaSummary?.cumulativeGpa ?? null,
          subjects: allSemestersSummaries.flatMap((s) => s.subjects),
        }
      : semesterGpaSummary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Điểm số & Động cơ GPA
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Theo dõi bảng điểm môn học, xếp loại học lực và tính toán điểm trung bình hệ 10.
          </p>
        </div>

        {semesters.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Xem theo:</span>
            <select
              value={selectedSemesterId}
              onChange={(e) => selectSemester(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="ALL">🌟 Tất cả học kỳ (Toàn khóa)</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.academicYear}) {s.isCurrent ? '• [Hiện tại]' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={() => fetchInitialData()} />}

      <GpaSummary
        semesterGpa={currentSummaryForTopMetrics}
        cumulativeGpa={cumulativeGpaSummary}
      />

      <div>
        {isLoading && <LoadingState message="Đang nạp bảng điểm các học kỳ..." />}

        {!isLoading && semesters.length === 0 && (
          <EmptyState
            title="Chưa có học kỳ nào"
            description="Hãy tạo học kỳ và môn học trong phân hệ Study & Academic trước khi quản lý điểm số."
            actionLabel="Tới trang Học tập & Học kỳ"
            onAction={() => (window.location.href = '/academic')}
          />
        )}

        {!isLoading && semesters.length > 0 && displayedSemesters.length === 0 && (
          <EmptyState
            title="Chưa có môn học trong học kỳ này"
            description="Hãy thêm các môn học vào học kỳ để bắt đầu nhập điểm số."
            actionLabel="Thêm môn học vào học kỳ"
            onAction={() => (window.location.href = '/academic')}
          />
        )}

        {!isLoading && displayedSemesters.length > 0 && (
          <div className="space-y-8">
            {displayedSemesters.map((semSummary) => (
              <div
                key={semSummary.semesterId}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900/40 space-y-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm text-xs">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {semSummary.semesterName}
                        </h3>
                        {semSummary.isCurrent && (
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Năm học {semSummary.academicYear} • {semSummary.totalSubjects} môn học • {semSummary.totalCredits} tín chỉ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-start sm:self-auto bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      GPA Học Kỳ:
                    </span>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {semSummary.gpa !== null ? semSummary.gpa.toFixed(2) : '--'}
                      <span className="text-[10px] text-slate-400 pl-0.5">/ 10.0</span>
                    </span>
                  </div>
                </div>

                {semSummary.subjects.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-xl dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    Học kỳ này chưa có môn học nào được đăng ký.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {semSummary.subjects.map((subSummary) => (
                      <SubjectGradeSummaryCard
                        key={subSummary.subjectId}
                        summary={subSummary}
                        onAddGrade={handleOpenAddGrade}
                        onEditGrade={handleOpenEditGrade}
                        onDeleteGrade={handleOpenDeleteGrade}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <GradeComponentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        grade={editingGrade}
        isSubmitting={isSubmitting}
      />

      <GradeDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        grade={deletingGrade}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};