export interface EventRecord {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_at: Date;
  end_at: Date;
  location: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EventResponse {
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

export interface EventFilterParams {
  from?: string;
  to?: string;
  search?: string;
}