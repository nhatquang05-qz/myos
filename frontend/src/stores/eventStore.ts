import { create } from 'zustand';
import { CalendarEvent, CreateEventRequest, UpdateEventRequest, EventFilterParams } from '../types/event';
import { eventApi } from '../services/eventApi';

interface EventState {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  currentDate: Date;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchEvents: () => Promise<void>;
  createEvent: (data: CreateEventRequest) => Promise<void>;
  updateEvent: (id: string, data: UpdateEventRequest) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  setCurrentDate: (date: Date) => void;
  setSearchQuery: (query: string) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  goToToday: () => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  selectedEvent: null,
  currentDate: new Date(),
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setSelectedEvent: (event: CalendarEvent | null) => set({ selectedEvent: event }),

  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
    get().fetchEvents();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchEvents();
  },

  nextMonth: () => {
    const { currentDate } = get();
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    set({ currentDate: next });
    get().fetchEvents();
  },

  prevMonth: () => {
    const { currentDate } = get();
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    set({ currentDate: prev });
    get().fetchEvents();
  },

  goToToday: () => {
    set({ currentDate: new Date() });
    get().fetchEvents();
  },

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    const { currentDate, searchQuery } = get();

    // Tính toán khoảng thời gian từ đầu tuần chứa ngày 1 đến cuối tuần chứa ngày cuối tháng
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Bắt đầu từ 7 ngày trước đầu tháng và kết thúc sau 7 ngày cuối tháng để bao quát toàn bộ grid
    const fromDate = new Date(firstDayOfMonth);
    fromDate.setDate(fromDate.getDate() - 7);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(lastDayOfMonth);
    toDate.setDate(toDate.getDate() + 7);
    toDate.setHours(23, 59, 59, 999);

    const params: EventFilterParams = {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      search: searchQuery.trim() || undefined,
    };

    try {
      const events = await eventApi.getEvents(params);
      set({ events, isLoading: false });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Không thể tải lịch sự kiện',
      });
    }
  },

  createEvent: async (data: CreateEventRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      await eventApi.createEvent(data);
      set({
        isSubmitting: false,
        successMessage: 'Tạo sự kiện mới thành công!',
      });
      await get().fetchEvents();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Tạo sự kiện thất bại',
      });
      throw err;
    }
  },

  updateEvent: async (id: string, data: UpdateEventRequest) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await eventApi.updateEvent(id, data);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updated : e)),
        selectedEvent: state.selectedEvent?.id === id ? updated : state.selectedEvent,
        isSubmitting: false,
        successMessage: 'Cập nhật sự kiện thành công!',
      }));
      await get().fetchEvents();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Cập nhật sự kiện thất bại',
      });
      throw err;
    }
  },

  deleteEvent: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await eventApi.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
        isSubmitting: false,
        successMessage: 'Đã xóa sự kiện thành công!',
      }));
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isSubmitting: false,
        error: errorObj.message || 'Xóa sự kiện thất bại',
      });
      throw err;
    }
  },
}));