export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TagItem {
  id: string;
  name: string;
}

export interface TaskRecord {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface TaskResponse {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  completedAt: string | null;
  tags: TagItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  tagId?: string;
  page?: number;
  limit?: number;
}