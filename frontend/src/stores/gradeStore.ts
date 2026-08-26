import { create } from 'zustand';
import { Semester } from '../types/semester';
import {
  SemesterGpaSummary,
  CumulativeGpaSummary,
  SubjectGradeSummary,
  CreateGradeRequest,
  UpdateGradeRequest,
} from '../types/grade';
import { gradeApi } from '../services/gradeApi';
import { semesterApi } from '../services/semesterApi';

interface GradeState {
  semesters: Semester[];
  selectedSemesterId: string | 'ALL';
  semesterGpaSummary: SemesterGpaSummary | null;
  allSemestersSummaries: SemesterGpaSummary[];
  cumulativeGpaSummary: CumulativeGpaSummary | null;
  selectedSubject: SubjectGradeSummary | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchInitialData: () => Promise<void>;
  selectSemester: (semesterId: string | 'ALL') => Promise<void>;
  fetchSemesterGpa: (semesterId: string) => Promise<void>;
  fetchAllSemestersGpa: () => Promise<void>;
  fetchCumulativeGpa: () => Promise<void>;
  setSelectedSubject: (subject: SubjectGradeSummary | null) => void;

  createGrade: (subjectId: string, data: CreateGradeRequest) => Promise<void>;
  updateGrade: (id: string, data: UpdateGradeRequest) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;

  clearError: () => void;
  clearSuccessMessage: () => void;
}

export const useGradeStore = create<GradeState>((set, get) => ({
  semesters: [],
  selectedSemesterId: 'ALL',
  semesterGpaSummary: null,
  allSemestersSummaries: [],
  cumulativeGpaSummary: null,
  selectedSubject: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),

  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [semesters, cumulative] = await Promise.all([
        semesterApi.getSemesters(),
        gradeApi.getCumulativeGpa(),
      ]);

      set({
        semesters,
        cumulativeGpaSummary: cumulative,
      });

      if (semesters.length > 0) {
        const { selectedSemesterId } = get();
        await get().selectSemester(selectedSemesterId || 'ALL');
      } else {
        set({ isLoading: false });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải dữ liệu học tập và điểm số',
      });
    }
  },

  selectSemester: async (semesterId: string | 'ALL') => {
    set({ selectedSemesterId: semesterId });
    if (semesterId === 'ALL') {
      await get().fetchAllSemestersGpa();
    } else {
      await get().fetchSemesterGpa(semesterId);
    }
  },

  fetchSemesterGpa: async (semesterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const summary = await gradeApi.getSemesterGpa(semesterId);
      set({ semesterGpaSummary: summary, isLoading: false });

      const { selectedSubject } = get();
      if (selectedSubject) {
        const updatedSub = summary.subjects.find((s) => s.subjectId === selectedSubject.subjectId);
        if (updatedSub) {
          set({ selectedSubject: updatedSub });
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải GPA của học kỳ',
      });
    }
  },

  fetchAllSemestersGpa: async () => {
    set({ isLoading: true, error: null });
    const { semesters } = get();
    try {
      const summaries = await Promise.all(
        semesters.map((s) => gradeApi.getSemesterGpa(s.id))
      );
      set({ allSemestersSummaries: summaries, isLoading: false });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải bảng điểm tất cả học kỳ',
      });
    }
  },

  fetchCumulativeGpa: async () => {
    try {
      const cumulative = await gradeApi.getCumulativeGpa();
      set({ cumulativeGpaSummary: cumulative });
    } catch {
      // Soft handled
    }
  },

  createGrade: async (subjectId: string, data: CreateGradeRequest) => {
    const { selectedSemesterId } = get();
    set({ isSubmitting: true, error: null });
    try {
      await gradeApi.createGrade(subjectId, data);
      set({
        isSubmitting: false,
        successMessage: 'Thêm cột điểm thành công!',
      });
      await Promise.all([
        selectedSemesterId === 'ALL' ? get().fetchAllSemestersGpa() : get().fetchSemesterGpa(selectedSemesterId),
        get().fetchCumulativeGpa(),
      ]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errorCode?: string };
      const friendlyMessage =
        errorObj.errorCode === 'WEIGHT_EXCEEDS_LIMIT'
          ? errorObj.message || 'Tổng trọng số không được vượt quá 100%'
          : errorObj.message || 'Thêm cột điểm thất bại';
      set({
        isSubmitting: false,
        error: friendlyMessage,
      });
      throw new Error(friendlyMessage);
    }
  },

  updateGrade: async (id: string, data: UpdateGradeRequest) => {
    const { selectedSemesterId } = get();
    set({ isSubmitting: true, error: null });
    try {
      await gradeApi.updateGrade(id, data);
      set({
        isSubmitting: false,
        successMessage: 'Cập nhật cột điểm thành công!',
      });
      await Promise.all([
        selectedSemesterId === 'ALL' ? get().fetchAllSemestersGpa() : get().fetchSemesterGpa(selectedSemesterId),
        get().fetchCumulativeGpa(),
      ]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; errorCode?: string };
      const friendlyMessage =
        errorObj.errorCode === 'WEIGHT_EXCEEDS_LIMIT'
          ? errorObj.message || 'Tổng trọng số không được vượt quá 100%'
          : errorObj.message || 'Cập nhật cột điểm thất bại';
      set({
        isSubmitting: false,
        error: friendlyMessage,
      });
      throw new Error(friendlyMessage);
    }
  },

  deleteGrade: async (id: string) => {
    const { selectedSemesterId } = get();
    set({ isSubmitting: true, error: null });
    try {
      await gradeApi.deleteGrade(id);
      set({
        isSubmitting: false,
        successMessage: 'Đã xóa cột điểm thành công!',
      });
      await Promise.all([
        selectedSemesterId === 'ALL' ? get().fetchAllSemestersGpa() : get().fetchSemesterGpa(selectedSemesterId),
        get().fetchCumulativeGpa(),
      ]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa cột điểm thất bại',
      });
      throw err;
    }
  },
}));