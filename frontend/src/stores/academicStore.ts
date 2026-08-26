import { create } from 'zustand';
import { Semester, CreateSemesterRequest, UpdateSemesterRequest } from '../types/semester';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject';
import { semesterApi } from '../services/semesterApi';
import { subjectApi } from '../services/subjectApi';

interface AcademicState {
  semesters: Semester[];
  selectedSemester: Semester | null;
  subjects: Subject[];
  isLoadingSemesters: boolean;
  isLoadingSubjects: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchSemesters: () => Promise<void>;
  selectSemester: (semester: Semester) => Promise<void>;
  fetchSubjects: (semesterId: string) => Promise<void>;

  createSemester: (data: CreateSemesterRequest) => Promise<void>;
  updateSemester: (id: string, data: UpdateSemesterRequest) => Promise<void>;
  deleteSemester: (id: string) => Promise<void>;
  setCurrentSemester: (id: string) => Promise<void>;

  createSubject: (data: CreateSubjectRequest) => Promise<void>;
  updateSubject: (id: string, data: UpdateSubjectRequest) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  clearError: () => void;
  clearSuccessMessage: () => void;
}

export const useAcademicStore = create<AcademicState>((set, get) => ({
  semesters: [],
  selectedSemester: null,
  subjects: [],
  isLoadingSemesters: false,
  isLoadingSubjects: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),

  fetchSemesters: async () => {
    set({ isLoadingSemesters: true, error: null });
    try {
      const semesters = await semesterApi.getSemesters();
      set({ semesters, isLoadingSemesters: false });

      const { selectedSemester } = get();
      if (!selectedSemester && semesters.length > 0) {
        const currentSem = semesters.find((s) => s.isCurrent) || semesters[0];
        if (currentSem) {
          get().selectSemester(currentSem);
        }
      } else if (selectedSemester) {
        const updated = semesters.find((s) => s.id === selectedSemester.id);
        if (updated) {
          set({ selectedSemester: updated });
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoadingSemesters: false,
        error: errorObj.message || 'Không thể tải danh sách học kỳ',
      });
    }
  },

  selectSemester: async (semester: Semester) => {
    set({ selectedSemester: semester });
    await get().fetchSubjects(semester.id);
  },

  fetchSubjects: async (semesterId: string) => {
    set({ isLoadingSubjects: true, error: null });
    try {
      const subjects = await subjectApi.getSubjectsBySemester(semesterId);
      set({ subjects, isLoadingSubjects: false });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoadingSubjects: false,
        error: errorObj.message || 'Không thể tải danh sách môn học',
      });
    }
  },

  createSemester: async (data: CreateSemesterRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      const newSemester = await semesterApi.createSemester(data);
      set({
        isSubmitting: false,
        successMessage: 'Tạo học kỳ mới thành công!',
      });
      await get().fetchSemesters();
      await get().selectSemester(newSemester);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Tạo học kỳ thất bại',
      });
      throw err;
    }
  },

  updateSemester: async (id: string, data: UpdateSemesterRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await semesterApi.updateSemester(id, data);
      set((state) => ({
        semesters: state.semesters.map((s) => (s.id === id ? updated : s)),
        selectedSemester: state.selectedSemester?.id === id ? updated : state.selectedSemester,
        isSubmitting: false,
        successMessage: 'Cập nhật học kỳ thành công!',
      }));
      await get().fetchSemesters();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Cập nhật học kỳ thất bại',
      });
      throw err;
    }
  },

  setCurrentSemester: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await semesterApi.updateSemester(id, { isCurrent: true });
      set({
        isSubmitting: false,
        successMessage: 'Đã đặt làm học kỳ hiện tại!',
      });
      await get().fetchSemesters();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Không thể cập nhật học kỳ hiện tại',
      });
    }
  },

  deleteSemester: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await semesterApi.deleteSemester(id);
      set((state) => ({
        semesters: state.semesters.filter((s) => s.id !== id),
        selectedSemester: state.selectedSemester?.id === id ? null : state.selectedSemester,
        subjects: state.selectedSemester?.id === id ? [] : state.subjects,
        isSubmitting: false,
        successMessage: 'Đã xóa học kỳ thành công!',
      }));
      await get().fetchSemesters();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa học kỳ thất bại',
      });
      throw err;
    }
  },

  createSubject: async (data: CreateSubjectRequest) => {
    const { selectedSemester } = get();
    if (!selectedSemester) return;

    set({ isSubmitting: true, error: null });
    try {
      await subjectApi.createSubject(selectedSemester.id, data);
      set({
        isSubmitting: false,
        successMessage: 'Thêm môn học mới thành công!',
      });
      await Promise.all([get().fetchSubjects(selectedSemester.id), get().fetchSemesters()]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errorCode?: string };
      const friendlyMessage =
        errorObj.errorCode === 'SUBJECT_CODE_ALREADY_EXISTS'
          ? 'Mã môn học đã tồn tại trong học kỳ này.'
          : errorObj.message || 'Thêm môn học thất bại';

      set({
        isSubmitting: false,
        error: friendlyMessage,
      });
      throw new Error(friendlyMessage);
    }
  },

  updateSubject: async (id: string, data: UpdateSubjectRequest) => {
    const { selectedSemester } = get();
    set({ isSubmitting: true, error: null });
    try {
      const updated = await subjectApi.updateSubject(id, data);
      set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? updated : s)),
        isSubmitting: false,
        successMessage: 'Cập nhật môn học thành công!',
      }));
      if (selectedSemester) {
        await get().fetchSemesters();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errorCode?: string };
      const friendlyMessage =
        errorObj.errorCode === 'SUBJECT_CODE_ALREADY_EXISTS'
          ? 'Mã môn học đã tồn tại trong học kỳ này.'
          : errorObj.message || 'Cập nhật môn học thất bại';

      set({
        isSubmitting: false,
        error: friendlyMessage,
      });
      throw new Error(friendlyMessage);
    }
  },

  deleteSubject: async (id: string) => {
    const { selectedSemester } = get();
    set({ isSubmitting: true, error: null });
    try {
      await subjectApi.deleteSubject(id);
      set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
        isSubmitting: false,
        successMessage: 'Đã xóa môn học thành công!',
      }));
      if (selectedSemester) {
        await get().fetchSemesters();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa môn học thất bại',
      });
      throw err;
    }
  },
}));