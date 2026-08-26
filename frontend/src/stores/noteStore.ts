import { create } from 'zustand';
import { Note, NoteFilterParams, CreateNoteRequest, UpdateNoteRequest } from '../types/note';
import { PaginationMeta } from '../types/task';
import { noteApi } from '../services/noteApi';

interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  pagination: PaginationMeta;
  filters: NoteFilterParams;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchNotes: (customFilters?: NoteFilterParams) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (data: CreateNoteRequest) => Promise<void>;
  updateNote: (id: string, data: UpdateNoteRequest) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (note: Note) => Promise<void>;
  toggleArchive: (note: Note) => Promise<void>;
  setFilters: (newFilters: Partial<NoteFilterParams>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setSelectedNote: (note: Note | null) => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
}

const initialFilters: NoteFilterParams = {
  page: 1,
  limit: 20,
  search: undefined,
  pinned: undefined,
  archived: undefined,
  tagId: undefined,
};

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  selectedNote: null,
  pagination: initialPagination,
  filters: initialFilters,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setSelectedNote: (note: Note | null) => set({ selectedNote: note }),

  fetchNotes: async (customFilters?: NoteFilterParams) => {
    set({ isLoading: true, error: null });
    const currentFilters = customFilters || get().filters;
    try {
      const data = await noteApi.getNotes(currentFilters);
      set({
        notes: data.notes,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải danh sách ghi chú',
      });
    }
  },

  fetchNoteById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const note = await noteApi.getNote(id);
      set({ selectedNote: note, isLoading: false });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải chi tiết ghi chú',
      });
    }
  },

  createNote: async (data: CreateNoteRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      await noteApi.createNote(data);
      set({
        isSubmitting: false,
        successMessage: 'Tạo ghi chú mới thành công!',
      });
      await get().fetchNotes();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Tạo ghi chú thất bại',
      });
      throw err;
    }
  },

  updateNote: async (id: string, data: UpdateNoteRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedNote = await noteApi.updateNote(id, data);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? updatedNote : n)),
        selectedNote: state.selectedNote?.id === id ? updatedNote : state.selectedNote,
        isSubmitting: false,
        successMessage: 'Cập nhật ghi chú thành công!',
      }));
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Cập nhật ghi chú thất bại',
      });
      throw err;
    }
  },

  deleteNote: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await noteApi.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
        isSubmitting: false,
        successMessage: 'Đã xóa ghi chú thành công!',
      }));
      const remaining = get().notes.length;
      if (remaining === 0 && get().pagination.page > 1) {
        get().setPage(get().pagination.page - 1);
      } else {
        await get().fetchNotes();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa ghi chú thất bại',
      });
      throw err;
    }
  },

  togglePin: async (note: Note) => {
    try {
      const nextPinState = !note.isPinned;
      const updatedNote = await noteApi.updateNote(note.id, { isPinned: nextPinState });
      set((state) => ({
        notes: state.notes.map((n) => (n.id === note.id ? updatedNote : n)),
        selectedNote: state.selectedNote?.id === note.id ? updatedNote : state.selectedNote,
        successMessage: nextPinState ? 'Đã ghim ghi chú lên đầu!' : 'Đã bỏ ghim ghi chú!',
      }));
      await get().fetchNotes();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({ error: errorObj.message || 'Không thể thay đổi trạng thái ghim' });
    }
  },

  toggleArchive: async (note: Note) => {
    try {
      const nextArchiveState = !note.isArchived;
      await noteApi.updateNote(note.id, { isArchived: nextArchiveState });
      set({
        successMessage: nextArchiveState ? 'Đã chuyển ghi chú vào mục lưu trữ!' : 'Đã khôi phục ghi chú từ mục lưu trữ!',
      });
      await get().fetchNotes();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({ error: errorObj.message || 'Không thể thay đổi trạng thái lưu trữ' });
    }
  },

  setFilters: (newFilters: Partial<NoteFilterParams>) => {
    const updated = { ...get().filters, ...newFilters, page: 1 };
    set({ filters: updated });
    get().fetchNotes(updated);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchNotes(initialFilters);
  },

  setPage: (page: number) => {
    const updated = { ...get().filters, page };
    set({ filters: updated });
    get().fetchNotes(updated);
  },
}));