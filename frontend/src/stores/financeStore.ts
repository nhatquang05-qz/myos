import { create } from 'zustand';
import {
  Transaction,
  TransactionSummary,
  TransactionFilterParams,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '../types/transaction';
import { PaginationMeta } from '../types/task';
import { transactionApi } from '../services/transactionApi';

interface FinanceState {
  transactions: Transaction[];
  categories: string[];
  summary: TransactionSummary | null;
  selectedTransaction: Transaction | null;
  pagination: PaginationMeta;
  filters: TransactionFilterParams;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchTransactions: (customFilters?: TransactionFilterParams) => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTransaction: (data: CreateTransactionRequest) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransactionRequest) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilters: (newFilters: Partial<TransactionFilterParams>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setSelectedTransaction: (tx: Transaction | null) => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
}

const initialFilters: TransactionFilterParams = {
  page: 1,
  limit: 20,
  type: undefined,
  category: undefined,
  from: undefined,
  to: undefined,
  search: undefined,
};

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  categories: [],
  summary: null,
  selectedTransaction: null,
  pagination: initialPagination,
  filters: initialFilters,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setSelectedTransaction: (tx: Transaction | null) => set({ selectedTransaction: tx }),

  fetchSummary: async () => {
    const { filters } = get();
    try {
      const summary = await transactionApi.getSummary(filters.from, filters.to);
      set({ summary });
    } catch {
      // Summary errors are soft-handled
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await transactionApi.getCategories();
      set({ categories });
    } catch {
      // Categories fallback to defaults
    }
  },

  fetchTransactions: async (customFilters?: TransactionFilterParams) => {
    set({ isLoading: true, error: null });
    const currentFilters = customFilters || get().filters;
    try {
      const data = await transactionApi.getTransactions(currentFilters);
      set({
        transactions: data.transactions,
        pagination: data.pagination,
        isLoading: false,
      });
      // Synchronously refresh summary with current date bounds
      await get().fetchSummary();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải danh sách giao dịch',
      });
    }
  },

  createTransaction: async (data: CreateTransactionRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      await transactionApi.createTransaction(data);
      set({
        isSubmitting: false,
        successMessage: 'Thêm giao dịch mới thành công!',
      });
      await Promise.all([get().fetchTransactions(), get().fetchCategories()]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Thêm giao dịch thất bại',
      });
      throw err;
    }
  },

  updateTransaction: async (id: string, data: UpdateTransactionRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await transactionApi.updateTransaction(id, data);
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? updated : t)),
        selectedTransaction: state.selectedTransaction?.id === id ? updated : state.selectedTransaction,
        isSubmitting: false,
        successMessage: 'Cập nhật giao dịch thành công!',
      }));
      await Promise.all([get().fetchSummary(), get().fetchCategories()]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Cập nhật giao dịch thất bại',
      });
      throw err;
    }
  },

  deleteTransaction: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await transactionApi.deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        selectedTransaction: state.selectedTransaction?.id === id ? null : state.selectedTransaction,
        isSubmitting: false,
        successMessage: 'Đã xóa giao dịch thành công!',
      }));
      const remaining = get().transactions.length;
      if (remaining === 0 && get().pagination.page > 1) {
        get().setPage(get().pagination.page - 1);
      } else {
        await get().fetchTransactions();
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa giao dịch thất bại',
      });
      throw err;
    }
  },

  setFilters: (newFilters: Partial<TransactionFilterParams>) => {
    const updated = { ...get().filters, ...newFilters, page: 1 };
    set({ filters: updated });
    get().fetchTransactions(updated);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchTransactions(initialFilters);
  },

  setPage: (page: number) => {
    const updated = { ...get().filters, page };
    set({ filters: updated });
    get().fetchTransactions(updated);
  },
}));