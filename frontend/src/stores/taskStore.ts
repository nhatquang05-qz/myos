import { create } from 'zustand';
import { Task, TaskFilterParams, PaginationMeta, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import { taskApi } from '../services/taskApi';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  pagination: PaginationMeta;
  filters: TaskFilterParams;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchTasks: (customFilters?: TaskFilterParams) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (newFilters: Partial<TaskFilterParams>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
}

const initialFilters: TaskFilterParams = {
  page: 1,
  limit: 20,
  search: undefined,
  status: undefined,
  priority: undefined,
  tagId: undefined,
};

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  pagination: initialPagination,
  filters: initialFilters,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),

  fetchTasks: async (customFilters?: TaskFilterParams) => {
    set({ isLoading: true, error: null });
    const currentFilters = customFilters || get().filters;
    try {
      const data = await taskApi.getTasks(currentFilters);
      set({
        tasks: data.tasks,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải danh sách nhiệm vụ',
      });
    }
  },

  fetchTaskById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskApi.getTask(id);
      set({ selectedTask: task, isLoading: false });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải chi tiết nhiệm vụ',
      });
    }
  },

  createTask: async (data: CreateTaskRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      await taskApi.createTask(data);
      set({
        isSubmitting: false,
        successMessage: 'Tạo nhiệm vụ mới thành công!',
      });
      await get().fetchTasks();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Tạo nhiệm vụ thất bại',
      });
      throw err;
    }
  },

  updateTask: async (id: string, data: UpdateTaskRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedTask = await taskApi.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        selectedTask: state.selectedTask?.id === id ? updatedTask : state.selectedTask,
        isSubmitting: false,
        successMessage: 'Cập nhật nhiệm vụ thành công!',
      }));
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Cập nhật nhiệm vụ thất bại',
      });
      throw err;
    }
  },

  deleteTask: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await taskApi.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        isSubmitting: false,
        successMessage: 'Đã xóa nhiệm vụ thành công!',
      }));
      // Tải lại nếu trang hiện tại bị trống
      const remaining = get().tasks.length;
      if (remaining === 0 && get().pagination.page > 1) {
        get().setPage(get().pagination.page - 1);
      } else {
        await get().fetchTasks();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa nhiệm vụ thất bại',
      });
      throw err;
    }
  },

  setFilters: (newFilters: Partial<TaskFilterParams>) => {
    const updated = { ...get().filters, ...newFilters, page: 1 };
    set({ filters: updated });
    get().fetchTasks(updated);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchTasks(initialFilters);
  },

  setPage: (page: number) => {
    const updated = { ...get().filters, page };
    set({ filters: updated });
    get().fetchTasks(updated);
  },
}));