export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  location?: string | null;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string | null;
  startAt?: string;
  endAt?: string;
  location?: string | null;
}

export interface EventFilterParams {
  from?: string;
  to?: string;
  search?: string;
}