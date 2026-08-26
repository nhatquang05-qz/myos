import api from './api';
import { ApiResponse } from '../types/api';
import {
  CalendarEvent,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilterParams,
} from '../types/event';

export const eventApi = {
  async getEvents(params?: EventFilterParams): Promise<CalendarEvent[]> {
    const res = await api.get<ApiResponse<{ events: CalendarEvent[] }>>('/events', { params });
    return res.data.data!.events;
  },

  async getEvent(id: string): Promise<CalendarEvent> {
    const res = await api.get<ApiResponse<{ event: CalendarEvent }>>(`/events/${id}`);
    return res.data.data!.event;
  },

  async createEvent(data: CreateEventRequest): Promise<CalendarEvent> {
    const res = await api.post<ApiResponse<{ event: CalendarEvent }>>('/events', data);
    return res.data.data!.event;
  },

  async updateEvent(id: string, data: UpdateEventRequest): Promise<CalendarEvent> {
    const res = await api.patch<ApiResponse<{ event: CalendarEvent }>>(`/events/${id}`, data);
    return res.data.data!.event;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/events/${id}`);
  },
};