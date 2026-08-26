import React, { useEffect, useState } from 'react';
import { useAcademicStore } from '../stores/academicStore';
import { Semester, CreateSemesterRequest, UpdateSemesterRequest } from '../types/semester';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject';
import { SemesterCard } from '../components/academic/SemesterCard';
import { SemesterModal } from '../components/academic/SemesterModal';
import { SemesterDeleteModal } from '../components/academic/SemesterDeleteModal';
import { SubjectCard } from '../components/academic/SubjectCard';
import { SubjectModal } from '../components/academic/SubjectModal';
import { SubjectDeleteModal } from '../components/academic/SubjectDeleteModal';
import { Button } from '../components/common/Button';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StateFeedback';
import { Plus, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export const AcademicPage: React.FC = () => {
  const {
    semesters,
    selectedSemester,
    subjects,
    isLoadingSemesters,
    isLoadingSubjects,
    isSubmitting,
    error,
    successMessage,
    fetchSemesters,
    selectSemester,
    createSemester,
    updateSemester,
    deleteSemester,
    setCurrentSemester,
    createSubject,
    updateSubject,
    deleteSubject,
    clearSuccessMessage,
  } = useAcademicStore();

  const [semesterModalOpen, setSemesterModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [semesterDeleteModalOpen, setSemesterDeleteModalOpen] = useState(false);
  const [deletingSemester, setDeletingSemester] = useState<Semester | null>(null);

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectDeleteModalOpen, setSubjectDeleteModalOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  const handleOpenCreateSemester = () => {
    setEditingSemester(null);
    setSemesterModalOpen(true);
  };

  const handleOpenEditSemester = (sem: Semester) => {
    setEditingSemester(sem);
    setSemesterModalOpen(true);
  };

  const handleOpenDeleteSemester = (sem: Semester) => {
    setDeletingSemester(sem);
    setSemesterDeleteModalOpen(true);
  };

  const handleSemesterModalSubmit = async (data: CreateSemesterRequest | UpdateSemesterRequest) => {
    if (editingSemester) {
      await updateSemester(editingSemester.id, data);
    } else {
      await createSemester(data as CreateSemesterRequest);
    }
  };

  const handleSemesterDeleteConfirm = async () => {
    if (deletingSemester) {
      await deleteSemester(deletingSemester.id);
      setSemesterDeleteModalOpen(false);
      setDeletingSemester(null);
    }
  };

  const handleOpenCreateSubject = () => {
    setEditingSubject(null);
    setSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectModalOpen(true);
  };

  const handleOpenDeleteSubject = (sub: Subject) => {
    setDeletingSubject(sub);
    setSubjectDeleteModalOpen(true);
  };

  const handleSubjectModalSubmit = async (data: CreateSubjectRequest | UpdateSubjectRequest) => {
    if (editingSubject) {
      await updateSubject(editingSubject.id, data);
    } else {
      await createSubject(data as CreateSubjectRequest);
    }
  };

  const handleSubjectDeleteConfirm = async () => {
    if (deletingSubject) {
      await deleteSubject(deletingSubject.id);
      setSubjectDeleteModalOpen(false);
      setDeletingSubject(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản trị Học tập & Học kỳ
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý kế hoạch học tập, danh sách học kỳ và các môn học đăng ký.
          </p>
        </div>

        <Button onClick={handleOpenCreateSemester} className="space-x-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Thêm học kỳ</span>
        </Button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error State */}
      {error && <ErrorState message={error} onRetry={() => fetchSemesters()} />}

      {/* 2. Semesters Section */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Danh sách Học kỳ</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tổng cộng: {semesters.length} học kỳ
          </span>
        </div>

        {isLoadingSemesters && <LoadingState message="Đang tải danh sách học kỳ..." />}

        {!isLoadingSemesters && semesters.length === 0 && (
          <EmptyState
            title="Chưa có học kỳ nào"
            description="Hãy tạo học kỳ đầu tiên để bắt đầu thêm các môn học của bạn."
            actionLabel="+ Thêm học kỳ mới"
            onAction={handleOpenCreateSemester}
          />
        )}

        {!isLoadingSemesters && semesters.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semesters.map((sem) => (
              <SemesterCard
                key={sem.id}
                semester={sem}
                isSelected={selectedSemester?.id === sem.id}
                onSelect={selectSemester}
                onEdit={handleOpenEditSemester}
                onDelete={handleOpenDeleteSemester}
                onSetCurrent={(s) => setCurrentSemester(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Subjects Section of Selected Semester */}
      {selectedSemester && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Môn học: {selectedSemester.name}
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Năm học {selectedSemester.academicYear} • {selectedSemester.subjectCount ?? 0} môn • {selectedSemester.totalCredits ?? 0} tín chỉ
              </p>
            </div>

            <Button onClick={handleOpenCreateSubject} size="sm" className="space-x-1">
              <Plus className="h-4 w-4" />
              <span>Thêm môn học</span>
            </Button>
          </div>

          {isLoadingSubjects && <LoadingState message="Đang tải danh sách môn học..." />}

          {!isLoadingSubjects && subjects.length === 0 && (
            <EmptyState
              title="Chưa có môn học trong học kỳ này"
              description="Bấm 'Thêm môn học' để ghi nhận danh sách môn, số tín chỉ và điểm mục tiêu."
              actionLabel="+ Thêm môn học"
              onAction={handleOpenCreateSubject}
            />
          )}

          {!isLoadingSubjects && subjects.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub}
                  onEdit={handleOpenEditSubject}
                  onDelete={handleOpenDeleteSubject}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <SemesterModal
        isOpen={semesterModalOpen}
        onClose={() => setSemesterModalOpen(false)}
        onSubmit={handleSemesterModalSubmit}
        semester={editingSemester}
        isSubmitting={isSubmitting}
      />

      <SemesterDeleteModal
        isOpen={semesterDeleteModalOpen}
        onClose={() => setSemesterDeleteModalOpen(false)}
        onConfirm={handleSemesterDeleteConfirm}
        semester={deletingSemester}
        isSubmitting={isSubmitting}
      />

      <SubjectModal
        isOpen={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
        onSubmit={handleSubjectModalSubmit}
        subject={editingSubject}
        isSubmitting={isSubmitting}
      />

      <SubjectDeleteModal
        isOpen={subjectDeleteModalOpen}
        onClose={() => setSubjectDeleteModalOpen(false)}
        onConfirm={handleSubjectDeleteConfirm}
        subject={deletingSubject}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};